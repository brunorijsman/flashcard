const notAskedColor = '#cccccc'     // Light grey
const notKnownColor = '#d92626'     // Red
const knownColor = '#4d7722'        // Light green
const wellKnownColor = '#334f17'    // Dark green

function initProgressTab () {
}

function showCurrentQuestionStateChart () {
  // TODO: Say *which* topics in title
  let notAskedCount = 0
  let notKnownCount = 0
  let knownCount = 0
  let wellKnownCount = 0
  for (question of activeQuestions) {
    if (question.askCount == 0) {
      notAskedCount += 1
    } else if (question.knowRunCount >= 3) {
      wellKnownCount += 1
    } else if (question.knowCount >= 1) {
      knownCount += 1
    } else {
      notKnownCount += 1
    }
  }
  const chart = new Chart(document.getElementById('pie-chart'), {
    type: 'pie',
    data: {
      labels: ['Not asked', 'Not known', 'Known', 'Well known'],
      datasets: [{
        label: 'Current state of questions',
        backgroundColor: [notAskedColor, notKnownColor, knownColor, wellKnownColor],
        data: [notAskedCount, notKnownCount, knownCount, wellKnownCount]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Current state of questions'
      }
    }
  });
}

function selectProgressTab () {
  showCurrentQuestionStateChart()
}
