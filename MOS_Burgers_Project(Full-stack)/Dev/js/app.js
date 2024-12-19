console.log('hello');

async function checkAdminPassword() {

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
            // Example: Display the admin password
            console.log(`Admin Password: ${data.adminPassword}`);
            // check validity of admin password
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
            if (password === data.adminPassword) {
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

