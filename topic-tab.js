function getCourse () {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://127.0.0.1:5500/aws-certified-solutions-architect-associate.fcx', false)
  xhr.send(null)
  if (xhr.status !== 200) {
    return null
  }
  const courseDefinition = xhr.responseText
  const parser = new Parser()
  return parser.parse(courseDefinition)
}

function updateTopicsVisibility () {
  const selectedTopicIndex = $('#topic-select option:selected').index()
  if (selectedTopicIndex == 0) {
    $('#sub-topic-group').hide()
    $('#sub-sub-topic-group').hide()
  } else {
    $('#sub-topic-group').show()
    const selectedSubTopicIndex = $('#sub-topic-select option:selected').index()
    if (selectedSubTopicIndex == 0) {
      $('#sub-sub-topic-group').hide()
    } else {
      $('#sub-sub-topic-group').show()
    }
  }
}

function updateCourseName () {
  $('#course-name').text(course.name)
}

function updateTopicOptions () {
  const topicSelect = $('#topic-select')[0]
  topicSelect.options.length = 0
  const topicNames = ['All topics'].concat(course.topicNames)
  for (const topicName of topicNames) {
    topicSelect.append(new Option(topicName))
  }
}

function updateSubTopicOptions () {
  const subTopicSelect = $('#sub-topic-select')[0]
  subTopicSelect.options.length = 0
  const selectedTopicIndex = $('#topic-select option:selected').index()
  if (selectedTopicIndex > 0) {
    const subTopicNames = ['All sub-topics'].concat(course.getSubTopicNames(selectedTopicIndex - 1))
    for (const subTopicName of subTopicNames) {
      subTopicSelect.append(new Option(subTopicName))
    }
  }
}

function updateSubSubTopicOptions () {
  const subSubTopicSelect = $('#sub-sub-topic-select')[0]
  subSubTopicSelect.options.length = 0
  const selectedTopicIndex = $('#topic-select option:selected').index()
  const selectedSubTopicIndex = $('#sub-topic-select option:selected').index()
  if (selectedTopicIndex > 0 && selectedSubTopicIndex > 0) {
    const subSubTopicNames = ['All sub-sub-topics'].concat(course.getSubSubTopicNames(selectedTopicIndex - 1, selectedSubTopicIndex - 1))
    for (const subSubTopicName of subSubTopicNames) {
      subSubTopicSelect.append(new Option(subSubTopicName))
    }
  }
}

function changeTopic () {
  updateSubTopicOptions()
  updateTopicsVisibility()
}

function changeSubTopic () {
  updateSubSubTopicOptions()
  updateTopicsVisibility()
}

var course = null
