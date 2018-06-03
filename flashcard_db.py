class Topic:

    def __init__(self, name, level, parent):
        self._name = name
        self._level = level
        self._parent = parent
        self._children = []

    def add_child_topic(self, child_topic):
        self._children.append(child_topic)

    def print_child_topic_tree(self, indent_level):
        for topic in self._children:
            indent_str = ' ' * 4 * indent_level
            print(indent_str, topic._name)
            topic.print_child_topic_tree(indent_level + 1)

class Test:

    def __init__(self, test_name):
        self._name = test_name
        self._topics = []
        self._current_topic = None
        self._current_sub_topic = None

    def add_topic(self, topic_name):
        topic = Topic(topic_name, 0, None)
        self._topics.append(topic)
        self._current_topic = topic
        self._current_sub_topic = None

    def add_sub_topic(self, sub_topic_name):
        assert self._current_topic != None, "Cannot add sub-topic without current topic"
        sub_topic = Topic(sub_topic_name, 1, self._current_topic)
        self._current_topic.add_child_topic(sub_topic)
        self._current_sub_topic = sub_topic

    def add_sub_sub_topic(self, sub_sub_topic_name):
        assert self._current_sub_topic != None, "Cannot add sub-sub-topic without current sub-topic"
        sub_sub_topic = Topic(sub_sub_topic_name, 2, self._current_sub_topic)
        self._current_sub_topic.add_child_topic(sub_sub_topic)
        self._current_sub_sub_topic = sub_sub_topic

    def print_topic_tree(self):
        for topic in self._topics:
            print(topic._name)
            topic.print_child_topic_tree(1)
