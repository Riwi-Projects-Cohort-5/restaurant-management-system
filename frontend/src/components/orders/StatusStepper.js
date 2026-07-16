/**
 * StatusStepper Component
 * @param {Object} props
 * @param {Array} props.steps - [{label, status: 'done'|'current'|''}]
 * @param {boolean} [props.isCancelled=false]
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    steps = [],
    isCancelled = false
  } = props;

  const stepsHtml = steps.map(function (step, idx) {
    const isLast = idx === steps.length - 1;

    const dotClasses = {
      done: 'bg-primary-500 text-white',
      current: 'bg-brand-500 text-white ring-4 ring-brand-100',
      '': 'bg-neutral-200 text-neutral-500'
    };

    const labelClasses = {
      done: 'text-primary-600',
      current: 'text-brand-700 font-bold',
      '': 'text-neutral-400'
    };

    const connectorClasses = {
      done: 'bg-primary-500',
      '': 'bg-neutral-200'
    };

    const dotClass = dotClasses[step.status] || dotClasses[''];
    const labelClass = labelClasses[step.status] || labelClasses[''];
    const connectorClass = connectorClasses[step.status] || connectorClasses[''];

    const connectorHtml = isLast ? '' : `
      <div class="h-0.5 flex-1 mx-2 ${connectorClass}"></div>
    `;

    const iconHtml = step.status === 'done'
      ? '<i data-lucide="check" class="w-4 h-4"></i>'
      : (step.status === 'current'
        ? `<span class="w-2 h-2 rounded-full bg-white"></span>`
        : '');

    return `
      <div class="flex flex-col items-center relative z-10">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${dotClass}">
          ${iconHtml}
        </div>
        <span class="text-xs mt-2 font-medium ${labelClass}">${step.label}</span>
      </div>
      ${connectorHtml}
    `;
  }).join('');

  const cancelledOverlay = isCancelled ? `
    <div class="absolute inset-0 bg-neutral-900/20 rounded-xl flex items-center justify-center z-20">
      <span class="inline-flex items-center rounded-full font-semibold px-3 py-1 text-xs
                   bg-neutral-900/20 text-neutral-700">
        Cancelled
      </span>
    </div>
  ` : '';

  return `
    <div class="relative">
      <div class="flex items-center justify-between w-full">
        ${stepsHtml}
      </div>
      ${cancelledOverlay}
    </div>
  `;
}

/**
 * Initialize StatusStepper interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup StatusStepper (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
