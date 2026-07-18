import * as settingsStore from "../../store/settings.js";

function render(el) {
  var settings = settingsStore.getSettings();

  var html = '<div class="space-y-5 max-w-2xl">';

  html += '<div class="flex items-center justify-between">';
  html += '<div><h2 class="text-xl font-semibold text-brand-900 font-display">Settings</h2>';
  html += '<p class="text-sm text-secondary-500 mt-0.5">Restaurant profile and preferences</p></div>';
  html += "</div>";

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">Restaurant Profile</h3>';
  html += "</div>";
  html += '<div class="p-5">';
  html += '<div class="space-y-4">';

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Restaurant Name</label>';
  html += '<input type="text" id="settings-name" value="' + (settings.restaurant_name || "") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Address</label>';
  html += '<input type="text" id="settings-address" value="' + (settings.address || "") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div class="grid grid-cols-2 gap-4">';
  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Phone</label>';
  html += '<input type="tel" id="settings-phone" value="' + (settings.phone || "") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Email</label>';
  html += '<input type="email" id="settings-email" value="' + (settings.email || "") + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";
  html += "</div>";

  html += "</div></div></div>";

  html += '<div class="bg-white border border-brand-300 rounded-xl overflow-hidden">';
  html += '<div class="px-5 py-4 border-b border-brand-100 bg-brand-50">';
  html += '<h3 class="text-sm font-bold text-brand-800 uppercase tracking-wider">Tax & Currency</h3>';
  html += "</div>";
  html += '<div class="p-5">';
  html += '<div class="grid grid-cols-3 gap-4">';

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Tax Rate (%)</label>';
  html += '<input type="number" id="settings-tax" step="0.1" min="0" max="100" value="' + (settings.tax_rate || 0) + '" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Currency Symbol</label>';
  html += '<input type="text" id="settings-currency-symbol" value="' + (settings.currency_symbol || "$") + '" maxlength="3" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all" />';
  html += "</div>";

  html += '<div>';
  html += '<label class="block text-sm font-semibold text-secondary-600 mb-1">Currency Code</label>';
  html += '<select id="settings-currency-code" class="w-full px-3 py-2 border border-brand-200 rounded-lg text-sm text-neutral-900 bg-white cursor-pointer outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] transition-all">';
  var codes = ["USD", "EUR", "GBP", "MXN", "CAD", "JPY"];
  codes.forEach(function (code) {
    html += '<option value="' + code + '"' + (settings.currency_code === code ? " selected" : "") + ">" + code + "</option>";
  });
  html += "</select></div>";

  html += "</div></div></div>";

  html += '<div class="flex items-center gap-3">';
  html += '<button data-action="save-settings" class="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white border-0 cursor-pointer transition-colors"><i data-lucide="check" class="w-4 h-4"></i> Save Settings</button>';
  html += '<button data-action="reset-settings" class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 cursor-pointer transition-colors"><i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset to Defaults</button>';
  html += "</div>";

  html += "</div>";

  el.innerHTML = html;
  window.createIcons();

  el.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;

    var action = btn.getAttribute("data-action");

    if (action === "save-settings") {
      var data = {
        restaurant_name: (document.getElementById("settings-name") || {}).value || "",
        address: (document.getElementById("settings-address") || {}).value || "",
        phone: (document.getElementById("settings-phone") || {}).value || "",
        email: (document.getElementById("settings-email") || {}).value || "",
        tax_rate: parseFloat((document.getElementById("settings-tax") || {}).value) || 0,
        currency_symbol: (document.getElementById("settings-currency-symbol") || {}).value || "$",
        currency_code: (document.getElementById("settings-currency-code") || {}).value || "USD",
      };
      settingsStore.updateSettings(data);
      render(el);
    } else if (action === "reset-settings") {
      if (confirm("Reset all settings to defaults?")) {
        settingsStore.resetSettings();
        render(el);
      }
    }
  });
}

var SettingsView = {
  render: render,
  init: function () {},
  destroy: function () {},
};

export default SettingsView;
