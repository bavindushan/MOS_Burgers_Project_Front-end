// Function to fetch the orders from the API
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:8080/order/getAll');
        const orders = await response.json(); // Parse JSON response
        return orders; // Return orders data
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Function to generate the PDF
async function generateReport() {
    const orders = await fetchOrders(); // Fetch orders from the API

    if (orders.length === 0) {
        alert('No orders found or there was an error fetching data.');
        return;
    }

    // Format data into the table format pdfmake expects
    const tableBody = [
        ['Order ID', 'Date', 'Total', 'Customer ID']
    ];

    // Loop through the orders and ensure each field is defined
    orders.forEach(order => {
        // Check if any required field is missing or invalid
        const orderId = order.id || 'N/A';
        const orderDate = order.date || 'N/A';
        const orderTotal = order.total || 'N/A';
        const customerId = order.customer_id || 'N/A';

        // Push the order data into the table
        tableBody.push([orderId, orderDate, orderTotal, customerId]);
    });

    // PDF document definition
    const docDefinition = {
        content: [
            { text: 'Order Report', style: 'header' },
            {
                table: {
                    body: tableBody
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            }
        }
    };

    // Generate and download the PDF
    pdfMake.createPdf(docDefinition).download('order_report.pdf');
}

// Attach click event listener to the icon
document.getElementById('generatePdf').addEventListener('click', generateReport);



// Function to populate the table with order details
function populateCustomerTable() {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    const customerRequestOptions = {
        method: "GET",
        redirect: "follow"
    };

    const orderRequestOptions = {
        method: "GET",
        redirect: "follow"
    };

    // Fetch customer data
    fetch("http://localhost:8080/customer/getAll", customerRequestOptions)
        .then(response => response.json())
        .then(customers => {
            // Fetch order data
            fetch("http://localhost:8080/order/getAll", orderRequestOptions)
                .then(response => response.json())
                .then(orders => {
                    // Combine customer and order data
                    customers.forEach(customer => {
                        const row = document.createElement('tr');

                        // Create table cells for each customer
                        const idCell = document.createElement('td');
                        idCell.textContent = customer.id;

                        const nameCell = document.createElement('td');
                        nameCell.textContent = `${customer.firstName} ${customer.lastName}`;

                        const dateCell = document.createElement('td');
                        const totalAmountCell = document.createElement('td');

                        // Find orders for the current customer
                        const customerOrders = orders.filter(order => order.customerId === customer.id);

                        if (customerOrders.length > 0) {
                            // Use the first order's date (assuming one order per customer for simplicity)
                            dateCell.textContent = customerOrders[0].date;

                            // Calculate total amount for the customer
                            const totalAmount = customerOrders.reduce((sum, order) => sum + order.total, 0);
                            totalAmountCell.textContent = totalAmount.toFixed(2);
                        } else {
                            // If no orders, display placeholder values
                            dateCell.textContent = "N/A";
                            totalAmountCell.textContent = "0.00";
                        }

                        // Append the cells to the row
                        row.appendChild(idCell);
                        row.appendChild(nameCell);
                        row.appendChild(dateCell);
                        row.appendChild(totalAmountCell);

                        // Append the row to the table body
                        tableBody.appendChild(row);
                    });
                })
                .catch(error => console.error("Error fetching order data:", error));
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
