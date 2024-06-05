$(document).ready(function() {
    const steps = [
        {
            question: 'Does the patient have normal or abnormal LV systolic function, or atrial fibrillation?',
            options: ['Normal LV systolic function', 'Abnormal LV systolic function', 'Atrial fibrillation'],
            id: 'lvFunction'
        },
        // Normal LV systolic function steps
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the E/e\' value?',
            id: 'eE',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the LA Volume Index (ml/m^2)?',
            id: 'laVolume',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the TR Velocity (m/s)?',
            id: 'trVelocity',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Normal LV systolic function',
            question: 'What is the lateral e\' value?',
            id: 'ePrime',
            type: 'number'
        },
        // Abnormal LV systolic function steps
        {
            condition: (answers) => answers.lvFunction === 'Abnormal LV systolic function',
            question: 'What is the LVEF (%)?',
            id: 'lvef',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Abnormal LV systolic function',
            question: 'What is the Global Longitudinal Strain (GLS) (%)?',
            id: 'gls',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Abnormal LV systolic function',
            question: 'Does the patient have known myocardial disease?',
            options: ['Yes', 'No'],
            id: 'myocardialDisease'
        },
        // Atrial fibrillation steps
        {
            condition: (answers) => answers.lvFunction === 'Atrial fibrillation',
            question: 'What is the septal E/e\' value?',
            id: 'septalEE',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Atrial fibrillation',
            question: 'What is the Mitral E velocity (cm/sec)?',
            id: 'mitralEVelocity',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Atrial fibrillation',
            question: 'What is the E decel time (ms)?',
            id: 'eDecelTime',
            type: 'number'
        },
        {
            condition: (answers) => answers.lvFunction === 'Atrial fibrillation',
            question: 'What is the TR velocity (m/s)?',
            id: 'afTRVelocity',
            type: 'number'
        }
    ];

    let currentStepIndex = 0;
    let answers = {};

    function loadQuestion(stepIndex) {
        const questionContainer = $('#questionContainer');
        questionContainer.empty();

        const stepInfo = steps[stepIndex];
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

    function nextStep() {
        currentStepIndex++;
        const nextStepInfo = steps.find((step, index) => index > currentStepIndex && (!step.condition || step.condition(answers)));

        if (nextStepInfo) {
            currentStepIndex = steps.indexOf(nextStepInfo);
            loadQuestion(currentStepIndex);
        } else {
            // Complete evaluation based on the collected answers
            evaluate();
        }
    }

    function evaluate() {
        // Implement evaluation logic based on collected answers
        $('#result').text('Evaluation completed with results: ' + JSON.stringify(answers));
    }

    $('#evaluationForm').on('submit', function(event) {
        event.preventDefault();
        const currentStepInfo = steps[currentStepIndex];
        const answer = $(`[name=${currentStepInfo.id}]`).val();

        answers[currentStepInfo.id] = answer;

        nextStep();
    });

    loadQuestion(currentStepIndex);
});
