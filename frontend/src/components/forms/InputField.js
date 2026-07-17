function InputField(opts) {
  var id = opts.id;
  var label = opts.label || '';
  var type = opts.type || 'text';
  var placeholder = opts.placeholder || '';
  var error = opts.error || '';
  var required = opts.required;
  var autocomplete = opts.autocomplete || '';
  var errorId = id + 'Error';

  var html = '<div class="flex flex-col gap-1">';
  html += '<label class="text-sm font-medium leading-loose text-neutral-900" for="' + id + '">' + label + '</label>';
  html += '<div class="relative flex items-center">';
  html += '<input class="w-full h-11 text-sm font-normal leading-normal text-neutral-900 box-border pl-3 pr-3 ' +
    'bg-brand-50 border border-brand-300 rounded-md outline-none ' +
    'transition-colors duration-100 ' +
    'placeholder:text-neutral-400 ' +
    'focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] ' +
    'hover:not-focus:border-brand-400" ' +
    'type="' + type + '" id="' + id + '" name="' + id + '" placeholder="' + placeholder + '"' +
    (autocomplete ? ' autocomplete="' + autocomplete + '"' : '') +
    (required ? ' required' : '') + '>';
  html += '</div>';

  if (error) {
    html += '<span class="field-error hidden items-center gap-1 text-xs font-normal leading-tight text-error-600" id="' + errorId + '">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    html += error;
    html += '</span>';
  }

  html += '</div>';
  return html;
}

function initInputField(id) {
  var input = document.getElementById(id);
  var errorEl = document.getElementById(id + 'Error');
  if (!input) return;

  input.addEventListener('input', function () {
    if (input.classList.contains('error') && errorEl) {
      input.classList.remove('error');
      errorEl.classList.remove('flex');
      errorEl.classList.add('hidden');
    }
  });
}

window.InputField = InputField;
window.initInputField = initInputField;

export default InputField;
