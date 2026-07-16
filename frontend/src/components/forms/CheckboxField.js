/**
 * CheckboxField Component
 * @param {Object} props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.label - Label text
 * @param {boolean} [props.checked=false] - Initial checked state
 * @returns {string} HTML string
 */
function CheckboxField({ id, label, checked = false }) {
  return `
    <label class="flex items-center gap-2 cursor-pointer" for="${id}">
      <input type="checkbox" id="${id}" name="${id}" class="sr-only peer" ${checked ? 'checked' : ''}>
      <span class="checkbox-box w-[18px] h-[18px] border-[1.5px] border-brand-300 rounded
                   flex items-center justify-center bg-brand-50 transition-all duration-100 shrink-0
                   peer-checked:bg-brand-500 peer-checked:border-brand-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 peer-checked:opacity-100 transition-opacity duration-100"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span class="text-label font-medium leading-loose text-neutral-900 select-none">${label}</span>
    </label>
  `;
}

/**
 * Initialize CheckboxField interactivity
 * @param {string} id - Checkbox ID
 */
function initCheckboxField(id) {
  const checkbox = document.getElementById(id);
  if (!checkbox) return;

  // No manual class toggling needed — Tailwind peer-checked handles it
}

// Export for use
window.CheckboxField = CheckboxField;
window.initCheckboxField = initCheckboxField;
