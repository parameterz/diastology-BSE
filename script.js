$(document).ready(function() {
    let state = {
        currentStep: 0,
        initialDecision: null,
        criteria: {}
    };

    $('#evaluateButton').click(function() {
        // Get the input values
        let eToERatio = $('#eToERatio').val();
        let laVolumeIndex = $('#laVolumeIndex').val();
        let trVelocity = $('#trVelocity').val();

        // Convert input values to floats if they are provided
        eToERatio = eToERatio ? parseFloat(eToERatio) : undefined;
        laVolumeIndex = laVolumeIndex ? parseFloat(laVolumeIndex) : undefined;
        trVelocity = trVelocity ? parseFloat(trVelocity) : undefined;

        // Implement the algorithm logic
        let result = evaluateDiastolicFunction(eToERatio, laVolumeIndex, trVelocity);

        // Display the result
        $('#result').text('Result: ' + result);

        // Save state and handle subsequent steps based on the result
        state.initialDecision = result;
        state.criteria = {
            eToERatio: eToERatio !== undefined ? eToERatio > 14 : undefined,
            laVolumeIndex: laVolumeIndex !== undefined ? laVolumeIndex > 34 : undefined,
            trVelocity: trVelocity !== undefined ? trVelocity > 2.8 : undefined
        };
        state.currentStep = 1;
        handleSubsequentSteps(state.currentStep, state.initialDecision);
    });

    function evaluateDiastolicFunction(eToERatio, laVolumeIndex, trVelocity) {
        let criteria = {
            eToERatio: eToERatio !== undefined ? eToERatio > 14 : undefined,
            laVolumeIndex: laVolumeIndex !== undefined ? laVolumeIndex > 34 : undefined,
            trVelocity: trVelocity !== undefined ? trVelocity > 2.8 : undefined
        };

        let positiveCount = Object.values(criteria).filter(val => val === true).length;
        let availableCount = Object.values(criteria).filter(val => val !== undefined).length;

        let initialDecision;
        if (availableCount < 2) {
            initialDecision = "Insufficient data";
        } else if (positiveCount >= 2) {
            initialDecision = "Diastolic dysfunction present";
        } else if (positiveCount === 0 && availableCount === 2) {
            initialDecision = "Normal diastolic function";
        } else if (positiveCount === 1 && availableCount === 2) {
            initialDecision = "Indeterminate result";
        } else {
            initialDecision = "Normal diastolic function";
        }

        return initialDecision;
    }

    function handleSubsequentSteps(step, initialDecision) {
        $('.step-inputs').hide(); // Hide all step inputs

        $('#backButton').toggle(step > 0);
        $('#nextButton').toggle(step === 1 && initialDecision !== "Insufficient data");

        switch (initialDecision) {
            case "Diastolic dysfunction present":
                if (step === 1) {
                    $('#diastolicDysfunctionInputs').show();
                } else if (step === 2) {
                    let additionalInput1 = $('#additionalInput1').val();
                    $('#result').text('Further step result: ' + additionalInput1); // Example processing
                }
                break;

            case "Normal diastolic function":
                if (step === 1) {
                    $('#normalFunctionInputs').show();
                } else if (step === 2) {
                    let additionalInput2 = $('#additionalInput2').val();
                    $('#result').text('Further step result: ' + additionalInput2); // Example processing
                }
                break;

            case "Indeterminate result":
                $('#result').text('Indeterminate result: Further evaluation required.');
                break;

            case "Insufficient data":
                $('#result').text('Insufficient data: Unable to proceed.');
                break;

            default:
                $('#result').text('Error: Unrecognized decision.');
                break;
        }
    }

    $('#backButton').click(function() {
        if (state.currentStep > 0) {
            state.currentStep--;
            handleSubsequentSteps(state.currentStep, state.initialDecision);
        }
    });

    $('#nextButton').click(function() {
        state.currentStep++;
        handleSubsequentSteps(state.currentStep, state.initialDecision);
    });

    $('#submitDiastolicDysfunction').click(function() {
        let additionalInput1 = $('#additionalInput1').val();
        $('#result').text('Further step result: ' + additionalInput1); // Example processing
    });

    $('#submitNormalFunction').click(function() {
        let additionalInput2 = $('#additionalInput2').val();
        $('#result').text('Further step result: ' + additionalInput2); // Example processing
    });
});
