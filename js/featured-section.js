// Featured Section Firebase Integration
// Import Firestore functions
import { collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class FeaturedSectionManager {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        try {
            // Wait for Firebase to be available
            await this.waitForFirebase();
            
            if (window.firebaseDb) {
                this.db = window.firebaseDb;
                await this.loadFeaturedContent();
            } else {
                console.warn('Firebase not initialized, using fallback content');
                this.renderFallbackContent();
            }
        } catch (error) {
            console.error('Error initializing Featured section:', error);
            this.renderFallbackContent();
        }
    }

    waitForFirebase() {
        return new Promise((resolve) => {
            if (window.firebaseDb) {
                resolve();
            } else {
                const checkFirebase = () => {
                    if (window.firebaseDb) {
                        resolve();
                    } else {
                        setTimeout(checkFirebase, 100);
                    }
                };
                checkFirebase();
            }
        });
    }

    async loadFeaturedContent() {
        try {
            // Query the 'destaques' collection, ordered by createdAt, limited to 4 items
            const destaquesRef = collection(this.db, 'destaques');
            const q = query(destaquesRef, orderBy('createdAt', 'desc'), limit(4));
            const querySnapshot = await getDocs(q);
            
            const destaques = [];
            querySnapshot.forEach((doc) => {
                destaques.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Render the featured content
            this.renderFeaturedContent(destaques);
            
        } catch (error) {
            console.error('Erro ao carregar destaques para Featured:', error);
            // Fallback to static content if Firebase fails
            this.renderFallbackContent();
        }
    }

    renderFeaturedContent(destaques) {
        const container = document.querySelector('.featured-grid');
        if (!container) return;

        // Remove loading indicator
        const loadingIndicator = document.getElementById('featuredLoading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        // Clear existing content
        container.innerHTML = '';

        // Check if we have destaques to display
        if (destaques.length === 0) {
            this.renderFallbackContent();
            return;
        }

        // Limit to 4 items to match the grid layout
        const limitedDestaques = destaques.slice(0, 4);

        // Categories mapping for fallback
        const categories = ['Tableware', 'Kitchen Accessories', 'Homeware', 'Lifestyle'];

        limitedDestaques.forEach((destaque, index) => {
            const featuredItem = this.createFeaturedElement(destaque, categories[index] || 'Featured');
            container.appendChild(featuredItem);
        });

        // Fill remaining slots if we have less than 4 items
        if (limitedDestaques.length < 4) {
            for (let i = limitedDestaques.length; i < 4; i++) {
                const fallbackItem = this.createFallbackElement(categories[i], i + 1);
                container.appendChild(fallbackItem);
            }
        }
    }

    createFeaturedElement(destaque, fallbackCategory) {
        const featuredItem = document.createElement('div');
        featuredItem.className = 'featured-item';

        // Get the first image or use fallback
        const imageUrl = destaque.images && destaque.images.length > 0 
            ? destaque.images[0] 
            : `images/featured-${Math.floor(Math.random() * 4) + 1}.jpg`;

        // Get title or use fallback
        const title = destaque.title || fallbackCategory;

        // Create the HTML structure
        featuredItem.innerHTML = `
            <div class="featured-image">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='images/featured-1.jpg'">
            </div>
            <div class="featured-category">+ ${title}</div>
        `;

        // Add click event to show more details
        featuredItem.addEventListener('click', () => {
            this.showFeaturedDetails(destaque);
        });

        return featuredItem;
    }

    createFallbackElement(category, index) {
        const featuredItem = document.createElement('div');
        featuredItem.className = 'featured-item';

        featuredItem.innerHTML = `
            <div class="featured-image">
                <img src="images/featured-${index}.jpg" alt="${category}">
            </div>
            <div class="featured-category">+ ${category}</div>
        `;

        return featuredItem;
    }

    showFeaturedDetails(destaque) {
        // Create a modal or redirect to auction page
        if (destaque.auctionUrl) {
            window.open(destaque.auctionUrl, '_blank');
        } else {
            // Show details in a modal (you can implement this later)
            alert(`${destaque.title}\n\nDetalhes: ${destaque.details || 'Sem detalhes disponíveis'}\n\nLance atual: R$ ${destaque.currentBid || '0'}`);
        }
    }

    renderFallbackContent() {
        const container = document.querySelector('.featured-grid');
        if (!container) return;

        // Remove loading indicator
        const loadingIndicator = document.getElementById('featuredLoading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        // Clear existing content
        container.innerHTML = '';

        // Static fallback content
        const fallbackItems = [
            { category: 'Tableware', image: 'featured-1.jpg' },
            { category: 'Kitchen Accessories', image: 'featured-2.jpg' },
            { category: 'Homeware', image: 'featured-3.jpg' },
            { category: 'Lifestyle', image: 'featured-4.jpg' }
        ];

        fallbackItems.forEach((item, index) => {
            const featuredItem = document.createElement('div');
            featuredItem.className = 'featured-item';
            
            featuredItem.innerHTML = `
                <div class="featured-image">
                    <img src="images/${item.image}" alt="${item.category}">
                </div>
                <div class="featured-category">+ ${item.category}</div>
            `;
            
            container.appendChild(featuredItem);
        });

        console.log('Using fallback static content for Featured section');
    }

    // Method to refresh content
    async refreshContent() {
        await this.loadFeaturedContent();
    }
}

// Initialize the Featured Section Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure the featured section is in the DOM
    setTimeout(() => {
        window.featuredSectionManager = new FeaturedSectionManager();
    }, 500);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.featuredSectionManager = new FeaturedSectionManager();
        }, 500);
    });
} else {
    setTimeout(() => {
        window.featuredSectionManager = new FeaturedSectionManager();
    }, 500);
}