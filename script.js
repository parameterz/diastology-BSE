$(document).ready(function() {
    $('#evaluateButton').click(function() {
        // Get the input values
        let eToERatio = parseFloat($('#eToERatio').val());
        let laVolumeIndex = parseFloat($('#laVolumeIndex').val());
        let trVelocity = parseFloat($('#trVelocity').val());

        // Validate inputs
        if (isNaN(eToERatio) || isNaN(laVolumeIndex) || isNaN(trVelocity)) {
            alert('Please enter valid numbers for all inputs.');
            return;
        }

        // Implement the algorithm logic
        let result = evaluateDiastolicFunction(eToERatio, laVolumeIndex, trVelocity);

        // Display the result
        $('#result').text('Result: ' + result);
    });

    function evaluateDiastolicFunction(eToERatio, laVolumeIndex, trVelocity) {
        // Placeholder for the actual algorithm
        // Replace with the actual logic to evaluate diastolic function
        // Example logic: If any input is above a certain threshold, the result is positive
        if (eToERatio > 15 || laVolumeIndex > 34 || trVelocity > 2.8) {
            return "Diastolic dysfunction present";
        } else {
            return "Normal diastolic function";
        }
    }
});
