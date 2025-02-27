console.log("Hello, I am the admin dashboard");

import { getAdminPassword, setAdminPassword } from '../data/data.js'; // Import methods from data.js

async function changeAdminPassword() {
    try {
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

        // If no password entered or incorrect, exit early
        if (!currentPassword || currentPassword !== getAdminPassword()) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "The current password is incorrect. Please try again.",
            });
            return;
        }

        // Step 2: Prompt admin to enter a new password
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

        // Step 3: Change the admin password using setAdminPassword
        setAdminPassword(newPassword);

        // Step 4: Notify success
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

//----------------------- Display Annual Sales Summary --------------------------------
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