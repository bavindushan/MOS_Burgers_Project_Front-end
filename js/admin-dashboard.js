console.log("Hello, I am the admin dashboard");


async function changeAdminPassword() {
    try {
        // Step 1: Get the current admin password from API
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const response = await fetch("http://localhost:8080/admin/getAll", requestOptions);
        const adminData = await response.json();

        // Assuming only one admin exists
        const admin = adminData[0];
        const currentStoredPassword = admin.password;

        // Step 2: Prompt admin to enter the current password
        const { value: currentPassword } = await Swal.fire({
            title: "Enter your current admin password",
            input: "password",
            inputLabel: "Password",
            inputPlaceholder: "Enter current password",
            inputAttributes: {
                maxlength: "10",
                autocapitalize: "off",
                autocorrect: "off"
            }
        });

        // If no password entered or incorrect, exit early
        if (!currentPassword || currentPassword !== currentStoredPassword) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "The current password is incorrect. Please try again.",
            });
            return;
        }

        // Step 3: Prompt admin to enter a new password
        const { value: newPassword } = await Swal.fire({
            title: "Enter your new admin password",
            input: "password",
            inputLabel: "New Password",
            inputPlaceholder: "Enter new password",
            inputAttributes: {
                maxlength: "10",
                autocapitalize: "off",
                autocorrect: "off"
            }
        });

        // If no new password entered, exit early
        if (!newPassword) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "New password cannot be empty!",
            });
            return;
        }

        // Step 4: Update admin password in the database
        const updateHeaders = new Headers();
        updateHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            id: admin.id,  // Use the actual admin ID
            name: admin.name,
            password: newPassword
        });

        const updateOptions = {
            method: "PUT",
            headers: updateHeaders,
            body: raw,
            redirect: "follow"
        };

        const updateResponse = await fetch("http://localhost:8080/admin/update", updateOptions);
        const updateResult = await updateResponse.text();

        // Step 5: Notify success
        await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password changed successfully!",
            timer: 1500,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Error changing password:', error);
        await Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while changing the password. Please try again.",
        });
    }
}

// Attach to window for global access
window.changeAdminPassword = changeAdminPassword;

export { changeAdminPassword };


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
