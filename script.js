// Функция для показа деталей проекта (пример интерактивности)
function showDetails(projectId) {
  const details = {
    1: 'Детали проекта: Разработал простую IDS на Python + SQILite.'
  };

  alert(`Проект ${projectId}:\n\n${details[projectId]}`);
}

// Плавная прокрутка к разделам (если будут якоря)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
