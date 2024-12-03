document.addEventListener('DOMContentLoaded', async function(){
    const productDisplay = document.querySelector(".table-group-divider")

    async function fetchDashboardData() {
        try {
            // Fetch products
            const productResponse = await fetch('http://localhost:3000/product');
            const products = await productResponse.json();
    
            // Fetch orders
            const orderResponse = await fetch('http://localhost:3000/orders');
            const orders = await orderResponse.json();
    
            // Calculate Total Sales, Total Orders, and Total Products
            const totalSales = orders.reduce((sum, order) => {
                const numericPrice = parseFloat(order.totalPrice.replace(/[^0-9.]/g, '') || 0);
                return sum + numericPrice;
            }, 0);
                        const totalOrders = orders.length;
            const totalProducts = products.length;
    
            // Update the dashboard
            document.querySelector('.dashboard-content .card:nth-child(1) h3').textContent = `₱${totalSales.toLocaleString()}`;
            document.querySelector('.dashboard-content .card:nth-child(2) h3').textContent = totalOrders.toLocaleString();
            document.querySelector('.dashboard-content .card:nth-child(3) h3').textContent = totalProducts.toLocaleString();
    
            // Update progress bars (optional example logic)
            document.querySelector('.dashboard-content .card:nth-child(1) .progress-bar').style.width = `${(totalSales / 10000) * 100}%`;
            document.querySelector('.dashboard-content .card:nth-child(2) .progress-bar').style.width = `${(totalOrders / 100) * 100}%`;
            document.querySelector('.dashboard-content .card:nth-child(3) .progress-bar').style.width = `${(totalProducts / 100) * 100}%`;
    
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }
    
    // Call the function when the page loads
    fetchDashboardData();

    
    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch('http://localhost:3000/product');
            const products = await response.json();

            const tableBody = document.querySelector("tbody.table-group-divider");
            tableBody.innerHTML = '';

            products.forEach((product) => {
                let priceRange = '';
                let totalStocks = '';

                // Extract prices from prodVariation, filter out zero/undefined values, and calculate min and max
                const prices = product.prodVariation
                    .map(variation => parseFloat(variation.variationTypePrice))
                    .filter(price => price > 0);

                // Extract stock values and filter out zero/undefined values
                const stocks = product.prodVariation
                    .map(variation => parseInt(variation.variationTypeStocks))
                    .filter(stocks => stocks > 0);

                // Calculate total stock by summing the stock values
                const totalStock = stocks.reduce((total, stock) => total + stock, 0);

                if (prices.length > 1) {
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    priceRange = `₱${minPrice} - ₱${maxPrice}`;
                } else if (prices.length === 1) {
                    priceRange = `₱${prices[0]}`; // Show the single price
                } else {
                    priceRange = "Price not available";
                }

                // Create row for each product
                const row = document.createElement("tr");
                row.innerHTML = `
                <th scope="row">${product.prodID}</th>
                <td>${product.prodName}</td>
                <td>${priceRange}</td>
                <td>${totalStock}</td>
            `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Fetch and display products when the document loads
    fetchAndDisplayProducts();



     // Fetch and display all orders
     async function fetchAndDisplayOrders() {
        try {
            const response = await fetch('http://localhost:3000/orders');
            if (!response.ok) {
                console.error("Error: Failed to fetch data", response.statusText);
                return;
            }

            const orders = await response.json();
            console.log("Fetched orders:", orders);
            const tableBody = document.querySelector(".table-group-divider.o");
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
            recalculateNoColumn();


        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function recalculateNoColumn() {
        const tableBody = document.querySelector("tbody.table-group-divider");
        const rows = tableBody.querySelectorAll("tr");
    
        rows.forEach((row, index) => {
            const noColumn = row.querySelector("th");  // Assuming the "No." column is the first <th> in the row
            if (noColumn) {
                noColumn.textContent = index + 1;  // Set the row number (1-based index)
            }
        });
    }
    fetchAndDisplayOrders();
})