console.log("Hellow");


async function changeAdminPassword() {
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

