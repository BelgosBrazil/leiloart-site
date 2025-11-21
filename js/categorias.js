document.addEventListener('DOMContentLoaded', () => {
    const categorias = [
        { nome: 'Sofás', imagem: 'sofas.jpg' },
        { nome: 'Poltronas', imagem: 'poltrona.jpg' },
        { nome: 'Espreguiçadeiras', imagem: 'espreguicadeira.jpg' },
        { nome: 'Mesas de centro', imagem: 'mesa_centro.jpg' },
        { nome: 'Cadeiras', imagem: 'cadeiras.jpg' },
        { nome: 'Vasos', imagem: 'vasos.jpg' },
        { nome: 'Tapetes', imagem: 'tapetes.jpg' },
        { nome: 'Cozinhas', imagem: 'cozinhas.jpg' },
        { nome: 'Aparadores', imagem: 'aparadores.jpg' },
        { nome: 'Mesas', imagem: 'mesas.jpg' },
        { nome: 'Console', imagem: 'consoles.jpg' },
        { nome: 'Camas', imagem: 'camas.jpg' },
        { nome: 'Pias', imagem: 'pias.jpg' }
    ];

    const slider = document.querySelector('.categorias-slider');
    const sliderContainer = document.querySelector('.categorias-slider-container');

    // Duplicar categorias para o efeito de slide infinito
    const categoriasDuplicadas = [...categorias, ...categorias];

    categoriasDuplicadas.forEach(categoria => {
        const item = document.createElement('div');
        item.classList.add('categoria-item');

        const link = document.createElement('a');
        link.href = `/loja?categoria=${encodeURIComponent(categoria.nome)}`;

        const img = document.createElement('img');
        img.src = `categorias/${categoria.imagem}`;
        img.alt = categoria.nome;

        const p = document.createElement('p');
        p.textContent = categoria.nome;

        link.appendChild(img);
        link.appendChild(p);
        item.appendChild(link);
        slider.appendChild(item);
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador para acelerar o scroll
        slider.scrollLeft = scrollLeft - walk;
    });


});