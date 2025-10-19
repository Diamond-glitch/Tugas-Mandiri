let cart = [];
let totalPrice = 0;


document.addEventListener('DOMContentLoaded', function() {
    console.log('Mitra Usaha Website Loaded');
    
    if (document.getElementById('searchInput')) {
        setupSearchFunctionality();
    }
    
    if (document.getElementById('cartSummary')) {
        loadCartFromStorage();
    }
});

//  SEARCH FUNCTIONALITY 

function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search
    searchInput.addEventListener('input', function() {
        performSearch();
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.search-result-item');
    let hasResults = false;
    
    items.forEach(item => {
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const description = item.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = 'block';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

function applyFilters() {
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const minPrice = parseFloat(document.getElementById('filterMinPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('filterMaxPrice').value) || Infinity;
    
    const items = document.querySelectorAll('.search-result-item');
    let hasResults = false;
    
    items.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemCategory = item.getAttribute('data-category');
        const itemPrice = parseFloat(item.getAttribute('data-price'));
        
        const typeMatch = typeFilter === 'all' || itemType === typeFilter;
        const categoryMatch = categoryFilter === 'all' || itemCategory === categoryFilter;
        const priceMatch = itemPrice >= minPrice && itemPrice <= maxPrice;
        
        if (typeMatch && categoryMatch && priceMatch) {
            item.style.display = 'block';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

function resetFilters() {
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterMinPrice').value = '';
    document.getElementById('filterMaxPrice').value = '';
    document.getElementById('searchInput').value = '';
    
    // Show all items
    const items = document.querySelectorAll('.search-result-item');
    items.forEach(item => {
        item.style.display = 'block';
    });
    
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

function viewProduct(productName) {
    alert(`Anda akan melihat detail produk: ${productName}\n\nFitur ini akan mengarahkan ke halaman detail produk.`);
    // In a real application, this would navigate to a product detail page
    window.location.href = 'produk.html';
}

// ==================== PRODUCT PAGE FUNCTIONALITY ====================

function filterProducts(type) {
    const items = document.querySelectorAll('.product-item');
    
    items.forEach(item => {
        if (type === 'all') {
            item.style.display = 'block';
        } else {
            const itemType = item.getAttribute('data-type');
            item.style.display = itemType === type ? 'block' : 'none';
        }
    });
}

function addToCart(productName, price) {
    // Add to cart
    cart.push({
        name: productName,
        price: price,
        quantity: 1
    });
    
    // Update total
    totalPrice += price;
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update UI
    updateCartUI();
    
    // Show notification
    showNotification(`Produk "${productName}" ditambahkan ke keranjang!`);
}

function rentProduct(productName, price) {
    const months = prompt(`Berapa bulan Anda ingin menyewa "${productName}"?\nHarga: Rp ${price.toLocaleString('id-ID')}/bulan`);
    
    if (months && !isNaN(months) && months > 0) {
        const totalRentPrice = price * parseInt(months);
        
        cart.push({
            name: `${productName} (${months} bulan)`,
            price: totalRentPrice,
            quantity: 1
        });
        
        totalPrice += totalRentPrice;
        saveCartToStorage();
        updateCartUI();
        showNotification(`Penyewaan "${productName}" untuk ${months} bulan ditambahkan ke keranjang!`);
    }
}

function updateCartUI() {
    const cartSummary = document.getElementById('cartSummary');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItemHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-orange">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.innerHTML += cartItemHTML;
    });
    
    cartTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

function removeFromCart(index) {
    totalPrice -= cart[index].price;
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
    showNotification('Produk dihapus dari keranjang');
}

function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    const confirmMessage = `Total Pembayaran: Rp ${totalPrice.toLocaleString('id-ID')}\n\nApakah Anda ingin melanjutkan ke checkout?`;
    
    if (confirm(confirmMessage)) {
        alert('Terima kasih! Pesanan Anda sedang diproses.\n\nTim kami akan menghubungi Anda segera untuk konfirmasi.');
        cart = [];
        totalPrice = 0;
        saveCartToStorage();
        updateCartUI();
    }
}

function saveCartToStorage() {
    localStorage.setItem('mitraUsahaCart', JSON.stringify(cart));
    localStorage.setItem('mitraUsahaTotal', totalPrice.toString());
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('mitraUsahaCart');
    const savedTotal = localStorage.getItem('mitraUsahaTotal');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        totalPrice = parseFloat(savedTotal) || 0;
        updateCartUI();
    }
}

