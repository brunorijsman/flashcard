# Flashcard

A web application for using flashcards to practice a subject.

Current end-user features:

* The topic tab:
  * Show the hierarchical organization of the course into topics, sub-topics, etc.
  * The user can choose to practice all questions, or a subset of the questions by topic.
* The quiz tab:
  * Display a sequence of questions.
  * The user can expose the correct answer for each question.
  * The user can indicate whether or not they knew the answer to the question.
  * A visual indication showing whether the question was asked before and whether the answer was known.
  * Fast learning cycle, enabled by fast response times and keyboard short-cuts.
  
Planned end-user features:
* Chose a topic to study and ask only questions from the selected topic (currently the topic can be selected, the it does not influence which questions are asked)
* Store question coverage history. For each question, keep track of:
  * How often the question was asked.
  * How often the answer was known and how often not.
  * The state of each question:
    * Not-covered = the question was never asked.
    * Covered = the question was asked at least once.
    * Not-known = when the question was asked most recently, the answer was not known.
    * Known = when the question was asked most recently, the answer was known.
    * Well-known = the most recent three times the question was asked, the answer was known each time.
  * For the most recent three exposures of the question, whether the answer was known or not.
  * Whether the question is known (answer was known in the most recent exposure).
  * Whether the question is well-known (answer was known each of the three most recent exposures)
* Store lab coverage history. For each lab, keep track of:
  * How often the lab was executed.
* Store learning effort history. For each day, keep track of:
  * How many questions were asked ("exposures")
  * For how many questions the answer was known, and how often not.
  * How many labs were executed.
* Visual feedback during the practice cycle to indicate how well the answer to a question is already known (most recent three answers: known or not known).
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
  

Current technical attributes:
* Responsive application built using bootstrap. Works well on laptops, tablets, and phones.
* This is a purely static web application, written entirely using client-side Javascript. It requires no active backend application.
* All the information a "course definition" such as questions, answers, labs is stored in a plain text file, which can be easily edited without any special tools.
* Do not lose progress history when questions are added, deleted, or modified.

Planned technical attributes:
* All information learning progress (which questions were asked, which were answered correct, which were not, etc.) is stored in local storage on the client-side. No information is sent to the server; in fact, there is no active back-end server application. The upsides are better privacy, the ability to work offline, and better performance when the Internet is slow. The downsides are that learning progress cannot be tracked across multiple devices and that clearing browser state will erase test progress, but these are conscious decissions.



