/**
 * PasswordToggle Component
 * Appends a toggle button to a password input wrapper
 * @param {Object} props
 * @param {string} props.inputId - Password input ID
 * @returns {string} HTML string for the toggle button
 */
function PasswordToggle({ inputId }) {
  return `
    <button type="button" class="password-toggle absolute right-3 top-1/2 -translate-y-1/2
                                  flex items-center justify-center w-5 h-5 p-0
                                  bg-transparent border-none cursor-pointer text-neutral-400
                                  hover:text-neutral-600" data-input="${inputId}" aria-label="Toggle password visibility">
      <i data-lucide="eye" class="icon-eye w-5 h-5"></i>
      <i data-lucide="eye-off" class="icon-eye-off w-5 h-5 hidden"></i>
    </button>
  `;
}

/**
 * Initialize all PasswordToggle buttons
 */
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach(function (toggle) {
    const inputId = toggle.dataset.input;
    const input = document.getElementById(inputId);
    if (!input) return;

    toggle.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const eyeIcon = toggle.querySelector('.icon-eye');
      const eyeOffIcon = toggle.querySelector('.icon-eye-off');

      if (eyeIcon && eyeOffIcon) {
        eyeIcon.style.display = isPassword ? 'none' : 'block';
        eyeOffIcon.style.display = isPassword ? 'block' : 'none';
      }
    });
  });
}

// Export for use
window.PasswordToggle = PasswordToggle;
window.initPasswordToggles = initPasswordToggles;
