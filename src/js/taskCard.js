// Listede her görev için oluşturulan kart.
function formatTaskDate(value) {
  if (!value) return 'Tarih yok';
  const date = new Date(value + 'T12:00:00');
  if (Number.isNaN(date.getTime())) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(date);
}
function createTaskCard(task) {
  const $card = $('<article>').addClass('task-card').attr('data-id', task.id);
  if (task.completed) $card.addClass('is-complete');

  const $check = $('<label>').addClass('checkbox-wrap');
  const $checkbox = $('<input>', { type: 'checkbox' })
    .prop('checked', task.completed)
    .attr('aria-label', task.title + ' tamamlandı');
  $check.append($checkbox, $('<span>').addClass('custom-checkbox').attr('aria-hidden', 'true').text('✓'));

  const $info = $('<div>').addClass('task-content');
  const $meta = $('<div>').addClass('task-meta');
  const priorityClass = { 'Yüksek': 'priority-yuksek', 'Orta': 'priority-orta', 'Düşük': 'priority-dusuk' };
  $meta.append(
    $('<span>').addClass('course-label').text(task.course),
    $('<span>').addClass('meta-dot').attr('aria-hidden', 'true').text('·'),
    $('<span>').text(formatTaskDate(task.date)),
    $('<span>').addClass('priority ' + (priorityClass[task.priority] || 'priority-orta')).text(task.priority)
  );
  $info.append($('<h3>').text(task.title), $meta);

  const $actions = $('<div>').addClass('task-actions');
  $actions.append(
    $('<button>', { type: 'button' }).addClass('edit-task').attr('aria-label', 'Düzenle: ' + task.title).text('Düzenle'),
    $('<button>', { type: 'button' }).addClass('delete-btn delete-task').attr('aria-label', 'Sil: ' + task.title).text('Sil')
  );
  return $card.append($check, $info, $actions);
}