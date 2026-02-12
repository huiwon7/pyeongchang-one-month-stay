/* ============================================
   Pricing Toggle (Monthly / Daily)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPricingToggle();
});

function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  const labels = document.querySelectorAll('.pricing-toggle__label');
  const amounts = document.querySelectorAll('.pricing-card__amount');
  const periods = document.querySelectorAll('.pricing-card__period');

  let isDaily = false;

  toggle.addEventListener('click', () => {
    isDaily = !isDaily;
    toggle.classList.toggle('active', isDaily);

    labels.forEach(label => {
      const view = label.dataset.view;
      label.classList.toggle('active', (isDaily && view === 'daily') || (!isDaily && view === 'monthly'));
    });

    amounts.forEach(amount => {
      const value = isDaily ? amount.dataset.daily : amount.dataset.monthly;
      const suffix = isDaily ? '만원' : '만원';

      // Animate the number change
      amount.style.opacity = '0';
      amount.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        amount.textContent = `${value}${suffix}`;
        amount.style.opacity = '1';
        amount.style.transform = 'translateY(0)';
      }, 200);
    });

    periods.forEach(period => {
      period.style.opacity = '0';
      setTimeout(() => {
        period.textContent = isDaily ? '/1일' : '/30일';
        period.style.opacity = '1';
      }, 200);
    });
  });

  // Add transition to amounts
  amounts.forEach(amount => {
    amount.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  });
  periods.forEach(period => {
    period.style.transition = 'opacity 0.2s ease';
  });
}
