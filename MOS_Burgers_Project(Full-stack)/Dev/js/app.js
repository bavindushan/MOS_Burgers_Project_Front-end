console.log("app.js loaded");

import dataManager from '../data/data.js';

async function checkAdminPassword() {
    try {
        const { value: password } = await Swal.fire({
            title: "Enter your admin password",
            input: "password",
            inputLabel: "Password",
            inputPlaceholder: "Enter your password",
            inputAttributes: {
                maxlength: "10",
                autocapitalize: "off",
                autocorrect: "off"
            }
        });

        // Use the dataManager's verifyPassword method
        const isPasswordValid = dataManager.verifyPassword(password);

        if (isPasswordValid) {
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password is correct",
                timer: 1500,
                showConfirmButton: false
            });

            window.location.href = "../app/admin-dashboard.html"; // Redirect to admin dashboard
        } else {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Password is wrong! Please try again!",
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        await Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred during authentication. Please try again.",
        });
    }
}

// Attach to window for global access
window.checkAdminPassword = checkAdminPassword;

export { checkAdminPassword };