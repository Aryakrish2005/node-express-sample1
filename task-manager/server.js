const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

// POST create a task
app.post('/api/tasks', (req, res) => {
  const title = (req.body.title || '').trim();
  const priority = ['low', 'medium', 'high'].includes(req.body.priority)
    ? req.body.priority
    : 'medium';

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const tasks = readTasks();
  const task = {
    id: Date.now().toString(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    task.title = req.body.title.trim();
  }
  if (typeof req.body.completed === 'boolean') task.completed = req.body.completed;
  if (['low', 'medium', 'high'].includes(req.body.priority)) {
    task.priority = req.body.priority;
  }

  writeTasks(tasks);
  res.json(task);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const remaining = tasks.filter(t => t.id !== req.params.id);
  if (remaining.length === tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  writeTasks(remaining);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
