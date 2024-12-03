document.addEventListener('DOMContentLoaded', async function () {

    // Get required elements
    let cart_overlay1 = document.querySelector('.cart_overlay1');
    let cart_close_btn1 = document.querySelector('.close_btn');
    let sidecart = document.querySelector('.sidecart');
    localStorage.setItem('orderComplete', 'false');
     
    // Ensure elements exist before adding event listeners
    if (cart_overlay1 && cart_close_btn1 && sidecart) {
        // Handle cart overlay click
        cart_overlay1.onclick = () => {
            sidecart.classList.remove('open');
            cart_overlay1.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Ensure scrolling is restored
        };

        // Handle cart close button click
        cart_close_btn1.onclick = () => {
            sidecart.classList.remove('open');
            cart_overlay1.classList.remove('active');
        };
    }

     
    let allProducts = [];
    let selectedColor = 'all'; 

// Fetch and display products
async function fetchAndDisplayProducts() {
    try {
        const response = await fetch('http://localhost:3000/product');
        const products = await response.json();
        console.log('Fetched products:', products);
        
        if (products.length === 0) {
            document.querySelector(".no-products-message").style.display = 'block';

            return;
        }
        
        document.querySelector(".no-products-message").style.display = 'none';



        allProducts = products; // Store all products for later filtering

        // Apply color filter if needed
        const filteredProducts = selectedColor === 'all' 
            ? allProducts 
            : allProducts.filter(product => product.prodColor.toLowerCase() === selectedColor.toLowerCase());

        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

fetchAndDisplayProducts();


// Function to display products in the DOM
function displayProducts(products) {
    const productsContainer = document.querySelector(".products");
    const totalProductsText = document.querySelector(".total_products");

    productsContainer.innerHTML = ''; // Clear any existing products

    totalProductsText.textContent = `${products.length} products`;

    if (products.length === 0) {
        document.querySelector(".no-products-message").style.display = 'block';
        return;
    }

    document.querySelector(".no-products-message").style.display = 'none'; // Hide the message

    products.forEach((product) => {
        let priceRange = '';
        const prices = product.prodVariation
            .map(variation => parseFloat(variation.variationTypePrice))
            .filter(price => price > 0);

        if (prices.length > 1) {
            const minPrice = Math.min(...prices).toLocaleString();
            const maxPrice = Math.max(...prices).toLocaleString();
            priceRange = `₱${minPrice} - ₱${maxPrice}`;
        } else if (prices.length === 1) {
            priceRange = `₱${prices[0]}`;
        } else {
            priceRange = "Price not available";
        }

        const productHTML = `
            <div class="row">
                <div class="product_image">
                   <a href="/homepage/ProductDetails/prod-details.html?id=${product.id}" class="product-link">
                     <img src="${product.prodImage}" alt="${product.prodName}">
                    </a>
                    <a href="/homepage/ProductDetails/prod-details.html?id=${product.id}" class="product-link">
                    <button class="view_button">View</button>
                    </a>

                </div>
                <div class="product_text">
                    ${product.isSale ? "<h5>Sale</h5>" : ""}
                </div>
                <div class="product_price">
                    <h4>${product.prodName}</h4>
                    <div class="product_ratings">
                        <i class="bx bxs-star"></i>  
                        <i class="bx bxs-star"></i>  
                        <i class="bx bxs-star"></i>  
                        <i class="bx bxs-star"></i>  
                        <i class="bx bxs-star"></i>  
                    </div>
                    <p>${priceRange}</p>
                </div>
            </div>
        `;

        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });

  
}

// View Product Details 
document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', event => {
        const productId = event.target.closest('a').dataset.id; // Assuming each link has a `data-id` attribute.
        const selectedProduct = products.find(product => product.id === productId); // Replace `products` with your data source.

        if (selectedProduct) {
            localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
        }
    });
});


// FILTER BY COLOR
document.querySelectorAll('.color-filter').forEach(filter => {
    filter.addEventListener('click', (e) => {
        // Remove .active class from all filters
        document.querySelectorAll('.color-filter').forEach(item => item.classList.remove('active'));

        // Add .active class to the clicked filter
        e.target.classList.add('active');

        // Get the selected color from the clicked element's data-color attribute
        selectedColor = e.target.getAttribute('data-color');

        // Update the title based on the selected color
        const titleElement = document.querySelector('.center_text h2');
        titleElement.textContent = selectedColor === 'all' 
            ? 'All Products' 
            : `${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Bouquets`;

        // Update the breadcrumb based on the selected color
        const breadcrumb = document.querySelector('.breadcrumb');
        if (selectedColor === 'all') {
            breadcrumb.innerHTML = `
          <div class="center_text">
            <a href="/homepage/index.html">Home /</a>

            <h2>All Products</h2>
            <p class="total_products"></p>
          </div>    
            `;
        } else {
            breadcrumb.innerHTML = `
          <div class="center_text">
                   <a href="/homepage/index.html">Home /</a> 
            <h2>${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Bouquets</h2>
            <p class="total_products"></p>
          </div>
            `;
        }

        const url = new URL(window.location.href);
        url.searchParams.set('color', selectedColor); // Add or update the `color` query parameter
        window.history.pushState({}, '', url);  // Update the URL without reloading the page


        // Fetch and display the products based on the selected color
        fetchAndDisplayProducts();
    });
});


// SORT PRODUCTS
document.getElementById('sort-products').addEventListener('change', (e) => {
    const sortOption = e.target.value;
    let sortedProducts = [...allProducts];

    if (selectedColor !== 'all') {
        sortedProducts = sortedProducts.filter(product => product.prodColor.toLowerCase() === selectedColor.toLowerCase());
    }

    if (sortOption === 'price-low-to-high') {
        sortedProducts.sort((a, b) => {
            const pricesA = a.prodVariation.map(v => parseFloat(v.variationTypePrice));
            const pricesB = b.prodVariation.map(v => parseFloat(v.variationTypePrice));
            const minPriceA = Math.min(...pricesA);
            const minPriceB = Math.min(...pricesB);
            return minPriceA - minPriceB;
        });
    } else if (sortOption === 'price-high-to-low') {
        sortedProducts.sort((a, b) => {
            const pricesA = a.prodVariation.map(v => parseFloat(v.variationTypePrice));
            const pricesB = b.prodVariation.map(v => parseFloat(v.variationTypePrice));
            const minPriceA = Math.min(...pricesA);
            const minPriceB = Math.min(...pricesB);
            return minPriceB - minPriceA;
        });
    } else if (sortOption === 'popularity') {
        sortedProducts.sort((a, b) => b.popularity - a.popularity); // assuming a 'popularity' field
    }

    displayProducts(sortedProducts);
});


});





 
