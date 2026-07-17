function Card(opts) {
  opts = opts || {};
  var title = opts.title || '';
  var headerRight = opts.headerRight || '';
  var body = opts.body || '';
  var noPadding = opts.noPadding ? ' p-0' : '';
  var headerClass = opts.headerClass || '';

  var html = '<div class="bg-white border border-brand-300 rounded-xl shadow-[0_2px_6px_rgba(114,49,23,0.08)] overflow-hidden">';

  if (title) {
    html += '<div class="px-5 pt-5 pb-3 flex justify-between items-center border-b border-brand-200 ' + headerClass + '">';
    html += '<h3 class="text-base font-semibold text-primary-700 font-display">' + title + '</h3>';
    if (headerRight) {
      html += '<div>' + headerRight + '</div>';
    }
    html += '</div>';
  }

  html += '<div class="px-5 pb-5 pt-3' + noPadding + '">' + body + '</div>';
  html += '</div>';

  return html;
}

export default Card;
