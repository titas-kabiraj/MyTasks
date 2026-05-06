let tasks = [
  { id: 1, text: 'Review project proposal', category: 'work', done: false },
  { id: 2, text: 'Schedule dentist appointment', category: 'health', done: false },
  { id: 3, text: 'Buy groceries', category: 'personal', done: true },
  { id: 4, text: 'Submit quarterly report', category: 'urgent', done: false }
];

let filter = 'all';
let nextId = 5;

/* Date */
document.getElementById('date-label').textContent =
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

/* Escape HTML */
function escHtml(s) {
  return s.replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;');
}

/* Filter */
function getFiltered() {
  return tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return t.category === filter;
  });
}

/* Render */
function render() {
  const list = document.getElementById('todo-list');
  const filtered = getFiltered();

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet</p>
      </div>`;
  } else {
    list.innerHTML = filtered.map(t => `
      <div class="todo-item ${t.done ? 'done' : ''}">
        <button data-toggle="${t.id}">
          ${t.done ? '✔' : ''}
        </button>

        <span class="todo-text">${escHtml(t.text)}</span>

        <span class="todo-badge badge-${t.category}">
          ${t.category}
        </span>

        <button data-delete="${t.id}">🗑</button>
      </div>
    `).join('');
  }

  updateStats();
}

/* Stats */
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-remaining').textContent = total - done;

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
}

/* Add Task */
function addTask() {
  const input = document.getElementById('task-input');
  const cat = document.getElementById('category-select').value;
  const text = input.value.trim();

  if (!text) return;

  tasks.unshift({
    id: nextId++,
    text,
    category: cat,
    done: false
  });

  input.value = '';
  render();
}

/* Events */
document.getElementById('add-btn').addEventListener('click', addTask);

document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

document.getElementById('todo-list').addEventListener('click', e => {
  const toggle = e.target.closest('[data-toggle]');
  const del = e.target.closest('[data-delete]');

  if (toggle) {
    const id = +toggle.dataset.toggle;
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      render();
    }
  }

  if (del) {
    const id = +del.dataset.delete;
    tasks = tasks.filter(t => t.id !== id);
    render();
  }
});

/* Filter Buttons */
document.querySelector('.filter-row').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));

  btn.classList.add('active');
  filter = btn.dataset.filter;
  render();
});

/* Init */
render();