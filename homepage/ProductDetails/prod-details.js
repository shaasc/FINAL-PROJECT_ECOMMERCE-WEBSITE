
       let product = null;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        let cart = [];  // Initialize an empty cart

        // async function fetchProductDetails() {
        //     try {
        //         const response = await fetch(`http://localhost:3000/product/${productId}`);
        //         const product = await response.json();
        
        //         console.log('Product ID:', productId);
        
        //         if (!product) {
        //             console.error('Product not found.');
        //             return;
        //         }
        
        //         // Set product name and image
        //         document.querySelector('.product_name').textContent = product.prodName;
        //         document.querySelector('.accordion-d').textContent = product.prodDescription;
        //         document.querySelector('#product-image').src = product.prodImage;
        
        //         const variationsContainer = document.getElementById('variation-buttons');
        //         const priceElement = document.getElementById('product-price');
        
        //         // Calculate price range
        //         const prices = product.prodVariation
        //             .map(v => parseFloat(v.variationTypePrice))
        //             .filter(price => price > 0);
        
        //         const priceRange =
        //             prices.length > 1
        //                 ? `₱${Math.min(...prices).toLocaleString()} - ₱${Math.max(...prices).toLocaleString()}`
        //                 : prices.length === 1
        //                 ? `₱${prices[0].toLocaleString()}`
        //                 : "Price not available";
        
        //         priceElement.textContent = priceRange;
        
        //    // Render variation buttons
        // variationsContainer.innerHTML = product.prodVariation.map((variation, index) => {
        //     const isOutOfStock = parseInt(variation.variationTypeStocks, 10) === 0;
        //     return `
        //         <button 
        //             class="variation-button ${isOutOfStock ? 'disabled' : ''}" 
        //             data-index="${index}" 
        //             data-type="${variation.variationType}" 
        //             data-price="${variation.variationTypePrice}" 
        //             data-stock="${variation.variationTypeStocks}"
        //             ${isOutOfStock ? 'disabled' : ''}>
        //             ${variation.variationType} ${isOutOfStock ? '(Out of stock)' : ''}
        //         </button>`;
        // }).join('');

        //         // Add button listeners
                
        //         const variationButtons = document.querySelectorAll('.variation-button');
        //         variationButtons.forEach((button) => {
        //             const stock = parseInt(button.getAttribute('data-stock'), 10);
        
        //             // Disable button visually and functionally if out of stock
        //             if (stock === 0) {
        //                 button.classList.add('disabled');
        //             }          
                    
        //             button.addEventListener('click', (e) => {
        //                 if (!e.target.classList.contains('disabled')) {
        //                     variationButtons.forEach(btn => btn.classList.remove('active'));
        //                     e.target.classList.add('active');
        //                     priceElement.textContent = `₱${parseFloat(e.target.getAttribute('data-price')).toLocaleString()}`;
        //                 }
        //             });
        //         });
        
        //         // Add event listener to the Add to Cart button
        //         document.querySelector('.add_to_cart').addEventListener('click', () => addToCart(product));
                
        //     } catch (error) {
        //         console.error('Error fetching product details:', error);
        //     }
        // }

        async function fetchProductDetails() {
            try {
                const response = await fetch(`http://localhost:3000/product/${productId}`);
                const product = await response.json();
        
                console.log('Product ID:', productId);
        
                if (!product) {
                    console.error('Product not found.');
                    return;
                }
        
                // Set product name and image
                document.querySelector('.product_name').textContent = product.prodName;
                document.querySelector('.accordion-d').textContent = product.prodDescription;
                document.querySelector('#product-image').src = product.prodImage;
        
                const variationsContainer = document.getElementById('variation-buttons');
                const priceElement = document.getElementById('product-price');
        
                // Calculate price range
                const prices = product.prodVariation
                    .map(v => parseFloat(v.variationTypePrice))
                    .filter(price => price > 0);
        
                const priceRange =
                    prices.length > 1
                        ? `₱${Math.min(...prices).toLocaleString()} - ₱${Math.max(...prices).toLocaleString()}`
                        : prices.length === 1
                        ? `₱${prices[0].toLocaleString()}`
                        : "Price not available";
        
                priceElement.textContent = priceRange;
        
                // Render variation buttons
                variationsContainer.innerHTML = product.prodVariation.map((variation, index) => {
                    const isOutOfStock = parseInt(variation.variationTypeStocks, 10) === 0;
                    return `
                        <button 
                            class="variation-button ${isOutOfStock ? 'disabled' : ''}" 
                            data-index="${index}" 
                            data-type="${variation.variationType}" 
                            data-price="${variation.variationTypePrice}" 
                            data-stock="${variation.variationTypeStocks}"
                            ${isOutOfStock ? 'disabled' : ''}>
                            ${variation.variationType} ${isOutOfStock ? '(Out of stock)' : ''}
                        </button>`;
                }).join('');
        
                const variationButtons = document.querySelectorAll('.variation-button');
        
                // Set the first variation as active by default
                const firstActiveVariation = Array.from(variationButtons).find(btn => !btn.classList.contains('disabled'));
                if (firstActiveVariation) {
                    firstActiveVariation.classList.add('active');
                    priceElement.textContent = `₱${parseFloat(firstActiveVariation.getAttribute('data-price')).toLocaleString()}`;
                }
        
                // Add button listeners
                variationButtons.forEach(button => {
                    const stock = parseInt(button.getAttribute('data-stock'), 10);
        
                    // Disable button visually and functionally if out of stock
                    if (stock === 0) {
                        button.classList.add('disabled');
                    }
        
                    button.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('disabled')) {
                            variationButtons.forEach(btn => btn.classList.remove('active'));
                            e.target.classList.add('active');
                            priceElement.textContent = `₱${parseFloat(e.target.getAttribute('data-price')).toLocaleString()}`;
                        }
                    });
                });
        
                // Add event listener to the Add to Cart button
                document.querySelector('.add_to_cart').addEventListener('click', () => addToCart(product));
        
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        }     
        
        function updateCart() {
            const cartContainer = document.querySelector('.cart_items');
            const totalPriceElement = document.getElementById('total_price');  
            const totalItemsElement = document.querySelector('.count-cart-items');
            const totalItemsCart = document.querySelector('.cart_total_items');

            let totalPrice = 0;  

            cartContainer.innerHTML = ''; 

            if (cart.length === 0) {
                // Display "Cart is empty" message and "Shop Now" link if no items are in the cart
                cartContainer.innerHTML = `
                    <p class="empty-cart-message">Your cart is empty.</p>
                    <a href="/homepage/Shop/shop.html" class="shop-now-link">Shop Now</a>
                `;
                totalPriceElement.textContent = '₱0'; // Set total price to 0
                totalItemsCart.textContent = ' (0)'; // Update cart total items display
                totalItemsElement.classList.add('hide');
                return; // Exit the function
            }
        
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart_item');
                totalItemsElement.classList.remove('hide');
                cartItem.dataset.prodId = item.prodName; 
                cartItem.dataset.variation = item.variation;
        
                cartItem.innerHTML = `
                    <img src="${item.prodImage}" alt="${item.prodName}" class="cart_item_image" width="70px">
                    <div class="cart_item_details">
                        <h3 class="cart_item_name">${item.prodName}</h3>
                        <button type="button" class="remove_item">Remove</button>
                        <h4 class="cart_item_variation">Pieces: ${item.variation}</h4>
                        <div class="quantity_control">
                            <div class="quantity_box">
                                <button class="quantity_btn_minus">-</button>
                                <input value="${item.quantity}" class="cart_item_quantity" min="1" />
                                <button class="quantity_btn_plus">+</button>
                            </div>
                            <span class="cart_item_price">₱${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    </div>
                `;
        
                cartItem.querySelector('.remove_item').addEventListener('click', () => {
                    // Filter out the item from the cart
                    cart = cart.filter(cartItem => cartItem.prodName !== item.prodName || cartItem.variation !== item.variation);
            
                    // Update the cart in localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
            
                    // Refresh the cart UI
                    updateCart();
                });
        
                   // Handle quantity change
        const quantityPlusButton = cartItem.querySelector('.quantity_btn_plus');
        const quantityMinusButton = cartItem.querySelector('.quantity_btn_minus');

        // Get the stock value from the cart or localStorage
        const stock = parseInt(item.stock, 10); 

        // Disable "+" button if quantity is equal to stock
        if (item.quantity >= stock) {
            quantityPlusButton.classList.add('disabled');
        } else {
            quantityPlusButton.classList.remove('disabled');
        }

        quantityPlusButton.addEventListener('click', () => {
            if (item.quantity < stock) {
                item.quantity++;
                updateCart(); // Refresh the cart UI
            }
        });

        quantityMinusButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart(); // Refresh the cart UI
            }
        });
        
                cartContainer.appendChild(cartItem);
        
                // Add this item's price to the total price
                totalPrice += item.price * item.quantity;

            });
        
            // Update the total price display
            totalPriceElement.textContent = `₱${totalPrice.toLocaleString()}`;
            totalItemsElement.textContent = `${cart.length}`; 
            totalItemsCart.textContent = ` (${cart.length})`; 

            localStorage.setItem('cart', JSON.stringify(cart));

        }

        function loadCart() {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
                updateCart(); // Update the cart UI with loaded data
                console.log(storedCart); // Log the cart to check its content
            }
        }
        
         fetchProductDetails();
         loadCart();
         updateCart();

           
         function addToCart(product) {
                const selectedVariation = document.querySelector('.variation-button.active');
                if (!selectedVariation) {
                    alert('Please select a variation first!');
                    return;
                }
            
                const selectedPrice = parseFloat(selectedVariation.getAttribute('data-price'));
                const variationType = selectedVariation.textContent.trim();
                const stock = parseInt(selectedVariation.getAttribute('data-stock'), 10);
            
                // Check if the item is already in the cart
                const existingItemIndex = cart.findIndex(
                    item => item.prodName === product.prodName && item.variation === variationType
                );
            
                if (existingItemIndex >= 0) {
                    // Increment quantity if stock allows
                    if (cart[existingItemIndex].quantity < stock) {
                        cart[existingItemIndex].quantity += 1;
                    } else {
                        alert('Stock limit reached for this variation.');
                    }
                } else {
                    if (stock > 0) {
                        // Add new item to the cart
                        cart.push({
                            prodName: product.prodName,
                            variation: variationType,
                            price: selectedPrice,
                            quantity: 1,
                            prodImage: product.prodImage,
                            stock: stock,
                        });
                    } else {
                        alert('This variation is out of stock.');
                    }
                }
            
                updateCart(); // Update the cart UI
         }    

         document.addEventListener('DOMContentLoaded', function() {
            localStorage.setItem('orderComplete', 'false');
         })

            
               

    