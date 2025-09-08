// Simple Image Gallery to replace Flash
class SimpleGallery {
    constructor(containerId, images, descriptions = []) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.descriptions = descriptions;
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="gallery-wrapper">
                <div class="gallery-main">
                    <img id="gallery-image" src="${this.images[0]}" alt="Gallery Image">
                    <div class="gallery-description" id="gallery-description">
                        ${this.descriptions[0] || ''}
                    </div>
                </div>
                <div class="gallery-controls">
                    <button id="prev-btn">&larr; Previous</button>
                    <span class="gallery-counter">
                        <span id="current-num">1</span> / <span id="total-num">${this.images.length}</span>
                    </span>
                    <button id="next-btn">Next &rarr;</button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('prev-btn').addEventListener('click', () => this.prev());
        document.getElementById('next-btn').addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    prev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.updateDisplay();
    }

    next() {
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('gallery-image').src = this.images[this.currentIndex];
        document.getElementById('gallery-description').textContent = this.descriptions[this.currentIndex] || '';
        document.getElementById('current-num').textContent = this.currentIndex + 1;
    }
}
