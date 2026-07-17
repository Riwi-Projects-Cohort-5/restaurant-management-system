import Badge from '../ui/Badge.js';

function TableStatusCard() {
  var statusCounts = { available: 4, occupied: 6, reserved: 2 };
  var total = 12;
  var occupiedPct = ((statusCounts.occupied / total) * 100).toFixed(0);
  var reservedPct = ((statusCounts.reserved / total) * 100).toFixed(0);
  var availablePct = ((statusCounts.available / total) * 100).toFixed(0);

  var html = '<div class="bg-white border border-brand-300 rounded-xl shadow-sm p-5 h-full">';
  html += '<div class="flex justify-between items-center mb-4">';
  html += '<h3 class="text-base font-semibold text-primary-700 font-display">Table Status</h3>';
  html += '<span class="text-sm text-brand-500 font-medium">' + total + ' tables</span>';
  html += '</div>';

  html += '<div class="space-y-3">';

  html += '<div class="flex items-center justify-between">';
  html += '<div class="flex items-center gap-2">' + Badge({ text: 'Occupied', color: 'warning', size: 'sm' }) + '</div>';
  html += '<span class="text-sm font-semibold text-primary-800">' + statusCounts.occupied + ' tables</span>';
  html += '</div>';
  html += '<div class="w-full bg-brand-100 rounded-full h-2.5 overflow-hidden">';
  html += '<div class="bg-warning-400 h-full rounded-full" style="width:' + occupiedPct + '%"></div>';
  html += '</div>';

  html += '<div class="flex items-center justify-between mt-3">';
  html += '<div class="flex items-center gap-2">' + Badge({ text: 'Reserved', color: 'info', size: 'sm' }) + '</div>';
  html += '<span class="text-sm font-semibold text-primary-800">' + statusCounts.reserved + ' tables</span>';
  html += '</div>';
  html += '<div class="w-full bg-brand-100 rounded-full h-2.5 overflow-hidden">';
  html += '<div class="bg-info-400 h-full rounded-full" style="width:' + reservedPct + '%"></div>';
  html += '</div>';

  html += '<div class="flex items-center justify-between mt-3">';
  html += '<div class="flex items-center gap-2">' + Badge({ text: 'Available', color: 'success', size: 'sm' }) + '</div>';
  html += '<span class="text-sm font-semibold text-primary-800">' + statusCounts.available + ' tables</span>';
  html += '</div>';
  html += '<div class="w-full bg-brand-100 rounded-full h-2.5 overflow-hidden">';
  html += '<div class="bg-success-400 h-full rounded-full" style="width:' + availablePct + '%"></div>';
  html += '</div>';

  html += '</div></div>';
  return html;
}

export default TableStatusCard;
