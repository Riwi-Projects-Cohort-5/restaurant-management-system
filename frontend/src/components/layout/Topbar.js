import AppShell from "./AppShell.js";

var Topbar = {
  render: function (el, title) {
    AppShell.renderTopbar(el);
    if (title) {
      var titleEl = el.querySelector("#topbarTitle");
      if (titleEl) titleEl.textContent = title;
    }
  },
  updateTitle: function (path) {
    AppShell.updateTopbarTitle(path);
  },
};

export default Topbar;
