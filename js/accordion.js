/* ============================================
   FAQ Accordion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
});

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}
