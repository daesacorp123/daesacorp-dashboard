// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Interactive metrics animation
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    
    metrics.forEach(metric => {
        const originalText = metric.textContent;
        metric.textContent = '0';
        
        let counter = 0;
        const target = parseInt(originalText.replace(/\D/g, ''));
        const increment = target / 50;
        
        const updateCounter = () => {
            if (counter < target) {
                counter += increment;
                metric.textContent = Math.floor(counter) + (originalText.includes('x') ? 'x' : '');
                setTimeout(updateCounter, 30);
            } else {
                metric.textContent = originalText;
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(metric.parentElement);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    animateMetrics();
    
    // Demo video placeholder click
    document.querySelector('.video-placeholder').addEventListener('click', function() {
        this.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <div style="background: rgba(0,0,0,0.7); color: white; padding: 20px; border-radius: 10px;">
                    <i class="fas fa-play-circle" style="font-size: 3rem; margin-bottom: 10px;"></i>
                    <p>Video Demo Akan Diputar</p>
                    <small>Demo interaktif dashboard marketing</small>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.innerHTML = `
                <i class="fas fa-play"></i>
                <p>Video Demo 60 Detik</p>
            `;
        }, 3000);
    });
    
    // Button interactions
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const buttonText = this.textContent.trim();
            let message = '';
            
            if (buttonText.includes('Demo')) {
                message = 'Demo akan segera dimulai! Kami akan mengarahkan Anda ke halaman demo interaktif.';
            } else if (buttonText.includes('Konsultasi')) {
                message = 'Terima kasih! Tim kami akan menghubungi Anda dalam 1x24 jam untuk konsultasi gratis.';
            } else if (buttonText.includes('Tingkatkan')) {
                message = 'Mengarahkan Anda ke halaman upgrade paket...';
            }
            
            if (message) {
                alert(message);
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });
});