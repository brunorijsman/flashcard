var answerVisible = false

const lowerCaseC = 'c'.charCodeAt(0)
const upperCaseC = 'C'.charCodeAt(0)
const lowerCaseV = 'v'.charCodeAt(0)
const upperCaseV = 'V'.charCodeAt(0)
const lowerCaseX = 'x'.charCodeAt(0)
const upperCaseX = 'X'.charCodeAt(0)

const questions = [
  { q: 'What skin pattern does a zebra have?', a: 'Stripes.' },
  { q: 'Who is the president of the United States?', a: 'Donald Trump.' },
  { q: 'How many eggs are there in a dozen?', a: 'Twelve' }
]
var currentQuestionNr = null
var currentQuestion = null

function showAnswer () {
  $('#answer').show()
  $('#show-answer-button').hide()
  $('#dont-know-button').show()
  $('#do-know-button').show()
  answerVisible = true
}

function hideAnswer () {
  $('#answer').hide()
  $('#show-answer-button').show()
  $('#dont-know-button').hide()
  $('#do-know-button').hide()
  answerVisible = false
}

function nextQuestion () {
  hideAnswer()
  const question = course.pickRandomQuestion()
  $('#question-text').text(question.questionText)
  $('#answer-text').text(question.answerText)
}

function recordKnowIt () {
  /* TODO: record the result */
  nextQuestion()
}

function recordDontKnowIt () {
  /* TODO: record the result */
  nextQuestion()
}

function handleKeyPress (key) {
  if ((key.which === lowerCaseX) || (key.which === upperCaseX)) {
    recordDontKnowIt()
  } else if ((key.which === lowerCaseC) || (key.which === upperCaseC)) {
    showAnswer()
  } else if ((key.which === lowerCaseV) || (key.which === upperCaseV)) {
    recordKnowIt()
  }
}

function initQuestionTab () {
  nextQuestion()
  $(document).keypress(handleKeyPress)
}
