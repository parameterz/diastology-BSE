$(document).ready(function() {
    let state = {
        currentNode: 0,
        history: []
    };

    const decisionTree = [
        {
            id: 0,
            question: "Is the E to e' ratio (E/e') greater than 14?",
            yes: 1,
            no: 2
        },
        {
            id: 1,
            question: "Is the LA Volume index (LAVi) greater than 34?",
            yes: 3,
            no: 4
        },
        {
            id: 2,
            question: "Is the TR Velocity greater than 2.8?",
            yes: 3,
            no: 4
        },
        {
            id: 3,
            result: "Diastolic dysfunction present"
        },
        {
            id: 4,
            result: "Normal diastolic function"
        }
    ];

    function showNode(nodeId) {
        const node = decisionTree[nodeId];
        state.currentNode = nodeId;
        $('#questionContainer').empty();
        $('#result').hide();
        $('#yesButton').hide();
        $('#noButton').hide();

        if (node.question) {
            $('#questionContainer').text(node.question);
            $('#yesButton').show();
            $('#noButton').show();
        } else if (node.result) {
            $('#result').text(node.result).show();
        }

        $('#backButton').toggle(state.history.length > 0);
    }

    function navigateTo(nodeId) {
        state.history.push(state.currentNode);
        showNode(nodeId);
    }

    $('#yesButton').click(function() {
        const node = decisionTree[state.currentNode];
        navigateTo(node.yes);
    });

    $('#noButton').click(function() {
        const node = decisionTree[state.currentNode];
        navigateTo(node.no);
    });

    $('#backButton').click(function() {
        if (state.history.length > 0) {
            const previousNode = state.history.pop();
            showNode(previousNode);
        }
    });

    // Start at the root node
    showNode(0);
});
