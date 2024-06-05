$(document).ready(function() {
    const steps = [
        {
            question: 'Does the patient have normal or abnormal LV systolic function, or atrial fibrillation?',
            options: ['Normal LV systolic function', 'Abnormal LV systolic function', 'Atrial fibrillation'],
            id: 'lvFunction',
            nextStep: function(answers) {
                if (answers.lvFunction === 'Normal LV systolic function') {
                    return 'age';
                } else if (answers.lvFunction === 'Abnormal LV systolic function') {
                    return 'lvef';
                } else if (answers.lvFunction === 'Atrial fibrillation') {
                    return 'septalEE';
                }
            }
        },
        {
            question: 'What is the patient\'s age?',
            id: 'age',
            type: 'number',
            nextStep: function(answers) {
                if (answers.age >= 18 && answers.age <= 40) {
                    return 'gender';
                } else {
                    return 'eE';
                }
            }
        },
        {
            question: 'What is the patient\'s gender?',
            options: ['Male', 'Female'],
            id: 'gender',
            nextStep: 'eE'
        },
        // Normal LV systolic function steps
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the E/e\' value?',
            id: 'eE',
            type: 'number',
            nextStep: function(answers) {
                if (answers.eE < 14) {
                    return 'laVolume';
                } else {
                    return 'laVolume';  // Continue to next step for simplicity
                }
            }
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the LA Volume Index (ml/m^2)?',
            id: 'laVolume',
            type: 'number',
            nextStep: function(answers) {
                if (answers.eE < 14 && answers.laVolume < 34) {
                    return 'evaluateEarly';
                } else {
                    return 'trVelocity';
                }
            }
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the TR Velocity (m/s)?',
            id: 'trVelocity',
            type: 'number',
            nextStep: 'ePrime'
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the lateral e\' value?',
            id: 'ePrime',
            type: 'number',
            nextStep: 'evaluateNormal'
        },
        // Abnormal LV systolic function steps
        {
            question: 'What is the LVEF (%)?',
            id: 'lvef',
            type: 'number',
            nextStep: 'gls'
        },
        {
            question: 'What is the Global Longitudinal Strain (GLS) (%)?',
            id: 'gls',
            type: 'number',
            nextStep: 'myocardialDisease'
        },
        {
            question: 'Does the patient have known myocardial disease?',
            options: ['Yes', 'No'],
            id: 'myocardialDisease',
            nextStep: 'eEAbnormal'
        },
        {
            question: 'What is the E/e\' value?',
            id: 'eEAbnormal',
            type: 'number',
            nextStep: 'laVolumeAbnormal'
        },
        {
            question: 'What is the LA Volume Index (ml/m^2)?',
            id: 'laVolumeAbnormal',
            type: 'number',
            nextStep: 'trVelocityAbnormal'
        },
        {
            question: 'What is the TR Velocity (m/s)?',
            id: 'trVelocityAbnormal',
            type: 'number',
            nextStep: 'evaluateAbnormal'
        },
        // Atrial fibrillation steps
        {
            question: 'What is the septal E/e\' value?',
            id: 'septalEE',
            type: 'number',
            nextStep: 'mitralEVelocity'
        },
        {
            question: 'What is the Mitral E velocity (cm/sec)?',
            id: 'mitralEVelocity',
            type: 'number',
            nextStep: 'eDecelTime'
        },
        {
            question: 'What is the E decel time (ms)?',
            id: 'eDecelTime',
            type: 'number',
            nextStep: 'afTRVelocity'
        },
        {
            question: 'What is the TR velocity (m/s)?',
            id: 'afTRVelocity',
            type: 'number',
            nextStep: 'laReservoirStrain'
        },
        {
            question: 'What is the LA Reservoir Strain (%)?',
            id: 'laReservoirStrain',
            type: 'number',
            nextStep: 'bmi'
        },
        {
            question: 'What is the BMI (kg/m^2)?',
            id: 'bmi',
            type: 'number',
            nextStep: 'pvSDRatioAF'
        },
        {
            question: 'What is the Pulmonary Venous S/D Ratio?',
            id: 'pvSDRatioAF',
            type: 'number',
            nextStep: 'evaluateAF'
        }
    ];

    let currentStepIndex = 0;
    let answers = {};

    function loadQuestion(stepIndex) {
        const questionContainer = $('#questionContainer');
        questionContainer.empty();

        const stepInfo = steps[stepIndex];
        console.log('Loading question:', stepInfo.question);  // Debugging statement
        const question = $('<label>').text(stepInfo.question);
        questionContainer.append(question);

        if (stepInfo.type === 'number') {
            const input = $('<input>').attr('type', 'number').attr('id', stepInfo.id).attr('name', stepInfo.id).attr('step', '0.1').attr('required', true);
            questionContainer.append(input);
        } else if (stepInfo.options) {
            stepInfo.options.forEach(option => {
                const label = $('<label>').text(option);
                const input = $('<input>').attr('type', 'radio').attr('name', stepInfo.id).attr('value', option).attr('required', true);
                questionContainer.append(input).append(label);
            });
        }
    }

    function evaluate() {
        let result = '';

        console.log('Evaluating answers:', answers);  // Debugging statement

        if (answers.lvFunction === 'Normal LV systolic function') {
            const { eE, laVolume, trVelocity, ePrime, age, gender } = answers;

            // Determine normal e' based on age and gender
            let normalEPrime;
            if (age >= 18 && age <= 40) {
                normalEPrime = gender === 'Male' ? 9 : 11;
            } else if (age >= 41 && age <= 65) {
                normalEPrime = 6;
            } else if (age > 65) {
                normalEPrime = 5;
            }

            if (eE < 14 && laVolume < 34 && trVelocity < 2.8) {
                if (ePrime >= normalEPrime) {
                    result = 'Normal diastolic function';
                } else {
                    result = 'Impaired diastolic function with normal filling pressures';
                }
            } else if (eE < 14 && laVolume < 34) {
                result = '2 criteria negative: Normal diastolic function';
            } else if (eE < 14) {
                result = '1 criterion negative: Indeterminate diastolic function';
            } else {
                result = 'Impaired diastolic function';
            }
        } else if (answers.lvFunction === 'Abnormal LV systolic function') {
            const { eEAbnormal, laVolumeAbnormal, trVelocityAbnormal, ePrime } = answers;
            if (eEAbnormal > 14 || laVolumeAbnormal > 34 || trVelocityAbnormal > 2.8) {
                result = 'Impaired diastolic function with elevated filling pressures';
            } else if (ePrime >= 10) {
                result = 'Normal diastolic function';
            } else {
                result = 'Impaired diastolic function with normal filling pressures';
            }
        } else if (answers.lvFunction === 'Atrial fibrillation') {
            const { septalEE, mitralEVelocity, eDecelTime, afTRVelocity, laReservoirStrain, bmi, pvSDRatioAF } = answers;
            if (septalEE > 11 || mitralEVelocity >= 100 || eDecelTime <= 160 || afTRVelocity > 2.8) {
                result = 'Impaired diastolic function with elevated filling pressures';
            } else if (laReservoirStrain < 16 || bmi > 30 || pvSDRatioAF < 1) {
                result = 'Impaired diastolic function with normal filling pressures';
            } else {
                result = 'Normal filling pressures';
            }
        }

        $('#result').text('Evaluation completed: ' + result);
    }

    function nextStep() {
        const currentStep = steps[currentStepIndex];
        let nextStepId;

        if (typeof currentStep.nextStep === 'function') {
            nextStepId = currentStep.nextStep(answers);
        } else {
            nextStepId = currentStep.nextStep;
        }

        console.log('Next step ID:', nextStepId);  // Debugging statement

        if (nextStepId === 'evaluateEarly') {
            evaluate();
            return;
        }

        currentStepIndex = steps.findIndex(step => step.id === nextStepId);

        if (currentStepIndex !== -1) {
            loadQuestion(currentStepIndex);
        } else {
            evaluate();
        }
    }

    $('#evaluationForm').on('submit', function(event) {
        event.preventDefault();
        const currentStepInfo = steps[currentStepIndex];
        const answer = $(`[name=${currentStepInfo.id}]`).val();
        answers[currentStepInfo.id] = answer;

        console.log('Current answers:', answers);  // Debugging statement

        nextStep();
    });

    loadQuestion(currentStepIndex);
});
