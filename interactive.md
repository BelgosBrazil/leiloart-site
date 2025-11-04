# Interactive Banners Slider - HTML/CSS/JS

Este é um componente de slider de banners interativos convertido do React para HTML/CSS/JS puro, baseado no componente original `InteractiveBannersSlider.tsx`.

## Arquivos Incluídos

- `interactive-banners-slider.html` - Estrutura HTML principal
- `interactive-banners-slider.css` - Estilos CSS
- `interactive-banners-slider.js` - Funcionalidade JavaScript

## Funcionalidades

✅ **Slider/Carousel de banners** com transições suaves
✅ **Hotspots interativos** posicionados sobre as imagens
✅ **Modal de produtos** com detalhes e imagens
✅ **Paginação visual** com pontos indicadores
✅ **Navegação por teclado** (setas e ESC)
✅ **Reprodução automática** (opcional)
✅ **Design responsivo** para mobile e desktop
✅ **Acessibilidade** com ARIA labels e foco adequado
✅ **Dados mock** incluídos (substitui Firebase)

## Como Usar

### 1. Uso Básico

Inclua os arquivos CSS e JS no seu HTML:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Site</title>
    <link rel="stylesheet" href="interactive-banners-slider.css">
</head>
<body>
    <!-- Seu conteúdo aqui -->
    
    <!-- Container do slider -->
    <section class="interactive-banners-slider" id="interactiveBannersSlider">
        <div class="carousel-container">
            <div class="carousel-content" id="carouselContent"></div>
        </div>
        <div class="carousel-pagination" id="carouselPagination"></div>
    </section>

    <!-- Modal (necessário) -->
    <div class="product-modal" id="productModal">
        <div class="modal-content">
            <button class="modal-close" id="modalClose">&times;</button>
            <div class="modal-body" id="modalBody"></div>
        </div>
    </div>

    <!-- Templates (necessários) -->
    <template id="bannerTemplate">
        <div class="carousel-item">
            <div class="banner-container">
                <div class="vignette-overlay">
                    <div class="vignette-left"></div>
                    <div class="vignette-right"></div>
                </div>
                <img class="banner-image" alt="" loading="lazy">
                <div class="banner-title"><h3></h3></div>
                <div class="hotspots-container"></div>
            </div>
        </div>
    </template>

    <template id="hotspotTemplate">
        <div class="hotspot">
            <button class="hotspot-button" aria-label="Ver produto">
                <span>+</span>
            </button>
        </div>
    </template>

    <template id="productModalTemplate">
        <div class="product-card">
            <div class="product-header">
                <h4 class="product-title"></h4>
                <p class="product-bid"></p>
            </div>
            <div class="product-content">
                <div class="product-image-container">
                    <img class="product-image" alt="">
                </div>
                <p class="product-details"></p>
                <div class="product-actions">
                    <button class="product-button">Ver detalhes</button>
                </div>
            </div>
        </div>
    </template>

    <script src="interactive-banners-slider.js"></script>
</body>
</html>
```

### 2. Uso Avançado com Dados Personalizados

```javascript
// Seus dados de banners
const meusBanners = [
    {
        id: "banner1",
        title: "Meu Banner",
        imageUrl: "https://exemplo.com/imagem.jpg",
        aspectRatio: 16/9,
        focalPoint: { x: 0.5, y: 0.4 },
        active: true,
        hotspots: [
            {
                id: "hotspot1",
                position: { x: 0.3, y: 0.6 }, // Posição relativa (0-1)
                zIndex: 10,
                product: {
                    id: "produto1",
                    title: "Meu Produto",
                    imageUrl: "https://exemplo.com/produto.jpg",
                    currentBid: "R$ 500,00",
                    details: "Descrição do produto..."
                }
            }
        ]
    }
];

// Inicialização manual
document.addEventListener('DOMContentLoaded', function() {
    const slider = new InteractiveBannersSlider('interactiveBannersSlider', {
        autoPlay: true,
        autoPlayInterval: 5000
    });
    
    slider.loadBanners(meusBanners);
});
```

## Estrutura dos Dados

### Banner
```javascript
{
    id: string,              // ID único do banner
    title: string,           // Título do banner (opcional)
    imageUrl: string,        // URL da imagem
    aspectRatio: number,     // Proporção da imagem (ex: 16/9)
    focalPoint: {            // Ponto focal da imagem
        x: number,           // 0-1 (esquerda para direita)
        y: number            // 0-1 (topo para baixo)
    },
    active: boolean,         // Se o banner está ativo
    hotspots: Hotspot[]      // Array de hotspots
}
```

### Hotspot
```javascript
{
    id: string,              // ID único do hotspot
    position: {              // Posição relativa no banner
        x: number,           // 0-1 (esquerda para direita)
        y: number            // 0-1 (topo para baixo)
    },
    zIndex: number,          // Z-index do hotspot (opcional)
    product: {               // Dados do produto
        id: string,
        title: string,
        imageUrl: string,
        currentBid: string,  // Lance atual (opcional)
        details: string      // Descrição (opcional)
    }
}
```

## Opções de Configuração

```javascript
const options = {
    autoPlay: false,         // Reprodução automática
    autoPlayInterval: 5000   // Intervalo em ms
};

const slider = new InteractiveBannersSlider('containerId', options);
```

## Métodos Disponíveis

```javascript
// Navegação
slider.goToNext();           // Próximo slide
slider.goToPrevious();       // Slide anterior
slider.goToSlide(index);     // Slide específico

// Reprodução automática
slider.startAutoPlay();      // Inicia auto-play
slider.stopAutoPlay();       // Para auto-play

// Controle
slider.destroy();            // Destrói o slider
```

## Navegação por Teclado

- **Seta Esquerda**: Slide anterior
- **Seta Direita**: Próximo slide
- **ESC**: Fecha modal de produto

## Personalização CSS

Você pode personalizar as cores e estilos modificando as variáveis CSS:

```css
/* Cores principais */
.product-button {
    background: #d946ef; /* Cor do botão */
}

.hotspot-button {
    background: rgba(255, 255, 255, 0.9); /* Cor do hotspot */
}

.pagination-dot {
    background: rgba(255, 255, 255, 0.7); /* Cor dos pontos */
}
```

## Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Diferenças do Componente React Original

1. **Firebase**: Substituído por dados estáticos/mock
2. **React Router**: Links substituídos por console.log (personalizável)
3. **Tailwind CSS**: Substituído por CSS vanilla
4. **Componentes UI**: Reimplementados em HTML/CSS puro

## Integração com Backend

Para integrar com seu backend, substitua os dados mock no JavaScript:

```javascript
// Em vez de EXAMPLE_BANNERS, carregue de sua API
async function carregarBanners() {
    const response = await fetch('/api/banners');
    const banners = await response.json();
    
    slider.loadBanners(banners);
}
```

## Suporte

Este componente é uma conversão fiel do componente React original, mantendo todas as funcionalidades principais. Para dúvidas ou problemas, verifique se a estrutura HTML e os dados estão corretos conforme a documentação.