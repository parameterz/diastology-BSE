$(document).ready(function() {
    let state = {
        currentQuestionIndex: 0,
        inputs: {},
        finalResultDisplayed: false
    };

    const decisionTree = [
        {
            id: "eToERatio",
            question: "What is the E/e' ratio?",
            options: [
                { text: "E/e' ratio > 14", value: "positive" },
                { text: "E/e' ratio < 14", value: "negative" },
                { text: "Not Available", value: "not available" }
            ]
        },
        {
            id: "laVolumeIndex",
            question: "What is the LA Volume index (LAVi)?",
            options: [
                { text: "LAVi > 34", value: "positive" },
                { text: "LAVi < 34", value: "negative" },
                { text: "Not Available", value: "not available" }
            ]
        },
        {
            id: "trVelocity",
            question: "What is the TR Velocity?",
            options: [
                { text: "TR Velocity > 2.8", value: "positive" },
                { text: "TR Velocity < 2.8", value: "negative" },
                { text: "Not Available", value: "not available" }
            ]
        },
        {
            id: "laStrain",
            question: "Assess LA strain:",
            options: [
                { text: "pump strain ≥14% OR reservoir strain ≥30%", value: "positive" },
                { text: "pump strain <14% OR reservoir strain <30%", value: "negative" }
            ]
        },
        {
            id: "lars",
            question: "LA Reservoir Strain",
            options: [
                { text: "LARs <18%", value: "positive" },
                { text: "LARs ≥18%", value: "negative" }
            ]
        },
        {
            id: "ageSpecificE",
            question: "Assess relaxation by age-specific e'",
            options: [
                { text: "e' > LLN", value: "positive" },
                { text: "e' < LLN", value: "negative" }
            ]
        },
        {
            id: "supplementaryParams",
            question: "Assess supplementary parameters: Ar-A duration >30 ms OR L-wave >20 cm/s",
            options: [
                { text: "≥1 positive", value: "positive" },
                { text: "None positive", value: "negative" }
            ]
        }
    ];

    function renderQuestion() {
        const questionData = decisionTree[state.currentQuestionIndex];
        $('#questionContainer').empty();
        const questionDiv = $(`<div class="question-block" data-node-id="${questionData.id}"></div>`);
        questionDiv.append(`<p>${questionData.question}</p>`);
        const select = $('<select class="responseSelect"></select>');
        select.append('<option value="" selected disabled>Select an option</option>');
        questionData.options.forEach(option => {
            select.append(`<option value="${option.value}">${option.text}</option>`);
        });
        if (state.inputs[questionData.id]) {
            select.val(state.inputs[questionData.id]);
        }
        questionDiv.append(select);
        $('#questionContainer').append(questionDiv);
        $('#backButton').prop('disabled', state.currentQuestionIndex === 0);
        $('#nextButton').prop('disabled', !state.inputs[questionData.id]);
    }

    $('#questionContainer').on('change', '.responseSelect', function() {
        const selectedValue = $(this).val();
        const currentNodeId = $(this).closest('.question-block').data('node-id');
        state.inputs[currentNodeId] = selectedValue;
        $('#nextButton').prop('disabled', false);
    });

    $('#backButton').click(function() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    });

    $('#nextButton').click(function() {
        if (state.currentQuestionIndex < decisionTree.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            evaluateState();
        }
    });

    function evaluateState() {
        const results = Object.values(state.inputs);
        const positiveCount = results.filter(value => value === "positive").length;
        const negativeCount = results.filter(value => value === "negative").length;
        const availableCount = results.filter(value => value !== "not available").length;

        if (availableCount < 2) {
            $('#result').text("Insufficient data").show();
            return;
        } else if (positiveCount >= 2) {
            $('#result').text("Impaired diastolic function with elevated filling pressures").show();
        } else if (negativeCount >= 2) {
            $('#result').text("Normal diastolic function").show();
        } else if (availableCount === 2 && positiveCount === 1) {
            $('#result').text("Impaired diastolic function with elevated filling pressures").show();
        } else {
            $('#result').text("Impaired diastolic function with elevated filling pressures").show();
        }
        $('#result').show();
        state.finalResultDisplayed = true;
    }

    renderQuestion(); // Initial render
});
