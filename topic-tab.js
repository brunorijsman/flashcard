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
  topicSelect.append(new Option('All topics'))
  for (const topic of course.topics) {
    topicSelect.append(new Option(topic.name))
  }
}

function updateSubTopicOptions () {
  const subTopicSelect = $('#sub-topic-select')[0]
  subTopicSelect.options.length = 0
  const selectedTopicIndex = $('#topic-select option:selected').index()
  if (selectedTopicIndex > 0) {
    selectedTopic = course.topics[selectedTopicIndex - 1]
    subTopicSelect.append(new Option('All sub-topics'))
    for (const subTopic of selectedTopic.childTopics) {
      subTopicSelect.append(new Option(subTopic.name))
    }
  }
}

function updateSubSubTopicOptions () {
  const subSubTopicSelect = $('#sub-sub-topic-select')[0]
  subSubTopicSelect.options.length = 0
  const selectedTopicIndex = $('#topic-select option:selected').index()
  const selectedSubTopicIndex = $('#sub-topic-select option:selected').index()
  if (selectedTopicIndex > 0 && selectedSubTopicIndex > 0) {
    selectedTopic = course.topics[selectedTopicIndex - 1]
    selectedSubTopic = selectedTopic.childTopics[selectedSubTopicIndex - 1]
    subSubTopicSelect.append(new Option('All sub-sub-topics'))
    for (const subSubTopic of selectedSubTopic.childTopics) {
      subSubTopicSelect.append(new Option(subSubTopic.name))
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

function initTopicTab () {
  course = getCourse()
  updateCourseName()
  updateTopicOptions()
}

<!-- TODO: Create a special object for holding the global state -->

var course = null

