$(document).ready(function() {
    let state = {
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

    function appendNode(nodeId) {
        const node = decisionTree.find(n => n.id === nodeId);
        if (node && !$(`div[data-node-id='${nodeId}']`).length) {
            const questionDiv = $(`<div class="question-block" data-node-id="${nodeId}"></div>`);
            questionDiv.append(`<p>${node.question}</p>`);
            const select = $('<select class="responseSelect"></select>');
            select.append('<option value="" selected disabled>Select an option</option>');
            node.options.forEach((option, index) => {
                select.append(`<option value="${option.value}">${option.text}</option>`);
            });
            questionDiv.append(select);
            $('#questionContainer').append(questionDiv);
        }
    }

    $('#questionContainer').on('change', '.responseSelect', function() {
        const selectedValue = $(this).val();
        const parentDiv = $(this).closest('.question-block');
        const currentNodeId = parentDiv.data('node-id');

        state.inputs[currentNodeId] = selectedValue;

        // Clear subsequent steps
        const nodesToRemove = Object.keys(state.inputs).filter(id => id > currentNodeId);
        nodesToRemove.forEach(id => {
            delete state.inputs[id];
            $(`div[data-node-id='${id}']`).remove();
        });
        $('#result').hide(); // Hide the result if any

        state.finalResultDisplayed = false;

        // Re-evaluate the current state based on the inputs
        evaluateState();
    });

    function evaluateState() {
        if (state.finalResultDisplayed) return; // Prevent further evaluations if final result is displayed

        const results = Object.values(state.inputs);
        const positiveCount = results.filter(value => value === "positive").length;
        const negativeCount = results.filter(value => value === "negative").length;
        const availableCount = results.filter(value => value !== "not available").length;

        // Ensure all initial questions are answered before proceeding
        if (!state.inputs["eToERatio"] || !state.inputs["laVolumeIndex"] || !state.inputs["trVelocity"]) {
            return;
        }

        if (availableCount < 2) {
            $('#result').text("Insufficient data").show();
            state.finalResultDisplayed = true;
            return;
        } else if (positiveCount >= 2) {
            appendNode("laStrain"); // Assess LA strain
        } else if (negativeCount >= 2) {
            appendNode("ageSpecificE"); // Assess relaxation by age-specific e'
        } else if (availableCount === 2 && positiveCount === 1) {
            appendNode("laStrain"); // Assess LA strain
        } else {
            appendNode("laStrain"); // Assess LA strain
        }

        // Further branching based on subsequent questions
        const laStrain = state.inputs["laStrain"];
        if (laStrain) {
            if (laStrain === "negative") {
                $('#result').text("Impaired diastolic function with elevated filling pressures").show();
                state.finalResultDisplayed = true;
                return;
            } else {
                appendNode("lars"); // LARs <18%
            }
        }

        const lars = state.inputs["lars"];
        if (lars) {
            if (lars === "positive") {
                appendNode("ageSpecificE"); // Assess relaxation by age-specific e'
            } else {
                appendNode("supplementaryParams"); // Assess supplementary parameters
            }
        }

        const ageSpecificE = state.inputs["ageSpecificE"];
        if (ageSpecificE) {
            if (ageSpecificE === "positive") {
                $('#result').text("Normal diastolic function").show();
                state.finalResultDisplayed = true;
                return;
            } else {
                $('#result').text("Impaired diastolic function with normal filling pressures").show();
                state.finalResultDisplayed = true;
                return;
            }
        }

        const supplementaryParams = state.inputs["supplementaryParams"];
        if (supplementaryParams) {
            if (supplementaryParams === "positive") {
                $('#result').text("Impaired diastolic function with elevated filling pressures").show();
                state.finalResultDisplayed = true;
                return;
            } else {
                $('#result').text("If clinically indicated, exercise echo may be considered to investigate elevated filling pressures on exertion").show();
                state.finalResultDisplayed = true;
                return;
            }
        }
    }

    // Append all initial questions
    decisionTree.slice(0, 3).forEach(node => appendNode(node.id));
});
