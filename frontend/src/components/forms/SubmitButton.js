/**
 * SubmitButton Component
 * @param {Object} props
 * @param {string} props.text - Button text
 * @param {string} [props.id] - Button ID
 * @param {boolean} [props.disabled=false] - Disabled state
 * @returns {string} HTML string
 */
function SubmitButton({ text, id = 'submitBtn', disabled = false }) {
  return `
    <button
      type="submit"
      id="${id}"
      class="w-full h-11 flex items-center justify-center
             text-button font-semibold leading-relaxed text-white
             bg-primary-600 border-none rounded-md cursor-pointer
             transition-colors duration-100
             hover:bg-primary-700 active:bg-primary-800
             disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
      ${disabled ? 'disabled' : ''}
    >
      ${text}
    </button>
  `;
}

/**
 * Initialize SubmitButton interactivity
 * @param {string} id - Button ID
 * @param {Object} [options]
 * @param {string} [options.loadingText] - Text to show when loading
 */
function initSubmitButton(id, options = {}) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const form = btn.closest('form');
  if (!form) return;

  const originalText = btn.textContent.trim();
  const loadingText = options.loadingText || 'Signing in...';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate loading
    btn.disabled = true;
    btn.textContent = loadingText;

    setTimeout(function () {
      btn.disabled = false;
      btn.textContent = originalText;
    }, 2000);
  });
}

// Export for use
window.SubmitButton = SubmitButton;
window.initSubmitButton = initSubmitButton;
