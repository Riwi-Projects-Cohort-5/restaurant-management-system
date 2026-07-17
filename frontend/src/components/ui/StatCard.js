function StatCard(opts) {
  opts = opts || {};
  var label = opts.label || '';
  var value = opts.value || '0';
  var change = opts.change || '';
  var icon = opts.icon || 'activity';
  var iconBg = opts.iconBg || 'bg-primary-100 text-primary-600';

  var isPositive = change && !change.startsWith('-');
  var changeClass = isPositive
    ? 'bg-success-100 text-success-700'
    : 'bg-error-100 text-error-700';
  var arrowIcon = isPositive ? 'trending-up' : 'trending-down';

  var html = '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm flex items-start gap-4">';
  html += '<div class="w-[52px] h-[52px] rounded-lg flex items-center justify-center shrink-0 ' + iconBg + '">';
  html += '<i data-lucide="' + icon + '" class="w-6 h-6"></i>';
  html += '</div>';
  html += '<div class="flex-1 min-w-0">';
  html += '<p class="text-sm text-brand-500 mb-1">' + label + '</p>';
  html += '<p class="text-[28px] font-bold text-primary-800 font-display leading-tight">' + value + '</p>';
  if (change) {
    html += '<div class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ' + changeClass + '">';
    html += '<i data-lucide="' + arrowIcon + '" class="w-3 h-3"></i>';
    html += change;
    html += '</div>';
  }
  html += '</div></div>';

  return html;
}

export default StatCard;
