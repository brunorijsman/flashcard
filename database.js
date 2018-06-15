
function questionKeyStr (question) {
  // TODO: Also encode a global course ID into the question key for when we have more courses in the future
  return 'qs' + String(question.id).padStart(5, '0')
}

function writeOneQuestionStats (question) {
  const keyStr = questionKeyStr(question)
  const value = {
    a: question.askCount,
    k: question.knowCount,
    r: question.knowRunCount,
    h: question.knowHistory.map(v => v ? 1 : 0)
  }
  const valueStr = JSON.stringify(value)
  console.info('Write key="' + keyStr + '", value="' + valueStr + '"')
  localStorage.setItem(keyStr, valueStr)
}

function readOneQuestionStats (questions) {
  const keyStr = questionKeyStr(question)
  const valueStr = localStorage.getItem(keyStr)
  if (valueStr) {
    try {
      const value = JSON.parse(valueStr)
      console.info('Read key="' + keyStr + '", value="' + valueStr + '"')
      question.askCount = value.a
      question.knowCount = value.k
      question.knowRunCount = value.r
      question.knowHistory = value.h.map(v => v ? true : false)
    } catch (error) {
      console.error("cannot parse " + valueStr)
      /* Ignore */
    }
  }
}

function readAllQuestionsStats (questions) {
  for (question of questions) {
    readOneQuestionStats (question)
  }
}
