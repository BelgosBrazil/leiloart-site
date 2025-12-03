// Custom loader animation for MYNE - Simplificada
(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        const loader = document.getElementById('loader');
        const loaderText = document.querySelector('#loader .loader-text');
        const header = document.getElementById('header');
        const cookies = document.getElementById('cookie-law-info-bar');

        if (!loader || !loaderText || !header) return;

        // Esconder o header e cookies inicialmente
        header.classList.add('hidden-during-intro');
        if (cookies) {
            cookies.style.opacity = '0';
            cookies.style.pointerEvents = 'none';
        }

        // Sequência de animação simplificada
        const animationSequence = async () => {
            // Passo 1: Mostrar o título MYNE no centro
            await delay(300);
            loaderText.classList.add('show');

            // Passo 2: Aguardar com o logo visível (tempo total para visualização)
            // +2 segundos conforme solicitado
            await delay(6300);

            // Passo 4: Fade out do loader e fade in do header
            header.classList.remove('hidden-during-intro');
            header.classList.add('show-after-intro');
            loader.classList.add('hide-loader');

            // Passo 5: Aguardar a transição completar
            await delay(800);

            // Passo 6: Mostrar cookies
            if (cookies) {
                cookies.style.opacity = '1';
                cookies.style.pointerEvents = 'auto';
                cookies.style.transition = 'opacity 0.6s ease-out';
            }

            // Passo 7: Remover o loader do DOM
            await delay(500);
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
