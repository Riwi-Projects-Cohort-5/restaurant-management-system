/**
 * Login Component — Vanilla JS
 * Handles: password toggle, form validation, error states
 */

(function () {
  "use strict";

  // ── DOM refs ──
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.getElementById("passwordToggle");
  const emailError = document.getElementById("emailError");

  // ── Initialize Lucide icons ──
  function initIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // ── Password visibility toggle ──
  function setupPasswordToggle() {
    if (!passwordToggle || !passwordInput) return;

    passwordToggle.addEventListener("click", function () {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      const eyeIcon = passwordToggle.querySelector(".icon-eye");
      const eyeOffIcon = passwordToggle.querySelector(".icon-eye-off");

      if (eyeIcon && eyeOffIcon) {
        eyeIcon.style.display = isPassword ? "none" : "block";
        eyeOffIcon.style.display = isPassword ? "block" : "none";
      }
    });
  }

  // ── Email validation ──
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showEmailError(show) {
    if (!emailInput || !emailError) return;

    if (show) {
      emailInput.classList.add("error");
      emailError.classList.add("visible");
    } else {
      emailInput.classList.remove("error");
      emailError.classList.remove("visible");
    }
  }

  // ── Clear error on input ──
  function setupErrorClear() {
    if (!emailInput) return;

    emailInput.addEventListener("input", function () {
      if (emailInput.classList.contains("error")) {
        showEmailError(false);
      }
    });
  }

  // ── Form submission ──
  function setupFormSubmit() {
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";
      let hasError = false;

      // Validate email
      if (!email || !isValidEmail(email)) {
        showEmailError(true);
        hasError = true;
      } else {
        showEmailError(false);
      }

      // Validate password
      if (!password) {
        hasError = true;
      }

      if (hasError) return;
    });
  }

  // ── Checkbox toggle ──
  function setupCheckbox() {
    const checkbox = document.getElementById("keepSignedIn");
    const checkboxBox = document.querySelector(".checkbox-box");
    if (!checkbox || !checkboxBox) return;

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        checkboxBox.classList.add("checked");
      } else {
        checkboxBox.classList.remove("checked");
      }
    });
  }

  // ── Init ──
  function init() {
    initIcons();
    setupPasswordToggle();
    setupCheckbox();
    setupErrorClear();
    setupFormSubmit();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
