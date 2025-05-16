document.addEventListener("DOMContentLoaded", function () {
    fetch("default.json")
        .then(response => response.json())
        .then(data => {
            const quizContainer = document.getElementById("quiz-questions");
            data.questions.forEach((question, index) => {
                const questionBlock = document.createElement("div");
                questionBlock.classList.add("quiz-question");
                questionBlock.innerHTML = `
                    <h2>${question.text}</h2>
                    ${question.options.map((option, i) => `
                        <label>
                            <input type="radio" name="question-${index}" value="${i}" required>
                            ${option}
                        </label>
                    `).join('')}
                `;
                quizContainer.appendChild(questionBlock);
            });
        })
        .catch(error => console.error("Error loading quiz data:", error));

    document.getElementById("quiz-form").addEventListener("submit", function (event) {
        event.preventDefault();
        fetch("default.json")
            .then(response => response.json())
            .then(data => {
                const formData = new FormData(event.target);
                let score = 0;
                const feedbackMessages = [];
                data.questions.forEach((question, index) => {
                    const selectedOption = formData.get(`question-${index}`);
                    if (selectedOption == question.answer) {
                        score++;
                        feedbackMessages.push(`✅ ${question.feedback.correct}`);
                    } else {
                        feedbackMessages.push(`❌ ${question.feedback.incorrect}`);
                    }
                });
                const feedbackElement = document.getElementById("quiz-feedback");
                feedbackElement.innerHTML = `You scored ${score} out of ${data.questions.length}.<br><br>${feedbackMessages.join('<br>')}`;
            })
            .catch(error => console.error("Error processing quiz results:", error));
    });
});
