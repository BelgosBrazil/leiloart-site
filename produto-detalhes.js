/**
 * Produto Detalhes - Sistema de exibição de detalhes do produto
 * Carrega e exibe os detalhes completos de um produto específico do Firestore
 */

class ProdutoDetalhes {
    constructor() {
        this.productId = null;
        this.product = null;
        this.currentImageIndex = 0;
        this.timerInterval = null;

        this.init();
    }

    async init() {
        console.log('🔍 Inicializando página de detalhes do produto...');

        // Pega o ID do produto da URL
        this.productId = this.getProductIdFromUrl();

        if (!this.productId) {
            this.showError();
            return;
        }

        console.log('📦 ID do produto:', this.productId);

        // Aguarda o Firebase estar disponível
        await this.waitForFirebase();

        // Carrega o produto
        await this.loadProduct();

        // Configura event listeners
        this.setupEventListeners();

        // Configura efeito de scroll no header
        this.setupHeaderScroll();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async waitForFirebase() {
        return new Promise((resolve, reject) => {
            const checkFirebase = () => {
                if (window.firebaseDb) {
                    console.log('✅ Firebase disponível');
                    resolve();
                } else {
                    console.log('⏳ Aguardando Firebase...');
                    setTimeout(checkFirebase, 100);
                }
            };

            checkFirebase();

            // Timeout após 10 segundos
            setTimeout(() => {
                if (!window.firebaseDb) {
                    reject(new Error('Firebase não inicializado após 10 segundos'));
                }
            }, 10000);
        });
    }

    async loadProduct() {
        try {
            console.log('🔍 Carregando produto do Firestore...');

            // Importa as funções do Firestore
            const { doc, getDoc, collection, getDocs, query, where, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            // Busca o produto na coleção 'lojinha'
            const productRef = doc(window.firebaseDb, 'lojinha', this.productId);
            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) {
                console.warn('⚠️ Produto não encontrado');
                this.showError();
                return;
            }

            this.product = {
                id: productSnap.id,
                ...productSnap.data()
            };

            console.log('✅ Produto carregado:', this.product);
            console.log('📋 Attributes:', this.product.attributes);
            console.log('📏 Measurements:', this.product.measurements);
            console.log('💰 CurrentBid:', this.product.currentBid, 'Type:', typeof this.product.currentBid);

            // Renderiza o produto
            this.renderProduct();

            // Carrega produtos relacionados
            await this.loadRelatedProducts();

        } catch (error) {
            console.error('❌ Erro ao carregar produto:', error);
            this.showError();
        }
    }

    renderProduct() {
        // Oculta loading e mostra conteúdo
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('product-section').style.display = 'block';

        // Atualiza título da página
        document.title = `${this.product.title} | MYNE`;

        // Renderiza imagens
        this.renderGallery();

        // Renderiza informações básicas
        document.getElementById('product-title').textContent = this.product.title;

        // Renderiza preço
        const price = this.formatPrice(this.product.currentBid);
        document.getElementById('product-price').textContent = `R$ ${price}`;

        // Renderiza Cor
        if (this.product.color) {
            document.getElementById('selected-color-name').textContent = this.product.color;
            // Tenta encontrar uma cor CSS válida ou usa preto como fallback
            const colorMap = {
                'Preto': '#000000',
                'Branco': '#ffffff',
                'Vermelho': '#ff0000',
                'Azul': '#0000ff',
                'Verde': '#008000',
                'Amarelo': '#ffff00',
                'Marrom': '#a52a2a',
                'Bege': '#f5f5dc',
                'Cinza': '#808080',
                'Rosa': '#ffc0cb',
                'Roxo': '#800080',
                'Laranja': '#ffa500'
            };

            const colorHex = colorMap[this.product.color] || '#000000';
            const colorCircle = document.querySelector('.color-circle');
            if (colorCircle) {
                colorCircle.style.backgroundColor = colorHex;
                colorCircle.setAttribute('aria-label', this.product.color);
            }
        }

        // Renderiza Tamanho (se disponível)
        if (this.product.size) {
            const sizeSelect = document.getElementById('size-select');
            if (sizeSelect) {
                // Adiciona o tamanho do produto como opção selecionada se não existir
                let sizeExists = false;
                for (let i = 0; i < sizeSelect.options.length; i++) {
                    if (sizeSelect.options[i].value === this.product.size) {
                        sizeSelect.selectedIndex = i;
                        sizeExists = true;
                        break;
                    }
                }

                if (!sizeExists) {
                    const option = document.createElement('option');
                    option.value = this.product.size;
                    option.textContent = this.product.size;
                    option.selected = true;
                    sizeSelect.add(option);
                }
            }
        }

        // Renderiza Detalhes (Accordion)
        const detailsContent = document.getElementById('product-details-content');
        let detailsHtml = '';

        if (this.product.details) {
            detailsHtml += `<p>${this.product.details}</p>`;
        }

        // Adiciona outros atributos nos detalhes
        if (this.product.material) detailsHtml += `<p><strong>Material:</strong> ${this.product.material}</p>`;
        if (this.product.condition) detailsHtml += `<p><strong>Condição:</strong> ${this.product.condition}</p>`;
        if (this.product.origin) detailsHtml += `<p><strong>Origem:</strong> ${this.product.origin}</p>`;
        if (this.product.year) detailsHtml += `<p><strong>Ano:</strong> ${this.product.year}</p>`;

        if (this.product.measurements && Array.isArray(this.product.measurements)) {
            detailsHtml += '<p><strong>Medidas:</strong><br>';
            this.product.measurements.forEach(m => {
                detailsHtml += `- ${m.label}: ${m.value}<br>`;
            });
            detailsHtml += '</p>';
        }

        if (!detailsHtml) {
            detailsHtml = '<p>Nenhum detalhe adicional disponível.</p>';
        }

        detailsContent.innerHTML = detailsHtml;

        // Configura botão de adicionar ao carrinho (Link do leilão)
        const btnAddCart = document.getElementById('btn-add-cart');
        if (this.product.auctionUrl) {
            btnAddCart.onclick = () => {
                window.open(this.product.auctionUrl, '_blank');
            };
        } else {
            btnAddCart.disabled = true;
            btnAddCart.textContent = 'INDISPONÍVEL';
            btnAddCart.style.backgroundColor = '#ccc';
            btnAddCart.style.cursor = 'not-allowed';
        }
    }

    renderGallery() {
        const images = this.product.images || [];

        if (images.length === 0) {
            images.push('/images/placeholder.jpg');
        }

        // Renderiza imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.src = images[0];
        mainImage.alt = this.product.title;

        // Renderiza dots
        const dotsContainer = document.getElementById('gallery-dots');
        dotsContainer.innerHTML = '';

        if (images.length > 1) {
            images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Imagem ${index + 1}`);

                dot.addEventListener('click', () => {
                    this.changeImage(index);
                });

                dotsContainer.appendChild(dot);
            });
        }
    }

    changeImage(index) {
        const images = this.product.images || ['/images/placeholder.jpg'];

        if (index < 0 || index >= images.length) return;

        this.currentImageIndex = index;

        // Atualiza imagem principal com fade
        const mainImage = document.getElementById('main-image');
        mainImage.style.opacity = '0';

        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.onload = () => {
                mainImage.style.opacity = '1';
            };
        }, 200);

        // Atualiza dots ativos
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Método renderAttributes removido pois agora faz parte dos detalhes no accordion
    renderAttributes() {
        // Mantido vazio para compatibilidade se chamado de outros lugares, 
        // mas a lógica foi movida para renderProduct dentro do accordion
    }

    startTimer() {
        const updateTimer = () => {
            const timeRemaining = this.calculateTimeRemaining(this.product.endAt);
            document.getElementById('product-timer').textContent = timeRemaining;
        };

        updateTimer();

        // Atualiza a cada minuto
        this.timerInterval = setInterval(updateTimer, 60000);
    }

    calculateTimeRemaining(endAt) {
        if (!endAt) return 'Data não definida';

        const endTime = endAt.seconds ? new Date(endAt.seconds * 1000) : new Date(endAt);
        const now = new Date();
        const timeDiff = endTime - now;

        if (timeDiff <= 0) {
            return 'Leilão encerrado';
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} dia${days > 1 ? 's' : ''} e ${hours} hora${hours > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hora${hours > 1 ? 's' : ''} e ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        }
    }

    async loadRelatedProducts() {
        try {
            const { collection, getDocs, query, where, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            // Busca produtos da mesma categoria
            const lojinhaRef = collection(window.firebaseDb, 'lojinha');

            let q;
            if (this.product.category) {
                q = query(
                    lojinhaRef,
                    where('category', '==', this.product.category),
                    limit(5)
                );
            } else {
                q = query(lojinhaRef, limit(5));
            }

            const querySnapshot = await getDocs(q);

            const relatedProducts = [];
            querySnapshot.forEach((doc) => {
                // Não inclui o produto atual
                if (doc.id !== this.productId) {
                    relatedProducts.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });

            if (relatedProducts.length > 0) {
                this.renderRelatedProducts(relatedProducts.slice(0, 4));
            }

        } catch (error) {
            console.error('❌ Erro ao carregar produtos relacionados:', error);
        }
    }

    renderRelatedProducts(products) {
        if (products.length === 0) return;

        document.getElementById('related-products').style.display = 'block';

        const grid = document.getElementById('related-products-grid');
        grid.innerHTML = '';

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'related-product-item';

            const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg';
            const price = this.formatPrice(product.currentBid);

            item.innerHTML = `
                <div class="related-product-image">
                    <img src="${imageUrl}" alt="${product.title}" loading="lazy">
                </div>
                <div class="related-product-info">
                    <h3 class="related-product-title">${product.title}</h3>
                    <p class="related-product-price">R$ ${price}</p>
                </div>
            `;

            item.addEventListener('click', () => {
                window.location.href = `produto-detalhes.html?id=${product.id}`;
            });

            grid.appendChild(item);
        });
    }

    setupEventListeners() {
        // Botão de favoritar (ícone na imagem)
        const btnFavoritar = document.getElementById('btn-favoritar-img');
        if (btnFavoritar) {
            btnFavoritar.addEventListener('click', () => {
                btnFavoritar.classList.toggle('active');
                const isActive = btnFavoritar.classList.contains('active');

                const svg = btnFavoritar.querySelector('svg');
                if (isActive) {
                    svg.style.fill = '#000';
                } else {
                    svg.style.fill = 'none';
                }
            });
        }

        // Accordion de detalhes
        const accordionTrigger = document.getElementById('details-trigger');
        const accordionContent = document.getElementById('product-details-content');

        if (accordionTrigger && accordionContent) {
            accordionTrigger.addEventListener('click', () => {
                const isExpanded = accordionTrigger.getAttribute('aria-expanded') === 'true';
                accordionTrigger.setAttribute('aria-expanded', !isExpanded);
                accordionContent.classList.toggle('active');

                // Opcional: animar ícone se houver
            });
        }

        // Botões de compartilhamento
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const network = btn.getAttribute('data-network');
                this.share(network);
            });
        });
    }

    share(network) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.product.title);

        let shareUrl = '';

        switch (network) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    formatPrice(price) {
        if (!price) return '0,00';

        // Converte para string e remove caracteres não numéricos
        let priceStr = price.toString().replace(/[^0-9]/g, '');

        // Se o valor já está em centavos (número grande), divide por 100
        // Se o valor está em reais (número pequeno ou string), usa direto
        let numericPrice;

        if (typeof price === 'string' && !price.includes('.')) {
            // String sem ponto decimal - assume que já está formatado corretamente
            // Ex: "13500" = R$ 135,00
            numericPrice = parseFloat(priceStr) / 100;
        } else if (typeof price === 'number' && price > 1000) {
            // Número maior que 1000 - assume centavos
            numericPrice = price / 100;
        } else {
            // Outros casos
            numericPrice = parseFloat(priceStr) / 100;
        }

        return numericPrice.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    showError() {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'flex';
    }

    setupHeaderScroll() {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.produtoDetalhes = new ProdutoDetalhes();
});

