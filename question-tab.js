var answerVisible = false
var currentQuestion = null

const lowerCaseC = 'c'.charCodeAt(0)
const upperCaseC = 'C'.charCodeAt(0)
const lowerCaseV = 'v'.charCodeAt(0)
const upperCaseV = 'V'.charCodeAt(0)
const lowerCaseX = 'x'.charCodeAt(0)
const upperCaseX = 'X'.charCodeAt(0)

var currentQuestionNr = null
var currentQuestion = null

function showAnswer() {
  $('#answer').show()
  $('#show-answer-button').hide()
  $('#dont-know-button').show()
  $('#do-know-button').show()
  answerVisible = true
}

function hideAnswer() {
  $('#answer').hide()
  $('#show-answer-button').show()
  $('#dont-know-button').hide()
  $('#do-know-button').hide()
  answerVisible = false
}

function updateKnowHistoryTick(index) {
  const knowId = '#hist-know-' + index
  const dontKnowId = '#hist-dont-know-' + index
  if (currentQuestion.knowHistory.length > index) {
    if (currentQuestion.knowHistory[index]) {
      $(knowId).show()
      $(dontKnowId).hide()
    } else {
      $(knowId).hide()
      $(dontKnowId).show()
    }
  } else {
    $(knowId).hide()
    $(dontKnowId).hide()
  }
}

function nextQuestion() {
  hideAnswer()
  currentQuestion = course.pickRandomQuestion()
  $('#topic-for-question').text(currentQuestion.topicPath().join(' | '))
  $('#question-text').text(currentQuestion.questionText)
  $('#answer-text').text(currentQuestion.answerText)
  updateKnowHistoryTick(0)
  updateKnowHistoryTick(1)
  updateKnowHistoryTick(2)
}

function recordKnowIt() {
  if (currentQuestion !== null) {
    currentQuestion.recordKnowIt()
  }
  nextQuestion()
}

function recordDontKnowIt() {
  if (currentQuestion !== null) {
    currentQuestion.recordDontKnowIt()
  }
  nextQuestion()
}

function handleKeyPress(key) {
  if (answerVisible) {
    if ((key.which === lowerCaseX) || (key.which === upperCaseX)) {
      recordDontKnowIt()
    } else if ((key.which === lowerCaseV) || (key.which === upperCaseV)) {
      recordKnowIt()
    }
  } else {
    if ((key.which === lowerCaseC) || (key.which === upperCaseC)) {
      showAnswer()
    }
  }
}

function initQuestionTab() {
  nextQuestion()
  $(document).keypress(handleKeyPress)
}
