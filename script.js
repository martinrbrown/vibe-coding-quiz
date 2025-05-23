let currentQuestionIndex = 0;
let questions = [];

async function loadQuestions() {
    try {
        const response = await fetch('default.json');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        document.getElementById('quiz').innerText = 'Failed to load quiz data.';
    }
}

function showQuestion() {
    const quizDiv = document.getElementById('quiz');
    const question = questions[currentQuestionIndex];
    let html = `<div role="group" aria-labelledby="q${currentQuestionIndex}">
                    <p id="q${currentQuestionIndex}">${question.question}</p>`;
    question.options.forEach((opt, i) => {
        html += `<label><input type="radio" name="q" value="${i}" aria-checked="false">${opt}</label>`;
    });
    html += `<button onclick="submitAnswer()">Submit</button></div>
             <div id="feedback" class="feedback" aria-live="assertive"></div>`;
    quizDiv.innerHTML = html;
    document.getElementById('nextBtn').classList.add('hidden');
}

function submitAnswer() {
    const radios = document.getElementsByName('q');
    let selected = -1;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selected = parseInt(radios[i].value);
            break;
        }
    }

    const feedbackDiv = document.getElementById('feedback');
    if (selected === -1) {
        feedbackDiv.textContent = 'Please select an option.';
        return;
    }

    const question = questions[currentQuestionIndex];
    feedbackDiv.textContent = selected === question.correct ? question.feedback.correct : question.feedback.incorrect;
    document.getElementById('nextBtn').classList.remove('hidden');
    document.getElementById('nextBtn').onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            document.getElementById('quiz').innerHTML = '<p>Quiz complete! Thanks for participating.</p>';
            document.getElementById('nextBtn').classList.add('hidden');
        }
    };
}

window.onload = loadQuestions;