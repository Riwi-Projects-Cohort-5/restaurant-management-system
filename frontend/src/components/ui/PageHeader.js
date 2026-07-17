function PageHeader(opts) {
  opts = opts || {};
  var title = opts.title || '';
  var left = opts.left || '';
  var right = opts.right || '';

  var html = '<div class="flex items-center justify-between">';
  html += '<div>' + (left || '<h2 class="text-xl font-semibold text-primary-700 font-display">' + title + '</h2>') + '</div>';
  html += '<div class="flex items-center gap-3">' + right + '</div>';
  html += '</div>';
  return html;
}

export default PageHeader;
