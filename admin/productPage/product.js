document.addEventListener('DOMContentLoaded', async function () {
    const showAddProductDiv = document.querySelector(".addProduct");
    const hideButton = document.querySelector(".forButton");
    const showButton = document.getElementById("show-add-product");

    //Saving products to server
    const saveButton = document.getElementById("saveProduct");
    const showPriceDiv = document.querySelector(".row.mb-3.price");
    const showStocksDiv = document.querySelector(".row.mb-3.stocks");
    const showAddproductButton = document.querySelector(".btn.btn-success.me-2");
    const disableAddVariation = document.getElementById("addvariation");
    let errorIndicators = document.querySelectorAll(".row.mb-3.variant input");
    const errorMessages = document.getElementById("labelForVariation");
    let priceDiv = document.querySelectorAll(".row.mb-3.price input");
    let stockDiv = document.querySelectorAll(".row.mb-3.stocks input");
    const updateProduct = document.querySelector(".row .mb-3 .save-product");
    const saveEdit = document.getElementById("saveEdit");


    let editingProductId = null;

    //for showing add product div
    showButton.onclick = function () {
        showAddProductDiv.classList.add('show');
        hideButton.classList.add('hide');
        saveEdit.classList.remove('show');
        disableAddVariation.classList.remove('hide')
    };

    // For adding variation
    const divVariation = document.querySelector(".row.mb-3.variant");
    const showVariation = document.getElementById("addvariation");
    const showSaveButton = document.querySelector(".row.mb-3.save");
    

    // Initially hide the variation div and save button
    divVariation.classList.remove('show');
    showSaveButton.classList.remove('show');

    //for adding variation
    showVariation.onclick = function () {
        divVariation.classList.add('show');
        showSaveButton.classList.add('show');

        //enable all the disabled input
        errorIndicators.forEach(input => {
            input.disabled = false;
        });
    };

    const inputedImage = document.getElementById("image-holder");
    const inputFile = document.getElementById("myFile");
    const originalImageSrc = inputedImage.src;
    let imgUploaded = '';

    // // Reflecting image when added
    // inputFile.addEventListener("change", e => {
    //     const imgfile = inputFile.files[0];
    //     const reader = new FileReader();

    //     reader.onload = function () {
    //         inputedImage.src = reader.result;
    //         imgUploaded = reader.result;
    //     };
    //     imagreErrorIndicator.classList.remove("show");
    //     inputFile.style.border = '';
    //     reader.readAsDataURL(imgfile);
    // });


    function resetImage() {
        inputedImage.src = originalImageSrc;
        inputFile.value = "";
    }

    inputFile.addEventListener("change", e => {
        const imgfile = inputFile.files[0];
    
        const reader = new FileReader();
    
        reader.onload = function () {
            // Create a new image element to load the uploaded image
            const img = new Image();
            img.src = reader.result;
    
            img.onload = function () {
                // Create a canvas to resize the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set the desired width and height (this will compress the image)
                const maxWidth = 800;  // Max width for the image
                const maxHeight = 800; // Max height for the image
                let width = img.width;
                let height = img.height;
    
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
    
                // Resize the image
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
    
                // Compress and convert to base64 with a reduced quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 0.7 is the quality (can be adjusted)
    
                // Set the compressed image as the new image source
                inputedImage.src = compressedBase64;
                imgUploaded = compressedBase64;  // Store the base64 image
    
                // You can now send `imgUploaded` to the server or do other processing
            };
        };
        
        // Reset image error indicator
        imagreErrorIndicator.classList.remove("show");
        inputFile.style.border = '';
    
        // Read the file as data URL
        reader.readAsDataURL(imgfile);
    });

    console.log(imgUploaded)

    ///save button functionality
    saveButton.addEventListener("click", async function (e) {
        e.preventDefault();

        try {
            // Ensure at least one variation has been filled
            if (!addProductForm.variation.value &&
                !addProductForm.variation1.value &&
                !addProductForm.variation2.value &&
                !addProductForm.variation3.value) {

                // Set border color to red for each input
                errorIndicators.forEach(input => {
                    input.style.borderColor = "red";
                });

                // Show error message
                errorMessages.style.display = "block";
                throw new Error("At least one variation must be filled.");
            } else {
                const getVariationValue = {
                    varType1: addProductForm.variation.value,
                    varType2: addProductForm.variation1.value,
                    varType3: addProductForm.variation2.value,
                    varType4: addProductForm.variation3.value
                };

                disableAddVariation.disabled = true;
                showPriceDiv.classList.add("show");
                showStocksDiv.classList.add("show");
                showAddproductButton.classList.add("show");

                // Reset border colors
                errorIndicators.forEach(input => {
                    input.style.borderColor = "";
                    input.disabled = true;
                });

                //enabling the price inputs
                priceDiv.forEach(input => {
                    input.disabled = false;
                });

                //Enabling the stocks inputs
                stockDiv.forEach(input => {
                    input.disabled = false;
                });

                // Set placeholders based on variations
                getPriceStocksData(getVariationValue);
                showSaveButton.classList.remove("show");
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    });


    // Function to set placeholders for price and stock fields
    const getPriceStocksData = function (variationData) {
        // Update placeholder text based on each variation
        priceDiv.forEach((input, index) => {
            const getPricevariation = variationData[`varType${index + 1}`];
            if (getPricevariation) {
                input.placeholder = `Price for ${getPricevariation} pcs`;
            } else {
                input.placeholder = "";
                input.disabled = true;
            }
        });

        stockDiv.forEach((input, index) => {
            const getStocksvariation = variationData[`varType${index + 1}`];
            if (getStocksvariation) {
                input.placeholder = `Stock for ${getStocksvariation} pcs`;
            } else {
                input.placeholder = "";
                input.disabled = true;
            }
        });
    };

    // cancel button
    const cancelButton = document.querySelector(".btn-danger");
    cancelButton.onclick = function () {
        resetImage();
        showAddProductDiv.classList.remove('show');
        hideButton.classList.remove('hide');
        divVariation.classList.remove("show");
        showSaveButton.classList.remove("show");
        showPriceDiv.classList.remove("show");
        showStocksDiv.classList.remove("show");
        showAddproductButton.classList.remove("show");
        disableAddVariation.disabled = false;

        const textInputs = document.querySelectorAll("input[type='text'], input[type='number'], textarea");
        textInputs.forEach(input => {
            input.value = '';  // Clear the input values
        });

        const selectFields = document.querySelectorAll("select");
        selectFields.forEach(select => {
            select.selectedIndex = 0;  // Reset dropdown
        });
    
        priceDiv.forEach(input => {
            input.value = '';
        })
        stockDiv.forEach(input => {
            input.value = '';
        })
    };

    // Adding product to server and table
    const addProductForm = document.getElementById('addProductForm');
    const imagreErrorIndicator = document.querySelector(".imageIndicator");
    let newId = await getMaxProductId();  // Fetch the max prodID initially

    addProductForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Increment the product ID based on the current max ID
        newId++;

         // Assuming you have the color dropdown with id "addColor"
        const selectedColor = document.getElementById("addColor").value; 

        // Check if an image is uploaded
        if (!inputFile) {
            imagreErrorIndicator.classList.add("show");
            inputFile.style.border = "2px solid red";
            return;
        } else {
            inputFile.style.border = '';
        }

        //Check for invalid value for price and stocks
        let hasInvalidInput = false;

        priceDiv.forEach(input => {
            if (!input.disabled && (input.value <= 0 || isNaN(input.value))) {
                input.style.border = "2px solid red";
                hasInvalidInput = true;
            } else {
                input.style.border = '';
            }
        });

        stockDiv.forEach(input => {
            if (!input.disabled && (input.value <= 0 || isNaN(input.value))) {
                input.style.border = "2px solid red";
                hasInvalidInput = true;
            } else {
                input.style.border = '';
            }
        });

        // Stop form submission if there are invalid inputs
        if (hasInvalidInput) {
            alert("Please enter valid input");
            return;
        }

        // Collect product variations
        const newProductAdded = {
            prodID: newId,
            prodName: addProductForm.prodName.value,
            prodDescription: addProductForm.description.value,
            prodImage: imgUploaded,
            prodColor: selectedColor,
            prodVariation: [
                {
                    variationType: addProductForm.variation.value,
                    variationTypePrice: parseFloat(addProductForm.price.value) || 0,
                    variationTypeStocks: addProductForm.stocks.value
                },
                {
                    variationType: addProductForm.variation1.value,
                    variationTypePrice: parseFloat(addProductForm.price1.value) || 0,
                    variationTypeStocks: addProductForm.stocks1.value
                },
                {
                    variationType: addProductForm.variation2.value,
                    variationTypePrice: parseFloat(addProductForm.price2.value) || 0,
                    variationTypeStocks: addProductForm.stocks2.value
                },
                {
                    variationType: addProductForm.variation3.value,
                    variationTypePrice: parseFloat(addProductForm.price3.value) || 0,
                    variationTypeStocks: addProductForm.stocks3.value
                }
            ]
        };

        // Send product to the server
        try {
            const response = await fetch('http://localhost:3000/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProductAdded)
            });


            if (response.ok) {
                const addedProduct = await response.json();
                displayProducts(addedProduct, priceRange); // Pass priceRange to displayProducts
                addProductForm.reset();
                showAddProductDiv.classList.remove('show');
                hideButton.classList.remove('hide');
                localStorage.setItem('addProductVisibility', 'hidden');
            } else {
                console.error('Error adding product:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Function to get the current max product ID from the server
    async function getMaxProductId() {
        try {
            const response = await fetch('http://localhost:3000/product');
            const products = await response.json();
            let maxId = 0;
            if (products.length > 0) {
                maxId = Math.max(...products.map(p => p.prodID));
            }
            return maxId;
        } catch (error) {
            console.error('Error fetching products:', error);
            return 0;
        }
    }

    // Fetch and display products when the document loads
    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch('http://localhost:3000/product');
            const products = await response.json();

            const tableBody = document.querySelector("tbody.table-group-divider");
            tableBody.innerHTML = '';

            let rowNumber = 1;  // Start the row number from 1


            products.forEach((product) => {
                let priceRange = '';
                // Extract prices from prodVariation, filter out zero/undefined values, and calculate min and max
                const prices = product.prodVariation
                    .map(variation => parseFloat(variation.variationTypePrice))
                    .filter(price => price > 0);

                // Extract stock values and filter out zero/undefined values
                const stocks = product.prodVariation
                    .map(variation => parseInt(variation.variationTypeStocks))
                    .filter(stock => stock > 0);

                // Calculate total stock by summing the stock values
                const totalStock = stocks.reduce((total, stock) => total + stock, 0);

                if (prices.length > 1) {
                    const minPrice = Math.min(...prices).toLocaleString();
                    const maxPrice = Math.max(...prices).toLocaleString();
                    priceRange = `₱${minPrice} - ₱${maxPrice}`;
                } else if (prices.length === 1) {
                    priceRange = `₱${prices[0]}`; // Show the single price
                } else {
                    priceRange = "Price not available";
                }

                // Create row for each product
                const row = document.createElement("tr");
                row.innerHTML = `
                <th scope="row"></th>
                <td>
                <img src="${product.prodImage}" alt="products" style="width: 40px;">
                </td>
                <td>${product.prodName}</td>
                <td>${priceRange}</td>
                <td>${totalStock}</td>
                <td>
                    <button type="button" class="btn btn-primary edit-product" data-id="${product.prodID}"><ion-icon name="create"></ion-icon></button>
                    <button type="button" class="btn btn-danger delete-product" data-id="${product.prodID}"><ion-icon name="trash"></ion-icon></button>
                </td>
            `;
                tableBody.appendChild(row);

                // Add delete functionality
                const deleteButton = row.querySelector('.delete-product');
                deleteButton.addEventListener('click', function () {
                    const productId = product.id;
                    deleteProduct(productId, row);
                });


                const editButton = row.querySelector('.edit-product');
                editButton.addEventListener('click', function () {
                    const productId = product.id;
                    editProduct(productId, row);
                });

                recalculateNoColumn();


            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // RESET FORM 
    document.getElementById('show-add-product').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission if it's within a form
        document.getElementById('product-form').reset();
        const addprod = document.querySelector('.title');
        addprod.classList.add("hide");


        
        // clear images, custom variations, etc.
        clearCustomFields();
    });
    
    function clearCustomFields() {
        document.getElementById('addProductVariation').value = '';
        document.getElementById('addProductCategory').value = '';
    }

    // Fetch and display products initially
    fetchAndDisplayProducts();

    // Function to delete a product with confirmation
async function deleteProduct(id, row) {
    const userConfirmed = confirm("Are you sure you want to delete this product?");
    if (!userConfirmed) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`http://localhost:3000/product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Product deleted successfully!');
            // Remove the row from the DOM
            row.remove();
        } else {
            console.error('Error deleting product:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

    async function editProduct(id) {``
        try {
            const response = await fetch(`http://localhost:3000/product/${id}`);
            if (response.ok) {
                const product = await response.json();

                // Populate form with basic product data
                addProductForm.prodName.value = product.prodName;
                addProductForm.description.value = product.prodDescription;
                addProductForm.color.value = product.prodColor;


                if (product.prodImage) {
                    inputedImage.src = product.prodImage;  // Show the existing image
                    imgUploaded = product.prodImage;

                } else {
                    inputedImage.src = '';  // Placeholder if no image exists
                }

                
                // Reflecting image when added
                inputFile.addEventListener("change", e => {
                    const imgfile = inputFile.files[0];
                    const reader = new FileReader();
            
                    reader.onload = function () {
                        inputedImage.src = reader.result;
                        imgUploaded = reader.result;
                    };
                    imagreErrorIndicator.classList.remove("show");
                    inputFile.style.border = '';
                    reader.readAsDataURL(imgfile);
                });

                // Populate each variation field with available data
                product.prodVariation.forEach((variation, index) => {
                    addProductForm[`variation${index ? index : ''}`].value = variation.variationType || '';
                    addProductForm[`price${index ? index : ''}`].value = variation.variationTypePrice || '';
                    addProductForm[`stocks${index ? index : ''}`].value = variation.variationTypeStocks || '';
                });                            

                const colorDropdown = addProductForm.color;  // Assuming the dropdown is named 'color'
                colorDropdown.value = product.prodColor || '';

                // Set the editing product ID
                editingProductId = id;
                editing = true;
                // Show the form for editing
                showAddProductDiv.classList.add('show');


                //handle the input fields 
                disableAddVariation.disabled = true;
                disableAddVariation.classList.add('hide')
                hideButton.classList.add('hide');
                showPriceDiv.classList.add("show");
                showStocksDiv.classList.add("show");
                divVariation.classList.add("show");
                saveEdit.classList.add("show");
                //save the updated product
                updateProduct.classList.add("show");

                errorIndicators.forEach(input => {
                    if (input.value === null) {
                        input.disabled = true;
                    }
                    else input.disabled = false;
                });

                priceDiv.forEach(input => {
                    if (input.value === null) {
                        input.disabled = true;
                    }
                    else input.disabled = false;
                });

                stockDiv.forEach(input => {
                    if (input.value === null) {
                        input.disabled = true;
                    }
                    else input.disabled = false;
                });
            } else {
                console.error('Error fetching product:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    saveEdit.addEventListener("click", async function (e) {
        e.preventDefault();
    
        try {
            if (!addProductForm.variation.value &&
                !addProductForm.variation1.value &&
                !addProductForm.variation2.value &&
                !addProductForm.variation3.value) {
    
                // Set border color to red for each input
                errorIndicators.forEach(input => {
                    input.style.borderColor = "red";
                });
    
                // Show error message
                errorMessages.style.display = "block";
                throw new Error("At least one variation must be filled.");
            } else {
                // Collect the updated product data
                const updatedProduct = {
                    prodName: addProductForm.prodName.value,
                    prodDescription: addProductForm.description.value,
                    prodImage: imgUploaded || '',  
                    prodColor: addProductForm.color.value,

                    prodVariation: [
                        { variationType: addProductForm.variation.value, variationTypePrice: addProductForm.price.value, variationTypeStocks: addProductForm.stocks.value },
                        { variationType: addProductForm.variation1.value, variationTypePrice: addProductForm.price1.value, variationTypeStocks: addProductForm.stocks1.value },
                        { variationType: addProductForm.variation2.value, variationTypePrice: addProductForm.price2.value, variationTypeStocks: addProductForm.stocks2.value },
                        { variationType: addProductForm.variation3.value, variationTypePrice: addProductForm.price3.value, variationTypeStocks: addProductForm.stocks3.value }
                    ]
                };

                // Send the updated data to the server
                const response = await fetch(`http://localhost:3000/product/${editingProductId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                });
    
                if (response.ok) {
                    const updatedProduct = await response.json();
                    console.log("Product updated successfully:", updatedProduct);
    
                    // Optionally, you can close the form or reset the form here after successful update
                    showAddProductDiv.classList.remove('show');
                } else {
                    console.error('Failed to update product:', response.statusText);
                }
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    });

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

});
