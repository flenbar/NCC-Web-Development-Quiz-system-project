const questions = [
  {
    question: "Which Ethiopian emperor famously defeated the Italian army at the Battle of Adwa in 1896?",
    answers: [
      { text: "Emperor Yohannes IV", correct: false },
      { text: "Emperor Menelik II", correct: true },
      { text: "Emperor Haile Selassie", correct: false },
      { text: "Emperor Tewodros II", correct: false }
    ]
  },
  {
    question: "What is the ancient capital city of Ethiopia, famous for its towering stone obelisks (stelae)?",
    answers: [
      { text: "Lalibela", correct: false },
      { text: "Aksum", correct: true },
      { text: "Gondar", correct: false },
      { text: "Harar", correct: false }
    ]
  },
  {
    question: "Which 12th-century Ethiopian king is credited with building rock-hewn churches?",
    answers: [
      { text: "King Lalibela", correct: true },
      { text: "King Kaleb", correct: false },
      { text: "King Ezana", correct: false },
      { text: "King Fasilides", correct: false }
    ]
  },
  {
    question: "Who was the last reigning emperor of Ethiopia's Solomonic Dynasty?",
    answers: [
      { text: "Iyasu V", correct: false },
      { text: "Menelik II", correct: false },
      { text: "Haile Selassie", correct: true },
      { text: "Tewodros II", correct: false }
    ]
  },
  {
    question: "Which king made Christianity the state religion of Ethiopia?",
    answers: [
      { text: "King Ezana", correct: true },
      { text: "King Kaleb", correct: false },
      { text: "King Armah", correct: false },
      { text: "King Bazen", correct: false }
    ]
  },
  {
    question: "Historic capital with castles in the 17th century?",
    answers: [
      { text: "Addis Ababa", correct: false },
      { text: "Gondar", correct: true },
      { text: "Mekelle", correct: false },
      { text: "Dire Dawa", correct: false }
    ]
  },
  {
    question: "Famous fossil discovered in Ethiopia (1974)?",
    answers: [
      { text: "Ardi", correct: false },
      { text: "Selam", correct: false },
      { text: "Lucy (Dinknesh)", correct: true },
      { text: "Taung Child", correct: false }
    ]
  },
  {
    question: "Battle marking start of Tewodros II unification?",
    answers: [
      { text: "Adwa", correct: false },
      { text: "Derezge", correct: true },
      { text: "Gundet", correct: false },
      { text: "Chelenqo", correct: false }
    ]
  },
  {
    question: "Walled city with 99 mosques?",
    answers: [
      { text: "Harar", correct: true },
      { text: "Jijiga", correct: false },
      { text: "Jimma", correct: false },
      { text: "Alitena", correct: false }
    ]
  },
  {
    question: "Empress who played key role at Adwa?",
    answers: [
      { text: "Zewditu", correct: false },
      { text: "Taytu Betul", correct: true },
      { text: "Menen Asfaw", correct: false },
      { text: "Eleni", correct: false }
    ]
  }
];

const questionElement = document.querySelector(".question");
const timerElement = document.querySelector(".timer");
const answerbuttons = document.querySelector(".answerbuttons");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const progressBar = document.querySelector(".progress-bar");
const questionCount = document.querySelector(".question-count");

let currentIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let userAnswers = new Array(questions.length).fill(null);
let answered = new Array(questions.length).fill(false);

if (localStorage.getItem("quiz")) {
  const data = JSON.parse(localStorage.getItem("quiz"));
  currentIndex = data.currentIndex || 0;
  score = data.score || 0;
  userAnswers = data.userAnswers || userAnswers;
  answered = data.answered || answered;
}

startQuiz();

function startQuiz() {
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);

  const q = questions[currentIndex];

  questionCount.innerText = `Question ${currentIndex + 1} of ${questions.length}`;

  progressBar.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  questionElement.innerText = q.question;

  answerbuttons.innerHTML = "";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.classList.add("ans-btn");
    btn.innerText = ans.text;

    if (answered[currentIndex]) {
      btn.disabled = true;
    }

    if (userAnswers[currentIndex] === ans.text) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(ans, btn);

    answerbuttons.appendChild(btn);
  });

  updateNav();
  startTimer();
  save();
}

function selectAnswer(ans, btn) {
  if (answered[currentIndex]) return;

  clearInterval(timer);

  userAnswers[currentIndex] = ans.text;
  answered[currentIndex] = true;

  const buttons = document.querySelectorAll(".ans-btn");

  buttons.forEach(b => b.disabled = true);

  if (ans.correct) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("wrong");
    buttons.forEach(b => {
      if (b.innerText === getCorrectAnswer()) {
        b.classList.add("correct");
      }
    });
  }

  save();

  setTimeout(() => {
    nextQuestion();
  }, 1000);
}

function getCorrectAnswer() {
  return questions[currentIndex].answers.find(a => a.correct).text;
}

function startTimer() {
  timeLeft = 30;

  timerElement.classList.remove("timer-warning");

  timerElement.innerText = `Time Left: ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;

    timerElement.innerText = `Time Left: ${timeLeft}`;

    if (timeLeft <= 10) {
      timerElement.classList.add("timer-warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSkip();
    }
  }, 1000);
}

function autoSkip() {
  if (!answered[currentIndex]) {
    userAnswers[currentIndex] = null;
    answered[currentIndex] = false;
  }
  nextQuestion();
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

nextBtn.onclick = nextQuestion;
prevBtn.onclick = prevQuestion;

function updateNav() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === questions.length - 1;
}

function showResult() {
  clearInterval(timer);

  let correct = score;
  let incorrect = userAnswers.filter((a, i) => a && !questions[i].answers.find(x => x.text === a)?.correct).length;
  let unanswered = userAnswers.filter(a => a === null).length;

  let percent = Math.round((correct / questions.length) * 100);

  let message = "";
  if (percent <= 40) message = "Needs Improvement";
  else if (percent <= 70) message = "Good Effort";
  else if (percent <= 90) message = "Great Work";
  else message = "Excellent";

  document.querySelector(".container").innerHTML = `
    <div class="result-box">
      <h2>Quiz Completed</h2>
      <p>Score: ${correct}/${questions.length}</p>
      <p>Correct: ${correct}</p>
      <p>Incorrect: ${incorrect}</p>
      <p>Unanswered: ${unanswered}</p>
      <p>Percentage: ${percent}%</p>
      <h3>${message}</h3>
      <button onclick="location.reload()">Restart Quiz</button>
    </div>
  `;

  localStorage.removeItem("quiz");
}

function save() {
  localStorage.setItem(
    "quiz",
    JSON.stringify({
      currentIndex,
      score,
      userAnswers,
      answered
    })
  );
}
