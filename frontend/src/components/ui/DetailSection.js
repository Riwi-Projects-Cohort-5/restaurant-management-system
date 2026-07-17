function DetailSection(opts) {
  opts = opts || {};
  var title = opts.title || '';
  var body = opts.body || '';

  var html = '<div class="bg-white border border-brand-300 rounded-xl p-5">';
  if (title) {
    html += '<h4 class="text-sm font-semibold text-primary-700 font-display mb-3">' + title + '</h4>';
  }
  html += '<div class="text-sm text-brand-700">' + body + '</div>';
  html += '</div>';
  return html;
}

export default DetailSection;
