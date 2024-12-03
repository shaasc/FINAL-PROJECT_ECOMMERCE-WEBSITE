function loadCart() {
    // Get the compressed cart from localStorage
    const cartData = localStorage.getItem('cart');

    // If the cart data exists, decompress and parse it, otherwise use an empty array
    const decompressedCart = cartData ? JSON.parse(LZString.decompressFromUTF16(cartData)) : [];

    // Get the container where cart items will be displayed
    const cartItemsContainer = document.querySelector('.cart_items');

    // Empty current cart items before rendering new data
    cartItemsContainer.innerHTML = '';

    // If cart is empty, show an empty message
    if (decompressedCart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty';
        cartItemsContainer.appendChild(emptyMessage);
    } else {
        // Loop through the cart array and generate HTML for each product
        decompressedCart.forEach(item => {
            const cartItemHTML = `
                <div class="cart_item" data-prod-id="${item.prodID}" data-variation="${item.variation}">
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
                            <span class="cart_item_price">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        
            // Append the cart item to the container
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    }

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove_item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart_item');
            const itemId = cartItem.dataset.prodId;
            removeItemFromCart(itemId);
        });
    });

    // Add event listeners for quantity buttons
    const quantityButtons = document.querySelectorAll('.quantity_btn_minus, .quantity_btn_plus');
    quantityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const inputField = e.target.closest('.quantity_control').querySelector('.cart_item_quantity');
            let currentQuantity = parseInt(inputField.value, 10);

            if (e.target.classList.contains('quantity_btn_minus') && currentQuantity > 1) {
                currentQuantity--;
            } else if (e.target.classList.contains('quantity_btn_plus')) {
                currentQuantity++;
            }

            inputField.value = currentQuantity;
            const cartItem = e.target.closest('.cart_item');
            const itemId = cartItem.dataset.prodId;

            updateItemQuantity(itemId, currentQuantity);
        });
    });

    // Optionally update the total price and item count
    updateTotal(decompressedCart);
    updateCartCount(decompressedCart);
}

loadCart();  


    // Utility to get cart data from localStorage
    function getCart() {
        const cart = localStorage.getItem('cart');
        console.log('Getting cart from localStorage:', cart);  // Debugging: check what cart data is retrieved
    
        const decompressedCart = cart ? JSON.parse(LZString.decompressFromUTF16(cart)) : [];
        return decompressedCart;
    }
    
    // Utility to save cart data to localStorage
    function saveCart(cartItem) {
        
        // Save the updated cart back to localStorage
        console.log('Saving cart:', cart);  // Debugging: log the cart before saving
    
        const compressedCart = LZString.compressToUTF16(JSON.stringify(cartItem));
    
        localStorage.setItem('cart', compressedCart); }
    
    
    // Function to add item to cart
    function addToCart(item) {
        const cart = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem('cart'))) || [];
    
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.prodID === item.prodID && cartItem.variation === item.variation);
    if (existingItemIndex > -1) {
        // Update the quantity of the existing item
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add the new item to the cart
        cart.push(item);
    }
    
    // Save the updated cart to localStorage
    const compressedCart = LZString.compressToUTF16(JSON.stringify(cart));
    localStorage.setItem('cart', compressedCart);
    
    
    
        loadCart();  // Re-render cart
    
        console.log('Cart updated:', cart); // Debugging
    
    }
    
    // Event listener for adding item to cart
    document.querySelector('.add_to_cart').addEventListener('click', (event) => {
        event.preventDefault();
    
        // Ensure a variation is selected
        const selectedVariation = document.querySelector('.variation-button.active');
        if (!selectedVariation) {
            alert('Please select a variation.');
            return;
        }
    
        const variationIndex = parseInt(selectedVariation.getAttribute('data-index'), 10);
        const selectedProduct = product.prodVariation[variationIndex];
        const price = parseFloat(selectedProduct.variationTypePrice);
        const quantity = 1;
    
        const cartItem = {
            prodID: product.id,
            prodName: product.prodName,
            prodImage: product.prodImage,
            price: price,
            variation: selectedProduct.variationType,
            quantity: quantity,
            subtotal: price * quantity,
            totalPrice: price * quantity
        };
    
        // Add to cart (localStorage)
        addToCart(cartItem);
    });
    