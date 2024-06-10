$(document).ready(function() {
    let state = {
        currentQuestionIndex: 0,
        inputs: {},
        finalResultDisplayed: false
    };

    const decisionTree = [
        {
            id: "initial",
            questions: [
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
                }
            ]
        },
        {
            id: "ageSpecificE",
            question: "Assess relaxation by age-specific e'",
            options: [
                { text: "e' > LLN", value: "negative" },
                { text: "e' < LLN", value: "positive" }
            ]
        },
        {
            id: "laStrain",
            question: "Assess LA strain:",
            options: [
                { text: "pump strain ≥14% OR reservoir strain ≥30%", value: "negative" },
                { text: "pump strain <14% OR reservoir strain <30%", value: "positive" }
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
            id: "supplementaryParams",
            question: "Assess supplementary parameters: ",
            options: [
                { text: "Ar-A duration >30 ms OR L-wave >20 cm/s", value: "positive" },
                { text: "Ar-A duration <30 ms AND L-wave <20 cm/s", value: "negative" }
            ]
        }
    ];

    function renderInitialQuestions() {
        const initialQuestions = decisionTree[0].questions;
        $('#questionContainer').empty();
        initialQuestions.forEach(questionData => {
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
        });
        $('#backButton').prop('disabled', state.currentQuestionIndex === 0);
        $('#nextButton').prop('disabled', !initialQuestions.every(q => state.inputs[q.id]));
    }

    function renderQuestion() {
        if (state.currentQuestionIndex === 0) {
            renderInitialQuestions();
            return;
        }

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

        if (state.currentQuestionIndex === 0) {
            const initialQuestions = decisionTree[0].questions;
            $('#nextButton').prop('disabled', !initialQuestions.every(q => state.inputs[q.id]));
        } else {
            $('#nextButton').prop('disabled', false);
        }
    });

    $('#backButton').click(function() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    });

    $('#nextButton').click(function() {
        if (state.currentQuestionIndex === 0) {
            evaluateInitialQuestions();
        } else {
            evaluateState();
        }
    });

    function evaluateInitialQuestions() {
        const initialResults = decisionTree[0].questions.map(q => state.inputs[q.id]);
        const positiveCount = initialResults.filter(value => value === "positive").length;
        const negativeCount = initialResults.filter(value => value === "negative").length;
        const availableCount = initialResults.filter(value => value !== "not available").length;

        if (positiveCount >= 2) {
            displayResult("result-impaired-elevated");
        } else if (negativeCount >= 2) {
            state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "ageSpecificE");
            renderQuestion();
        } else if (availableCount === 2 && positiveCount === 1) {
            state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "laStrain");
            renderQuestion();
        }
    }

    function evaluateState() {
        const questionData = decisionTree[state.currentQuestionIndex];
        const result = state.inputs[questionData.id];

        if (questionData.id === "ageSpecificE") {
            if (result === "positive") {
                displayResult("result-impaired");
            } else {
                displayResult("result-normal");
            }
        } else if (questionData.id === "laStrain") {
            if (result === "positive") {
                state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "lars");
                renderQuestion();
            } else {
                state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "ageSpecificE");
                renderQuestion();
            }
        } else if (questionData.id === "lars") {
            if (result === "positive") {
                displayResult("result-impaired-elevated");
            } else {
                state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "supplementaryParams");
                renderQuestion();
            }
        } else if (questionData.id === "supplementaryParams") {
            if (result === "positive") {
                displayResult("result-impaired-elevated");
            } else {
                state.currentQuestionIndex = decisionTree.findIndex(q => q.id === "ageSpecificE");
                renderQuestion();
            }
        }
    }

    function displayResult(resultId) {
        $('.result').hide();
        $('#' + resultId).show();
        state.finalResultDisplayed = true;
    }

    renderInitialQuestions(); // Initial render
});
