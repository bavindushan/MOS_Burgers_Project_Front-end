console.log("app.js loaded");

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

        if (!password) {
            return; // Exit if no password is entered
        }

        // Step 2: Fetch admin data
        const response = await fetch("http://localhost:8080/admin/getAll");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const admins = await response.json();

        // Step 3: Check if the entered password matches any admin password
        const isPasswordValid = admins.some(admin => admin.password === password);

        if (isPasswordValid) {
            // Step 4: Notify success and redirect
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password is correct",
                timer: 1500,
                showConfirmButton: false
            });

            window.location.href = "app/admin-dashboard.html"; // Redirect to admin dashboard
        } else {
            // Step 5: Notify error for incorrect password
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
            text: "An error occurred while verifying the password. Please try again.",
        });
    }
}

// Attach to window for global access
window.checkAdminPassword = checkAdminPassword;
