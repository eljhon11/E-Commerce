// Interactive Background with Three.js
function initBackground() {
    const container = document.getElementById('background-canvas');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00f7ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 5;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Initialize 3D product model
function init3DProduct() {
    const container = document.getElementById('product-3d-model');
    
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create a simple cube as placeholder for the 3D model
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f7ff,
        wireframe: true
    });
    const model = new THREE.Mesh(geometry, material);
    scene.add(model);
    
    camera.position.z = 4;
    
    // Handle container resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Interactive rotation on mouse move
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        const y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        model.rotation.x = y * 2;
        model.rotation.y = x * 2;
    });
}
// Cart functionality
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    let cart = [];
    
    // Open cart
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card') || button.closest('.showcase-product');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('img')?.src || 'https://via.placeholder.com/100x100';
            
            // Convert price string to number
            const price = parseFloat(productPrice.replace('$', ''));
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.name === productName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    image: productImage,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show cart after adding item
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add animation effect to cart icon
            cartIcon.classList.add('pulse');
            setTimeout(() => {
                cartIcon.classList.remove('pulse');
            }, 300);
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">
                            <button class="decrease-quantity">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity">+</button>
                        </div>
                    </div>
                    <button class="remove-item">×</button>
                `;
                
                cartItems.appendChild(cartItem);
                
                // Add event listeners for quantity buttons
                const decreaseBtn = cartItem.querySelector('.decrease-quantity');
                const increaseBtn = cartItem.querySelector('.increase-quantity');
                const removeBtn = cartItem.querySelector('.remove-item');
                
                decreaseBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(cartItem => cartItem.name !== item.name);
                    }
                    updateCart();
                });
                
                increaseBtn.addEventListener('click', () => {
                    item.quantity += 1;
                    updateCart();
                });
                
                removeBtn.addEventListener('click', () => {
                    cart = cart.filter(cartItem => cartItem.name !== item.name);
                    updateCart();
                });
            });
        }
        
        // Update total amount
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }
}

// Animate stats counter
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-count'));
        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                if (Number.isInteger(target)) {
                    stat.textContent = Math.floor(current);
                } else {
                    stat.textContent = current.toFixed(1);
                }
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
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
        
        observer.observe(stat);
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Interactive category cards
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add a ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-effect');
            card.appendChild(ripple);
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
            
            ripple.classList.add('active');
            
            setTimeout(() => {
                ripple.remove();
                
                // Navigate to category page (placeholder)
                const category = card.getAttribute('data-category');
                console.log(`Navigating to ${category} category`);
                // window.location.href = `/category/${category}`;
            }, 300);
        });
    });
}

// Newsletter form submission
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Subscribing...';
            
            setTimeout(() => {
                button.textContent = 'Thank You!';
                form.reset();
                
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                }, 2000);
            }, 1500);
            
            console.log(`Newsletter subscription for: ${email}`);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background
    if (typeof THREE !== 'undefined') {
        initBackground();
        init3DProduct();
    } else {
        console.warn('THREE.js not loaded. Interactive background disabled.');
    }
    
    // Initialize other components
    initCart();
    animateStats();
    initSmoothScroll();
    initCategoryCards();
    initNewsletterForm();
    
    // Add CSS for ripple effect (dynamically)
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            pointer-events: none;
            opacity: 1;
            z-index: 10;
        }
        
        .ripple-effect.active {
            animation: ripple 0.5s linear forwards;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        .pulse {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--glass-effect);
        }
        
        .item-image {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 1rem;
        }
        
        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-details h4 {
            font-size: 1rem;
            margin-bottom: 0.3rem;
        }
        
        .item-price {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .item-quantity {
            display: flex;
            align-items: center;
        }
        
        .item-quantity button {
            width: 25px;
            height: 25px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: var(--text-color);
            cursor: pointer;
        }
        
        .item-quantity span {
            margin: 0 0.5rem;
        }
        
        .remove-item {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color var(--transition-speed) ease;
        }
        
        .remove-item:hover {
            color: var(--secondary-color);
        }
    `;
    
    document.head.appendChild(style);
});

// Add this function to the existing JavaScript file
function initCreatorSection() {
    const creatorImage = document.querySelector('.creator-image');
    const creatorGlow = document.querySelector('.creator-image-glow');
    
    if (creatorImage && creatorGlow) {
        creatorImage.addEventListener('mousemove', (e) => {
            const rect = creatorImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / creatorImage.clientWidth) - 0.5;
            const y = ((e.clientY - rect.top) / creatorImage.clientHeight) - 0.5;
            
            creatorImage.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
            creatorGlow.style.boxShadow = `${x * 20}px ${y * 20}px 25px var(--primary-color)`;
        });
        
        creatorImage.addEventListener('mouseleave', () => {
            creatorImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            creatorGlow.style.boxShadow = '0 0 20px var(--primary-color)';
        });
    }
}

// Add this line to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code...
    
    // Add this line
    initCreatorSection();
});

