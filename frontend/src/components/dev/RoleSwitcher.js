const ROLES = [
  { id: "admin", label: "Admin", color: "bg-error-500" },
  { id: "waiter", label: "Waiter", color: "bg-brand-500" },
  { id: "chef", label: "Chef", color: "bg-accent-500" },
  { id: "cashier", label: "Cashier", color: "bg-success-500" },
];

let expanded = false;

function getCurrentRole() {
  return window.currentRole || "admin";
}

function renderFloatingButton() {
  const existing = document.getElementById("dev-role-switcher");
  if (existing) existing.remove();

  const role = getCurrentRole();
  const roleMeta =
    ROLES.find(function (r) {
      return r.id === role;
    }) || ROLES[0];

  const wrapper = document.createElement("div");
  wrapper.id = "dev-role-switcher";
  wrapper.style.cssText =
    "position:fixed;bottom:20px;right:20px;z-index:9999;font-family:system-ui,sans-serif;";

  if (expanded) {
    let html =
      '<div style="background:#1e1e1e;border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,0.35);min-width:160px;">';
    html +=
      '<div style="padding:4px 8px 6px;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.05em;">DEV Role Switch</div>';
    ROLES.forEach(function (r) {
      const isActive = r.id === role;
      const bg = isActive ? r.color : "transparent";
      const textColor = isActive ? "#fff" : "#ccc";
      const hoverBg = isActive
        ? ""
        : "onmouseover=\"this.style.background='#333'\" onmouseout=\"this.style.background='transparent'\"";
      html +=
        '<button data-role="' +
        r.id +
        '" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border:none;border-radius:8px;background:' +
        bg +
        ";color:" +
        textColor +
        ";font-size:13px;font-weight:600;cursor:pointer;text-align:left;" +
        (isActive ? "" : hoverBg) +
        '">';
      html +=
        '<span style="width:8px;height:8px;border-radius:50%;background:' +
        (isActive ? "#fff" : r.color) +
        ';flex-shrink:0;"></span>';
      html += r.label;
      if (isActive) {
        html += '<span style="margin-left:auto;font-size:10px;opacity:0.7;">&#10003;</span>';
      }
      html += "</button>";
    });
    html += "</div>";
    wrapper.innerHTML = html;
  } else {
    wrapper.innerHTML =
      '<button id="dev-role-toggle" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9999px;border:2px solid ' +
      (roleMeta ? roleMeta.color.replace("bg-", "").replace("500", "") : "#666") +
      ';background:#1e1e1e;color:#fff;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.3);font-family:inherit;text-transform:uppercase;letter-spacing:0.03em;">' +
      '<span style="width:8px;height:8px;border-radius:50%;background:' +
      (roleMeta ? roleMeta.color.replace("bg-", "") : "#666") +
      ';"></span>' +
      (roleMeta ? roleMeta.label : role) +
      "</button>";
  }

  document.body.appendChild(wrapper);

  if (expanded) {
    wrapper.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchRole(this.getAttribute("data-role"));
      });
    });
  } else {
    const toggleBtn = document.getElementById("dev-role-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        expanded = true;
        renderFloatingButton();
      });
    }
  }

  document.addEventListener("click", function handleOutside(e) {
    if (!wrapper.contains(e.target)) {
      expanded = false;
      renderFloatingButton();
      document.removeEventListener("click", handleOutside);
    }
  });
}

function switchRole(newRole) {
  const auth = window._devAuthModule;
  if (!auth) return;

  const user = auth.currentUser();
  if (!user) return;

  auth.setRole(newRole);
  window.currentRole = newRole;

  const roleLabels = {
    admin: "Administrator",
    waiter: "Waiter",
    chef: "Chef",
    cashier: "Cashier",
  };
  const username = user.displayName || user.username || "Admin";
  const initials = username
    .split(" ")
    .map(function (w) {
      return w[0];
    })
    .join("")
    .toUpperCase()
    .slice(0, 2);
  window.userData = {
    name: username,
    initials: initials,
    role: roleLabels[newRole] || newRole,
  };

  expanded = false;
  renderFloatingButton();

  window.dispatchEvent(new CustomEvent("dev-role-changed", { detail: { role: newRole } }));
}

export function initRoleSwitcher(authModule) {
  if (!import.meta.env.DEV) return;

  window._devAuthModule = authModule;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(renderFloatingButton, 500);
    });
  } else {
    setTimeout(renderFloatingButton, 500);
  }
}

export default { initRoleSwitcher };
