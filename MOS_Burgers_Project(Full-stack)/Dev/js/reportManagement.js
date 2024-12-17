console.log("Hellow");


const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'],
        datasets: [{
            label: 'Annual Sales Summary',
            data: [12, 19, 25, 5, 27, 39,22,23,45,56,66,78],
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