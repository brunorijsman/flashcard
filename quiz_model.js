class Question {
  constructor (topic, QuestionText, answerText) {
    this.topic = topic
    this.questionText = QuestionText
    this.answerText = answerText
  }
}

class QuestionSet {
  constructor () {
    this.questions = []
  }

  addQuestion (question) {
    this.questions.push(question)
  }

  pickRandomQuestion () {
    if (this.questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.questions.length)
      return this.questions[randomIndex]
    } else {
      return undefined
    }
  }

  nrQuestions() {
    return this.questions.length()
  }
}

class Topic {
  constructor (name, level, parent) {
    this.name = name
    this.level = level
    this.parent = parent
    this.children = []
    this.questionSet = new QuestionSet()
  }

  addChildTopic (childTopic) {
    this.children.push(childTopic)
  }

  addQuestion (question) {
    this.questionSet.addQuestion(question)
    if (this.parent) {
      this.parent.addQuestion(question)
    }
  }

  nrQuestions () {
    return this.questionSet.nrQuestions()
  }
}

class Quiz {
  constructor (quizName) {
    this.quizPseudoTopic = Topic(quizName, 0, null)
    this.currentTopic = null
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = this.quizPseudoTopic
  }

  addTopic (topicName) {
    const topic = new Topic(topicName, 1, this.quizPseudoTopic)
    this.quizPseudoTopic.addChildTopic(topic)
    this.currentTopic = topic
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubTopic (subTopicName) {
    assert(this.currentTopic, 'Tried to add sub-topic without parent topic')
    const topic = new Topic(subTopicName, 2, this.currentTopic)
    this.currentTopic.addChildTopic(topic)
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubSubTopic (subSubTopicName) {
    assert(this.currentSubTopic, 'Tried to add sub-sub-topic without parent sub-topic')
    const topic = new Topic(subSubTopicName, 3, this.currentSubTopic)
    this.currentSubTopic.addChildTopic(topic)
    this.currentSubSubTopic = topic
    this.currentTopicAtAnyLevel = topic
  }

  addQuestion (questText, answerText) {
    assert(this.currentTopicAtAnyLevel, 'Tried to add question without current topic')
    question = new Question(this.currentTopicAtAnyLevel)
    this.currentTopicAtAnyLevel.addQuestion(question)
  }
}
