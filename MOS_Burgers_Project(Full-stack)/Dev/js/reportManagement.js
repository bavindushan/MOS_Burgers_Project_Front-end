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



const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'],
        datasets: [{
            label: 'Annual Sales Summary',
            data: [12, 19, 25, 5, 27, 39,22,23,45,56,66,78],
            borderWidth: 1
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