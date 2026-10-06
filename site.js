// Diamond's native overflow/scroll-snap carousel; no cloned cards or autoplay.
const track = document.querySelector('#review-track');
const cards = [...track.children];
const controls = document.querySelector('.review-controls');
const previous = controls.querySelector('[data-review-step="-1"]');
const next = controls.querySelector('[data-review-step="1"]');
const cardLeft = card => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft - track.clientLeft;
const inset = () => parseFloat(getComputedStyle(track).scrollPaddingLeft);
let firstVisible = 1;
const currentIndex = () => {
  const left = track.scrollLeft + inset();
  return cards.reduce((nearest, card, index) => Math.abs(cardLeft(card) - left) < Math.abs(cardLeft(cards[nearest]) - left) ? index : nearest, 0);
};
function updateControls() {
  previous.disabled = track.scrollLeft <= 2;
  next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  firstVisible = currentIndex();
}
function move(direction) {
  const index = Math.max(0, Math.min(cards.length - 1, currentIndex() + direction));
  track.scrollTo({ left: cardLeft(cards[index]) - inset() });
}
controls.addEventListener('click', event => {
  const button = event.target.closest('button[data-review-step]');
  if (button) move(Number(button.dataset.reviewStep));
});
track.addEventListener('keydown', event => {
  if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Home' || event.key === 'End') track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth });
  else move(event.key === 'ArrowLeft' ? -1 : 1);
});
track.addEventListener('scroll', updateControls, { passive: true });
new ResizeObserver(() => {
  track.scrollTo({ left: cardLeft(cards[firstVisible]) - inset(), behavior: 'instant' });
  updateControls();
}).observe(track);
controls.hidden = false;

// Mobile quote bar: jump to whichever form is closest so its fields land just under the sticky header,
// and slide the bar away while a form is on screen so it doesn't cover the fields.
const formPanels = [...document.querySelectorAll('.daylight-card, .quote-panel')];
const mobileCta = document.querySelector('#mobile-cta');
document.querySelector('[data-form-jump]').addEventListener('click', event => {
  event.preventDefault();
  const nearest = formPanels.reduce((a, b) => Math.abs(a.getBoundingClientRect().top) <= Math.abs(b.getBoundingClientRect().top) ? a : b);
  nearest.scrollIntoView({ block: 'start' });
  nearest.focus({ preventScroll: true });
});
const formsInView = new Set();
const formObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting ? formsInView.add(entry.target) : formsInView.delete(entry.target));
  mobileCta.classList.toggle('is-hidden', formsInView.size > 0);
}, { threshold: 0.35 });
formPanels.forEach(panel => formObserver.observe(panel));
