$(function () {
  let tasks = TaskStorage.load();
  let editingId = null;
  let currentFilter = 'all';

  function persistAndRender() {
    TaskStorage.save(tasks);
    render();
  }

  function render() {
    const complete = tasks.filter((task) => task.completed).length;
    $('#total-count').text(tasks.length);
    $('#pending-count').text(tasks.length - complete);
    $('#complete-count').text(complete);

    const visible = tasks.filter((task) => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'complete') return task.completed;
      return true;
    });

    $('#list-count').text(visible.length);
    const $list = $('#task-list').empty();
    if (visible.length === 0) {
      const $empty = $('<div>').addClass('empty-state');
      $empty.append(
        $('<span>').attr('aria-hidden', 'true').text('☕'),
        $('<strong>').text('Burada henüz bir görev yok.'),
        $('<p>').text('Yeni bir görev ekleyebilir veya başka bir filtre seçebilirsin.')
      );
      $list.append($empty);
    } else {
      visible.forEach((task) => $list.append(createTaskCard(task)));
    }
  }

  function resetForm() {
    editingId = null;
    $('#task-form')[0].reset();
    $('#form-title').text('Yeni görev ekle');
    $('#save-text').text('Görev ekle');
    $('#save-button > span:first-child').text('+');
    $('#cancel-button').prop('hidden', true);
  }

  function showAll() {
    currentFilter = 'all';
    $('.filter-btn').removeClass('active').attr('aria-pressed', 'false');
    $('.filter-btn[data-filter="all"]').addClass('active').attr('aria-pressed', 'true');
  }

  $('#task-form').on('submit', function (event) {
    event.preventDefault();
    const title = $('#task-title').val().trim();
    if (!title) return;

    const values = {
      title,
      course: $('#task-course').val().trim() || 'Genel',
      date: $('#task-date').val(),
      priority: $('#task-priority').val(),
    };

    if (editingId !== null) {
      tasks = tasks.map((task) => task.id === editingId ? { ...task, ...values } : task);
    } else {
      const id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
      tasks.unshift({ id, ...values, completed: false });
    }
    resetForm();
    showAll();
    persistAndRender();
  });

  $('#cancel-button').on('click', resetForm);

  $('.filter-btn').on('click', function () {
    currentFilter = $(this).data('filter');
    $('.filter-btn').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    render();
  });

  $('#task-list').on('change', 'input[type="checkbox"]', function () {
    const id = $(this).closest('.task-card').attr('data-id');
    tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
    persistAndRender();
  });

  $('#task-list').on('click', '.edit-task', function () {
    const id = $(this).closest('.task-card').attr('data-id');
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    editingId = task.id;
    $('#task-title').val(task.title);
    $('#task-course').val(task.course);
    $('#task-date').val(task.date);
    $('#task-priority').val(task.priority);
    $('#form-title').text('Görevi düzenle');
    $('#save-text').text('Değişiklikleri kaydet');
    $('#save-button > span:first-child').text('✓');
    $('#cancel-button').prop('hidden', false);
    $('#task-title').trigger('focus');
  });

  $('#task-list').on('click', '.delete-task', function () {
    const id = $(this).closest('.task-card').attr('data-id');
    if (!window.confirm('Bu görevi silmek istiyor musun?')) return;
    tasks = tasks.filter((task) => task.id !== id);
    if (editingId === id) resetForm();
    persistAndRender();
  });

  render();
});