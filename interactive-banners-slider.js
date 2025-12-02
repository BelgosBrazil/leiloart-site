/**
 * Interactive Banners Slider
 * Versão HTML/CSS/JS do componente React InteractiveBannersSlider
 */

class InteractiveBannersSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            autoPlay: false,
            autoPlayInterval: 5000,
            ...options
        };

        this.banners = [];
        this.currentIndex = 0;
        this.isTransitioning = false;

        this.carouselContent = null;
        this.pagination = null;
        this.modal = null;
        this.currentHotspot = null;
        this.scrollListener = null;

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Container não encontrado');
            return;
        }

        this.carouselContent = this.container.querySelector('#carouselContent');
        this.pagination = this.container.querySelector('#carouselPagination');
        this.modal = document.getElementById('productModal');

        this.setupModal();
        this.setupKeyboardNavigation();
        this.setupScrollAnimation();
        this.setupParallax();
    }

    setupParallax() {
        const updateParallax = () => {
            const images = this.container.querySelectorAll('.banner-image');

            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Só aplica se o elemento estiver visível
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calcula quanto do elemento já passou pela tela
                    // 0 = elemento entrando por baixo
                    // 1 = elemento saindo por cima
                    const scrolled = (windowHeight - rect.top) / (windowHeight + rect.height);

                    // Converte para movimento de -50px a +50px
                    const moveX = (scrolled * 100) - 50;

                    // Aplica o movimento
                    img.style.transform = `translateX(${moveX}px) scale(1.15)`;
                }
            });
        };

        // Atualiza no scroll
        window.addEventListener('scroll', updateParallax, { passive: true });

        // Atualiza uma vez no início
        updateParallax();
    }

    // Configurar animação de entrada com scroll - similar ao padrão do site
    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona a classe animated quando entra na viewport
                    entry.target.classList.add('animated');
                    // Para de observar após animar
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Ativa quando 10% do elemento está visível
            rootMargin: '0px'
        });

        // Observa o container principal
        observer.observe(this.container);
    }

    // Função utilitária para converter ponto focal em object-position
    focalToObjectPosition(focalPoint) {
        return `${(focalPoint.x * 100).toFixed(2)}% ${(focalPoint.y * 100).toFixed(2)}%`;
    }

    // Função utilitária para converter número em porcentagem
    toPercent(n) {
        return `${(n * 100).toFixed(3)}%`;
    }

    // Carrega os banners (substitui a chamada ao Firebase)
    async loadBanners(bannersData) {
        this.banners = bannersData.filter(banner => banner.active);

        if (this.banners.length === 0) {
            this.container.style.display = 'none';
            return;
        }

        this.render();
        this.setupPagination();
        this.setupNavigationButtons();

        // Autoslide removido conforme solicitado
    }

    // Renderiza os banners
    render() {
        this.carouselContent.innerHTML = '';

        this.banners.forEach((banner, index) => {
            const bannerElement = this.createBannerElement(banner, index);
            this.carouselContent.appendChild(bannerElement);
        });

        this.updateCarouselPosition();
    }

    // Cria um elemento de banner
    createBannerElement(banner, index) {
        const template = document.getElementById('bannerTemplate');
        const bannerElement = template.content.cloneNode(true);

        const item = bannerElement.querySelector('.carousel-item');
        const container = bannerElement.querySelector('.banner-container');
        const image = bannerElement.querySelector('.banner-image');
        const title = bannerElement.querySelector('.banner-title h3');
        const hotspotsContainer = bannerElement.querySelector('.hotspots-container');

        // Configura aspect ratio
        const aspectRatio = banner.aspectRatio || (16 / 9);
        container.style.paddingTop = this.toPercent((1 / aspectRatio) * 0.9); // Aumentado altura em 10% (0.8 -> 0.9)

        // Configura imagem
        image.src = banner.imageUrl;
        image.alt = banner.title || `Banner ${index + 1}`;

        if (banner.focalPoint) {
            image.style.objectPosition = this.focalToObjectPosition(banner.focalPoint);
        }

        // Configura título fixo


        // Cria hotspots
        if (banner.hotspots && banner.hotspots.length > 0) {
            banner.hotspots.forEach(hotspot => {
                const hotspotElement = this.createHotspotElement(hotspot, banner);
                hotspotsContainer.appendChild(hotspotElement);
            });
        }

        return bannerElement;
    }

    // Cria um elemento de hotspot
    createHotspotElement(hotspot, banner) {
        const template = document.getElementById('hotspotTemplate');
        const hotspotElement = template.content.cloneNode(true);

        const hotspotDiv = hotspotElement.querySelector('.hotspot');
        const button = hotspotElement.querySelector('.hotspot-button');

        // Posiciona o hotspot
        hotspotDiv.style.left = this.toPercent(hotspot.position.x);
        hotspotDiv.style.top = this.toPercent(hotspot.position.y);

        if (hotspot.zIndex) {
            hotspotDiv.style.zIndex = hotspot.zIndex;
        }

        // Configura acessibilidade
        if (hotspot.product && hotspot.product.title) {
            button.setAttribute('aria-label', `Ver ${hotspot.product.title}`);
        }

        // Adiciona evento de clique - armazena evento para posicionamento
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Armazena o evento para usar no posicionamento do modal
            window.lastHotspotClickEvent = e;
            this.showProductModal(hotspot, banner);
        });

        return hotspotElement;
    }

    // Mostra o modal do produto
    showProductModal(hotspot, banner) {
        if (!hotspot.product || !hotspot.product.title) {
            this.showEmptyProductModal();
            return;
        }

        const product = hotspot.product;
        const template = document.getElementById('productModalTemplate');
        const modalContent = template.content.cloneNode(true);

        // Preenche os dados do produto
        const title = modalContent.querySelector('.product-title');
        const bid = modalContent.querySelector('.product-bid');
        const image = modalContent.querySelector('.product-image');
        const imageContainer = modalContent.querySelector('.product-image-container');
        const details = modalContent.querySelector('.product-details');
        const button = modalContent.querySelector('.product-button');

        title.textContent = product.title;

        if (product.currentBid) {
            bid.textContent = `Lance atual: ${product.currentBid}`;
            bid.style.display = 'block';
        } else {
            bid.style.display = 'none';
        }

        if (product.imageUrl) {
            image.src = product.imageUrl;
            image.alt = product.title;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }

        if (product.details || product.shortDescription) {
            details.textContent = product.details || product.shortDescription;
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }

        // Configura botão de ação
        button.addEventListener('click', () => {
            // Redireciona para a página de detalhes do produto
            if (product.id) {
                window.location.href = `produto-detalhes.html?id=${product.id}`;
            } else {
                console.warn('Produto sem ID:', product);
                this.hideModal();
            }
        });

        // Limpa e adiciona o conteúdo ao modal
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = '';
        modalBody.appendChild(modalContent);

        // Posiciona o modal próximo ao hotspot clicado
        this.showModalNearHotspot(hotspot);
    }

    // Mostra modal vazio quando produto não está configurado
    showEmptyProductModal() {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="product-card">
                <div class="product-content" style="padding: 16px;">
                    <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">Produto não configurado</p>
                </div>
            </div>
        `;
        this.showModal();
    }

    // Mostra o modal
    showModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Foca no botão de fechar para acessibilidade
        const closeButton = document.getElementById('modalClose');
        setTimeout(() => closeButton.focus(), 100);
    }

    // Mostra o modal próximo ao hotspot clicado
    showModalNearHotspot(hotspot) {
        // Usa o evento armazenado
        const clickEvent = window.lastHotspotClickEvent;

        if (!clickEvent || !clickEvent.target) {
            // Fallback: centraliza se não encontrar o evento
            console.warn('Evento de clique não encontrado, centralizando modal');
            this.showModal();
            return;
        }

        // Encontra o botão do hotspot a partir do evento
        const hotspotButton = clickEvent.target.closest('.hotspot-button');

        if (!hotspotButton) {
            console.warn('Botão do hotspot não encontrado');
            this.showModal();
            return;
        }

        const hotspotDiv = hotspotButton.closest('.hotspot');

        if (!hotspotDiv) {
            console.warn('Div do hotspot não encontrado');
            this.showModal();
            return;
        }

        // Armazena referência ao hotspot para atualizar posição no scroll
        this.currentHotspot = hotspotButton;

        // Posiciona o modal
        this.positionModalNearHotspot();

        // Mostra o modal
        const modal = this.modal;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Adiciona listener de scroll para reposicionar o modal
        this.setupScrollListener();

        // Foca no botão de fechar
        const closeButton = document.getElementById('modalClose');
        setTimeout(() => closeButton.focus(), 100);
    }

    // Posiciona o modal próximo ao hotspot
    positionModalNearHotspot() {
        if (!this.currentHotspot) return;

        // Obtém posição do hotspot relativa à viewport
        const hotspotRect = this.currentHotspot.getBoundingClientRect();

        // Calcula posição do modal próximo ao hotspot
        const modal = this.modal;
        const modalContent = modal.querySelector('.modal-content');

        // Posição ajustada do hotspot (ligeiramente deslocada para o lado direito)
        const offset = 60; // Distância do hotspot
        let left = hotspotRect.right + offset;
        let top = hotspotRect.top + hotspotRect.height / 2;

        // Dimensões do modal
        const modalWidth = 320;
        const modalHeight = 500; // Altura aproximada
        const padding = 20;

        // Ajusta se sair pela direita - muda para o lado esquerdo
        if (left + modalWidth / 2 > window.innerWidth - padding) {
            left = hotspotRect.left - offset;
        }

        // Ajusta verticalmente para não sair da tela
        if (top - modalHeight / 2 < padding) {
            top = padding + modalHeight / 2;
        }
        if (top + modalHeight / 2 > window.innerHeight - padding) {
            top = window.innerHeight - padding - modalHeight / 2;
        }

        // Ajusta horizontalmente se ainda estiver fora (fallback)
        if (left + modalWidth / 2 > window.innerWidth - padding) {
            left = window.innerWidth - padding - modalWidth / 2;
        }
        if (left - modalWidth / 2 < padding) {
            left = padding + modalWidth / 2;
        }

        // Aplica posicionamento
        modalContent.style.position = 'fixed';
        modalContent.style.left = `${left}px`;
        modalContent.style.top = `${top}px`;
        modalContent.style.transform = 'translate(-50%, -50%)';
        modalContent.style.margin = '0';
    }

    // Configura listener de scroll para reposicionar modal
    setupScrollListener() {
        // Remove listener anterior se existir
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener, true);
        }

        // Cria novo listener
        this.scrollListener = () => {
            if (this.modal.classList.contains('show') && this.currentHotspot) {
                // Reposiciona o modal conforme o scroll
                this.positionModalNearHotspot();
            }
        };

        // Adiciona listener com capture para pegar todos os scrolls
        window.addEventListener('scroll', this.scrollListener, true);
    }

    // Remove listener de scroll
    removeScrollListener() {
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener, true);
            this.scrollListener = null;
        }
    }

    // Esconde o modal
    hideModal() {
        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
            // Remove estilos inline de posicionamento
            modalContent.style.position = '';
            modalContent.style.left = '';
            modalContent.style.top = '';
            modalContent.style.transform = '';
            modalContent.style.margin = '';
        }
        this.modal.classList.remove('show');
        document.body.style.overflow = '';

        // Remove listener de scroll
        this.removeScrollListener();

        // Limpa referências
        this.currentHotspot = null;
        window.lastHotspotClickEvent = null;
    }

    // Configura eventos do modal
    setupModal() {
        const closeButton = document.getElementById('modalClose');

        closeButton.addEventListener('click', () => {
            this.hideModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    // Configura navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('show')) {
                return;
            }

            if (e.key === 'Escape') {
                this.hideModal();
            }
        });

        // Navegação do carousel
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('show')) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                this.goToPrevious();
            } else if (e.key === 'ArrowRight') {
                this.goToNext();
            }
        });
    }

    // Configura a paginação
    setupPagination() {
        if (this.banners.length <= 1) {
            this.pagination.style.display = 'none';
            return;
        }

        this.pagination.innerHTML = '';

        this.banners.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);

            if (index === this.currentIndex) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });

            this.pagination.appendChild(dot);
        });
    }

    // Configura botões de navegação
    setupNavigationButtons() {
        const carouselContainer = this.container.querySelector('.carousel-container');
        if (!carouselContainer) return;

        // Remove botões existentes se houver
        const existingPrev = carouselContainer.querySelector('.carousel-button--prev');
        const existingNext = carouselContainer.querySelector('.carousel-button--next');
        if (existingPrev) existingPrev.remove();
        if (existingNext) existingNext.remove();

        // Cria botão anterior
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-button carousel-button--prev';
        prevButton.setAttribute('aria-label', 'Slide anterior');
        prevButton.innerHTML = ''; // Seta será renderizada via CSS
        prevButton.addEventListener('click', () => {
            this.goToPrevious();
        });

        // Cria botão próximo
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-button carousel-button--next';
        nextButton.setAttribute('aria-label', 'Próximo slide');
        nextButton.innerHTML = ''; // Seta será renderizada via CSS
        nextButton.addEventListener('click', () => {
            this.goToNext();
        });

        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);

        // Esconde botões se houver apenas um slide
        if (this.banners.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    }

    // Atualiza a posição do carousel
    updateCarouselPosition() {
        if (!this.carouselContent) return;

        const translateX = -this.currentIndex * 100;
        this.carouselContent.style.transform = `translateX(${translateX}%)`;

        this.updatePaginationDots();
    }

    // Atualiza os pontos de paginação
    updatePaginationDots() {
        const dots = this.pagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Vai para um slide específico
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) {
            return;
        }

        if (index < 0 || index >= this.banners.length) {
            return;
        }

        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateCarouselPosition();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    // Vai para o próximo slide
    goToNext() {
        const nextIndex = (this.currentIndex + 1) % this.banners.length;
        this.goToSlide(nextIndex);
    }

    // Vai para o slide anterior
    goToPrevious() {
        const prevIndex = this.currentIndex === 0 ? this.banners.length - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }

    // Inicia reprodução automática
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.goToNext();
        }, this.options.autoPlayInterval);
    }

    // Para reprodução automática
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Destrói o slider
    destroy() {
        this.stopAutoPlay();
        this.removeScrollListener();

        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Dados de exemplo (substitui a chamada ao Firebase)
const EXAMPLE_BANNERS = [
    {
        id: "banner1",
        title: "Coleção Vintage",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=675&fit=crop",
        aspectRatio: 16 / 9,
        focalPoint: { x: 0.5, y: 0.4 },
        active: true,
        hotspots: [
            {
                id: "hotspot1",
                position: { x: 0.3, y: 0.6 },
                zIndex: 10,
                product: {
                    id: "product1",
                    title: "Cadeira Vintage Escandinava",
                    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=400&fit=crop",
                    currentBid: "R$ 850,00",
                    details: "Cadeira em madeira maciça com design escandinavo dos anos 60. Peça única em excelente estado de conservação."
                }
            },
            {
                id: "hotspot2",
                position: { x: 0.7, y: 0.4 },
                zIndex: 10,
                product: {
                    id: "product2",
                    title: "Mesa de Centro Retrô",
                    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=400&fit=crop",
                    currentBid: "R$ 1.200,00",
                    details: "Mesa de centro em madeira com pés palito, característica do design dos anos 50."
                }
            }
        ]
    },
    {
        id: "banner2",
        title: "Arte Contemporânea",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=675&fit=crop",
        aspectRatio: 16 / 9,
        focalPoint: { x: 0.6, y: 0.3 },
        active: true,
        hotspots: [
            {
                id: "hotspot3",
                position: { x: 0.4, y: 0.5 },
                zIndex: 10,
                product: {
                    id: "product3",
                    title: "Pintura Abstrata Original",
                    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
                    currentBid: "R$ 3.500,00",
                    details: "Obra original em tela, técnica mista. Artista contemporâneo renomado."
                }
            }
        ]
    },
    {
        id: "banner3",
        title: "Joias Exclusivas",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=675&fit=crop",
        aspectRatio: 16 / 9,
        focalPoint: { x: 0.5, y: 0.5 },
        active: true,
        hotspots: [
            {
                id: "hotspot4",
                position: { x: 0.5, y: 0.6 },
                zIndex: 10,
                product: {
                    id: "product4",
                    title: "Anel de Diamante Vintage",
                    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=400&fit=crop",
                    currentBid: "R$ 8.500,00",
                    details: "Anel em ouro 18k com diamante central de 1.5 quilates. Peça única dos anos 40."
                }
            }
        ]
    }
];

// Função para carregar banners do Firebase
async function loadBannersFromFirebase() {
    console.log('🔍 Iniciando carregamento de banners do Firebase...');

    try {
        if (!window.firebaseDb) {
            console.error('❌ Firebase não está inicializado');
            console.log('📋 Usando banners de exemplo como fallback');
            return EXAMPLE_BANNERS;
        }

        console.log('✅ Firebase está disponível, carregando dados...');

        // Import Firestore functions dynamically
        const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

        console.log('📦 Funções do Firestore importadas com sucesso');

        // Primeiro, vamos tentar uma query simples sem orderBy
        console.log('🔍 Tentando query simples primeiro...');

        try {
            // Query simples para buscar todos os banners da coleção
            const simpleQuery = collection(window.firebaseDb, 'interactiveBanners');
            const simpleSnapshot = await getDocs(simpleQuery);

            console.log(`📊 Query simples executada. Total de documentos: ${simpleSnapshot.size}`);

            if (simpleSnapshot.size === 0) {
                console.warn('⚠️ Coleção interactiveBanners está vazia ou não existe');
                return EXAMPLE_BANNERS;
            }

            // Se encontrou documentos, vamos processar
            const allBanners = [];
            simpleSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`📄 Documento encontrado:`, { id: doc.id, data });
                allBanners.push({
                    id: doc.id,
                    ...data
                });
            });

            // Filtrar apenas banners ativos (se o campo existir)
            const activeBanners = allBanners.filter(banner => {
                // Se não tem campo active, considera como ativo
                return banner.active !== false;
            });

            console.log(`🎯 Banners ativos encontrados: ${activeBanners.length}`);

            // Ordenar por order se existir, senão manter ordem original
            activeBanners.sort((a, b) => {
                const orderA = a.order || 0;
                const orderB = b.order || 0;
                return orderA - orderB;
            });

            console.log('📋 Banners finais carregados do Firebase:', activeBanners);

            return activeBanners.length > 0 ? activeBanners : EXAMPLE_BANNERS;

        } catch (queryError) {
            console.error('❌ Erro na query simples:', queryError);

            // Se a query simples falhou, tenta query com where apenas
            try {
                console.log('🔍 Tentando query com filtro where...');
                const whereQuery = query(
                    collection(window.firebaseDb, 'interactiveBanners'),
                    where('active', '==', true)
                );

                const whereSnapshot = await getDocs(whereQuery);
                const banners = [];

                console.log(`📊 Query com where executada. Documentos encontrados: ${whereSnapshot.size}`);

                whereSnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(`📄 Documento encontrado:`, { id: doc.id, data });
                    banners.push({
                        id: doc.id,
                        ...data
                    });
                });

                return banners.length > 0 ? banners : EXAMPLE_BANNERS;

            } catch (whereError) {
                console.error('❌ Erro na query com where:', whereError);
                throw whereError;
            }
        }
    } catch (error) {
        console.error('❌ Erro ao carregar banners do Firebase:', error);
        console.log('📋 Usando banners de exemplo como fallback');
        // Fallback para banners de exemplo em caso de erro
        return EXAMPLE_BANNERS;
    }
}

// Inicialização automática quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 DOM carregado, iniciando slider...');

    // Aguarda o Firebase estar disponível
    if (!window.firebaseDb) {
        console.log('⏳ Aguardando Firebase estar disponível...');
        // Aguarda um pouco para o Firebase ser inicializado
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!window.firebaseDb) {
            console.error('❌ Firebase ainda não está disponível após aguardar');
        } else {
            console.log('✅ Firebase agora está disponível');
        }
    } else {
        console.log('✅ Firebase já está disponível');
    }

    // Cria uma instância do slider (autoslide desabilitado)
    console.log('🎠 Criando instância do slider...');
    const slider = new InteractiveBannersSlider('interactiveBannersSlider', {
        autoPlay: false, // Autoslide removido
        autoPlayInterval: 5000
    });

    // Carrega os banners do Firebase
    console.log('📥 Carregando banners...');
    const banners = await loadBannersFromFirebase();
    slider.loadBanners(banners);

    // Expõe o slider globalmente para debug/controle externo
    window.interactiveBannersSlider = slider;
});

// Expõe a classe globalmente
window.InteractiveBannersSlider = InteractiveBannersSlider;