console.log("wada wada");




function populateCustomerTable() {
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8080/customer/getAll", requestOptions)
        .then(response => response.json()) // Convert response to JSON
        .then(customers => {
            customers.forEach(customer => {
                const row = document.createElement('tr');

                // Create table cells for each customer
                const idCell = document.createElement('td');
                idCell.textContent = customer.id;

                const nameCell = document.createElement('td');
                nameCell.textContent = `${customer.firstName} ${customer.lastName}`;

                const emailCell = document.createElement('td');
                emailCell.textContent = customer.email;

                const roleCell = document.createElement('td');
                roleCell.textContent = customer.occupation;

                const settingsCell = document.createElement('td');
                settingsCell.innerHTML = `
                    <div class="d-flex">
                        <div class="col ad-st-icon">
                            <img src="../assest/icon/eye.png" alt="View" onclick="viewCustomer(${customer.id})">
                        </div>
                        <div class="col ad-st-icon">
                            <img src="../assest/icon/edit.png" alt="Edit" onclick="editCustomer(${customer.id})">
                        </div>
                        <div class="col ad-st-icon">
                            <img src="../assest/icon/delete.png" alt="Delete" onclick="deleteCustomer(${customer.id})">
                        </div>
                    </div>
                `;

                // Append the cells to the row
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(roleCell);
                row.appendChild(settingsCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching customer data:", error));
}


function viewCustomer(customerID) {
    console.log(`Viewing customer with ID: ${customerID}`);
    
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://localhost:8080/customer/search/${customerID}`, requestOptions)
        .then(response => response.json()) // Parse the response as JSON
        .then(customer => {
            // Handle successful response with customer data
            Swal.fire({
                title: `Customer Details: ${customer.firstName} ${customer.lastName}`,
                html: `
                    <strong>First Name:</strong> ${customer.firstName} <br>
                    <strong>Last Name:</strong> ${customer.lastName} <br>
                    <strong>Occupation:</strong> ${customer.occupation} <br>
                    <strong>Email:</strong> ${customer.email} <br>
                    <strong>Phone:</strong> ${customer.phoneNumber} <br>
                    <strong>Location:</strong> ${customer.location} <br>
                    <strong>Additional Info:</strong> ${customer.additionalInfo}
                `,
                icon: "info",
                draggable: true
            });
        })
        .catch(error => {
            // Handle any errors
            console.error('Error fetching customer data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch customer data. Please try again later.',
                icon: 'error'
            });
        });
}


function editCustomer(customerID) {
    console.log(`Editing customer with ID: ${customerID}`);

    // Fetch customer data by ID to pre-populate the form
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://localhost:8080/customer/search/${customerID}`, requestOptions)
        .then((response) => response.json())
        .then((customer) => {
            // Show the Swal modal with the form
            Swal.fire({
                title: "Edit Customer",
                html: `
                    <div class="card modal-content-custom">
                        <div class="card-header">
                            Edit Customer Form
                            <button type="button" class="btn-close float-end" aria-label="Close" id="closeForm"></button>
                        </div>
                        <div class="card-body add-customer-form">
                            <div class="d-flex justify-content-between gap-2">
                                <input class="form-control form-edit mb-3 border-black" id="CFname" type="text" placeholder="First Name" required>
                                <input class="form-control form-edit mb-3 border-black" id="CLemail" type="text" placeholder="Last Name" required>
                            </div>
                            <div class="d-flex justify-content-between gap-3">
                                <input class="form-control form-edit mb-3 border-black" id="Coccupation" type="text" placeholder="Occupation" required>
                                <select class="form-select form-edit mb-3 border-black" id="Cgender" required>
                                    <option value="" disabled selected>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <input class="form-control form-edit mb-3 border-black" id="Clocation" type="text" placeholder="Location" required>
                            <input class="form-control form-edit mb-3 border-black" id="Cemail" type="text" placeholder="Email" required>
                            <input class="form-control form-edit mb-3 border-black" id="CPhoneNo" type="text" placeholder="Phone Number" required>
                            <textarea class="form-control form-edit mb-3 p-3 border-black" id="CAdditional" placeholder="Additional Information"></textarea>
                            <div class="d-flex gap-2 float-end">
                                <button class="btn btn-danger" id="cancelForm">Cancel</button>
                                <button class="btn btn-primary" id="submitCustomer">Update Customer</button>
                            </div>
                        </div>
                    </div>
                `,
                showConfirmButton: false,
                width: '80%',
                customClass: 'swal-wide',
                didOpen: () => {
                    // After modal is opened, populate the form fields with the customer data
                    document.getElementById("CFname").value = customer.firstName;
                    document.getElementById("CLemail").value = customer.lastName;
                    document.getElementById("Coccupation").value = customer.occupation;
                    document.getElementById("Cgender").value = customer.gender;
                    document.getElementById("Clocation").value = customer.location;
                    document.getElementById("Cemail").value = customer.email;
                    document.getElementById("CPhoneNo").value = customer.phoneNumber;
                    document.getElementById("CAdditional").value = customer.additionalInfo;

                    // Attach event listeners to the buttons after the modal is opened
                    document.getElementById("cancelForm").addEventListener("click", handleCancel);
                    document.getElementById("submitCustomer").addEventListener("click", () => submitCustomerForm(customerID));
                }
            });
        })
        .catch((error) => {
            console.error('Error fetching customer data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch customer data. Please try again later.',
                icon: 'error'
            });
        });
}

function handleCancel() {
    Swal.close();
}

function submitCustomerForm(customerID) {
    // Collect form data
    const updatedCustomer = {
        id: customerID,
        firstName: document.getElementById("CFname").value,
        lastName: document.getElementById("CLemail").value,
        occupation: document.getElementById("Coccupation").value,
        gender: document.getElementById("Cgender").value,
        location: document.getElementById("Clocation").value,
        email: document.getElementById("Cemail").value,
        phoneNumber: document.getElementById("CPhoneNo").value,
        additionalInfo: document.getElementById("CAdditional").value
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(updatedCustomer);

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/customer/update", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log("Customer updated:", result);
            Swal.fire({
                title: "Success",
                text: "Customer details updated successfully.",
                icon: "success"
            });
            // Optionally, refresh or reload the customer list
            // populateCustomerTable();
        })
        .catch((error) => {
            console.error('Error updating customer:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update customer. Please try again later.',
                icon: 'error'
            });
        });
}


function deleteCustomer(customerID) {
    console.log(`Deleting customer with ID: ${customerID}`);
    Swal.fire({
        title: "This will be implement in the future!",
        icon: "warning",
        draggable: true
    });
}
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;




// Initialize table population on DOM load
document.addEventListener('DOMContentLoaded', () => {
    populateCustomerTable();
});
