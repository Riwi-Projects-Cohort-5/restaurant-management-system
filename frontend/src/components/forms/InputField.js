/**
 * InputField Component
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Label text
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder=''] - Placeholder text
 * @param {string} [props.error=''] - Error message
 * @param {boolean} [props.required=false] - Required field
 * @param {string} [props.autocomplete=''] - Autocomplete attribute
 * @returns {string} HTML string
 */
function InputField({ id, label, type = 'text', placeholder = '', error = '', required = false, autocomplete = '' }) {
  const errorId = `${id}Error`;

  return `
    <div class="field flex flex-col gap-1">
      <label class="text-label font-medium leading-loose text-neutral-900" for="${id}">${label}</label>
      <div class="relative flex items-center">
        <input
          class="field-input w-[380px] h-11 px-3 text-sm font-normal leading-normal text-neutral-900
                 bg-brand-50 border border-brand-300 rounded-md outline-none
                 transition-colors duration-100
                 placeholder:text-neutral-400
                 focus:border-brand-500 focus:shadow-[var(--ring-brand)]
                 hover:not-focus:border-brand-400
                 error:border-error-600 error:shadow-[var(--ring-error)]
                 max-md:w-full"
          type="${type}"
          id="${id}"
          name="${id}"
          placeholder="${placeholder}"
          ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
          ${required ? 'required' : ''}
        >
      </div>
      ${error ? `
      <span class="field-error hidden items-center gap-1 text-xs font-normal leading-tight text-error-600" id="${errorId}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ${error}
      </span>
      ` : ''}
    </div>
  `;
}

/**
 * Initialize InputField interactivity
 * @param {string} id - Input ID
 * @param {Object} [options]
 * @param {string} [options.errorId] - Error element ID
 */
function initInputField(id, options = {}) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(options.errorId || `${id}Error`);

  if (!input) return;

  // Clear error on input
  input.addEventListener('input', function () {
    if (input.classList.contains('error') && errorEl) {
      input.classList.remove('error');
      errorEl.classList.remove('flex');
      errorEl.classList.add('hidden');
    }
  });
}

// Export for use
window.InputField = InputField;
window.initInputField = initInputField;
