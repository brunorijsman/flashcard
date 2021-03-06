if (typeof exports != 'undefined') {
  const courseModel = require('./course-model.js')
  Course = courseModel.Course
}

class Parser {
  reset() {
    this.definition = null
    this.line = null
    this.lineNr = null
    this.tag = null
    this.arg = null
    this.pushedBack = false
    this.course = null
    this.topicName = null
    this.subTopicName = null
    this.subSubTopicName = null
    this.allowMissingAnnotations = true
    this.storedNextId = null
    this.nextId = 1
    this.nrMissingAnnotations = 0
  }

  constructor() {
    this.reset()
  }

  fatalError(errorMsg) {
    console.error('Error   :', errorMsg)
    console.error('File    :', this.fileName)
    console.error('Line nr :', this.lineNr)
    console.error('Line    :', this.line)
    throw new Error(errorMsg)
  }

  nextCommand() {
    if (this.pushedBack) {
      this.pushedBack = false
      console.assert(this.tag, 'Missing pushed-back tag')
      return true
    }
    let line = null
    while (true) {
      if (this.lineNr >= this.definition.length) {
        return false
      }
      line = this.definition[this.lineNr].trim()
      this.lineNr += 1
      if (line !== '' && line[0] !== '#') {
        this.line = line
        break
      }
    }
    const split = line.split(':')
    if (split.length === 1) {
      this.fatalError('Syntax error, missing :')
    }
    this.tag = split[0].trim().toLowerCase()
    split.shift()
    this.arg = split.join(':').trim()
    return true
  }

  mandatoryNextCommand(expectedCommands, errorMsg) {
    if (!this.nextCommand()) {
      this.fatalError(errorMsg)
    }
    if (!expectedCommands.includes(this.tag)) {
      this.fatalError(errorMsg)
    }
  }

  optionalNextCommand(expectedCommands) {
    if (!this.nextCommand()) {
      return false
    }
    if (expectedCommands.includes(this.tag)) {
      return true
    }
    this.prevCommand()
    return false
  }

  prevCommand() {
    console.assert(!this.pushedBack, 'Only one push-back allowed')
    console.assert(this.tag != null, 'Nothing to push-back')
    this.pushedBack = true
  }

  allocateId() {
    const id = this.nextId
    this.nextId += 1
    return id
  }

  parseId() {
    if (this.optionalNextCommand(['id', 'i'])) {
      const id = parseInt(this.arg)
      if (this.storedNextId === null) {
        this.fatalError('Stored Id without stored NextId')
      } else if (id >= this.storedNextId) {
        this.fatalError('Actual Id is greater than or equal to stored NextId')
      }
      return id
    } else {
      if (this.allowMissingAnnotations) {
        this.nrMissingAnnotations += 1
        return this.allocateId()
      } else {
        this.fatalError('Missing id')
      }
    }
  }

  parseNextId() {
    if (this.optionalNextCommand(['nextid'])) {
      this.storedNextId = parseInt(this.arg)
      this.nextId = this.storedNextId
    } else {
      if (!this.allowMissingAnnotations) {
        this.fatalError('Missing nextid')
      }
      this.storedNextId = null
      this.nextId = 1
      this.nrMissingAnnotations += 1
    }
  }

  parseTopic() {
    const topicName = this.arg
    const id = this.parseId()
    this.course.addTopic(id, topicName)
    this.topicName = topicName
    this.subTopicName = null
    this.subSubTopicName = null
  }

  parseSubTopic() {
    if (this.topicName === null) {
      this.fatalError('Sub-topic without topic')
    }
    const subTopicName = this.arg
    const id = this.parseId()
    this.course.addSubTopic(id, subTopicName)
    this.subTopicName = subTopicName
    this.subSubTopicName = null
  }

  parseSubSubTopic() {
    if (this.subTopicName === null) {
      this.fatalError('Sub-sub-topic without sub-topic')
    }
    const subSubTopicName = this.arg
    const id = this.parseId()
    this.course.addSubSubTopic(id, subSubTopicName)
    this.subSubTopicName = subSubTopicName
  }

  parseQuestion() {
    if (this.topicName === null) {
      this.fatalError('Question without topic')
    }
    const questionText = this.arg
    const id = this.parseId()
    this.mandatoryNextCommand(['answer', 'a'], 'Question without answer')
    const answerText = this.arg
    this.course.addQuestion(id, questionText, answerText)
  }

  parseLab() {
    const labName = this.arg
    const id = this.parseId()
    this.course.addLab(id, labName)
    while (this.optionalNextCommand(['step', 's'])) {
      const stepText = this.arg
      this.course.addStep(stepText)
    }
  }

  parseCourse() {
    this.mandatoryNextCommand(['course'], 'Missing course')
    const courseName = this.arg
    this.parseNextId()
    const id = this.parseId()
    this.course = new Course(id, courseName)
    while (this.nextCommand()) {
      if (this.tag === 'topic') {
        this.parseTopic()
      } else if (this.tag === 'subtopic') {
        this.parseSubTopic()
      } else if (this.tag === 'subsubtopic') {
        this.parseSubSubTopic()
      } else if (['question', 'q'].includes(this.tag)) {
        this.parseQuestion()
      } else if (this.tag === 'lab') {
        this.parseLab()
      } else {
        this.fatalError('Unrecognized tag: ' + this.tag)
      }
    }
  }

  parse(definitionText) {
    this.reset()
    this.definition = definitionText.split('\n')
    this.lineNr = 0
    this.parseCourse()
    return this.course
  }

  generateDefinitionTextForQuestion(question) {
    let text = ''
    text += 'Question: ' + question.questionText + '\n'
    text += 'Id: ' + question.id + '\n'
    text += 'Answer: ' + question.answerText + '\n\n'
    return text
  }

  generateDefinitionTextForLab(lab) {
    let text = ''
    text += 'Lab: ' + lab.name + '\n'
    text += 'Id: ' + lab.id + '\n'
    for (const stepText of lab.steps) {
      text += 'Step: ' + stepText + '\n'
    }
    text += '\n'
    return text
  }

  generateDefinitionTextForTopic(topic) {
    let text = ''
    const levelToTagMap = { 0: 'Course', 1: 'Topic', 2: 'SubTopic', 3: 'SubSubTopic' }
    text += levelToTagMap[topic.level] + ': ' + topic.name + '\n'
    if (topic.level === 0) {
      text += 'NextId: ' + this.nextId + '\n'
    }
    text += 'Id: ' + topic.id + '\n'
    text += '\n'
    for (const lab of topic.localLabs) {
      text += this.generateDefinitionTextForLab(lab)
    }
    for (const question of topic.localQuestions) {
      text += this.generateDefinitionTextForQuestion(question)
    }
    for (const childTopic of topic.childTopics) {
      text += this.generateDefinitionTextForTopic(childTopic)
    }
    return text
  }

  generateDefinitionText() {
    console.assert(this.course !== null, 'Must not call generateDefinitionText without a parsed course')
    return this.generateDefinitionTextForTopic(this.course.coursePseudoTopic)
  }
}

if (typeof exports != 'undefined') {
  module.exports.Parser = Parser
}
