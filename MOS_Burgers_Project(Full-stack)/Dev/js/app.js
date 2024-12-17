console.log('hello');

console.log('hello');

async function checkAdminPassword() {
    console.log("Function called");
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

    // Check the password
    if (password === "1234") {
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password is correct",
            timer: 1500, // Automatically close the alert after 1.5 seconds
            showConfirmButton: false
        }).then(() => {
            // Redirect to the admin dashboard page within the same window
            window.location.href = "app/admin-dashboard.html"; 
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Password is wrong! Please try again!",
        });
    }
}

