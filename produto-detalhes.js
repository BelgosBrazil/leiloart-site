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

        const categoryEl = document.getElementById('product-category');
        if (categoryEl && this.product.category) {
            categoryEl.textContent = this.product.category;
        }

        // Renderiza preço
        const price = this.formatPrice(this.product.currentBid);
        document.getElementById('product-price').textContent = `R$ ${price}`;

        // Inicia o timer
        this.startTimer();

        // Renderiza Atributos
        this.renderAttributes();

        // Renderiza Descrição
        this.renderDescription();

        // Configura botão de dar lance
        const btnDarLance = document.getElementById('btn-dar-lance');
        if (btnDarLance) {
            if (this.product.auctionUrl) {
                btnDarLance.onclick = () => {
                    window.open(this.product.auctionUrl, '_blank');
                };
            } else {
                btnDarLance.disabled = true;
                btnDarLance.textContent = 'ENCERRADO';
                btnDarLance.style.backgroundColor = '#ccc';
                btnDarLance.style.cursor = 'not-allowed';
            }
        }
    }

    renderAttributes() {
        const attributesContainer = document.getElementById('product-attributes');
        if (!attributesContainer) return;

        let html = '';

        // Adiciona atributos padrão se existirem
        const standardAttributes = [
            { key: 'material', label: 'Material' },
            { key: 'condition', label: 'Condição' },
            { key: 'origin', label: 'Origem' },
            { key: 'year', label: 'Ano' },
            { key: 'color', label: 'Cor' },
            { key: 'size', label: 'Tamanho' }
        ];

        standardAttributes.forEach(attr => {
            if (this.product[attr.key]) {
                html += `
                    <div class="attribute-item">
                        <span class="attribute-label">${attr.label}</span>
                        <span class="attribute-value">${this.product[attr.key]}</span>
                    </div>
                `;
            }
        });

        // Adiciona medidas se existirem
        if (this.product.measurements && Array.isArray(this.product.measurements)) {
            this.product.measurements.forEach(m => {
                html += `
                    <div class="attribute-item">
                        <span class="attribute-label">${m.label}</span>
                        <span class="attribute-value">${m.value}</span>
                    </div>
                `;
            });
        }

        // Adiciona atributos personalizados
        if (this.product.attributes && Array.isArray(this.product.attributes)) {
            this.product.attributes.forEach(attr => {
                html += `
                    <div class="attribute-item">
                        <span class="attribute-label">${attr.key || attr.label}</span>
                        <span class="attribute-value">${attr.value}</span>
                    </div>
                `;
            });
        }

        if (!html) {
            html = '<p class="no-attributes">Nenhum atributo especificado.</p>';
        }

        attributesContainer.innerHTML = html;
    }

    renderDescription() {
        const descriptionContainer = document.getElementById('product-description');
        if (!descriptionContainer) return;

        if (this.product.details || this.product.description) {
            // Usa details ou description, o que estiver disponível
            const text = this.product.details || this.product.description;
            // Converte quebras de linha em <br>
            descriptionContainer.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        } else {
            descriptionContainer.innerHTML = '<p>Nenhuma descrição disponível.</p>';
        }
    }

    renderGallery() {
        console.log('🖼️ Renderizando galeria...');
        const images = this.product.images || [];

        if (images.length === 0) {
            images.push('/images/placeholder.jpg');
        }

        // Renderiza imagem principal
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.src = images[0];
            mainImage.alt = this.product.title;
        }

        // Renderiza thumbnails
        const thumbnailsContainer = document.getElementById('gallery-thumbnails');
        if (!thumbnailsContainer) {
            console.warn('⚠️ Container de thumbnails não encontrado');
            return;
        }

        thumbnailsContainer.innerHTML = '';

        if (images.length > 1) {
            images.forEach((imgSrc, index) => {
                const thumb = document.createElement('div');
                thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumb.setAttribute('aria-label', `Ver imagem ${index + 1}`);

                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Thumbnail ${index + 1}`;

                thumb.appendChild(img);

                thumb.addEventListener('click', () => {
                    this.changeImage(index);
                });

                thumbnailsContainer.appendChild(thumb);
            });
        }
    }

    changeImage(index) {
        const images = this.product.images || ['/images/placeholder.jpg'];

        if (index < 0 || index >= images.length) return;

        this.currentImageIndex = index;

        // Atualiza imagem principal com fade
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.style.opacity = '0';

            setTimeout(() => {
                mainImage.src = images[index];
                mainImage.onload = () => {
                    mainImage.style.opacity = '1';
                };
                // Fallback caso onload não dispare (imagem em cache)
                setTimeout(() => mainImage.style.opacity = '1', 50);
            }, 200);
        }

        // Atualiza thumbnails ativos
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
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
        // Botão de favoritar (na imagem)
        const btnFavoritar = document.getElementById('btn-favoritar');
        if (btnFavoritar) {
            btnFavoritar.addEventListener('click', () => {
                btnFavoritar.classList.toggle('active');
                // Lógica de favoritar seria implementada aqui
            });
        }

        // Botão de favoritar (texto)
        const btnFavoritarText = document.getElementById('btn-favoritar-text');
        if (btnFavoritarText) {
            btnFavoritarText.addEventListener('click', () => {
                // Sincroniza com o botão da imagem se existir
                if (btnFavoritar) btnFavoritar.classList.toggle('active');

                // Muda texto ou estilo
                if (btnFavoritarText.textContent.trim() === 'Favoritar') {
                    btnFavoritarText.textContent = 'Favoritado';
                    btnFavoritarText.style.backgroundColor = '#f5f5f5';
                } else {
                    btnFavoritarText.textContent = 'Favoritar';
                    btnFavoritarText.style.backgroundColor = '#fff';
                }
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
        console.error('❌ Exibindo tela de erro');
        const loadingState = document.getElementById('loading-state');
        const productSection = document.getElementById('product-section');
        const errorState = document.getElementById('error-state');

        if (loadingState) loadingState.style.display = 'none';
        if (productSection) productSection.style.display = 'none';
        if (errorState) errorState.style.display = 'flex';
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

