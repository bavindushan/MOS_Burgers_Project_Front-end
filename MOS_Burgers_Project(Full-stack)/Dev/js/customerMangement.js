console.log("Hellow");

// Customer array
let customers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St, Springfield",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "987-654-3210",
        address: "456 Elm St, Shelbyville",
    },
];

// Function to view customer details
function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        Swal.fire("Error", "Customer not found!", "error");
        return;
    }
    Swal.fire({
        title: "Customer Details",
        html: `
            <div class="card" style="width: 18rem; margin: auto;">
                <div class="card-body">
                    <h5 class="card-title">${customer.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Email: ${customer.email}</h6>
                    <p class="card-text">
                        <strong>Phone:</strong> ${customer.phone}<br>
                        <strong>Address:</strong> ${customer.address}
                    </p>
                    <button class="btn btn-primary" onclick="editCustomer(${customer.id})">Edit</button>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
    });
}

// Function to edit customer details
function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        Swal.fire("Error", "Customer not found!", "error");
        return;
    }
    Swal.fire({
        title: "Edit Customer Details",
        html: `
            <input id="editName" class="swal2-input" placeholder="Name" value="${customer.name}">
            <input id="editEmail" class="swal2-input" placeholder="Email" value="${customer.email}">
            <input id="editPhone" class="swal2-input" placeholder="Phone" value="${customer.phone}">
            <input id="editAddress" class="swal2-input" placeholder="Address" value="${customer.address}">
        `,
        confirmButtonText: "Save",
        showCancelButton: true,
        preConfirm: () => {
            const newName = document.getElementById("editName").value;
            const newEmail = document.getElementById("editEmail").value;
            const newPhone = document.getElementById("editPhone").value;
            const newAddress = document.getElementById("editAddress").value;

            if (!newName || !newEmail || !newPhone || !newAddress) {
                Swal.showValidationMessage("All fields are required!");
                return false;
            }
            return { newName, newEmail, newPhone, newAddress };
        },
    }).then(result => {
        if (result.isConfirmed) {
            customer.name = result.value.newName;
            customer.email = result.value.newEmail;
            customer.phone = result.value.newPhone;
            customer.address = result.value.newAddress;
            Swal.fire("Success", "Customer details updated successfully!", "success");
        }
    });
}

// Example usage
viewCustomerDetails(1); // Call this function to display customer details


// Example Usage:
