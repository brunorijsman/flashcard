import random

class Question:

    def __init__(self, topic, question_text, answer_text):
        self._topic = topic
        self._question_text = question_text
        self._answer_text = answer_text

class QuestionSet:

    def __init__(self):
        self._questions = []

    def add_question(self, question):
        self._questions.append(question)

    def pick_random_question(self):
        if self._questions:
            return random.choice(self._questions)
        else:
            return None

class Topic:

    def __init__(self, name, level, parent):
        self._name = name
        self._level = level
        self._parent = parent
        self._children = []
        self._question_set = QuestionSet()

    def add_child_topic(self, child_topic):
        self._children.append(child_topic)

    def add_question(self, question):
        self._question_set.add_question(question)
        if self._parent:
            self._parent.add_question(question)

    def print_tree(self, indent_level):
        indent_str = ' ' * 4 * indent_level
        print(indent_str, self._name, "...", len(self._question_set._questions))
        for topic in self._children:
            topic.print_tree(indent_level + 1)

    def nr_questions(self):
        return len(self._question_set)

class Test:

    def __init__(self, test_name):
        topic = Topic(test_name, 0, None)
        self._test_pseudo_topic = topic
        self._current_topic = None
        self._current_sub_topic = None
        self._current_sub_sub_topic = None
        self._current_topic_at_any_level = None
        self._current_topic_at_any_level = topic

    def add_topic(self, topic_name):
        topic = Topic(topic_name, 1, self._test_pseudo_topic)
        self._test_pseudo_topic.add_child_topic(topic)
        self._current_topic = topic
        self._current_sub_topic = None
        self._current_sub_sub_topic = None
        self._current_topic_at_any_level = topic

    def add_sub_topic(self, sub_topic_name):
        assert self._current_topic != None, "Cannot add sub-topic without current topic"
        topic = Topic(sub_topic_name, 2, self._current_topic)
        self._current_topic.add_child_topic(topic)
        self._current_sub_topic = topic
        self._current_sub_sub_topic = None
        self._current_topic_at_any_level = topic

    def add_sub_sub_topic(self, sub_sub_topic_name):
        assert self._current_sub_topic != None, "Cannot add sub-sub-topic without current sub-topic"
        topic = Topic(sub_sub_topic_name, 3, self._current_sub_topic)
        self._current_sub_topic.add_child_topic(topic)
        self._current_sub_sub_topic = topic
        self._current_topic_at_any_level = topic

    def add_question(self, question_text, answer_text):
        question = Question(self._current_topic_at_any_level, question_text, answer_text)
        self._current_topic_at_any_level.add_question(question)

    def print_topic_tree(self):
        self._test_pseudo_topic.print_tree(0)
