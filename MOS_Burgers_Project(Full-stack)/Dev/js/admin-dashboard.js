console.log("Hellow I am admin dashboard");




async function changeAdminPassword() {
    console.log("Function called");

    // Load JSON file
    fetch('../data/data.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load JSON file');
            }
            return response.json(); // Parse JSON data
        })
        .then(async data => {
            console.log(data); // Use the JSON data
            // Prompt admin to enter the current password
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

            // Check if the current password matches the stored password
            if (currentPassword === data.adminPassword) {
                // Prompt admin to enter a new password
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

                // Validate new password and update JSON
                if (newPassword) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Password changed successfully!",
                        timer: 1500, // Automatically close the alert after 1.5 seconds
                        showConfirmButton: false
                    });

                    // Update the password in the JSON object
                    data.adminPassword = newPassword;

                    // Save the updated JSON file (this requires server-side handling)
                    console.log("New Password:", newPassword);
                    console.log("Updated Data:", data);

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "New password cannot be empty!",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Current password is incorrect! Please try again!",
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//display annual sales summary
const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Annual Sales Summary',
            data: [12, 19, 25, 5, 27, 39, 22, 23, 45, 56, 66, 78],
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

