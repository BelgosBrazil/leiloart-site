// Custom loader animation for MYNE
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const loader = document.getElementById('loader');
        const loaderText = document.querySelector('#loader .loader-text');
        const loaderTitle = document.getElementById('loaderTitle');
        const loaderSubtitle = document.querySelector('#loader .loader-subtitle');
        const centerContainer = document.querySelector('#loader .inner .center');
        const header = document.getElementById('header');
        const cookies = document.getElementById('cookie-law-info-bar');
        
        if (!loader || !loaderText || !loaderSubtitle || !centerContainer || !header) return;
        
        // Esconder o header e cookies inicialmente
        header.classList.add('hidden-during-intro');
        if (cookies) {
            cookies.style.opacity = '0';
            cookies.style.pointerEvents = 'none';
        }
        
        // Sequência de animação
        const animationSequence = async () => {
            // Passo 1: Mostrar o título MYNE no centro
            await delay(500);
            loaderText.classList.add('show');
            
            // Passo 2: Aguardar com o título visível
            await delay(1800);
            
            // Passo 3: Mover o título para a posição do header
            centerContainer.classList.add('move-to-header');
            
            // Passo 4: Aguardar a animação de movimento completar
            await delay(1500);
            
            // Passo 5: Mostrar o subtítulo
            loaderSubtitle.classList.add('show');
            
            // Passo 6: Aguardar com tudo visível
            await delay(2500);
            
            // Passo 7: Transição sincronizada - fade out do loader e fade in do header
            // Começar a mostrar o header
            header.classList.remove('hidden-during-intro');
            header.classList.add('show-after-intro');
            
            // Ao mesmo tempo, começar a esconder o loader
            loader.classList.add('hide-loader');
            
            // Passo 8: Aguardar a transição completar
            await delay(800);
            
            // Passo 9: Mostrar cookies
            if (cookies) {
                cookies.style.opacity = '1';
                cookies.style.pointerEvents = 'auto';
                cookies.style.transition = 'opacity 0.6s ease-out';
            }
            
            // Passo 10: Remover o loader do DOM
            await delay(1000);
            loader.style.display = 'none';
        };
        
        // Função auxiliar para delays
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        // Iniciar a sequência de animação
        animationSequence();
    });
})();
