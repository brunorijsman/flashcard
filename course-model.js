class Question {
  constructor (QuestionText, answerText, topic) {
    this.questionText = QuestionText
    this.answerText = answerText
    this.topic = topic
  }

  topicPath () {
    let topic = this.topic
    let concatenatedNames = topic.name
    topic = topic.parent
    while (topic !== null && topic.level !== 0) {
      concatenatedNames = topic.name + '  |  ' + concatenatedNames
      topic = topic.parent
    }
    return concatenatedNames
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
      return null
    }
  }

  get nrQuestions () {
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

  get nrQuestions () {
    return this.questionSet.nrQuestions()
  }
}

class Course {
  constructor (courseName) {
    this.coursePseudoTopic = new Topic(courseName, 0, null)
    this.currentTopic = null
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = this.coursePseudoTopic
  }

  addTopic (topicName) {
    const topic = new Topic(topicName, 1, this.coursePseudoTopic)
    this.coursePseudoTopic.addChildTopic(topic)
    this.currentTopic = topic
    this.currentSubTopic = null
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubTopic (subTopicName) {
    console.assert(this.currentTopic, 'Tried to add sub-topic without parent topic')
    const topic = new Topic(subTopicName, 2, this.currentTopic)
    this.currentTopic.addChildTopic(topic)
    this.currentSubTopic = topic
    this.currentSubSubTopic = null
    this.currentTopicAtAnyLevel = topic
  }

  addSubSubTopic (subSubTopicName) {
    console.assert(this.currentSubTopic, 'Tried to add sub-sub-topic without parent sub-topic')
    const topic = new Topic(subSubTopicName, 3, this.currentSubTopic)
    this.currentSubTopic.addChildTopic(topic)
    this.currentSubSubTopic = topic
    this.currentTopicAtAnyLevel = topic
  }

  addQuestion (questionText, answerText) {
    console.assert(this.currentTopicAtAnyLevel, 'Tried to add question without current topic')
    const question = new Question(questionText, answerText, this.currentTopicAtAnyLevel)
    this.currentTopicAtAnyLevel.addQuestion(question)
  }

  get name () {
    return this.coursePseudoTopic.name
  }

  get topicNames () {
    const topicNames = []
    for (const topic of this.coursePseudoTopic.children) {
      topicNames.push(topic.name)
    }
    return topicNames
  }

  getSubTopicNames (topicIndex) {
    const topics = this.coursePseudoTopic.children
    const subTopics = topics[topicIndex].children
    const subTopicNames = []
    for (const subTopic of subTopics) {
      subTopicNames.push(subTopic.name)
    }
    return subTopicNames
  }

  /* TODO: There is a bug related to the sub-sub-topid dropdown menu */
  getSubSubTopicNames (topicIndex, subTopicIndex) {
    const topics = this.coursePseudoTopic.children
    const subTopics = topics[topicIndex].children
    const subSubTopics = subTopics[subTopicIndex].children
    const subSubTopicNames = []
    for (const subSubTopic of subSubTopics) {
      subSubTopicNames.push(subSubTopic.name)
    }
    return subSubTopicNames
  }

  /* TODO: Also add parameters to restrict the set of candidate questions to a particular topic, sub-topic, sub-sub-topic */
  /* TODO: Add a pick context with strategy and history, so we can make the picking smarter, e.g. avoid repeated questions */
  pickRandomQuestion () {
    return this.coursePseudoTopic.questionSet.pickRandomQuestion()
  }
}
