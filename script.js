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

    $('#basic-info-form').on('submit', function(event) {
        event.preventDefault();
        const age = parseInt($('#age').val());
        const gender = $('#gender').val();

        if (age && gender) {
            $('#step1').addClass('hidden');
            $('#step2').removeClass('hidden');

            $('#criteria-form').on('submit', function(event) {
                event.preventDefault();
                const avgE = $('#avg-e').val();
                const laVolume = $('#la-volume').val();
                const trVelocity = $('#tr-velocity').val();

                evaluateCriteria(age, gender, avgE, laVolume, trVelocity);
            });
        }
    });

    function evaluateCriteria(age, gender, avgE, laVolume, trVelocity) {
        let criteriaPositive = 0;
        if (avgE > 14) criteriaPositive++;
        if (laVolume > 34) criteriaPositive++;
        if (trVelocity > 2.8) criteriaPositive++;

        $('#step2').addClass('hidden');

        if (criteriaPositive >= 2) {
            displayResults('Impaired diastolic function with elevated filling pressures');
        } else if (criteriaPositive === 1) {
            $('#step3').removeClass('hidden');

            $('#strain-form').on('submit', function(event) {
                event.preventDefault();
                const pumpStrain = $('#pump-strain').val();
                const reservoirStrain = $('#reservoir-strain').val();
                evaluateLAstrain(age, gender, pumpStrain, reservoirStrain);
            });
        } else {
            $('#step4').removeClass('hidden');

            $('#e-values-form').on('submit', function(event) {
                event.preventDefault();
                const septalE = parseFloat($('#septal-e').val());
                const lateralE = parseFloat($('#lateral-e').val());
                evaluateEValues(age, gender, septalE, lateralE);
            });
        }
    }

    function evaluateLAstrain(age, gender, pumpStrain, reservoirStrain) {
        $('#step3').addClass('hidden');

        if (pumpStrain >= 14 || reservoirStrain >= 30) {
            displayResults('Impaired diastolic function with elevated filling pressures');
        } else {
            $('#step4').removeClass('hidden');

            $('#e-values-form').on('submit', function(event) {
                event.preventDefault();
                const septalE = parseFloat($('#septal-e').val());
                const lateralE = parseFloat($('#lateral-e').val());
                evaluateEValues(age, gender, septalE, lateralE);
            });
        }
    }

    function evaluateEValues(age, gender, septalE, lateralE) {
        $('#step4').addClass('hidden');
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
    }

    function displayResults(result) {
        $('#result-text').text(result);
        $('#results').removeClass('hidden');
    }
});
