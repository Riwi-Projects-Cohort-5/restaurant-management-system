var variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-brand-500 hover:bg-brand-600 text-white',
  danger:    'bg-error-500 hover:bg-error-600 text-white',
  ghost:     'bg-transparent hover:bg-brand-50 text-brand-600 border border-brand-300',
  brand:     'bg-brand-500 hover:bg-brand-600 text-white',
  accent:    'bg-accent-400 hover:bg-accent-500 text-white',
};

var sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

function Button(opts) {
  opts = opts || {};
  var variant = variants[opts.variant] || variants.primary;
  var size = opts.size ? (sizes[opts.size] || sizes.md) : sizes.md;
  var disabled = opts.disabled ? ' disabled opacity-50 pointer-events-none' : '';
  var icon = opts.icon
    ? '<i data-lucide="' + opts.icon + '" class="w-4 h-4"></i>'
    : '';
  var fullWidth = opts.fullWidth ? ' w-full flex-1' : '';
  var className = 'inline-flex items-center justify-center gap-2 font-semibold rounded-md border border-transparent transition-colors cursor-pointer ' + variant + ' ' + size + disabled + fullWidth;

  return '<button class="' + className + '" id="' + (opts.id || '') + '">' + icon + '<span>' + (opts.text || '') + '</span></button>';
}

Button.variants = variants;
Button.sizes = sizes;

export default Button;
