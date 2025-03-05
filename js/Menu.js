document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Load products on page load
    setupCategoryNavigation(); // Initialize category navigation
});

// Fetch all products
function fetchProducts() {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        redirect: "follow"
    };

    fetch("http://localhost:8080/product/getAll", requestOptions)
        .then(response => response.json()) // Assuming the response is JSON
        .then(products => {
            const container = document.getElementById("product-container");
            container.innerHTML = ""; // Clear existing content

            products.forEach(item => {
                const productHTML = `
                    <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card category-card">
                            <img src="${item.img}" class="card-img-top" alt="${item.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${item.name}</h5>
                                <h6>Price (LKR): ${parseFloat(item.price).toFixed(2)}</h6>
                            </div>
                            <div class="setting-icon">
                                <img src="../assest/icon/eye.png" alt="View" onclick="viewProduct('${item.id}')">
                                <img src="../assest/icon/edit.png" alt="Edit" onclick="updateProduct('${item.id}', '${item.name}', '${item.price}', '${item.categoryId}','${item.discount}', '${item.img}')">
                                <img src="../assest/icon/delete.png" alt="Delete" onclick="deleteProduct('${item.id}')">
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += productHTML;
            });
        })
        .catch(error => Swal.fire("Error", "Failed to fetch products!", "error"));
}

function viewProduct(productId) {
    fetch(`http://localhost:8080/product/searchById/${productId}`, {
        method: "GET",
        redirect: "follow"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }
        return response.json();
    })
    .then(item => {
        Swal.fire({
            title: item.name,
            html: `
                <b>ID:</b> ${item.id} <br>
                <b>Category:</b> ${item.categoryId} <br>
                <b>Price:</b> LKR ${parseFloat(item.price).toFixed(2)} <br>
                <b>Discount:</b>  ${parseFloat(item.discount).toFixed(2)} <br>
                <img src="${item.img}" width="100px">
            `,
            icon: "info"
        });
    })
    .catch(error => Swal.fire("Error", error.message, "error"));
}

// Update product
function updateProduct(productId, name, price, categoryId, discount, img) {
    console.log(productId, name, price, categoryId, discount, img);
    
    Swal.fire({
        title: "Update Product",
        html: `
            <input id="swal-name" class="swal2-input" placeholder="Product Name" value="${name}">
            <input id="swal-price" class="swal2-input" type="number" placeholder="Price" value="${price}">
            <input id="swal-category" class="swal2-input" placeholder="Category ID" value="${categoryId}">
            <input id="swal-discount" class="swal2-input" placeholder="Discount" value="${discount}">
            <input id="swal-img" class="swal2-input" placeholder="Image URL" value="${img}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
            return {
                name: document.getElementById("swal-name").value,
                price: parseFloat(document.getElementById("swal-price").value) || 0,
                categoryId: document.getElementById("swal-category").value,
                discount: parseFloat(document.getElementById("swal-discount").value) || 0,
                img: document.getElementById("swal-img").value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedProduct = {
                id: productId,
                ...result.value
            };

            fetch("http://localhost:8080/product/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
                redirect: "follow"
            })
            .then(response => response.text())
            .then(() => {
                Swal.fire("Success", "Product updated successfully!", "success");
                fetchProducts(); // Refresh products
            })
            .catch(error => Swal.fire("Error", "Failed to update product!", "error"));
        }
    });
}

// Delete product
function deleteProduct(productId) {
    Swal.fire({
        title: "Are you sure?",
        text: "This product will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:8080/product/delete/${productId}`, {
                method: "DELETE",
                redirect: "follow"
            })
            .then(response => response.text())
            .then(() => {
                Swal.fire("Deleted!", "Product has been deleted.", "success");
                fetchProducts(); // Refresh products
            })
            .catch(error => Swal.fire("Error", "Failed to delete product!", "error"));
        }
    });
}

// Render products by category
function renderCategoryItemsByID(categoryID) {
    const categoriesContainer = document.querySelector('#product-container');

    fetch("http://localhost:8080/product/getAll", {
        method: "GET",
        redirect: "follow"
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched Data:", data);

        const filteredItems = data.filter(item => item.categoryId === categoryID);

        categoriesContainer.innerHTML = '';

        if (filteredItems.length === 0) {
            console.warn(`No products found for categoryID: ${categoryID}`);
            categoriesContainer.innerHTML = '<p class="text-center">No products available.</p>';
            return;
        }

        filteredItems.forEach(item => {
            const categoryCard = `
                <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card category-card">
                            <img src="${item.img}" class="card-img-top" alt="${item.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${item.name}</h5>
                                <h6>Price (LKR): ${parseFloat(item.price).toFixed(2)}</h6>
                            </div>
                            <div class="setting-icon">
                                <img src="../assest/icon/eye.png" alt="View" onclick="viewProduct('${item.id}')">
                                <img src="../assest/icon/edit.png" alt="Edit" onclick="updateProduct('${item.id}', '${item.name}', '${item.price}', '${item.categoryId}','${item.discount}', '${item.img}')">
                                <img src="../assest/icon/delete.png" alt="Delete" onclick="deleteProduct('${item.id}')">
                            </div>
                        </div>
                    </div>
            `;
            categoriesContainer.innerHTML += categoryCard;
        });
    })
    .catch(error => console.error("Error fetching products:", error));
}

// Setup category navigation
function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.category-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            console.log("Selected Category:", category);
            renderCategoryItemsByID(category);
        });
    });
}


// Function to open the Add Product form
function addProduct() {
    // HTML content for the Add Product form
    const productFormHTML = `
    <div class="card modal-content-custom">
        <div class="card-header">
            Add Product Form
            
        </div>
        <div class="card-body add-customer-form">
            <div class="d-flex justify-content-between gap-2">
                <input class="form-control form-edit mb-3 border-warning" id="Pname" type="text" placeholder="Product Name" required>
                <input class="form-control form-edit mb-3 border-warning" id="PcategoryId" type="text" placeholder="Category ID" required>    
            </div>
            <div class="d-flex justify-content-between gap-3">
                <input class="form-control form-edit mb-3 border-warning" id="Pprice" type="number" placeholder="Price" required>
                <input class="form-control form-edit mb-3 border-warning" id="Pdiscount" type="number" placeholder="Discount" required>
            </div>
            <input class="form-control form-edit mb-3 border-warning" id="Pimg" type="text" placeholder="Image URL" required>
            <div class="d-flex gap-2 float-end">
                <button class="btn btn-danger" id="cancelForm" onclick="handleCancel()">Cancel</button>
                <button class="btn btn-primary" id="submitProduct" onclick="submitProductForm()">Add Product</button>
            </div>
        </div>
    </div>
    `;

    // Open the SweetAlert modal with the Add Product form
    Swal.fire({
        html: productFormHTML,
        showConfirmButton: false,
        focusConfirm: false,
        showCloseButton: true,
        width: '600px',
        heightAuto: true
    });
}

// Function to handle the cancel action
function handleCancel() {
    Swal.close();
}

// Function to submit the product form
function submitProductForm() {
    const name = document.getElementById("Pname").value;
    const categoryId = document.getElementById("PcategoryId").value;
    const price = parseFloat(document.getElementById("Pprice").value);
    const discount = parseFloat(document.getElementById("Pdiscount").value);
    const img = document.getElementById("Pimg").value;

    // Validate the input data (optional)
    if (!name || !categoryId || isNaN(price) || isNaN(discount) || !img) {
        Swal.fire("Error", "Please fill all fields correctly!", "error");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": name,
        "categoryId": categoryId,
        "price": price,
        "discount": discount,
        "img": img
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/product/add", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            Swal.fire("Success", "Product added successfully!", "success");
            fetchProducts(); // Refresh products
        })
        .catch(error => {
            console.error(error);
            Swal.fire("Error", "Failed to add product!", "error");
        });
}

// Add event listener to the button
document.getElementById("btnSearch").addEventListener("click", addProduct);

