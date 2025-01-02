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

    // Order state
    const order = {
        items: [],
        totalItems: 0,
        subTotal: 0,
        discount: 0,
        totalPrice: 0
    };

    // Update Order Card
    function updateOrderCard() {
        // Select elements inside the `.set-total-price` section
        const totalPriceElement = document.querySelector('.set-total-price h4'); // Target Total Price
        const subTotalElement = document.querySelector('.set-total-price h5:nth-of-type(1)'); // Target Sub Total
        const discountElement = document.querySelector('.set-total-price h5:nth-of-type(2)'); // Target Discount

        // Select the Total Items element
        const totalItemsElement = document.querySelector('.d-flex.justify-content-between.mt-3 h5'); // Target Total Items

        // Update the text content of these elements
        totalPriceElement.textContent = `Total Price: ${(order.subTotal - order.discount).toFixed(2)}`;
        subTotalElement.textContent = `Sub Total: ${order.subTotal.toFixed(2)}`;
        discountElement.textContent = `Discount: ${order.discount.toFixed(2)}`;
        totalItemsElement.textContent = `Total Items: ${order.totalItems}`;
    }

    // Add item to order
    function addToOrder(name, price, discount = 0) {
        const existingItem = order.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.items.push({ name, price, discount, quantity: 1 });
        }

        // Recalculate order totals
        order.totalItems += 1;
        order.subTotal += price;
        order.discount += (price * discount) / 100;

        updateOrderCard();
    }

    // Attach events to Add to Cart buttons
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const discount = parseFloat(e.target.getAttribute('data-discount')) || 0;

            addToOrder(name, price, discount);
        });
    });

    // Clear all button logic
    const clearButton = document.querySelector('.order-section .btn-danger');
    clearButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        order.items = [];
        order.totalItems = 0;
        order.subTotal = 0;
        order.discount = 0;
        order.totalPrice = 0;

        updateOrderCard();
    });
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
