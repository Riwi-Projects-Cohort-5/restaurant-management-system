var Topbar = {
  render: function (el, title) {
    el.innerHTML =
      '<div class="flex items-center justify-between w-full px-6">' +
        '<h1 class="text-xl font-semibold text-primary-700 font-display">' + (title || 'Dashboard') + '</h1>' +
        '<div class="flex items-center gap-3">' +
          '<div class="flex items-center border border-brand-300 rounded-full h-8 px-3 gap-2 w-[200px]">' +
            '<i data-lucide="search" class="w-4 h-4 text-brand-500"></i>' +
            '<input type="text" placeholder="Search menu..." class="bg-transparent text-sm outline-none flex-1 text-brand-600 placeholder-brand-400" />' +
          '</div>' +
          '<div class="w-px h-6 bg-brand-200"></div>' +
          '<button class="relative w-8 h-8 border border-brand-300 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-50">' +
            '<i data-lucide="bell" class="w-4 h-4"></i>' +
            '<span class="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>' +
          '</button>' +
          '<button class="w-8 h-8 border border-brand-300 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-50">' +
            '<i data-lucide="sun" class="w-4 h-4"></i>' +
          '</button>' +
        '</div>' +
      '</div>';
  }
};

export default Topbar;
