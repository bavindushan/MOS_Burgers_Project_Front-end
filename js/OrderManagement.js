

// Get the element where you want to display the date and time
const orderDateandTime = document.getElementById('orderDateandTime');

// Function to update the date and time
function updateDateTime() {
    const currentDate = new Date();  // Get the current date and time

    // Format the date 
    const formattedDate = currentDate.toLocaleDateString(); // Default format: MM/DD/YYYY

    // Format the time 
    const formattedTime = currentDate.toLocaleTimeString(); // Default format: HH:MM:SS AM/PM

    // Update the content of the element
    orderDateandTime.innerHTML = `Date: ${formattedDate} Time: ${formattedTime}`;
}

// Call the function to set the initial date and time
setInterval(updateDateTime, 1000);  // Update every 1000ms (1 second)

// Function to get current date and time for the order
function getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    return `Date: ${formattedDate} Time: ${formattedTime}`;
}

//-----------------------------------------------------------------------------------------------------//

async function addCustomer() {
    console.log("Opening Add Customer Form");

    const { value: formValues } = await Swal.fire({
        html: `
        <div class="card modal-content-custom">
            <div class="card-header">
                Add Customer Form
                <button type="button" class="btn-close float-end" aria-label="Close" id="closeForm" onclick="Swal.close()"></button>
            </div>
            <div class="card-body add-customer-form">
                <div class="d-flex justify-content-between gap-2">
                    <input class="form-control form-edit mb-3" id="CFname" type="text" placeholder="First Name" required>
                    <input class="form-control form-edit mb-3" id="CLemail" type="text" placeholder="Last Name" required>    
                </div>
                <div class="d-flex justify-content-between gap-3">
                    <input class="form-control form-edit mb-3" id="Coccupation" type="text" placeholder="Occupation" required>
                    <select class="form-select form-edit mb-3" id="Cgender" required>
                        <option value="" disabled selected>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <input class="form-control form-edit mb-3" id="Clocation" type="text" placeholder="Location" required>
                <input class="form-control form-edit mb-3" id="Cemail" type="email" placeholder="Email" required>
                <input class="form-control form-edit mb-3" id="CPhoneNo" type="text" placeholder="Phone Number" required>
                <textarea class="form-control form-edit mb-3 p-3 border-1 border-warning" id="CAdditional" placeholder="Additional Information"></textarea>
                <div class="d-flex gap-2 float-end">
                    <button class="btn btn-danger" id="cancelForm" onclick="handleCancel()">Cancel</button>
                    <button class="btn btn-primary" id="submitCustomer" onclick="submitCustomerForm()">Add Customer</button>
                </div>
            </div>
        </div>
        `,
        focusConfirm: false,
        showConfirmButton: false
    });
}

// Function to handle form submission
async function submitCustomerForm() {
    const firstName = document.getElementById("CFname").value.trim();
    const lastName = document.getElementById("CLemail").value.trim();
    const occupation = document.getElementById("Coccupation").value.trim();
    const gender = document.getElementById("Cgender").value.trim();
    const location = document.getElementById("Clocation").value.trim();
    const email = document.getElementById("Cemail").value.trim();
    const phoneNumber = document.getElementById("CPhoneNo").value.trim();
    const additionalInfo = document.getElementById("CAdditional").value.trim();

    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email address." });
        return;
    }

    // Phone Number Validation (Sri Lankan format)
    const phoneRegex = /^(?:07[01245678])[0-9]{7}$/;
    if (!phoneRegex.test(phoneNumber)) {
        Swal.fire({ icon: "error", title: "Invalid Phone Number", text: "Please enter a valid Sri Lankan phone number (07XXXXXXXX)." });
        return;
    }

    // Ensure required fields are filled
    if (!firstName || !lastName || !email || !phoneNumber) {
        Swal.fire({ icon: "error", title: "Missing Fields", text: "First Name, Last Name, Email, and Phone Number are required!" });
        return;
    }

    // Prepare customer data
    const customerData = {
        firstName,
        lastName,
        occupation,
        gender,
        location,
        email,
        phoneNumber,
        additionalInfo
    };

    // Send data to backend
    try {
        const response = await fetch("http://localhost:8080/customer/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.statusText}`);
        }

        const result = await response.text();
        console.log("Customer added:", result);

        Swal.fire({ icon: "success", title: "Customer Added", text: `${firstName} ${lastName} has been successfully added!` });

    } catch (error) {
        console.error("Error adding customer:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to add customer. Please try again!" });
    }
}

// Cancel button function
function handleCancel() {
    Swal.fire({ title: "Cancelled", icon: "error", text: "Customer addition cancelled." });
}

// Attach functions globally
window.addCustomer = addCustomer;
window.handleCancel = handleCancel;
window.submitCustomerForm = submitCustomerForm;
//-------------------------------------------------------------------------------------------------------//


function searchCustomerByPhone() {
    const phoneInput = document.getElementById('phoneNumber').value.trim();
    const nameField = document.getElementById('customerName');
    const locationField = document.getElementById('location');

    // Check if the phone input is empty
    if (phoneInput === '') {
        nameField.value = '';
        locationField.value = '';
        return;
    }

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://localhost:8080/customer/search-by-number/${phoneInput}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Customer not found!');
            }
            return response.json();
        })
        .then(customer => {
            nameField.value = `${customer.firstName} ${customer.lastName}`;
            locationField.value = customer.location;

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Customer available!",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        })
        .catch(error => {
            nameField.value = '';
            locationField.value = '';

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Customer not exist!",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        });
}

window.searchCustomerByPhone = searchCustomerByPhone;

//--------------------------------------------------------------------------------------------------//

function searchItems(searchTerm) {
    const productList = getProducts();  // Get products
    const searchResults = [];

    // Loop through product categories and items
    for (let category in productList) {
        productList[category].forEach((item) => {
            // If the item name matches the search term, add it to the search results
            if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                searchResults.push(item);
            }
        });
    }

    // Get the section where the items will be displayed
    const resultContainer = document.querySelector(".Section .row");

    // Clear previous results
    resultContainer.innerHTML = "";

    // Display the matching items
    searchResults.forEach((item) => {
        const card = `
            <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                <div class="card category-card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${item.name}</h5>
                        <h6>Price(LKR): ${item.price.toFixed(2)}</h6>
                        <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        resultContainer.innerHTML += card;  // Append the card to the container
    });
}

window.searchItems = searchItems;


// Function to place an order
function placeOrder(event) {
    // Array to store all placed orders
    let orderArray = [];
    // Prevent form submission
    event.preventDefault();

    const phoneInput = document.getElementById('phoneNumber').value.trim();
    const nameField = document.getElementById('customerName').value;
    const locationField = document.getElementById('location').value;
    const emailField = document.getElementById('email').value;

    // Order details
    const orderDetails = {
        orderId: 'P001', // You can generate dynamic order ID as needed
        dateTime: getCurrentDateTime(),
        phoneNumber: phoneInput,
        customerName: nameField,
        location: locationField,
        additionalNote: emailField,
        totalItems: 0, // Set your logic for calculating total items
        totalPrice: 0, // Set your logic for calculating total price
        subTotal: 0, // Set your logic for calculating subtotal
        discount: 0, // Set your logic for calculating discount
    };

    // Add the order details to the orderArray
    orderArray.push(orderDetails);

    // Log the order array to the console
    console.log('Order Array:', orderArray);

    // Update the UI with the order details (optional)
    document.getElementById('orderDateandTime').innerHTML = orderDetails.dateTime;
    // You can update other UI fields as needed

    // Optionally, show a success message
    Swal.fire({
        icon: 'success',
        title: 'Order Placed Successfully!',
        text: `Order ID: ${orderDetails.orderId}`,
    });
}

// Function to cancel an order
function cancelOrder(event) {
    // Prevent form submission
    event.preventDefault();

    // Clear the input fields
    document.getElementById('phoneNumber').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('email').value = '';

    // Optionally, clear the UI updates
    document.getElementById('orderDateandTime').innerHTML = '';

    // Optionally, show a cancel message
    Swal.fire({
        icon: 'error',
        title: 'Order Cancelled!',
        text: 'The order has been cancelled.',
    });

}
window.cancelOrder = cancelOrder;
window.placeOrder = placeOrder;

//------------------------------------------------------------------------------------------------------//




function renderCategoryItemsByID(categoryID) {
    const categoriesContainer = document.querySelector('.Section .row');

    // Fetch products from API
    fetch("http://localhost:8080/product/getAll", {
        method: "GET",
        redirect: "follow"
    })
    .then((response) => response.json()) // Parse response as JSON
    .then((data) => {
        // Filter products based on categoryID
        const filteredItems = data.filter(item => item.categoryId === categoryID);

        // Clear existing content
        categoriesContainer.innerHTML = '';

        if (filteredItems.length === 0) {
            console.warn(`No products found for categoryID: ${categoryId}`);
            categoriesContainer.innerHTML = '<p class="text-center">No products available.</p>';
            return;
        }

        // Generate items dynamically
        filteredItems.forEach((item) => {
            const categoryCard = `
                <div data-aos="zoom-in" class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card category-card">
                        <img src="${item.img}" class="card-img-top" alt="${item.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${item.name}</h5>
                            <h6>Price (LKR): ${item.price.toFixed(2)}</h6>
                            <button class="btn btn-primary add-to-cart" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                        </div>
                    </div>
                </div>`;
            categoriesContainer.innerHTML += categoryCard;
        });
        attachAddToCartEvents();

        // Attach event listeners for "Add to Cart" buttons (not integrating now)
    })
    .catch((error) => console.error("Error fetching products:", error));
}


//-----------------------------------------heta balapan meka--------------------------------------------------------------//

// Global Order Object
const order = {
    items: [],
    totalItems: 0,
    subTotal: 0,
    discount: 0
};

function showOrderPopup() {
    if (order.items.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Cart is Empty!",
            text: "Please add items to the cart before viewing the order list."
        });
        return;
    }

    let orderTable = `
        <table class="swal2-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price (LKR)</th>
                    <th>Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>`;

    order.items.forEach((item) => {
        orderTable += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`;
    });

    orderTable += `
            </tbody>
        </table>
        <h5 class="mt-3">Total Price: ${(order.subTotal - order.discount).toFixed(2)} LKR</h5>`;

    Swal.fire({
        title: "Your Order List",
        html: orderTable,
        showCloseButton: true,
        confirmButtonText: "Close"
    });
}

function attachAddToCartEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.querySelector('#cart-icon'); // Corrected selection

    function updateOrderCard() {
        const totalPriceElement = document.querySelector('.set-total-price h4');
        const subTotalElement = document.querySelector('.set-total-price h5:nth-of-type(1)');
        const discountElement = document.querySelector('.set-total-price h5:nth-of-type(2)');
        const totalItemsElement = document.querySelector('.d-flex.justify-content-between.mt-3 h5');

        totalPriceElement.textContent = `Total Price: ${(order.subTotal - order.discount).toFixed(2)}`;
        subTotalElement.textContent = `Sub Total: ${order.subTotal.toFixed(2)}`;
        discountElement.textContent = `Discount: ${order.discount.toFixed(2)}`;
        totalItemsElement.textContent = `Total Items: ${order.totalItems}`;
    }

    function addToOrder(name, price, discount = 0) {
        const existingItem = order.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            order.items.push({ name, price, discount, quantity: 1 });
        }

        order.totalItems += 1;
        order.subTotal += price;
        order.discount += (price * discount) / 100;

        updateOrderCard();
    }

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const discount = parseFloat(e.target.getAttribute('data-discount')) || 0;

            addToOrder(name, price, discount);
        });
    });

    if (cartIcon) {
        cartIcon.addEventListener('click', showOrderPopup);
    } else {
        console.error("Cart icon not found!");
    }

    const clearButton = document.querySelector('.order-section .btn-danger');
    clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        order.items = [];
        order.totalItems = 0;
        order.subTotal = 0;
        order.discount = 0;

        updateOrderCard();
    });
}

// Initialize the event listeners
attachAddToCartEvents();

//-------------------------------------------------------------------------------------------------------//


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
    renderCategoryItemsByID("B");

    // Set up category navigation
    setupCategoryNavigation();
});
