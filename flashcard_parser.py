import sys

class Parser:

    def _reset(self):
        self._file_name = None
        self._file = None
        self._line = None
        self._line_nr = None
        self._tag = None
        self._arg = None
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

    def _set_topic(self):
        print('*** Topic:', self._arg)
        self._topic = self._arg
        self._sub_topic = None
        self._sub_sub_topic = None

    def _set_sub_topic(self):
        print('  *** SubTopic:', self._arg)
        self._sub_topic = self._arg
        self._sub_sub_topic = None

    def _set_sub_sub_topic(self):
        print('    *** SubSubTopic:', self._arg)
        self._sub_sub_topic = self._arg

    def _add_question(self):
        if self._topic == None:
            self._fatal_error('Question without topic')
        question_text = self._arg
        if not self._next_command():
            self._fatal_error('Question missing answer')
        if self._tag not in ['answer', 'a']:
            self._fatal_error('Question missing answer')
        answer_text = self._arg
        print('      *** Question:', question_text)
        print('          Answer  :', answer_text)

    def _add_lab(self):
        lab_name = self._arg
        print('      *** Lab  :', lab_name)
        while self._next_command():
            if self._tag != 'step':
                break
            step_text = self._arg
            print('          Step :', step_text)

    def _parse_all_questions(self):
        while self._next_command():
            if self._tag == 'topic':
                self._set_topic()
            elif self._tag == 'subtopic':
                self._set_sub_topic()
            elif self._tag == 'subsubtopic':
                self._set_sub_sub_topic()
            elif self._tag in ['question', 'q']:
                self._add_question()
            elif self._tag == 'lab':
                self._add_lab()
            else:
                self._fatal_error('Unrecognized tag "' + self._tag + '"')
        
    def _parse_test(self):
        if not self._next_command():
            self._fatal_error('Missing test')
        if self._tag == 'test':
            print('*** Test:', self._test)
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

parser = Parser()
parser.parse_file("aws-certified-solutions-architect-associate.fcx")
