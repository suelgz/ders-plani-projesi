// Görevleri tarayıcıya kaydetmek ve tekrar okumak için.
const TaskStorage = (() => {
  const key = 'ders-plani-gorevler';

  function daysLater(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return [yyyy, mm, dd].join('-');
  }

  function sampleTasks() {
    return [
      { id: 'ornek-1', title: 'Veritabanı notlarını tekrar et', course: 'Veritabanı', date: daysLater(2), priority: 'Orta', completed: false },
      { id: 'ornek-2', title: 'Muhasebe ödevini bitir', course: 'Muhasebe', date: daysLater(4), priority: 'Yüksek', completed: false },
      { id: 'ornek-3', title: 'JavaScript tekrarını yap', course: 'Web Geliştirme', date: daysLater(1), priority: 'Düşük', completed: true },
    ];
  }

  return {
    load() {
      try {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          const data = JSON.parse(saved);
          if (Array.isArray(data)) return data;
        }
      } catch (error) {
        console.warn('Kayıtlar okunamadı:', error);
      }
      return sampleTasks();
    },
    save(tasks) {
      try {
        localStorage.setItem(key, JSON.stringify(tasks));
      } catch (error) {
        console.warn('Kayıt yapılamadı:', error);
      }
    },
  };
})();