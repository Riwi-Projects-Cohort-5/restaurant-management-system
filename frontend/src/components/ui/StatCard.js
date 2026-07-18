function StatCard(opts) {
  opts = opts || {};
  var label = opts.label || "";
  var value = opts.value || "0";
  var change = opts.change || "";
  var icon = opts.icon || "activity";
  var iconBg = opts.iconBg || "";
  var changeNeutral = opts.changeNeutral || false;

  var isPositive = change && !change.startsWith("-") && !changeNeutral;
  var changeClass = changeNeutral
    ? "bg-neutral-100 text-neutral-600"
    : isPositive
      ? "bg-success-100 text-success-700"
      : "bg-error-100 text-error-700";
  var arrowIcon = changeNeutral ? null : isPositive ? "trending-up" : "trending-down";

  var html =
    '<div class="bg-white border border-brand-300 rounded-xl p-5 shadow-sm flex items-start gap-4">';
  html +=
    '<div class="w-[52px] h-[52px] rounded-lg flex items-center justify-center shrink-0 ' +
    iconBg +
    '">';
  html += '<i data-lucide="' + icon + '" class="w-6 h-6"></i>';
  html += "</div>";
  html += '<div class="flex-1 min-w-0">';
  html += '<p class="text-sm font-medium mb-1 text-secondary-500">' + label + "</p>";
  html +=
    '<p class="text-[28px] font-bold leading-tight font-display text-brand-900">' + value + "</p>";
  if (change) {
    html +=
      '<div class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ' +
      changeClass +
      '">';
    if (arrowIcon) html += '<i data-lucide="' + arrowIcon + '" class="w-3 h-3"></i>';
    html += change;
    html += "</div>";
  }
  html += "</div></div>";

  return html;
}

export default StatCard;
