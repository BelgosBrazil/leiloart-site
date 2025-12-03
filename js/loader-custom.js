// Custom loader animation for MYNE - Simplificada
(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        const loader = document.getElementById('loader');
        const header = document.getElementById('header');
        const cookies = document.getElementById('cookie-law-info-bar');
        const logo1 = document.getElementById('introLogo1');
        const logo2 = document.getElementById('introLogo2');

        if (!loader || !header || !logo1 || !logo2) return;

        // Esconder o header e cookies inicialmente
        header.classList.add('hidden-during-intro');
        if (cookies) {
            cookies.style.opacity = '0';
            cookies.style.pointerEvents = 'none';
        }

        // Sequência de animação simplificada
        const animationSequence = async () => {
            // Passo 1: Mostrar o primeiro logo
            await delay(200);
            logo1.classList.add('show');

            // Passo 2: 2s depois, mostrar o segundo logo empilhado
            await delay(2000);
            logo2.classList.add('show');

            // Passo 3: ~6s depois, sair da intro (reduzido em 2s)
            await delay(6000);
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
