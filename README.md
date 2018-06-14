# Flashcard

A web application for using flashcards to practice a subject.

## Features for the student role

The student role represents the person who practices their skills using a web-based flashcard application. 

The flashcard application allows the student to review questions and answers. It also provides the student step-by-step instructions for hands-on lab excercises. 

The student can keep track of their progress in terms of which questions have been covered, which answers are known, and how much effort was put in every day.

The student is not responsible for putting together the list of questions and answers; this is the responsibility of the teacher role.

Current features:

* The topic tab:
  * Show the hierarchical organization of the course into topics, sub-topics, etc.
  * The user can choose to practice all questions, or a subset of the questions by topic.
* The quiz tab:
  * Display a sequence of questions.
  * The user can expose the correct answer for each question.
  * The user can indicate whether or not they knew the answer to the question.
  * A visual indication showing whether the question was asked before and whether the answer was known.
  * Fast learning cycle, enabled by fast response times and keyboard short-cuts.
  
Planned features:
* Chose a topic to study and ask only questions from the selected topic (currently the topic can be selected, but it does not yet influence which questions are asked)
* Store question coverage history. For each question, keep track of:
  * How often the question was asked.
  * How often the answer was known and how often not.
  * The state of each question:
    * Not-covered = the question was never asked.
    * Covered = the question was asked at least once.
    * Not-known = when the question was asked most recently, the answer was not known.
    * Known = when the question was asked most recently, the answer was known.
    * Well-known = the most recent three times the question was asked, the answer was known each time.
* Store lab coverage history. For each lab, keep track of:
  * How often the lab was executed.
* Store learning effort history. For each day, keep track of:
  * How many questions were asked
  * For how many questions the answer was known, and how often not.
  * How many labs were executed.
* Automatically ask questions whose answer is know less frequently and ask questions whose answer is not known more frequently.
* Practice labs, where the user is lead through a sequence of steps to strengthen memory-muscle for some operational task.
* An effort graph, showing how many questions were practiced and what the results were as a function of time (i.e. for each day).
* An effort progress graph, showing:
  * On x-axis the progress of time (days) 
  * On the y-axis a stacked bar for each day, showing how many questions were asked. Red and green colors indicate how often the answer to those questions was known.
* A coverage progress graph, showing:
  * On x-axis the progress of time (days) 
  * On the y-axis the percentage of questions that are well-known (dark green), known (yellow), not-known (red), and not-covered (white).
* A coverage by topic table, listing for each topic what percentage of questions are well-known (dark green), known (yellow), not-known (red), and not-covered (white).
  
## Features for the teacher role

The teacher role represents the person who prepares the list of questions and answers, and the step-by-step instructions for hands-on labs.

The teacher uses a plain text editor to edit a course definition file that contains all this information, and then uses a command-line interface to check the course definition file for correctness and to annotate the file with additional meta-data (such as unique question identifiers) that is needed to make the system work as intended.

 Features:

* All the information a "course definition" such as questions, answers, labs is stored in a plain text file, which can be easily edited without any special tools. 
* Note: it is my conscious decision to use a text file instead of a database. I built this application for myself (scratch my own itch), and this is the way I like it. I much prefer the simplicity of editing a text file over using a database. Also, it makes it easier to version control the questions.
* A command-line interface to:
  * Check a course definition for correctness.
  * Annotate the course definition with automatically generated meta-data (e.g. unique question identifiers). This meta-data is needed for the correct operation of the system, but we don't want to bother the teacher with grunt work.

## Features for the operator and developer roles

The operator role represents the person who is responsible for hosting the web application. The operator is responsible for the day-to-day operational maintenance of the application, such as making sure that all resources (hosted files, web servers, etc.) are properly functioning. They care about things such as simplicity, stability, etc.

The developer role is responsible for developing and maintaining the applicaiton. They care about things such as correctness, maintainability, etc.

If anything is not working, the students and teachers will turn to the operator or developer for support.

Current features:

* A deploy script that automatically deploys the web application to Amazon Web Services
* The student web application:
  * Responsive Javascript application built using bootstrap. 
  * Works well on laptops, tablets, and phones.
* The teacher command line interface:
  * Node.js application.
  * Uses common code with the student web application to make sure the two stay in sync.
* This is a purely static web application, written entirely using client-side Javascript. It requires no active backend application.
* Do not lose progress history when questions are added, deleted, or modified.

Planned features:

* All information learning progress (which questions were asked, which were answered correct, which were not, etc.) is stored in local storage on the client-side. No information is sent to the server; in fact, there is no active back-end server application. The upsides are better privacy, the ability to work offline, and better performance when the Internet is slow. The downsides are that learning progress cannot be tracked across multiple devices and that clearing browser state will erase test progress, but these are conscious decissions.
* Host the application in some public place (most likely AWS).

