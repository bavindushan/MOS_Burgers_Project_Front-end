import { orderList } from '../data/data.js';



// Function to populate the table with order details
function populateOrderTable() {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    orderList.forEach(order => {
        const row = document.createElement('tr');

        // Create the table cells for each order
        const customerIdCell = document.createElement('td');
        customerIdCell.textContent = order.customerId;

        const customerNameCell = document.createElement('td');
        customerNameCell.textContent = order.customerName;

        const dateCell = document.createElement('td');
        dateCell.textContent = order.date;

        const totalAmountCell = document.createElement('td');
        totalAmountCell.textContent = order.totalAmount.toFixed(2); // Formatting to two decimal places

        // Append the cells to the row
        row.appendChild(customerIdCell);
        row.appendChild(customerNameCell);
        row.appendChild(dateCell);
        row.appendChild(totalAmountCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Call the function to populate the table when the page loads
window.onload = function() {
    populateOrderTable();
};



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
