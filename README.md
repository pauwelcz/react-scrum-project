# Scrum board app

This project is an implementation of an arbitraty number of Scrum boards - stored as projects, used for organizing tasks in software development. 

The application is available on page https://scrum-project-c5327.web.app

_Authors: Pavel Sedlář, Daša Kušniráková, Adam Radvan_

## Design
Users need to log in in order to be able to create and manage projects and tasks.

### Project
After log in, section _My projects_ becomes available in the main app menu. This is the place where users can view the list of their projects - but only those projects, which they are assigned to. 

Every project has an owner, who can manage the access of other users to the scrum board. This role is set automatically - project owner is the user who creates the project. Besides that, every project has a _name_ and _note_.

### Scrum board
Scrum board is organized in 4 columns. These columns store all tasks of a particular project. Each task is represented by a card, and each such card belogs to one of the columns according to the current development phase:
* To do
* In progress
* Testing
* Done

Every card stores the _name_ of a task, its _phase_ , its _categories_ and a note for a more detailed description. 

### Categories
Besides tasks, each project stores categories, which can be used for labeling cards for even better task organization. Every category has its own _color_.  

On the left side of the scrum board, filtering of tasks according to their assigned category can be applied. If a category is selected, all tasks labeled with this category remain visible on the scrum board, while tasks without the selected label(s) disappear.


## Other features
### Drag'n'drop
If the current phase of a task changes, users can update its phase in scrum board by a simple drag and drop move. This feature works not only for moving cards between columns, but for changing cards' positios swithin one column as well.

### Markdown language support
Project and task notes support _Markdown_ language formatting. The formatted note "live" preview is always displayed on the right side of the task's or project's edit page.
