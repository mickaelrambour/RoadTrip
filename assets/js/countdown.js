export function initCountdown() {
  const departureDate = new Date(2025, 7, 2); // 2 août 2025
  const today = new Date();
  const diffTime = departureDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;
  if (daysLeft > 0) {
    countdownEl.textContent = `J-${daysLeft}`;
  } else if (daysLeft === 0) {
    countdownEl.textContent = "🚀 C’est le grand jour !";
  } else {
    countdownEl.textContent = `✅ En cours (J+${-daysLeft})`;
  }
}
