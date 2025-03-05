document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Call function when page loads
    setupCategoryNavigation(); // Call category navigation setup on page load
});

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

            products.forEach(product => {
                const productHTML = `
                    <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card category-card">
                            <img src="${product.img}" class="card-img-top" alt="${product.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${product.name}</h5>
                                <h6>Price(LKR): ${product.price.toFixed(2)}</h6>
                            </div>
                            <div class="setting-icon">
                                <img src="../assest/icon/eye.png" alt="View">
                                <img src="../assest/icon/edit.png" alt="Edit">
                                <img src="../assest/icon/delete.png" alt="Delete">
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += productHTML;
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

function renderCategoryItemsByID(categoryID) {
    const categoriesContainer = document.querySelector('#product-container'); // Fixed selector

    // Fetch products from API
    fetch("http://localhost:8080/product/getAll", {
        method: "GET",
        redirect: "follow"
    })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            console.log("Fetched Data:", data); // Debugging API response

            // Filter products based on categoryID
            const filteredItems = data.filter(item => item.categoryId === categoryID);

            // Clear existing content
            categoriesContainer.innerHTML = '';

            if (filteredItems.length === 0) {
                console.warn(`No products found for categoryID: ${categoryID}`);
                categoriesContainer.innerHTML = '<p class="text-center">No products available.</p>';
                return;
            }

            // Generate items dynamically
            filteredItems.forEach(item => {
                const categoryCard = `
                <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card category-card">
                        <img src="${item.img}" class="card-img-top" alt="${item.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${item.name}</h5>
                            <h6>Price (LKR): ${item.price.toFixed(2)}</h6>
                        </div>
                        <div class="setting-icon">
                            <img src="../assest/icon/eye.png" alt="View">
                            <img src="../assest/icon/edit.png" alt="Edit">
                            <img src="../assest/icon/delete.png" alt="Delete">
                        </div>
                    </div>
                </div>
                `;
                categoriesContainer.innerHTML += categoryCard;
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.category-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const category = link.getAttribute('data-category'); // Get category code
            console.log("Selected Category:", category); // Debugging
            renderCategoryItemsByID(category); // Use function
        });
    });
}