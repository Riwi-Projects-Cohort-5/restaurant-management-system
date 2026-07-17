function WelcomeBanner(opts) {
  opts = opts || {};
  var user = opts.user || {};
  var name = user.name || 'Admin';
  var initials = user.initials || 'MC';
  var time = opts.time || 'morning';

  var html = '<div class="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-secondary-900 rounded-2xl p-8 text-white">';
  html += '<div class="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] rounded-full bg-white/10 pointer-events-none"></div>';
  html += '<div class="absolute bottom-[-40px] right-[120px] w-[160px] h-[160px] rounded-full bg-white/5 pointer-events-none"></div>';
  html += '<div class="relative z-10 flex items-center justify-between">';
  html += '<div>';
  html += '<h2 class="text-[28px] font-bold font-display mb-1">Good ' + time + ', ' + name + '</h2>';
  html += '<p class="text-brand-200 text-[15px]">Here\'s what\'s happening with your restaurant today.</p>';
  html += '</div>';
  html += '<div class="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-lg font-bold font-display">' + initials + '</div>';
  html += '</div></div>';

  return html;
}

export default WelcomeBanner;
