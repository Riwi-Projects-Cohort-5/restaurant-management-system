function DataTable(opts) {
  opts = opts || {};
  var columns = opts.columns || [];
  var rows = opts.rows || [];
  var className = opts.className || '';

  var html = '<div class="bg-white border border-brand-300 rounded-xl shadow-sm overflow-hidden ' + className + '">';
  html += '<div class="overflow-x-auto"><table class="w-full text-sm text-left">';

  html += '<thead class="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border-b-2 border-brand-300">';
  html += '<tr>';
  columns.forEach(function (col) {
    html += '<th class="px-4 py-3 whitespace-nowrap">' + col.label + '</th>';
  });
  html += '</tr></thead>';

  html += '<tbody class="divide-y divide-brand-200">';
  rows.forEach(function (row, i) {
    var bg = i % 2 === 0 ? 'bg-white' : 'bg-brand-50/50';
    html += '<tr class="' + bg + ' hover:bg-brand-50 transition-colors">';
    columns.forEach(function (col) {
      var cellClass = 'px-4 py-3';
      if (col.primary) cellClass += ' font-semibold text-primary-700';
      if (col.mono) cellClass += ' font-mono text-xs';
      html += '<td class="' + cellClass + '">' + (col.render ? col.render(row) : (row[col.key] || '')) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  return html;
}

export default DataTable;
