/**
 * Lojinha - Sistema de exibição de produtos do Firestore
 * Carrega e exibe produtos da coleção 'lojinha' com funcionalidades de leilão
 */

class Lojinha {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.gridContainer = document.getElementById('lojinhaGrid');
        this.btnVerMais = document.getElementById('btnVerMais');
        
        this.options = {
            itemsPerPage: 8,
            showLoadMore: true,
            enableTimer: true,
            ...options
        };
        
        this.products = [];
        this.displayedProducts = [];
        this.currentPage = 0;
        this.loading = false;
        
        this.init();
    }
    
    init() {
        console.log('🏪 Inicializando Lojinha...');
        this.setupEventListeners();
        this.loadProducts();
    }
    
    setupEventListeners() {
        if (this.btnVerMais) {
            this.btnVerMais.addEventListener('click', () => this.loadMoreProducts());
        }
    }
    
    async loadProducts() {
        if (this.loading) return;
        
        this.loading = true;
        this.showLoading();
        
        try {
            console.log('🔍 Carregando produtos da coleção lojinha...');
            
            // Aguarda o Firebase estar disponível
            await this.waitForFirebase();
            
            // Importa as funções do Firestore dinamicamente usando a mesma versão do index.html
            const { collection, getDocs, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            console.log('📦 Funções do Firestore importadas com sucesso');
            console.log('🔍 Firebase DB disponível:', !!window.firebaseDb);
            
            // Cria a query para buscar produtos ativos ordenados por data de criação
            const lojinhaRef = collection(window.firebaseDb, 'lojinha');
            console.log('📁 Referência da coleção criada:', lojinhaRef);
            
            const q = query(
                lojinhaRef,
                orderBy('createdAt', 'desc'),
                limit(50) // Limita a 50 produtos para performance
            );
            
            console.log('🔍 Executando query na coleção lojinha...');
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                console.warn('⚠️ Nenhum produto encontrado na coleção lojinha');
                this.showEmptyState();
                return;
            }
            
            // Processa os documentos
            this.products = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('📄 Produto encontrado:', doc.id, data.title);
                
                this.products.push({
                    id: doc.id,
                    ...data
                });
            });
            
            console.log(`✅ ${this.products.length} produtos carregados com sucesso`);
            
            // Exibe os primeiros produtos
            this.displayProducts();
            
        } catch (error) {
            console.error('❌ Erro ao carregar produtos:', error);
            console.error('❌ Detalhes do erro:', error.message);
            console.error('❌ Stack trace:', error.stack);
            
            // Tenta uma abordagem alternativa se o erro for relacionado ao Firestore
            if (error.message.includes('Expected first argument to collection()')) {
                console.log('🔄 Tentando abordagem alternativa...');
                await this.loadProductsAlternative();
            } else {
                this.showError('Erro ao carregar produtos. Tente novamente mais tarde.');
            }
        } finally {
            this.loading = false;
        }
    }
    
    async loadProductsAlternative() {
        try {
            console.log('🔄 Carregando produtos com abordagem alternativa...');
            
            // Verifica se o Firebase está realmente inicializado
            if (!window.firebaseDb) {
                throw new Error('Firebase não está inicializado');
            }
            
            // Usa uma abordagem mais simples sem query complexa
            const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const lojinhaRef = collection(window.firebaseDb, 'lojinha');
            const querySnapshot = await getDocs(lojinhaRef);
            
            if (querySnapshot.empty) {
                console.warn('⚠️ Nenhum produto encontrado na coleção lojinha');
                this.showEmptyState();
                return;
            }
            
            // Processa os documentos
            this.products = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('📄 Produto encontrado (alternativo):', doc.id, data.title);
                
                this.products.push({
                    id: doc.id,
                    ...data
                });
            });
            
            // Ordena por data de criação no cliente
            this.products.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });
            
            console.log(`✅ ${this.products.length} produtos carregados com sucesso (alternativo)`);
            
            // Exibe os primeiros produtos
            this.displayProducts();
            
        } catch (error) {
            console.error('❌ Erro na abordagem alternativa:', error);
            this.showError('Erro ao carregar produtos. Verifique se a coleção "lojinha" existe no Firestore.');
        }
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
    
    displayProducts() {
        const startIndex = this.currentPage * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const productsToShow = this.products.slice(startIndex, endIndex);
        
        if (this.currentPage === 0) {
            this.gridContainer.innerHTML = '';
        }
        
        productsToShow.forEach(product => {
            const productElement = this.createProductElement(product);
            this.gridContainer.appendChild(productElement);
        });
        
        this.displayedProducts.push(...productsToShow);
        this.currentPage++;
        
        // Controla a visibilidade do botão "Ver mais"
        if (this.btnVerMais) {
            const hasMoreProducts = this.displayedProducts.length < this.products.length;
        this.btnVerMais.style.display = hasMoreProducts ? 'block' : 'none';
    }

    // Inicia timers se habilitado
    if (this.options.enableTimer) {
        this.startTimers();
    }
    }
    
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'lojinha-item';
        productDiv.setAttribute('data-product-id', product.id);

        const price = this.formatPrice(product.currentBid);
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg';

        productDiv.innerHTML = `
            <div class="lojinha-item-image">
                <img src="${imageUrl}" alt="${product.title}" loading="lazy" onerror="this.src='/images/placeholder.jpg'">
                <button class="lojinha-item-favorite">
                    <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
            </div>
            <div class="lojinha-item-content">
                <h3 class="lojinha-item-title">${product.title}</h3>
                <p class="lojinha-item-price">R$ ${price}</p>
                <p class="lojinha-item-category">${product.category || ''}</p>
            </div>
        `;

        productDiv.addEventListener('click', (e) => {
            // Evita que o clique no botão de favorito acione o clique no card
            if (e.target.closest('.lojinha-item-favorite')) {
                return;
            }

            // Sempre redireciona para a página de detalhes
            this.openProductDetails(product.id);
        });

        return productDiv;
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
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    startTimers() {
        const timerElements = document.querySelectorAll('.auction-timer[data-end-time]');
        
        timerElements.forEach(element => {
            const endTime = parseInt(element.getAttribute('data-end-time'));
            if (endTime > 0) {
                this.updateTimer(element, endTime);
            }
        });
        
        // Atualiza timers a cada minuto
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            timerElements.forEach(element => {
                const endTime = parseInt(element.getAttribute('data-end-time'));
                if (endTime > 0) {
                    this.updateTimer(element, endTime);
                }
            });
        }, 60000); // Atualiza a cada minuto
    }
    
    updateTimer(element, endTimeSeconds) {
        const endTime = new Date(endTimeSeconds * 1000);
        const now = new Date();
        const timeDiff = endTime - now;
        
        if (timeDiff <= 0) {
            element.textContent = 'Leilão encerrado';
            element.style.color = '#6b7280';
            return;
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            element.textContent = `${days}d ${hours}h`;
        } else if (hours > 0) {
            element.textContent = `${hours}h ${minutes}m`;
        } else {
            element.textContent = `${minutes}m`;
            element.style.color = '#e74c3c'; // Vermelho para urgência
        }
    }
    
    loadMoreProducts() {
        if (this.loading || this.displayedProducts.length >= this.products.length) return;
        
        this.displayProducts();
    }
    
    openProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        console.log('🔍 Abrindo detalhes do produto:', product.title);
        
        // Redireciona para a página de detalhes do produto
        window.location.href = `produto-detalhes.html?id=${productId}`;
    }
    
    showLoading() {
        this.gridContainer.innerHTML = `
            <div class="lojinha-loading">
                <div class="loading-spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        `;
    }
    
    showEmptyState() {
        this.gridContainer.innerHTML = `
            <div class="lojinha-empty">
                <h3>Nenhum produto disponível</h3>
                <p>Não há produtos em leilão no momento. Volte em breve!</p>
            </div>
        `;
        
        if (this.btnVerMais) {
            this.btnVerMais.style.display = 'none';
        }
    }
    
    showError(message) {
        this.gridContainer.innerHTML = `
            <div class="lojinha-empty">
                <h3>Erro ao carregar produtos</h3>
                <p>${message}</p>
                <button class="btn-ver-mais" onclick="window.lojinha.loadProducts()" style="margin-top: 20px;">
                    Tentar novamente
                </button>
            </div>
        `;
        
        if (this.btnVerMais) {
            this.btnVerMais.style.display = 'none';
        }
    }
    
    // Método para limpar timers quando necessário
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏪 DOM carregado, inicializando Lojinha...');
    
    // Aguarda um pouco para garantir que o Firebase foi inicializado
    setTimeout(() => {
        if (document.getElementById('lojinhaSection')) {
            window.lojinha = new Lojinha('lojinhaSection', {
                itemsPerPage: 8,
                showLoadMore: true,
                enableTimer: true
            });
        }
    }, 1000);
});

// Exporta a classe para uso global
window.Lojinha = Lojinha;