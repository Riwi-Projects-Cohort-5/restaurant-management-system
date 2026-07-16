/**
 * WelcomeBanner Component
 * @param {Object} props
 * @param {string} props.userName - User name
 * @param {string} props.userInitials - User initials for avatar
 * @param {string} props.subtitle - Greeting subtitle
 * @param {string} [props.id] - Banner ID
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    userName = '',
    userInitials = '',
    subtitle = '',
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';

  return `
    <style>
      .welcome-banner {
        position: relative;
        overflow: hidden;
      }
      .welcome-banner::before {
        content: '';
        position: absolute;
        top: -40%;
        right: -10%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      }
      .welcome-banner::after {
        content: '';
        position: absolute;
        bottom: -30%;
        left: -5%;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      }
    </style>

    <div ${idAttr}
         class="welcome-banner bg-gradient-to-br from-brand-500 via-brand-700 to-secondary-900
                rounded-2xl p-8 flex justify-between items-center relative z-0
                ${className}">

      <div class="relative z-10">
        <h1 class="text-[28px] font-bold text-white leading-tight font-display m-0 p-0">
          ${userName}
        </h1>
        <p class="text-[15px] text-brand-200 mt-1.5 m-0 p-0">
          ${subtitle}
        </p>
      </div>

      <div class="relative z-10 flex items-center justify-center
                  w-16 h-16 rounded-full bg-white text-brand-600
                  text-xl font-bold font-display shrink-0 shadow-lg">
        ${userInitials}
      </div>
    </div>
  `;
}

/**
 * Initialize WelcomeBanner interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup WelcomeBanner (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
