const API = '/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const emptyMsg = document.getElementById('empty-msg');
const filterButtons = document.querySelectorAll('.filter');

let tasks = [];
let currentFilter = 'all';

async function loadTasks() {
  const res = await fetch(API);
  tasks = await res.json();
  render();
}

function render() {
  const visible = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  list.innerHTML = '';
  visible.forEach(task => list.appendChild(createItem(task)));

  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
  emptyMsg.hidden = visible.length > 0;
}

function createItem(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.priority}${task.completed ? ' done' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => updateTask(task.id, { completed: checkbox.checked }));

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title;

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = task.priority;

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.title = 'Edit';
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => {
    const newTitle = prompt('Edit task:', task.title);
    if (newTitle && newTitle.trim()) updateTask(task.id, { title: newTitle });
  });

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.title = 'Delete';
  delBtn.textContent = '🗑️';
  delBtn.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, title, badge, editBtn, delBtn);
  return li;
}

async function addTask(title, priority) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority })
  });
  if (res.ok) {
    tasks.push(await res.json());
    render();
  }
}

async function updateTask(id, changes) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });
  if (res.ok) {
    const updated = await res.json();
    tasks = tasks.map(t => (t.id === id ? updated : t));
    render();
  }
}

async function deleteTask(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    tasks = tasks.filter(t => t.id !== id);
    render();
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTask(title, prioritySelect.value);
  input.value = '';
  input.focus();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

loadTasks();
