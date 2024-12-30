import { productList } from '../data/data.js';



function renderCategoryItems(category) {
    const categoriesContainer = document.querySelector('.Section .row');
    const items = productList[category];

    if (!items) {
        console.error(`Category ${category} not found in productList.`);
        return;
    }

    // Clear existing content
    categoriesContainer.innerHTML = '';

    // Generate items dynamically
    items.forEach((item) => {
        const categoryCard = `
            <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                <div class="card category-card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${item.name}</h5>
                        <h6>Price(LKR): ${item.price.toFixed(2)}</h6>
                        <button class="btn btn-primary add-to-cart " data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                    </div>
                </div>
            </div>`;
        categoriesContainer.innerHTML += categoryCard;
    });

    // Attach event listeners for "Add to Cart" buttons
    attachAddToCartEvents();
}

function attachAddToCartEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            addToOrder(name, price);
        });
    });
}

function addToOrder(name, price) {
    console.log(`Added to order: ${name} - LKR ${price.toFixed(2)}`);
    // Logic to add item to order (e.g., updating an order list or cart UI)
}

// Attach click event listeners to navbar links
function setupCategoryNavigation() {
    const navLinks = document.querySelectorAll('.category-link'); // Only target category links

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const category = link.textContent.trim(); // Use text content to determine the category
            renderCategoryItems(category);
        });
    });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    // Render "Burgers" category by default
    renderCategoryItems("Burgers");

    // Set up category navigation
    setupCategoryNavigation();
});
