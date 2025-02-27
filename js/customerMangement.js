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


// Example function placeholders for view, edit, and delete actions
function viewCustomer(customerID) {
    console.log(`Viewing customer with ID: ${customerID}`);
    Swal.fire({
        title: "This will be implement in the future!",
        icon: "warning",
        draggable: true
    });
}

function editCustomer(customerID) {
    console.log(`Editing customer with ID: ${customerID}`);
    Swal.fire({
        title: "This will be implement in the future!",
        icon: "warning",
        draggable: true
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
