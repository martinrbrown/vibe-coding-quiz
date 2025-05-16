document.addEventListener("DOMContentLoaded", () => {
    // Extract the topic parameter from the URL (e.g., ?topic=cybersecurity)
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get("topic") || "default";
    const questionsFile = `${topic}.json`;

    // Fetch the correct questions file based on the topic
    fetch(questionsFile)
        .then(response => response.json())
        .then(questions => {
            let currentQuestionIndex = 0;
            let selectedAnswerIndex = null;

            function showQuestion(questionObj) {
                const questionElement = document.getElementById("question");
                const answersElement = document.getElementById("answers");
                const submitButton = document.getElementById("submit-button");
                const nextButton = document.getElementById("next-button");
                const feedbackElement = document.getElementById("feedback");

                questionElement.textContent = questionObj.question;
                answersElement.innerHTML = "";
                feedbackElement.textContent = "";
                selectedAnswerIndex = null;
                submitButton.disabled = true;
                nextButton.disabled = true;

                questionObj.answers.forEach((answer, index) => {
                    const li = document.createElement("li");
                    const label = document.createElement("label");
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = "answer";
                    input.value = index;
                    input.addEventListener("change", () => {
                        selectedAnswerIndex = index;
                        submitButton.disabled = false;
                    });

                    label.appendChild(input);
                    label.appendChild(document.createTextNode(" " + answer.text));
                    li.appendChild(label);
                    answersElement.appendChild(li);
                });
            }

            document.getElementById("submit-button").addEventListener("click", () => {
                const question = questions[currentQuestionIndex];
                const selectedAnswer = question.answers[selectedAnswerIndex];
                const feedbackElement = document.getElementById("feedback");
                const nextButton = document.getElementById("next-button");

                feedbackElement.textContent = selectedAnswer.feedback;
                if (selectedAnswer.correct) {
                    nextButton.disabled = false;
                }
            });

            document.getElementById("next-button").addEventListener("click", () => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(questions[currentQuestionIndex]);
                } else {
                    const quizContainer = document.querySelector(".quiz-container");
                    quizContainer.innerHTML = "<h2>Quiz Complete!</h2><p>Thanks for playing!</p>";
                }
            });

            // Start the quiz with the first question
            showQuestion(questions[currentQuestionIndex]);
        })
        .catch(error => {
            console.error("Error loading questions:", error);
            const quizContainer = document.querySelector(".quiz-container");
            quizContainer.innerHTML = `<h2>Error Loading Quiz</h2><p>Could not load the quiz for topic: ${topic}</p>`;
        });
});
