function WelcomeBanner(opts) {
  opts = opts || {};
  var user = opts.user || {};
  var name = user.name || "Admin";
  var initials = user.initials || "MC";
  var time = opts.time || "morning";

  var html =
    '<div class="relative overflow-hidden rounded-2xl p-8 mb-6 flex items-center justify-between shadow-[0_8px_32px_rgba(114,49,23,0.25),0_2px_8px_rgba(0,0,0,0.1)]" style="background:linear-gradient(135deg, #E57722 0%, #B14616 40%, #4F473F 100%);">';
  html +=
    '<div class="absolute rounded-full pointer-events-none w-[450px] h-[450px]" style="top:-60%;right:-5%;background:radial-gradient(circle,rgba(251,191,36,0.25) 0%,transparent 70%);"></div>';
  html +=
    '<div class="absolute rounded-full pointer-events-none w-[350px] h-[350px]" style="bottom:-40%;left:20%;background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%);"></div>';
  html += '<div class="relative z-10">';
  html +=
    '<h2 class="text-white mb-1 font-display text-[28px] font-bold tracking-tight">Good ' +
    time +
    ", " +
    name +
    "</h2>";
  html +=
    "<p class=\"text-[15px] font-normal text-brand-200\">Here's what's happening at El Fogón today.</p>";
  html += "</div>";
  html +=
    '<div class="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full w-16 h-16 bg-white text-[20px] font-bold text-brand-600">' +
    initials +
    "</div>";
  html += "</div>";

  return html;
}

export default WelcomeBanner;
