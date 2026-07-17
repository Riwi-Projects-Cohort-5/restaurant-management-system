function DetailGrid(opts) {
  opts = opts || {};
  var cols = opts.cols || 3;
  var items = opts.items || [];

  var gridClass = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-' + cols;
  var html = '<div class="' + gridClass + '">';

  items.forEach(function (item) {
    html += '<div class="bg-white border border-brand-300 rounded-xl p-4">';
    html += '<span class="block text-[11px] font-semibold uppercase tracking-wider text-brand-500 mb-1">' + item.label + '</span>';
    html += '<span class="block text-base font-semibold text-primary-800">' + (item.value || '') + '</span>';
    html += '</div>';
  });

  html += '</div>';
  return html;
}

export default DetailGrid;
