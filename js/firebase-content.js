// Firebase Content Management
class FirebaseContentManager {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        while (!window.firebaseDb) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.db = window.firebaseDb;
        this.loadDestaquesContent();
    }

    async loadDestaquesContent() {
        try {
            // Import Firestore functions dynamically
            const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Get the destaques collection
            const destaquesRef = collection(this.db, 'destaques');
            const snapshot = await getDocs(destaquesRef);
            
            const destaques = [];
            snapshot.forEach((doc) => {
                destaques.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Render the content
            this.renderDestaquesContent(destaques);
            
        } catch (error) {
            console.error('Erro ao carregar destaques:', error);
            // Fallback to static content if Firebase fails
            this.renderFallbackContent();
        }
    }

    renderDestaquesContent(destaques) {
        const container = document.getElementById('destaques-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Check if we have destaques to display
        if (destaques.length === 0) {
            this.renderFallbackContent();
            return;
        }

        // Limit to 3 items to match the original layout
        const limitedDestaques = destaques.slice(0, 3);

        limitedDestaques.forEach((destaque, index) => {
            const infoDiv = this.createDestaqueElement(destaque);
            container.appendChild(infoDiv);
            
            // Add stroke separator except for the last item
            if (index < limitedDestaques.length - 1) {
                const stroke = document.createElement('div');
                stroke.className = 'stroke stroke--h';
                container.appendChild(stroke);
            }
        });
    }

    createDestaqueElement(destaque) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';

        // Format the current bid
        const currentBid = destaque.currentBid ? `R$ ${destaque.currentBid.toLocaleString('pt-BR')}` : 'Lance inicial';
        
        // Format the end date
        let endDateText = 'Data não definida';
        if (destaque.endAt && destaque.endAt.toDate) {
            const endDate = destaque.endAt.toDate();
            endDateText = endDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Check if item has images
        const hasImages = destaque.images && destaque.images.length > 0;
        const firstImage = hasImages ? destaque.images[0] : null;

        // Create content structure
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.style.padding = '3vw 5vw !important';
        
        contentDiv.innerHTML = `
            <div class="supertitle" style="font-size: 3vh !important; margin-bottom: 0 !important;">
                <p style="font-size: inherit !important; margin: 0 !important;"><strong style="font-size: 3vh !important;">${destaque.title || 'Título não disponível'}</strong></p>
            </div>
            <div class="wysiwyg">
                ${destaque.details ? `<p><span style="font-weight: 400;">${destaque.details}</span></p>` : ''}
                ${destaque.size ? `<p><span style="font-weight: 400;">Tamanho: <strong>${destaque.size}</strong></span></p>` : ''}
            </div>
        `;

        infoDiv.appendChild(contentDiv);

        // Add image if available (following original pattern)
        if (firstImage) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image';
            imageDiv.style.setProperty('--ratio', 'calc(100vh - 80px)');
            imageDiv.innerHTML = `<img src="${firstImage}" alt="${destaque.title || 'Destaque'}" style="width: 100%; height: 100%; object-fit: cover;">`;
            infoDiv.appendChild(imageDiv);
        }

        // Add current bid info below image with black background
        if (firstImage) {
            const bidDiv = document.createElement('div');
            bidDiv.style.cssText = 'background: #2f2f2f; padding: 20px; margin-top: 0; text-align: center;';
            bidDiv.innerHTML = `
                <p style="color: white; margin: 0 0 10px 0; font-size: 1.1em;">
                    <span style="font-weight: 400;">Lance atual: <strong style="font-weight: bold; font-size: 1.3em;">${currentBid}</strong></span>
                    ${destaque.auctionUrl ? `
                        <a href="${destaque.auctionUrl}" 
                           target="_blank" 
                           style="
                               display: inline-block;
                               background: white;
                               color: #000;
                               padding: 8px 16px;
                               text-decoration: none;
                               font-weight: 500;
                               font-size: 0.9em;
                               margin-left: 15px;
                               transition: opacity 0.3s ease;
                           "
                           onmouseover="this.style.opacity='0.8'"
                           onmouseout="this.style.opacity='1'">
                            Ver mais
                        </a>
                    ` : ''}
                </p>
                <p style="color: white; margin: 0; font-size: 0.9em;">
                    <span style="font-weight: 400;">Encerra em: <strong>${endDateText}</strong></span>
                </p>
            `;
            infoDiv.appendChild(bidDiv);
        }

        return infoDiv;
    }

    renderFallbackContent() {
        const container = document.getElementById('destaques-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Render original static content
        const staticContent = [
            {
                title: 'Our<br>laundry',
                content: 'Our laundry facility, which we acquired in 2020, has a long history in Los Angeles. Originally established in 2006, our wash house and our staff have been serving the premium denim industry with authentic, iconic washes for many years.<br><br>Now, we offer a wide range of sustainable dyeing and washing innovations.'
            },
            {
                title: 'Nearshoring<br>Hub',
                content: 'Our L.A. facility serves as a crucial hub connecting our customers with production centers across the Western Hemisphere.<br><br>Whether you need help building a made-in-LA collection or a finished-in-LA line — or you need full-package production or design development assistance for a collection that will be produced elsewhere — our team of experts can help.'
            },
            {
                title: 'Flexible<br>Operating Models',
                content: 'Timing is everything in fashion. SFI\'s flexible operating models let customers tailor their production according to price, volume and delivery.<br><br>Our growing network of production centers in the Western Hemisphere help our customers realize a significant savings in transportation time, allowing them to react to trends in real time, better schedule in-store deliveries and avoid retail markdowns.'
            }
        ];

        staticContent.forEach((item, index) => {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            infoDiv.innerHTML = `
                <div class="content">
                    <div class="supertitle"><p><strong>${item.title}</strong></p></div>
                    <div class="wysiwyg"><p><span style="font-weight: 400;">${item.content}</span></p></div>
                </div>
            `;
            container.appendChild(infoDiv);
            
            // Add stroke separator except for the last item
            if (index < staticContent.length - 1) {
                const stroke = document.createElement('div');
                stroke.className = 'stroke stroke--h';
                container.appendChild(stroke);
            }
        });

        console.log('Using fallback static content');
    }

    // Method to refresh content
    async refreshContent() {
        await this.loadDestaquesContent();
    }
}

// Initialize the Firebase Content Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseContentManager = new FirebaseContentManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.firebaseContentManager = new FirebaseContentManager();
    });
} else {
    window.firebaseContentManager = new FirebaseContentManager();
}