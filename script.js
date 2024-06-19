$(document).ready(function() {
    // Handle form submission
    $('#decisionForm').on('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission
        processDecision();
    });

    // Handle start button click
    $('#startButton').on('click', function() {
        navigateTo('node1.html');
    });
});

function processDecision() {
    const formData = $('#decisionForm').serializeArray();
    const data = {};

    // Convert formData to an object
    $.each(formData, function(index, field) {
        data[field.name] = field.value;
    });

    // Example logic to determine the next page
    let nextPage = 'default.html';  // Default next page

    const currentPage = $('body').data('node');
    switch(currentPage) {
        case 1:
            if (data.heartRate && data.heartRate < 60) {
                nextPage = 'node_bradycardia.html';
            } else if (data.heartRate && data.heartRate > 100) {
                nextPage = 'node_tachycardia.html';
            } else if (data.symptoms === 'severe') {
                nextPage = 'node_critical.html';
            } else {
                nextPage = 'node2.html';
            }
            break;
        // Add cases for other nodes as needed
        default:
            nextPage = 'default.html';
    }

    // Save the decision if needed
    localStorage.setItem('lastDecision', JSON.stringify(data));

    // Navigate to the next page
    window.location.href = nextPage;
}

function navigateTo(page) {
    window.location.href = page;
}
