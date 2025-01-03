import { productList } from '../data/data.js';
import { getProducts } from '../data/data.js';
import { customerArray } from '../data/data.js';

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

function searchCustomerByPhone() {
    const phoneInput = document.getElementById('phoneNumber').value.trim();
    const nameField = document.getElementById('customerName');
    const locationField = document.getElementById('location');

    // Check if the phone input is empty
    if (phoneInput === '') {
        // Clear the other fields if phone number is empty
        nameField.value = '';
        locationField.value = '';
        return;
    }

    // Find the customer by phone number
    const customer = customerArray.find(cust => cust.phoneNumber.startsWith(phoneInput));

    // Initialize the Toast object
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    if (customer) {
        // Set customer name and location
        nameField.value = `${customer.firstName} ${customer.lastName}`;
        locationField.value = customer.location;

        // Show success Toast
        Toast.fire({
            icon: "success",
            title: "Customer available!"
        });
    } else {
        // Clear fields if no customer is found
        nameField.value = '';
        locationField.value = '';

        // Show error Toast
        Toast.fire({
            icon: "error",
            title: "Customer not exist!"
        });
    }
}
window.searchCustomerByPhone = searchCustomerByPhone;



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


async function addCustomer() {
    console.log("um addCustomer");

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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <input class="form-control form-edit mb-3" id="Clocation" type="text" placeholder="Location" required>
                <input class="form-control form-edit mb-3" id="Cemail" type="text" placeholder="Email" required>
                <input class="form-control form-edit mb-3" id="CPhoneNo" type="text" placeholder="Phone Number" required>
                <textarea class="form-control form-edit mb-3 p-3" id="CAdditional" placeholder="Additional Information"></textarea>
                <div class="d-flex gap-2 float-end">
                    <button class="btn btn-danger" id="cancelForm" onclick="handleCancel()">Cancel</button>
                    <button class="btn btn-primary" id="submitCustomer" onclick="submitCustomerForm()">Add Customer</button>
                </div>
            </div>
        </div>
        `,
        focusConfirm: false,
        showConfirmButton: false, // Disable the OK button
        preConfirm: () => {
            const firstName = document.getElementById("CFname").value.trim();
            const lastName = document.getElementById("CLemail").value.trim();
            const occupation = document.getElementById("Coccupation").value.trim();
            const gender = document.getElementById("Cgender").value.trim();
            const location = document.getElementById("Clocation").value.trim();
            const email = document.getElementById("Cemail").value.trim();
            const phoneNumber = document.getElementById("CPhoneNo").value.trim();

            // Validate inputs before returning
            if (!firstName || !lastName || !email || !phoneNumber) {
                Swal.showValidationMessage("First Name, Last Name, Email, and Phone Number are required!");
                return null;
            }

            return { firstName, lastName, occupation, gender, location, email, phoneNumber };
        }
    });

    if (formValues) {
        // Proceed with showing success message after adding the customer
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        Toast.fire({
            icon: "success",
            title: "Customer added successfully"
        });

        console.log("New Customer Data:", formValues);
    }

    function submitCustomerForm() {
        const firstName = document.getElementById("CFname").value.trim();
        const lastName = document.getElementById("CLemail").value.trim();
        const occupation = document.getElementById("Coccupation").value.trim();
        const gender = document.getElementById("Cgender").value.trim();
        const location = document.getElementById("Clocation").value.trim();
        const email = document.getElementById("Cemail").value.trim();
        const phoneNumber = document.getElementById("CPhoneNo").value.trim();

        // Validate inputs before processing
        if (!firstName || !lastName || !email || !phoneNumber) {
            Swal.showValidationMessage("First Name, Last Name, Email, and Phone Number are required!");
            return;
        }

        const formData = {
            firstName,
            lastName,
            occupation,
            gender,
            location,
            email,
            phoneNumber
        };

        console.log("Form Data to be processed:", formData);

        // Here you can perform further processing (like saving the data to a server)

        Swal.fire({
            icon: "success",
            title: "Customer Added",
            text: `Customer ${firstName} ${lastName} added successfully!`
        });
    }
}

function handleCancel() {
    Swal.fire({
        title: "Cancel!",
        icon: "error",
        draggable: true
    });
}

// Attach the function to the global `window` object
window.addCustomer = addCustomer;
window.handleCancel = handleCancel;
window.submitCustomerForm = submitCustomerForm;

// Function to handle form submission
function submitCustomerForm() {
    const firstName = document.getElementById("CFname").value;
    const lastName = document.getElementById("CLemail").value;
    const occupation = document.getElementById("Coccupation").value;
    const gender = document.getElementById("Cgender").value;
    const location = document.getElementById("Clocation").value;
    const email = document.getElementById("Cemail").value;
    const phoneNumber = document.getElementById("CPhoneNo").value;
    const additionalInfo = document.getElementById("CAdditional").value;

    // Add your logic to validate and save the customer data
    if (firstName && lastName && email && phoneNumber) {
        Swal.fire({
            icon: 'success',
            title: 'Customer Added',
            text: `${firstName} ${lastName} has been successfully added!`
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill in all required fields!'
        });
    }
}

// Attach the function to the global `window` object
window.addCustomer = addCustomer;


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
