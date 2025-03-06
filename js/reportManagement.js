// Function to populate the table with order details
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

                // Append the cells to the row
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(roleCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching customer data:", error));
}





// Function to fetch order data and update the chart
async function fetchAndDisplayAnnualSales() {
    try {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const response = await fetch("http://localhost:8080/order/getAll", requestOptions);
        const orders = await response.json(); // Convert response to JSON

        // Initialize an array for monthly sales (Index 0 = January, Index 11 = December)
        const monthlySales = new Array(12).fill(0);

        // Process fetched order data
        orders.forEach(order => {
            const orderDate = new Date(order.date);
            const monthIndex = orderDate.getMonth(); // Get month (0 for Jan, 11 for Dec)
            monthlySales[monthIndex] += order.total; // Sum sales for each month
        });

        // Display Chart
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    'January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                datasets: [{
                    label: 'Annual Sales Summary',
                    data: monthlySales,
                    borderWidth: 2,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error fetching order data:", error);
    }
}

// Call the function to fetch data and display the chart
fetchAndDisplayAnnualSales();

// Initialize table population on DOM load
document.addEventListener('DOMContentLoaded', () => {
    populateCustomerTable();
});
