// script.js
$(document).ready(function() {
    const ageGenderEValues = {
        male: {
            '18-40': { septal: 7.0, lateral: 9.0 },
            '41-65': { septal: 8.0, lateral: 11.0 },
            '>65': { septal: 5.0, lateral: 6.0 }
        },
        female: {
            '18-40': { septal: 7.0, lateral: 9.0 },
            '41-65': { septal: 8.0, lateral: 11.0 },
            '>65': { septal: 5.0, lateral: 6.0 }
        }
    };

    $('#criteria-form').on('submit', function(event) {
        event.preventDefault();
        const avgE = parseFloat($('#avg-e').val());
        const laVolume = parseFloat($('#la-volume').val());
        const trVelocity = parseFloat($('#tr-velocity').val());

        evaluateCriteria(avgE, laVolume, trVelocity);
    });

    $('#strain-form').on('submit', function(event) {
        event.preventDefault();
        const pumpStrain = parseFloat($('#pump-strain').val());
        const reservoirStrain = parseFloat($('#reservoir-strain').val());
        evaluateLAstrain(pumpStrain, reservoirStrain);
    });

    $('#basic-info-form').on('submit', function(event) {
        event.preventDefault();
        const age = parseInt($('#age').val());
        const gender = $('#gender').val();
        evaluateEValues(age, gender);
    });

    $('#e-values-form').on('submit', function(event) {
        event.preventDefault();
        const septalE = parseFloat($('#septal-e').val());
        const lateralE = parseFloat($('#lateral-e').val());
        evaluateEValues(undefined, undefined, septalE, lateralE);
    });

    function evaluateCriteria(avgE, laVolume, trVelocity) {
        let criteriaPositive = 0;
        if (avgE > 14) criteriaPositive++;
        if (laVolume > 34) criteriaPositive++;
        if (trVelocity > 2.8) criteriaPositive++;

        clearActiveSections();
        if (criteriaPositive >= 2) {
            displayResults('Impaired diastolic function with elevated filling pressures');
        } else if (criteriaPositive === 1) {
            $('#step2').removeClass('hidden').addClass('active-section');
        } else {
            $('#basic-info').removeClass('hidden').addClass('active-section');
        }
    }

    function evaluateLAstrain(pumpStrain, reservoirStrain) {
        clearActiveSections();
        if (pumpStrain >= 14 || reservoirStrain >= 30) {
            displayResults('Impaired diastolic function with elevated filling pressures');
        } else {
            $('#basic-info').removeClass('hidden').addClass('active-section');
        }
    }

    function evaluateEValues(age, gender, septalE, lateralE) {
        clearActiveSections();
        if (age !== undefined && gender !== undefined) {
            // Evaluate e' values
            let ageGroup;
            if (age <= 40) {
                ageGroup = '18-40';
            } else if (age <= 65) {
                ageGroup = '41-65';
            } else {
                ageGroup = '>65';
            }

            const eValues = ageGenderEValues[gender][ageGroup];

            if (septalE < eValues.septal || lateralE < eValues.lateral) {
                displayResults('Impaired diastolic function with normal filling pressures');
            } else {
                displayResults('Normal diastolic function');
            }
        } else {
            $('#step3').removeClass('hidden').addClass('active-section');
        }
    }

    function displayResults(result) {
        $('#result-text').text(result);
        $('#results').removeClass('hidden');
    }

    function clearActiveSections() {
        $('section').removeClass('active-section');
    }
});
