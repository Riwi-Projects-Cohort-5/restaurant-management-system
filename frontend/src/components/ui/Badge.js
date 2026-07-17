var variants = {
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error:   'bg-error-100 text-error-700',
  info:    'bg-info-100 text-info-700',
  brand:   'bg-brand-100 text-brand-700',
  accent:  'bg-accent-100 text-accent-700',
  neutral: 'bg-neutral-100 text-neutral-700',
};

function Badge(opts) {
  opts = opts || {};
  var text = opts.text || '';
  var color = opts.color || 'brand';
  var variant = variants[color] || variants.brand;
  var size = opts.size === 'sm' ? ' text-[10px] px-1.5 py-0.5' : ' text-xs px-2 py-0.5';
  var withDot = opts.dot !== false;

  var html = '<span class="inline-flex items-center gap-1 font-semibold rounded-full whitespace-nowrap ' + variant + size + '">';
  if (withDot) {
    html += '<span class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>';
  }
  html += text;
  html += '</span>';
  return html;
}

Badge.variants = variants;
export default Badge;
