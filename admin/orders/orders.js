document.addEventListener('DOMContentLoaded', function () {

    // Fetch and display all orders
    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch('http://localhost:3000/orders');
            if (!response.ok) {
                console.error("Error: Failed to fetch data", response.statusText);
                return;
            }

            const orders = await response.json();
            console.log("Fetched orders:", orders);
            const tableBody = document.querySelector(".table-group-divider2");
            tableBody.innerHTML = ''; // Clear the table before inserting new rows

            if (orders.length === 0) {
                console.log("No orders found.");
            }

            orders.forEach((order) => {
                // Create row for each order
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th scope="row">${order.id}</th>
                    <td>${order.orderDate}</td>
                    <td>${order.customerInfo.fullName}</td>
                    <td>${order.totalPrice}</td>
                    <td>${order.items.length}</td> <!-- Number of items in the order -->
                    <td>${order.status}</td>
                    <td>
                        <button type="button" class="btn btn-primary showOrderDet" data-order-id="${order.id}">
                            <img src="/images/view.png" alt="View" width="20px">
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners to the "View Details" buttons
            document.querySelectorAll('.showOrderDet').forEach((button) => {
                button.addEventListener('click', async function () {
                    const orderId = this.getAttribute('data-order-id');
                    console.log("Button clicked, Order ID:", orderId);
                    await showOrderDetails(orderId);
                });
            });

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Show order details and populate the details page
    async function showOrderDetails(orderId) {
        try {
            const response = await fetch(`http://localhost:3000/orders/${orderId}`); // Fetch specific order
            if (!response.ok) {
                console.error("Error: Failed to fetch data", response.statusText);
                return;
            }

            const order = await response.json(); // Fetch the order details
            console.log("Fetched order details:", order);

            // Set customer and order information
            document.querySelector('.custName label').innerText = `Customer: ${order.customerInfo.fullName}`;
            document.querySelector('.order-id label').innerText = `Order ID: ${order.id}`;

            // Get the table body where items will be appended
            const tableBody = document.querySelector('.table-group-divider1');
            tableBody.innerHTML = ''; // Clear any existing rows

            // Populate table rows with order items
            order.items.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>
                        <img src="${item.prodImage}" alt="product" style="width: 40px;">
                    </td>
                    <td>${item.prodName}</td>
                    <td>${item.variation || 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>₱${(item.price * item.quantity).toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });

            // Show the order-details section
            const orderDetailsSection = document.querySelector('.order-details');
            orderDetailsSection.classList.add('show');

            // Set up the decline and accept buttons for the specific order
            const declineButton = document.querySelector('#decline');
            declineButton.setAttribute('data-order-id', order.id); // Set the order ID on the Decline button

            const acceptButton = document.querySelector('#accept');
            acceptButton.setAttribute('data-order-id', order.id); // Set the order ID on the Accept button

            // Add event listener for the Decline button
            declineButton.addEventListener('click', async function () {
                const orderId = this.getAttribute('data-order-id');
                console.log("Declining Order ID:", orderId);
                await declineOrders(orderId); // Call the function to delete the order
            });

            // Add event listener for the Accept button
            acceptButton.addEventListener('click', async function () {
                const orderId = this.getAttribute('data-order-id');
                console.log("Accepting Order ID:", orderId);
                await acceptOrders(orderId); // Call the function to accept the order
            });

            // Setup the receipt display functionality
            document.getElementById('viewReceiptBtn').addEventListener('click', function () {
                const receiptContainer = document.querySelector('.receipt-container');
                const receiptImage = document.getElementById('receiptImage');
                receiptContainer.style.display = 'block'; // Show the image
            });

            // Hide Receipt
            document.getElementById('return').addEventListener('click', function () {
                const receiptContainer = document.querySelector('.receipt-container');
                receiptContainer.style.display = 'none'; // Show the image
            });

        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    }

    // Function to decline (delete) an order
    // async function declineOrders(orderId) {
    //     const apiUrl = `http://localhost:3000/orders/${orderId}`;

    //     try {
    //         const response = await fetch(apiUrl, {
    //             method: 'DELETE', // Specify the HTTP method
    //         });

    //         if (response.ok) {
    //             alert("Order deleted successfully.");
    //             // Optionally, refresh the orders list to reflect the deletion
    //             fetchAndDisplayProducts(); // Re-fetch orders to update the list
    //             // Close the order details section
    //             const orderDetailsSection = document.querySelector('.order-details');
    //             orderDetailsSection.classList.remove('show');
    //         } else {
    //             throw new Error("Failed to delete the order.");
    //         }
    //     } catch (error) {
    //         console.error("Error deleting order:", error);
    //         alert("An error occurred while trying to delete the order.");
    //     }
    // }

    // Function to show confirmation modal
function showConfirmationModal(orderId) {
    const modal = document.getElementById("confirmation-modal");
    modal.style.display = "flex";

    // Add event listener for confirmation button
    const confirmButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("cancel-delete");

    const closeModal = () => {
        modal.style.display = "none";
        confirmButton.removeEventListener("click", handleConfirm);
        cancelButton.removeEventListener("click", closeModal);
    };

    const handleConfirm = async () => {
        await declineOrders(orderId); // Call your declineOrders function
        closeModal();
    };

    confirmButton.addEventListener("click", handleConfirm);
    cancelButton.addEventListener("click", closeModal);
}

// Function to decline (delete) an order with confirmation
async function declineOrders(orderId) {
    const apiUrl = `http://localhost:3000/orders/${orderId}`;

    // Show a confirmation prompt
    const userConfirmed = confirm("Are you sure you want to delete this order?");

    if (!userConfirmed) {
        // User canceled the action
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE', // Specify the HTTP method
        });

        if (response.ok) {
            alert("Order deleted successfully.");
            // Refresh the orders list to reflect the deletion
            fetchAndDisplayProducts(); // Re-fetch orders to update the list
            // Close the order details section
            const orderDetailsSection = document.querySelector('.order-details');
            orderDetailsSection.classList.remove('show');
        } else {
            throw new Error("Failed to delete the order.");
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        alert("An error occurred while trying to delete the order.");
    }
}


//decline order
document.querySelector("#decline").addEventListener("click", () => {
    showConfirmationModal(orderId);
});


    // Function to accept an order and update its status
    async function acceptOrders(orderId) {
        const apiUrl = `http://localhost:3000/orders/${orderId}`;

        try {
            // Update order status to "Accepted"
            const response = await fetch(apiUrl, {
                method: 'PATCH', // Use PATCH to update the order
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Processing' // Change the order status to "Processing"
                }),
            });


            if (response.ok) {
                alert("Order accepted successfully.");
                fetchAndDisplayProducts();
                const orderDetailsSection = document.querySelector('.order-details');
                orderDetailsSection.classList.remove('show');
            } else {
                throw new Error("Failed to accept the order.");
            }
        } catch (error) {
            console.error("Error accepting order:", error);
            alert("An error occurred while trying to accept the order.");
        }
    }

    // Event listener to close the order details section
    document.getElementById('closeOrderDetails').addEventListener('click', () => {
        const orderDetailsSection = document.querySelector('.order-details');
        orderDetailsSection.classList.remove('show');
        const receiptContainer = document.querySelector('.receipt-container');
        receiptContainer.style.display = 'none'; // Show the image
    });

    // Initial fetch of products/orders when the page is loaded
    fetchAndDisplayProducts();

});
