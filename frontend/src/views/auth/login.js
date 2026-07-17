import { createIcons } from 'lucide';
import * as authStore from '../../store/auth.js';
import { getHomeRoute } from '../../utils/routeGuard.js';
import InputField from '../../components/forms/InputField.js';
import CheckboxField from '../../components/forms/CheckboxField.js';
import SubmitButton from '../../components/forms/SubmitButton.js';
import PasswordToggle from '../../components/forms/PasswordToggle.js';

export function render(container) {
  container.innerHTML = `
    <div class="grid w-full h-screen overflow-hidden lg:grid-cols-[2fr_1fr]" id="loginPage">

      <aside class="relative overflow-hidden h-full max-lg:absolute max-lg:inset-0 max-lg:z-0 max-md:hidden" aria-hidden="true">
        <img src="/src/assets/logos/sun-scene.svg" alt="" class="absolute inset-0 w-full h-full object-cover object-bottom" draggable="false">
        <img src="/src/assets/logos/logo-02.png" alt="El Fogon" class="absolute z-10 top-55 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] min-w-[400px] max-w-[600px] object-contain max-lg:hidden" draggable="false">
      </aside>

      <main class="flex flex-col items-center justify-center z-10 bg-brand-100 lg:p-12 md:max-lg:bg-transparent md:max-lg:p-8 max-md:min-h-screen max-md:px-6 max-md:py-8">

        <div class="mb-12 hidden md:flex items-center gap-4 lg:hidden">
          <img src="/src/assets/logos/logo-01.png" alt="El Fogon" class="h-auto w-[147px] object-contain" draggable="false">
          <img src="/src/assets/logos/logo-03.png" alt="El Fogon" class="h-auto w-[277px] object-contain" draggable="false">
        </div>

        <div class="p-8 w-full max-w-[440px] bg-brand-100 md:max-lg:backdrop-blur-md md:max-lg:rounded-2xl md:max-lg:shadow-[0_8px_30px_rgba(114,49,23,0.12)]">

        <form class="login-form flex flex-col gap-6 w-full" id="loginForm" novalidate>

          <header class="flex flex-col items-center gap-20">
            <img class="hidden lg:block login-logo-desktop h-[180px] w-auto pb-6 object-contain" src="/src/assets/logos/logo-01.png" alt="El Fogon" draggable="false">
            <img class="block lg:hidden login-logo-mobile h-[240px] w-auto pb-6 object-contain" src="/src/assets/logos/logo-00.png" alt="El Fogon" draggable="false">
            <div class="flex flex-col gap-3">
              <h1 class="text-heading font-semibold leading-snug text-neutral-900">Good to see you again</h1>
              <p class="text-sm font-normal leading-normal text-neutral-600">Sign in to manage tables, orders, and reservations.</p>
            </div>
          </header>

          <div id="login-error" class="hidden rounded-md bg-error-50 border border-error-200 p-3">
            <p class="text-sm text-error-700"></p>
          </div>

          <div class="flex flex-col gap-6" id="formBody"></div>

          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between gap-4 flex-wrap max-md:gap-3">
              <div id="checkboxContainer"></div>
              <a href="#" class="text-sm font-normal leading-loose text-primary-600 no-underline whitespace-nowrap hover:text-primary-700 hover:underline">Forgot your password?</a>
            </div>
            <div id="submitContainer"></div>
          </div>

          <footer class="flex items-center justify-center gap-1 text-sm font-normal leading-normal text-neutral-600">
            <span>Don't have an account?</span>
            <a href="#/register" class="font-semibold text-primary-600 no-underline hover:text-primary-700 hover:underline">Contact Us</a>
          </footer>

        </form>
        </div>
      </main>
    </div>
  `;
}

export function init() {
  var formBody = document.getElementById('formBody');
  var checkboxContainer = document.getElementById('checkboxContainer');
  var submitContainer = document.getElementById('submitContainer');
  var errorBox = document.getElementById('login-error');
  var errorText = errorBox ? errorBox.querySelector('p') : null;

  if (!formBody || !checkboxContainer || !submitContainer) return;

  formBody.innerHTML = InputField({
    id: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'you@elfogon.com',
    error: 'Please enter a valid email address',
    required: true,
    autocomplete: 'email'
  });

  var passwordHtml = '<div class="flex flex-col gap-1">';
  passwordHtml += '<label class="text-sm font-medium leading-loose text-neutral-900" for="password">Password</label>';
  passwordHtml += '<div class="relative flex items-center">';
  passwordHtml += '<input class="w-full h-11 text-sm font-normal leading-normal text-neutral-900 box-border pl-3 pr-10 ' +
    'bg-brand-50 border border-brand-300 rounded-md outline-none ' +
    'transition-colors duration-100 ' +
    'placeholder:text-neutral-400 ' +
    'focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(229,119,34,0.15)] ' +
    'hover:not-focus:border-brand-400" ' +
    'type="password" id="password" name="password" placeholder="Enter your password" autocomplete="current-password" required>';
  passwordHtml += PasswordToggle({ inputId: 'password' });
  passwordHtml += '</div></div>';

  formBody.innerHTML += passwordHtml;

  checkboxContainer.innerHTML = CheckboxField({
    id: 'keepSignedIn',
    label: 'Keep me signed in'
  });

  submitContainer.innerHTML = SubmitButton({
    text: 'Sign In',
    id: 'signInBtn'
  });

  initInputField('email');
  initPasswordToggles();
  window.createIcons();

  var form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = document.getElementById('email');
      var passwordInput = document.getElementById('password');
      var signInBtn = document.getElementById('signInBtn');

      var email = emailInput ? emailInput.value.trim() : '';
      var password = passwordInput ? passwordInput.value : '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        var emailErr = document.getElementById('emailError');
        if (emailInput) emailInput.classList.add('error');
        if (emailErr) { emailErr.classList.remove('hidden'); emailErr.classList.add('flex'); }
        return;
      }

      if (!password) return;

      if (signInBtn) {
        signInBtn.disabled = true;
        signInBtn.textContent = 'Signing in...';
      }

      var username = email.split('@')[0];
      var result = authStore.login(username, password);

      if (result.success) {
        window.location.hash = '#' + getHomeRoute(result.user.role);
      } else {
        if (signInBtn) {
          signInBtn.disabled = false;
          signInBtn.textContent = 'Sign In';
        }
        if (errorText) errorText.textContent = result.error || 'Invalid credentials';
        if (errorBox) errorBox.classList.remove('hidden');
      }
    });
  }
}

export function destroy() {}

export default { render: render, init: init, destroy: destroy };
