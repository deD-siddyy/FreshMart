// Product Data
const products = [
    {
        id: 1,
        name: "Organic Apples",
        price: 90.00,
        description: "Fresh organic apples from local farms",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Whole Wheat Bread",
        price: 45.00,
        description: "Freshly baked whole wheat bread",
        category: "bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Organic Milk",
        price: 85.86,
        description: "1 gallon of organic whole milk",
        category: "dairy",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Eggs",
        price: 84.00,
        description: "Dozen free range eggs",
        category: "dairy",
        image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Organic Bananas",
        price: 70.00,
        description: "Fresh organic bananas",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Organic Carrots",
        price: 69.00,
        description: "Fresh organic carrots, 1lb bag",
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Organic Spinach",
        price: 76.00,
        description: "Fresh organic spinach, 8oz",
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Organic Greek Yogurt",
        price: 100.00,
        description: "Organic Greek yogurt, 16oz",
        category: "dairy",
        image: "https://www.eatingwell.com/thmb/5lXZbNYXpRSo3LML_OS0mPVjIkk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Homemade-Plain-Greek-Yogurt-beauty-146-b162d58143cf4eec8f65fa9e3ab61b95.jpg"
    },
    {
        id: 9,
        name: "Sourdough Bread",
        price: 45.00,
        description: "Artisan sourdough bread",
        category: "bakery",
        image: "https://www.theperfectloaf.com/wp-content/uploads/2015/12/theperfectloaf-mybestsourdoughrecipe-title-1.jpg"
    },
    {
        id: 10,
        name: "Organic Strawberries",
        price: 165.00,
        description: "Fresh organic strawberries, 1lb",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

// DOM Elements
const productList = document.getElementById('product-list');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartCount = document.getElementById('cart-count');
const cartToggle = document.querySelector('.cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.querySelector('.cart-sidebar');
const sortBy = document.getElementById('sort-by');
const priceRange = document.getElementById('price-range');

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    renderProducts(products);
    updateCart();
    setupEventListeners();
    
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Format price with currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

// Render products to the page
function renderProducts(productsToRender) {
    productList.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No products found. Try a different search.</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'grocery-item';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="item-image">
            <div class="item-details">
                <span class="item-category">${product.category}</span>
                <h3 class="item-name">${product.name}</h3>
                <p class="item-price">${formatPrice(product.price)}</p>
                <p class="item-description">${product.description}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" aria-label="Decrease quantity">-</button>
                    <span class="quantity" aria-live="polite">1</span>
                    <button class="quantity-btn plus" aria-label="Increase quantity">+</button>
                </div>
                <button class="add-to-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                    Add to Cart
                </button>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const quantity = parseInt(e.target.closest('.grocery-item').querySelector('.quantity').textContent);
            
            addToCart(product, quantity);
        }
        
        // Quantity controls
        if (e.target.classList.contains('quantity-btn')) {
            const quantityElement = e.target.closest('.quantity-control').querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (e.target.classList.contains('minus') && quantity > 1) {
                quantity--;
            } else if (e.target.classList.contains('plus')) {
                quantity++;
            }
            
            quantityElement.textContent = quantity;
        }
        
        // Quick category links
        if (e.target.matches('.quick-links a, .category-dropdown a, .footer-col ul li a')) {
            const category = e.target.getAttribute('data-category');
            if (category) {
                e.preventDefault();
                filterProducts(category);
                // Update active category button
                categoryBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-category') === category) {
                        btn.classList.add('active');
                    }
                });
            }
        }
    });
    
    // Cart item controls
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id') || e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(productId);
        }
        
        if (e.target.classList.contains('cart-minus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        }
        
        if (e.target.classList.contains('cart-plus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'payment.html';
        }
    });
    
    // Search functionality
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Debounce search input
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts();
        }, 300);
    });
    
    // Category filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.getAttribute('data-category'));
        });
    });
    
    // Sort products
    sortBy.addEventListener('change', function() {
        sortProducts(this.value);
    });
    
    // Price range filter
    priceRange.addEventListener('input', function() {
        filterByPrice(this.value);
    });
    
    // Cart toggle
    cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCart();
    });
    closeCart.addEventListener('click', toggleCart);
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    // cardSlide.classList.remove("none");
    // cartSidebar.remove()
}

// Search products
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Filter products by category
function filterProducts(category) {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Apply price filter if active
    const priceFilterValue = priceRange.value;
    if (priceFilterValue < 10) {
        filteredProducts = filteredProducts.filter(product => product.price <= priceFilterValue);
    }
    
    renderProducts(filteredProducts);
}

// Filter products by price
function filterByPrice(maxPrice) {
    let filteredProducts;
    const activeCategory = document.querySelector('.category-btn.active');
    const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
    
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    if (maxPrice < 10) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    renderProducts(filteredProducts);
}

// Sort products
function sortProducts(sortValue) {
    let productsToSort = [...products];
    const activeCategory = document.querySelector('.category-btn.active');
    
    // Apply category filter if active
    if (activeCategory && activeCategory.getAttribute('data-category') !== 'all') {
        const category = activeCategory.getAttribute('data-category');
        productsToSort = productsToSort.filter(product => product.category === category);
    }
    
    // Apply price filter if active
    const priceFilterValue = priceRange.value;
    if (priceFilterValue < 10) {
        productsToSort = productsToSort.filter(product => product.price <= priceFilterValue);
    }
    
    // Apply search filter if active
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        productsToSort = productsToSort.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort based on selected value
    switch(sortValue) {
        case 'price-low':
            productsToSort.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            productsToSort.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            productsToSort.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            productsToSort.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default sorting (original order)
            break;
    }
    
    renderProducts(productsToSort);
}

// Add item to cart
function addToCart(product, quantity) {
    try {
        if (!product || quantity < 1) throw new Error('Invalid product or quantity');
        
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity > 10) {
                existingItem.quantity = 10;
                showNotification('Maximum quantity per item is 10');
            }
        } else {
            if (quantity > 10) {
                showNotification('Maximum quantity per item is 10');
                quantity = 10;
            }
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        
        updateCart();
        showNotification(`${product.name} added to cart`);
        toggleCart();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart');
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
     
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else if (item.quantity > 10) {
            item.quantity = 10;
            showNotification('Maximum quantity per item is 10');
            updateCart();
        } else {
            updateCart();
        }
    }
}

// Update cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="cart-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div>${formatPrice(itemTotal)}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        cartTotalElement.textContent = `Total: ${formatPrice(total)}`;
        checkoutBtn.disabled = false;
    }
    
    // Update cart count in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);