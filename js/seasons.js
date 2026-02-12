/* ============================================
   Season Selector & Theme Switching
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSeasonSelector();
});

function initSeasonSelector() {
  const pills = document.querySelectorAll('.season-pill');
  const seasonCards = document.querySelectorAll('.season-card');

  // Set default season based on current month or saved preference
  const savedSeason = sessionStorage.getItem('selectedSeason');
  const defaultSeason = savedSeason || getDefaultSeason();
  changeSeason(defaultSeason);

  // Season pill clicks (in nav)
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      changeSeason(pill.dataset.season);
    });
  });

  // Season card clicks
  seasonCards.forEach(card => {
    card.addEventListener('click', () => {
      changeSeason(card.dataset.season);
    });
  });
}

function changeSeason(season) {
  // Update body attribute
  document.body.dataset.season = season;

  // Update nav pills
  document.querySelectorAll('.season-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.season === season);
  });

  // Update season cards
  document.querySelectorAll('.season-card').forEach(card => {
    card.classList.toggle('active', card.dataset.season === season);
  });

  // Save preference
  sessionStorage.setItem('selectedSeason', season);
}

function getDefaultSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}
