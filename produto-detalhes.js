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
        
        // Atualiza título da página e breadcrumb
        document.title = `${this.product.title} | MYNE`;
        document.getElementById('breadcrumb-title').textContent = this.product.title;
        
        // Renderiza imagens
        this.renderGallery();
        
        // Renderiza informações básicas
        document.getElementById('product-title').textContent = this.product.title;
        
        // Renderiza categoria (suporta string ou array)
        if (this.product.category) {
            let categoryText = '';
            if (Array.isArray(this.product.category)) {
                categoryText = this.product.category.join(', ');
            } else {
                categoryText = this.product.category;
            }
            document.getElementById('product-category').textContent = categoryText;
        }
        
        // Renderiza preço
        const price = this.formatPrice(this.product.currentBid);
        document.getElementById('product-price').textContent = `R$ ${price}`;
        
        // Renderiza timer
        if (this.product.endAt) {
            this.startTimer();
        } else {
            document.getElementById('timer-section').style.display = 'none';
        }
        
        // Renderiza atributos
        this.renderAttributes();
        
        // Renderiza detalhes
        if (this.product.details) {
            // Quebra o texto em parágrafos baseado em quebras de linha ou pontos e vírgulas
            const detailsText = this.product.details
                .split(/;[\s]*-/)
                .map(text => text.trim())
                .filter(text => text.length > 0)
                .map(text => text.startsWith('-') ? text : '- ' + text)
                .join('<br>');
            
            document.getElementById('product-details').innerHTML = detailsText;
        } else {
            document.getElementById('product-details').innerHTML = '<p style="color: #999;">Nenhum detalhe adicional disponível.</p>';
        }
        
        // Renderiza cuidados (se existir)
        if (this.product.care && this.product.care.trim()) {
            document.getElementById('care-section').style.display = 'block';
            document.getElementById('product-care').innerHTML = `<p>${this.product.care}</p>`;
        }
        
        // Renderiza informações de entrega (se existir)
        if (this.product.deliveryInfo && this.product.deliveryInfo.trim()) {
            document.getElementById('delivery-section').style.display = 'block';
            document.getElementById('product-delivery').innerHTML = `<p>${this.product.deliveryInfo}</p>`;
        }
        
        // Configura botão de lance
        const btnFazerLance = document.getElementById('btn-fazer-lance');
        if (this.product.auctionUrl) {
            btnFazerLance.onclick = () => {
                window.open(this.product.auctionUrl, '_blank');
            };
        } else {
            btnFazerLance.disabled = true;
            btnFazerLance.textContent = 'Link não disponível';
        }
    }
    
    renderGallery() {
        const images = this.product.images || [];
        
        if (images.length === 0) {
            // Se não há imagens, usa placeholder
            images.push('/images/placeholder.jpg');
        }
        
        // Renderiza imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.src = images[0];
        mainImage.alt = this.product.title;
        
        // Renderiza thumbnails
        const thumbnailsContainer = document.getElementById('gallery-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        images.forEach((imageUrl, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${imageUrl}" alt="${this.product.title} - Imagem ${index + 1}">`;
            
            thumbnail.addEventListener('click', () => {
                this.changeImage(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
        
        // Controla visibilidade das setas
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
    
    changeImage(index) {
        const images = this.product.images || ['/images/placeholder.jpg'];
        
        if (index < 0 || index >= images.length) return;
        
        this.currentImageIndex = index;
        
        // Atualiza imagem principal
        const mainImage = document.getElementById('main-image');
        mainImage.src = images[index];
        
        // Atualiza thumbnails ativos
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Atualiza estado dos botões
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === images.length - 1;
    }
    
    renderAttributes() {
        const attributesContainer = document.getElementById('product-attributes');
        attributesContainer.innerHTML = '';
        
        const allAttributes = [];
        
        // Processa array de attributes (se existir)
        if (this.product.attributes && Array.isArray(this.product.attributes)) {
            this.product.attributes.forEach(attr => {
                if (attr.label && attr.value) {
                    allAttributes.push({
                        label: attr.label,
                        value: attr.value
                    });
                }
            });
        }
        
        // Processa array de measurements (se existir)
        if (this.product.measurements && Array.isArray(this.product.measurements)) {
            this.product.measurements.forEach(measurement => {
                if (measurement.label && measurement.value) {
                    allAttributes.push({
                        label: measurement.label,
                        value: measurement.value
                    });
                }
            });
        }
        
        // Adiciona atributos do produto (formato antigo, para compatibilidade)
        if (this.product.size) {
            allAttributes.push({ label: 'Tamanho', value: this.product.size });
        }
        
        if (this.product.material) {
            allAttributes.push({ label: 'Material', value: this.product.material });
        }
        
        if (this.product.color) {
            allAttributes.push({ label: 'Cor', value: this.product.color });
        }
        
        if (this.product.condition) {
            allAttributes.push({ label: 'Condição', value: this.product.condition });
        }
        
        if (this.product.origin) {
            allAttributes.push({ label: 'Origem', value: this.product.origin });
        }
        
        if (this.product.year) {
            allAttributes.push({ label: 'Ano', value: this.product.year });
        }
        
        // Renderiza atributos
        if (allAttributes.length === 0) {
            attributesContainer.innerHTML = '<p style="font-family: \'Neue Montreal\', sans-serif; color: #999;">Nenhum atributo adicional disponível.</p>';
        } else {
            allAttributes.forEach(attr => {
                const item = document.createElement('div');
                item.className = 'attribute-item';
                item.innerHTML = `
                    <span class="attribute-label">${attr.label}</span>
                    <span class="attribute-value">${attr.value}</span>
                `;
                attributesContainer.appendChild(item);
            });
        }
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
        // Navegação da galeria
        document.getElementById('gallery-prev').addEventListener('click', () => {
            this.changeImage(this.currentImageIndex - 1);
        });
        
        document.getElementById('gallery-next').addEventListener('click', () => {
            this.changeImage(this.currentImageIndex + 1);
        });
        
        // Botão de favoritar
        const btnFavoritar = document.getElementById('btn-favoritar');
        btnFavoritar.addEventListener('click', () => {
            btnFavoritar.classList.toggle('favorited');
            const isFavorited = btnFavoritar.classList.contains('favorited');
            btnFavoritar.innerHTML = `
                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                ${isFavorited ? 'Favoritado' : 'Favoritar'}
            `;
        });
        
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

