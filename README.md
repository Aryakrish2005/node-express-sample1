# Task Manager

A full-stack task manager built with HTML, CSS, JavaScript, Node.js and Express.

## Features
- Add, edit, complete and delete tasks
- Priority levels (low / medium / high)
- Filter: all / active / completed
- Data saved in `data/tasks.json`

## Run
```bash
npm install
npm start
```
Open http://localhost:3000

## API
| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| GET    | /api/tasks       | List all tasks  |
| POST   | /api/tasks       | Create a task   |
| PUT    | /api/tasks/:id   | Update a task   |
| DELETE | /api/tasks/:id   | Delete a task   |

## Structure
```
task-manager/
├── server.js
├── package.json
├── data/tasks.json
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```
