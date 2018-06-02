import sys
from flashcard_test import Test

# TODO: Add support for continuations (...) in lab steps
# TODO: Add support for TODOs

class Parser:

    def _reset(self):
        self._file_name = None
        self._file = None
        self._line = None
        self._line_nr = None
        self._tag = None
        self._arg = None
        self._pushed_back = False
        self._test = None
        self._topic = None
        self._sub_topic = None
        self._sub_sub_topic = None

    def __init__(self):
        self._reset()

    def _fatal_error(self, error_msg):
        print("Error   :", error_msg)
        print("File    :", self._file_name)
        print("Line nr :", self._line_nr)
        print("Line    :", self._line)
        sys.exit(-1)

    def _next_command(self):
        if self._pushed_back:
            self._pushed_back = False
            assert(self._tag != None)
            return True
        while True:
            line = self._file.readline()
            if line == '':
                # EOF
                self._line = None
                self._line_nr = None
                return False
            self._line_nr += 1
            line = line.lstrip().rstrip('\n')
            if line != '' and line[0] != '#':
                # Not a blank line and not a comment
                self._line = line
                break
        split = line.split(':', 1)
        if len(split) == 1:
            self._fatal_error('Syntax error, missing :')
        self._tag = split[0].rstrip().lower()
        self._arg = split[1].lstrip()
        return True

    def _prev_command(self):
        assert(not self._pushed_back)
        assert(self._tag != None)
        self._pushed_back = True

    def _parse_topic(self):
        self._topic = self._arg
        self._sub_topic = None
        self._sub_sub_topic = None
        self._test.add_topic(self._topic)

    def _parse_sub_topic(self):
        if self._topic == None:
            self._fatal_error('SubTopic without Topic')
        self._sub_topic = self._arg
        self._sub_sub_topic = None
        self._test.add_sub_topic(self._sub_topic)

    def _parse_sub_sub_topic(self):
        if self._sub_topic == None:
            self._fatal_error('SubSubTopic without SubTopic')
        self._sub_sub_topic = self._arg
        self._test.add_sub_sub_topic(self._sub_sub_topic)

    def _parse_question(self):
        if self._topic == None:
            self._fatal_error('Question without Topic')
        question_text = self._arg
        if not self._next_command():
            self._fatal_error('Question missing Answer')
        if self._tag not in ['answer', 'a']:
            self._fatal_error('Question missing Answer')
        answer_text = self._arg
        print('      *** Question:', question_text)
        print('          Answer  :', answer_text)

    def _parse_lab(self):
        lab_name = self._arg
        print('      *** Lab  :', lab_name)
        while self._next_command():
            if self._tag != 'step':
                self._prev_command()
                break
            step_text = self._arg
            print('          Step :', step_text)

    def _parse_all_questions(self):
        while self._next_command():
            if self._tag == 'topic':
                self._parse_topic()
            elif self._tag == 'subtopic':
                self._parse_sub_topic()
            elif self._tag == 'subsubtopic':
                self._parse_sub_sub_topic()
            elif self._tag in ['question', 'q']:
                self._parse_question()
            elif self._tag == 'lab':
                self._parse_lab()
            else:
                self._fatal_error('Unrecognized tag "' + self._tag + '"')
        
    def _parse_test(self):
        if not self._next_command():
            self._fatal_error('Missing test')
        if self._tag == 'test':
            print('*** Test:', self._arg)
            self._test = Test(self._arg)
            self._parse_all_questions()
        else:
            self._fatal_error('Test command missing')

    def parse_file(self, file_name):
        self._reset()
        self._file_name = file_name
        self._file = open(file_name, "r")
        # TODO: Handle file open error
        self._line_nr = 0
        self._parse_test()
        self._file.close()  
        return self._test  

parser = Parser()
test = parser.parse_file("aws-certified-solutions-architect-associate.fcx")
print(test)
