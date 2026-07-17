var Sidebar = {
  render: function (el) {
    var user = window.userData || { name: 'Maria Castillo', initials: 'MC', role: 'Administrator' };
    AppShell.render(el);
  }
};

export default Sidebar;
