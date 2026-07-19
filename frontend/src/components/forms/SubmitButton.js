function SubmitButton(opts) {
  const text = opts.text || "Submit";
  const id = opts.id || "submitBtn";
  const disabled = opts.disabled || false;

  const html =
    '<button type="submit" id="' +
    id +
    '" ' +
    'class="w-full h-11 flex items-center justify-center ' +
    "text-button font-semibold leading-relaxed text-white " +
    "bg-primary-600 border-none rounded-md cursor-pointer " +
    "transition-colors duration-100 " +
    "hover:bg-primary-700 active:bg-primary-800 " +
    'disabled:opacity-60 disabled:cursor-not-allowed"' +
    (disabled ? " disabled" : "") +
    ">" +
    text +
    "</button>";
  return html;
}

function initSubmitButton(_id, _options) {
  // Handled by the login form's own submit handler
}

window.SubmitButton = SubmitButton;
window.initSubmitButton = initSubmitButton;

export default SubmitButton;
