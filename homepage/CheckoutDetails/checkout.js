document.addEventListener('DOMContentLoaded', function() {

    window.scrollTo(0, 0);  // Immediately scroll to the top

    if (localStorage.getItem('orderComplete') === 'true') {
        document.querySelector(".order-complete").style.display = "block";
        document.querySelector(".checkout_container").style.display = "none";
        document.querySelector(".breadcrumb1").style.display = "none";
    }
    else{
        document.querySelector(".order-complete").style.display = "none";  
        document.querySelector(".checkout_container").style.display = "block";
    }

    loadCartItems();
});

const inputFile = document.getElementById("receipt-upload"); 
const imageErrorIndicator = document.getElementById("image-error-indicator");  
let imgUploaded = '';  // To store the uploaded image base64 data


// Reflecting image when added
inputFile.addEventListener("change", e => {
    const imgfile = inputFile.files[0];
    if (imgfile) {
        const reader = new FileReader();

        reader.onload = function () {
            imgUploaded = reader.result;  // Store the base64 data
            console.log("Uploaded Image (Base64):", imgUploaded);  // Debugging: Log the base64 data

        };

        // Optional error handling: Remove any previous errors and reset styles
        imageErrorIndicator.classList.remove("show");
        inputFile.style.border = '';

        reader.readAsDataURL(imgfile);  // Convert the file to base64 and load it as an image
    }
});

// Function to load cart items from localStorage and update the checkout page
function loadCartItems() {
    const cart = localStorage.getItem('cart');

    // If the cart is null or empty, show the empty cart message
    if (!cart || JSON.parse(cart).length === 0) {
        const checkoutItemsContainer = document.querySelector('.checkout-items');
        checkoutItemsContainer.innerHTML = `
            <p class="empty-message">Your cart is empty.</p>
            <a href="/homepage/Shop/shop.html" class="shop-link">Shop Now</a>
        `;
        return; // Exit the function if the cart is empty
    }

    const storedCart = localStorage.getItem('cart');

    if (storedCart) {
        const cart = JSON.parse(storedCart);  // Parse the cart data
        // Get the checkout items container
        const checkoutItemsContainer = document.querySelector('.checkout-items');
        checkoutItemsContainer.innerHTML = '';  // Clear the previous content

        let totalPrice = 0;  // Initialize total price
        let bouquetCount = 0;  // Initialize the bouquet count

        // Loop through each item in the cart and add it to the order review form
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
    
            cartItem.innerHTML = `
                <div class="cart_item">
                    <img src="${item.prodImage}" alt="${item.prodName}" class="cart_item_image" width="60px">
                    <div class="cart_item_details">
                        <h3 class="cart_item_name">${item.prodName}</h3>
                        <h4 class="cart_item_variation">Pieces: <span>${item.variation}</span></h4>                            
                        <div class="price_quantity">
                            <span class="cart_item_price">₱${(item.price * item.quantity).toLocaleString()}</span>
                            <span class="cart_item_quan">${item.quantity}x</span>
                        </div>
                    </div>
                </div>
            `;

            // Append the cart item to the checkout items container
            checkoutItemsContainer.appendChild(cartItem);

            // Calculate the total price
            totalPrice += item.price * item.quantity;


                // Count the number of bouquets ordered
                if (item.prodName.toLowerCase().includes('bouquet')) {
                    bouquetCount += item.quantity;
                }
            });

            // Calculate the shipping fee
            let shippingFee = 80; // Base shipping fee
            if (bouquetCount > 1) {
                shippingFee += (bouquetCount - 1) * 50; // Add ₱50 for each additional bouquet
            }

            // Update the checkout details section with the total price
            const subtotalElement = document.querySelector('.checkout_subtotal span:last-child');
            const totalElement = document.querySelector('.checkout_total span:last-child');
            const shippingElement = document.querySelector('.shipping_fee span:last-child');

            const finalTotal = totalPrice + shippingFee;
            subtotalElement.textContent = `₱${totalPrice.toLocaleString()}`;
            totalElement.textContent = `₱${finalTotal.toLocaleString()}`;
            shippingElement.textContent = `₱${shippingFee.toLocaleString()}`;
        } else {
            console.log('Cart is empty or not found in localStorage');
        }
    }


function generateOrderId() {
    const uniqueId = Date.now().toString().slice(-5); // Get last 5 digits of timestamp
    return `#${uniqueId}`;
}

// Function to validate customer information
function validateCustomerInfo() {
    const fullName = document.getElementById('full-name');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const phone = document.getElementById('phone');
    const paymentMethod = document.getElementById('payment-method');

    let isValid = true;

    // Clear previous red borders
    [fullName, email, address, phone, paymentMethod].forEach(field => {
        field.style.border = '';  // Reset border to default
    });

    // Check if any required field is empty and apply red border
    if (!fullName.value) {
        fullName.style.border = '1px solid red';
        isValid = false;
    }
    if (!email.value) {
        email.style.border = '1px solid red';
        isValid = false;
    }
    if (!address.value) {
        address.style.border = '1px solid red';
        isValid = false;
    }
    if (!phone.value) {
        phone.style.border = '1px solid red';
        isValid = false;
    }
    if (!paymentMethod.value) {
        paymentMethod.style.border = '1px solid red';
        isValid = false;
    }

    return isValid;
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0');       // Get day and pad with leading zero if necessary
    const year = date.getFullYear();                            // Get the full year

    return `${month}-${day}-${year}`;
}

function sendOrderDataToJSON() {
    if (!validateCustomerInfo()) {
        return;  // Don't proceed if validation fails
    }
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];  // Get cart items from localStorage

    const orderId = generateOrderId();  // Call the generateOrderId function here
    const currentDate = new Date();
    const orderDate = formatDate(currentDate);

    // Format cart items into the structure for the JSON request
    const items = cart.map(item => ({
        prodName: item.prodName,       // Product name
        prodImage: item.prodImage,     // Product image
        quantity: item.quantity,      // Quantity
        variation: item.variation,    // Variation (if any)
        price: item.price             // Price
    }));

    const orderData = {
        orderId: orderId,
        orderDate: orderDate,  // Add the order date here
        status: "Pending",  // Add the order ID here
        customerInfo: {
            fullName,
            email,
            address,
            phone,
            paymentMethod,
            receiptUpload: imgUploaded,  // Attach the base64-encoded image data
        },
        items: items, // The array of items from the cart
        totalPrice: document.querySelector('.checkout_total span:last-child').textContent,
    };

    // Send the data to the server (replace with your JSON server endpoint)
    fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order successfully sent to JSON server:', data);

        // Update product stock after the order is placed
        updateProductStock();
        
        // Clear the cart from localStorage after sending the order
        localStorage.removeItem('cart');

        // Optional: Clear form fields or perform other actions
        document.getElementById('full-name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('address').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('payment-method').value = '';
        // Optionally, reset the receipt image preview or handle other cleanup
    })
    .catch(error => {
        console.error('Error sending order data:', error);
    });
}

// Listen for the "Place Order" button click and send data

document.querySelector('#place_order').addEventListener('click', function(event) {
    sendOrderDataToJSON();  
    // Store the state in localStorage to remember that the order is complete
    localStorage.setItem('orderComplete', 'true');

    window.scrollTo(0, 0);  // Immediately scroll to the top

});

function updateProductStock() {
    // Get the cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch products from JSON server
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            // Iterate over each item in the cart
            cart.forEach(cartItem => {
                // Find the corresponding product in the JSON server products
                const product = products.find(p => 
                    p.prodName === cartItem.prodName
                );

                if (product) {
                    // Find the variation in the product's prodVariation array
                    const variationStock = product.prodVariation.find(variation =>
                        variation.variationType === cartItem.variation
                    );

                    if (variationStock) {
                        // Reduce the stock by the quantity ordered
                        variationStock.variationTypeStocks -= cartItem.quantity;

                        // Update the product stock on the JSON server
                        fetch(`http://localhost:3000/products/${product.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                prodVariation: product.prodVariation
                            }),
                        })
                        .then(response => response.json())
                        .then(updatedProduct => {
                            console.log(`Updated stock for product ${updatedProduct.prodName}, variation ${cartItem.variation}:`, variationStock.variationTypeStocks);
                        })
                        .catch(error => {
                            console.error(`Error updating stock for product ${product.prodName}, variation ${cartItem.variation}:`, error);
                        });
                    } else {
                        console.warn(`Variation ${cartItem.variation} not found for product ${cartItem.prodName}`);
                    }
                } else {
                    console.warn(`Product ${cartItem.prodName} not found in JSON server.`);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching products from JSON server:', error);
        });
}


