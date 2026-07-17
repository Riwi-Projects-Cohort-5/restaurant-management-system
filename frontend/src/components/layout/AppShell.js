var AppShell = {
  render: function (el) {
    if (el.querySelector('.grid.h-screen')) return;

    var user = window.userData || { name: 'Maria Castillo', initials: 'MC', role: 'Administrator' };

    el.innerHTML =
      '<div class="grid h-screen grid-rows-[64px_1fr] grid-cols-[256px_1fr] overflow-hidden">' +
        '<aside class="grid row-span-2 col-start-1 col-span-1 border-r-2 border-brand-300 bg-white grid-rows-[64px_1fr_auto]">' +
          '<header class="flex items-center gap-2 border-b border-brand-200 p-3"></header>' +
          '<nav class="flex-1 overflow-y-auto p-3 space-y-4"></nav>' +
          '<footer class="border-t border-brand-200 p-4 flex flex-col gap-2"></footer>' +
        '</aside>' +
        '<div class="grid col-start-2 col-span-1 grid-rows-[64px_1fr] grid-cols-1">' +
          '<header class="grid grid-cols-1 grid-rows-1 bg-white border-b-2 border-brand-300"></header>' +
          '<main id="main-content" class="p-6 overflow-auto bg-brand-100 flex-1"></main>' +
        '</div>' +
      '</div>';

    var header = el.querySelector('aside > header');
    var nav = el.querySelector('aside > nav');
    var footer = el.querySelector('aside > footer');
    var topbar = el.querySelector('.grid > header');

    renderSidebarHeader(header);
    renderSidebarNav(nav);
    renderSidebarFooter(footer, user);
    renderTopbar(topbar);

    setupNavListeners(nav);
  }
};

function renderSidebarHeader(el) {
  el.innerHTML =
    '<div class="flex flex-col gap-1">' +
      '<div class="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold font-display">EF</div>' +
      '<div class="flex flex-col">' +
        '<span class="text-[14px] font-medium text-primary-700 font-display">El Fogon</span>' +
        '<span class="text-[12px] text-primary-500">Spanish Cuisine</span>' +
      '</div>' +
    '</div>' +
    '<button class="w-8 h-8 border border-brand-300 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-50"><i data-lucide="panel-left-close" class="w-4 h-4"></i></button>';
}

function renderSidebarNav(el) {
  var role = (window.currentRole || 'admin').toLowerCase();
  var isAdmin = role === 'admin';
  var sections = [
    {
      label: 'Main',
      items: [
        { icon: 'layout-dashboard', label: 'Dashboard', path: '/dashboard', badge: '' },
        { icon: 'shopping-cart', label: 'POS / Orders', path: '/pos', badge: '3' },
        { icon: 'utensils-crossed', label: 'Kitchen', path: '/kitchen', badge: '5' },
        { icon: 'grid-3x3', label: 'Tables', path: '/tables', badge: '' },
      ]
    },
    {
      label: 'Management',
      items: [
        { icon: 'calendar-days', label: 'Reservations', path: '/reservations', badge: '' },
        { icon: 'book-open', label: 'Menu', path: '/menu', badge: '' },
        { icon: 'archive', label: 'Inventory', path: '/inventory', badge: '' },
        { icon: 'credit-card', label: 'Payments', path: '/payments', badge: '' },
        { icon: 'bar-chart-2', label: 'Reports', path: '/reports', badge: '' },
      ]
    },
    {
      label: 'System',
      items: [
        { icon: 'settings', label: 'Settings', path: '/settings', badge: '' },
      ]
    }
  ];

  if (!isAdmin) {
    sections = [sections[0]];
  }

  var currentPath = window.location.hash.slice(1) || '/pos';

  var html = '';
  sections.forEach(function (section) {
    html += '<div>';
    html += '<p class="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2 px-2 font-display">' + section.label + '</p>';
    html += '<div class="space-y-0.5">';
    section.items.forEach(function (item) {
      var isActive = currentPath === item.path;
      var activeClass = isActive
        ? 'bg-brand-50 text-brand-800 border-l-4 border-primary-600 font-semibold'
        : 'text-brand-600 hover:bg-brand-50 border-l-4 border-transparent';
      html += '<a href="#' + item.path + '" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ' + activeClass + '">';
      html += '<i data-lucide="' + item.icon + '" class="w-5 h-5 shrink-0"></i>';
      html += '<span class="flex-1">' + item.label + '</span>';
      if (item.badge) {
        html += '<span class="ml-auto bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">' + item.badge + '</span>';
      }
      html += '</a>';
    });
    html += '</div></div>';
  });

  el.innerHTML = html;
}

function renderSidebarFooter(el, user) {
  el.innerHTML =
    '<div class="flex items-center gap-3 mb-2">' +
      '<div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm font-display">' + user.initials + '</div>' +
      '<div class="flex flex-col">' +
        '<span class="text-[14px] font-medium text-primary-800 font-display">' + user.name + '</span>' +
        '<span class="text-[12px] text-primary-500">' + user.role + '</span>' +
      '</div>' +
    '</div>' +
    '<button class="w-full h-8 border border-brand-300 rounded-lg flex items-center justify-center gap-2 text-brand-600 text-sm hover:bg-brand-50 transition-colors">' +
      '<i data-lucide="log-out" class="w-4 h-4"></i>' +
      '<span>Logout</span>' +
    '</button>';
}

function renderTopbar(el) {
  el.innerHTML =
    '<div class="flex items-center justify-between w-full px-6">' +
      '<h1 class="text-xl font-semibold text-primary-700 font-display">Dashboard</h1>' +
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

function setupNavListeners(nav) {
  nav.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    var icon = link.querySelector('[data-lucide="chevron-down"], [data-lucide="chevron-right"]');
    if (icon && e.target.closest('span')) {
      var parentDiv = link.nextElementSibling;
      if (parentDiv && parentDiv.tagName === 'DIV') {
        var isOpen = parentDiv.style.maxHeight && parentDiv.style.maxHeight !== '0px';
        parentDiv.style.maxHeight = isOpen ? '0px' : parentDiv.scrollHeight + 'px';
        icon.setAttribute('data-lucide', isOpen ? 'chevron-right' : 'chevron-down');
        window.createIcons();
      }
      return;
    }
  });
}

export default AppShell;
