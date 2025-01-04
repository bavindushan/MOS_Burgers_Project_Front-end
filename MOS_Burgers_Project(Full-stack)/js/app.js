console.log("app.js loaded");

import { getAdminPassword } from '../data/data.js'; // Import the getAdminPassword method

async function checkAdminPassword() {
    try {
        // Step 1: Prompt admin to enter their password
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

        // Step 2: Validate the entered password against the stored password
        const isPasswordValid = password === getAdminPassword();

        if (isPasswordValid) {
            // Step 3: Notify success and redirect
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password is correct",
                timer: 1500,
                showConfirmButton: false
            });

            window.location.href = "../app/admin-dashboard.html"; // Redirect to admin dashboard
        } else {
            // Step 4: Notify error for incorrect password
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Password is wrong! Please try again!",
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        // Notify error if any exception occurs
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
