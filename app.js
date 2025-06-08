// Slide presentation application for Priority Queue Algorithm
class SlidePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        
        // Get DOM elements
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        this.progressFill = document.getElementById('progress-fill');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Initialize the presentation
        this.init();
    }
    
    init() {
        // Set initial values
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial slide
        this.showSlide(this.currentSlide);
        
        console.log('Slide presentation initialized');
    }
    
    addEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;
            
            let deltaX = startX - endX;
            let deltaY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                    if (deltaX > 0) {
                        this.nextSlide(); // Swipe left -> next slide
                    } else {
                        this.previousSlide(); // Swipe right -> previous slide
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    showSlide(slideNumber) {
        // Validate slide number
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.warn(`Invalid slide number: ${slideNumber}`);
            return;
        }
        
        // Hide all slides first
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            const slideNum = index + 1;
            if (slideNum < slideNumber) {
                slide.classList.add('prev');
            }
        });
        
        // Show current slide with animation delay
        setTimeout(() => {
            const currentSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
            if (currentSlideElement) {
                currentSlideElement.classList.add('active');
            }
        }, 50);
        
        this.currentSlide = slideNumber;
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Announce slide change to screen readers
        this.announceSlideChange(slideNumber);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
            this.addSlideAnimation('next');
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
            this.addSlideAnimation('prev');
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.showSlide(slideNumber);
        }
    }
    
    addSlideAnimation(direction) {
        // Add visual feedback for slide transitions
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.transform = direction === 'next' ? 
                'translateX(-10px)' : 'translateX(10px)';
            
            setTimeout(() => {
                activeSlide.style.transform = 'translateX(0)';
            }, 100);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideElement && this.totalSlidesElement) {
            this.currentSlideElement.textContent = this.currentSlide;
            this.totalSlidesElement.textContent = this.totalSlides;
        }
    }
    
    updateProgressBar() {
        if (this.progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            this.prevBtn.setAttribute('aria-label', 
                this.currentSlide === 1 ? 'Primeiro slide' : 'Slide anterior');
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            this.nextBtn.setAttribute('aria-label', 
                this.currentSlide === this.totalSlides ? 'Último slide' : 'Próximo slide');
            
            // Update button text for last slide
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.innerHTML = 'Fim <span>✓</span>';
            } else {
                this.nextBtn.innerHTML = 'Próximo <span>→</span>';
            }
        }
    }
    
    announceSlideChange(slideNumber) {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        
        const slideTitle = this.getSlideTitle(slideNumber);
        announcement.textContent = `Slide ${slideNumber} de ${this.totalSlides}: ${slideTitle}`;
        
        document.body.appendChild(announcement);
        
        // Remove announcement after it's been read
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    getSlideTitle(slideNumber) {
        const slideTitles = [
            'Algoritmo de Fila de Prioridade',
            'Conceitos Fundamentais',
            'Características e Propriedades', 
            'Implementações Possíveis',
            'Heap Binário',
            'Operações Básicas',
            'Análise de Complexidade',
            'Aplicações Práticas',
            'Algoritmos que Usam Filas de Prioridade',
            'Implementação em Código',
            'Exercícios Práticos',
            'Conclusão'
        ];
        
        return slideTitles[slideNumber - 1] || `Slide ${slideNumber}`;
    }
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    // Method to handle window resize
    handleResize() {
        // Recalculate slide dimensions if needed
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            // Force reflow to ensure proper positioning
            activeSlide.style.transform = 'translateX(0)';
        }
    }
}

// Additional utility functions
function addKeyboardHints() {
    // Add keyboard navigation hints
    const hints = document.createElement('div');
    hints.className = 'keyboard-hints sr-only';
    hints.innerHTML = `
        <p>Navegação por teclado:</p>
        <ul>
            <li>Seta direita ou Espaço: Próximo slide</li>
            <li>Seta esquerda: Slide anterior</li>
            <li>Home: Primeiro slide</li>
            <li>End: Último slide</li>
            <li>Escape: Voltar ao início</li>
        </ul>
    `;
    document.body.appendChild(hints);
}

function addSlidePreloader() {
    // Preload slide content for smoother transitions
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        // Add data attributes for easier management
        slide.setAttribute('data-loaded', 'true');
        slide.setAttribute('data-slide-index', index + 1);
    });
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if all required elements exist
    const requiredElements = [
        '.slide',
        '#current-slide',
        '#total-slides',
        '#progress-fill',
        '#prev-btn',
        '#next-btn'
    ];
    
    const missingElements = requiredElements.filter(selector => 
        !document.querySelector(selector)
    );
    
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
        return;
    }
    
    // Initialize the presentation
    const presentation = new SlidePresentation();
    
    // Add utility functions
    addKeyboardHints();
    addSlidePreloader();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        presentation.handleResize();
    });
    
    // Make presentation globally accessible for debugging
    window.slidePresentation = presentation;
    
    // Add loading complete indicator
    document.body.classList.add('presentation-loaded');
    
    console.log('Priority Queue Algorithm slides ready!');
    console.log('Use arrow keys or buttons to navigate');
    console.log('Total slides:', presentation.getTotalSlides());
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Presentation error:', e.error);
});

// Prevent accidental page reload
window.addEventListener('beforeunload', function(e) {
    if (window.slidePresentation && window.slidePresentation.getCurrentSlide() > 1) {
        e.preventDefault();
        e.returnValue = 'Tem certeza que deseja sair da apresentação?';
    }
});

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('slides-script-loaded');
}