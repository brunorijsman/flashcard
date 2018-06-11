class Parser {
  reset () {
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
  }

  constructor () {
    this.reset()
  }

  fatalError (errorMsg) {
    console.error('Error   :', errorMsg)
    console.error('File    :', this.fileName)
    console.error('Line nr :', this.lineNr)
    console.error('Line    :', this.line)
    throw new Error(errorMsg)
  }

  nextCommand () {
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

  prevCommand () {
    console.assert(!this.pushedBack, 'Only one push-back allowed')
    console.assert(this.tag != null, 'Nothing to push-back')
    this.pushedBack = true
  }

  parseTopic () {
    this.topicName = this.arg
    this.subTopicName = null
    this.subSubTopicName = null
    this.course.addTopic(this.topicName)
  }

  parseSubTopic () {
    if (this.topicName === null) {
      this.fatalError('Sub-topic without topic')
    }
    this.subTopicName = this.arg
    this.subSubTopicName = null
    this.course.addSubTopic(this.subTopicName)
  }

  parseSubSubTopic () {
    if (this.subTopicName === null) {
      this.fatalError('Sub-sub-topic without sub-topic')
    }
    this.subSubTopicName = this.arg
    this.course.addSubSubTopic(this.subSubTopicName)
  }

  parseQuestion () {
    if (this.topicName === null) {
      this.fatalError('Question without topic')
    }
    const questionText = this.arg
    if (!this.nextCommand() || !['answer', 'a'].includes(this.tag)) {
      this.fatalError('Question without answer')
    }
    const answerText = this.arg
    this.course.addQuestion(questionText, answerText)
  }

  parseLab () {
    const labName = this.arg
    while (this.nextCommand()) {
      if (this.tag !== 'step') {
        this.prevCommand()
        break
      }
      const stepText = this.arg
      /* TODO: Add to model */
    }
  }

  parseCourse () {
    if (!this.nextCommand() || this.tag != 'course') {
      this.fatalError('Missing course')
    }
    console.assert(this.course === null)
    this.course = new Course(this.arg)
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

  parse (definitionText) {
    this.reset()
    this.definition = definitionText.split('\n')
    this.lineNr = 0
    this.parseCourse()
    return this.course
  }
}
