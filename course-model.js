const historyLength = 3

class Question {

  constructor (id, QuestionText, answerText, topic) {
    this.id = id
    this.questionText = QuestionText
    this.answerText = answerText
    this.topic = topic
    this.askCount = 0
    this.knowCount = 0
    this.knowRunCount = 0
    this.knowHistory = []
  }

  topicPath () {
    let topic = this.topic
    let path = [topic.name]
    topic = topic.parent
    while (topic !== null && topic.level !== 0) {
      path.unshift(topic.name)
      topic = topic.parent
    }
    return path
  }

  recordKnowIt () {
    this.askCount += 1
    this.knowCount += 1
    this.knowRunCount += 1
    this.knowHistory.unshift(true)
    while (this.knowHistory > historyLength) {
      this.knowHistory.pop()
    }
  }

  recordDontKnowIt () {
    this.askCount += 1
    this.knowRunCount = 0
    this.knowHistory.unshift(false)
    while (this.knowHistory > historyLength) {
      this.knowHistory.pop()
    }
  }

  /* TODO: Also update topic counts */
  /* TODO: Also track counts per day */
  /* TODO: Also write to local storage (for now, web service later on) */
}

class Topic {
  constructor (id, name, level, parent) {
    this.id = id
    this.name = name
    this.level = level
    this.parent = parent
    this.children = []
    this.allQuestions = []
    this.localQuestions = []
  }

  addChildTopic (childTopic) {
    this.children.push(childTopic)
  }

  addInheritedQuestion (question) {
    this.allQuestions.push(question)
    if (this.parent) {
      this.parent.addInheritedQuestion(question)
    }
  }

  addQuestion (question) {
    this.allQuestions.push(question)
    this.localQuestions.push(question)
    if (this.parent) {
      this.parent.addInheritedQuestion(question)
    }
  }

  get childTopics () {
    return this.children
  }

  pickRandomQuestion () {
    if (this.allQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.allQuestions.length)
      return this.allQuestions[randomIndex]
    } else {
      return null
    }
  }
}

class Course {
  constructor (id, courseName) {
    this.coursePseudoTopic = new Topic(id, courseName, 0, null)
    this.currentTopic = null
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = this.coursePseudoTopic
  }

  addTopic (id, topicName) {
    const topic = new Topic(id, topicName, 1, this.coursePseudoTopic)
    this.coursePseudoTopic.addChildTopic(topic)
    this.currentTopic = topic
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubTopic (id, subTopicName) {
    console.assert(this.currentTopic, 'Tried to add sub-topic without parent topic')
    const topic = new Topic(id, subTopicName, 2, this.currentTopic)
    this.currentTopic.addChildTopic(topic)
    this.currentSubTopic = topic
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubSubTopic (id, subSubTopicName) {
    console.assert(this.currentSubTopic, 'Tried to add sub-sub-topic without parent sub-topic')
    const topic = new Topic(id, subSubTopicName, 3, this.currentSubTopic)
    this.currentSubTopic.addChildTopic(topic)
    this.currentSubSubTopic = topic
    this.currentTopicAtAnyLevel = topic
  }

  addQuestion (id, questionText, answerText) {
    console.assert(this.currentTopicAtAnyLevel, 'Tried to add question without current topic')
    const question = new Question(id, questionText, answerText, this.currentTopicAtAnyLevel)
    this.currentTopicAtAnyLevel.addQuestion(question)
  }

  get name () {
    return this.coursePseudoTopic.name
  }

  get id () {
    return this.coursePseudoTopic.id
  }

  get topics () {
    return this.coursePseudoTopic.children
  }

  /* TODO: Also add parameters to restrict the set of candidate questions to a particular topic, sub-topic, sub-sub-topic */
  /* TODO: Add a pick context with strategy and history, so we can make the picking smarter, e.g. avoid repeated questions */
  pickRandomQuestion () {
    return this.coursePseudoTopic.pickRandomQuestion()
  }
}

if (typeof exports != 'undefined') {
  module.exports.Course = Course
}
