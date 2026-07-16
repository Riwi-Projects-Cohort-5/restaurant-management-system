/**
 * TableStatusCard Component
 * @module components/dashboard/TableStatusCard
 *
 * Dashboard card showing an SVG donut chart of table statuses with a
 * legend and a stacked summary bar.
 *
 * @param {Object} props
 * @param {number} [props.available=0]
 * @param {number} [props.occupied=0]
 * @param {number} [props.reserved=0]
 * @param {number} [props.total=0]
 */

function pct(part, total) {
  if (total === 0) return 0;
  return (part / total) * 100;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    // full circle — two half-arcs
    const mid = startAngle + 180;
    const s1 = polarToCartesian(cx, cy, r, startAngle);
    const m1 = polarToCartesian(cx, cy, r, mid);
    const m2 = polarToCartesian(cx, cy, r, mid);
    const e1 = polarToCartesian(cx, cy, r, endAngle - 0.01);
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${r} ${r} 0 1 1 ${m1.x} ${m1.y}`,
      `A ${r} ${r} 0 1 1 ${m2.x} ${m2.y}`,
      `A ${r} ${r} 0 1 1 ${e1.x} ${e1.y}`,
    ].join(' ');
  }
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function render(props = {}) {
  const { available = 0, occupied = 0, reserved = 0, total = 0 } = props;
  const sum = available + occupied + reserved;
  const effectiveTotal = total || sum || 1;

  const cx = 60;
  const cy = 60;
  const r = 48;
  const strokeW = 16;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { value: available, color: 'var(--color-success-500, #22c55e)', label: 'Available' },
    { value: occupied, color: 'var(--color-warning-500, #f59e0b)', label: 'Occupied' },
    { value: reserved, color: 'var(--color-accent-500, #8b5cf6)', label: 'Reserved' },
  ];

  // Build SVG arc paths
  let angle = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const sweep = (s.value / effectiveTotal) * 360;
      const startAngle = angle;
      const endAngle = angle + sweep;
      angle = endAngle;
      return { ...s, startAngle, endAngle, sweep };
    });

  const arcElements = arcs
    .map(
      (a) =>
        `<path d="${arcPath(cx, cy, r, a.startAngle, a.endAngle)}" fill="none" stroke="${a.color}" stroke-width="${strokeW}" stroke-linecap="round" />`
    )
    .join('');

  const legendItems = segments
    .map(
      (s) => `
      <li class="flex items-center gap-2 text-sm">
        <span class="w-3 h-3 rounded-full shrink-0" style="background:${s.color}"></span>
        <span class="text-secondary-600">${s.label}</span>
        <span class="font-semibold text-secondary-800">${s.value}</span>
      </li>
    `
    )
    .join('');

  const availPct = pct(available, effectiveTotal);
  const occPct = pct(occupied, effectiveTotal);
  const resPct = pct(reserved, effectiveTotal);

  const stackedBar = `
    <div class="h-3 rounded-full flex overflow-hidden mt-4" role="img" aria-label="Table status breakdown">
      ${available ? `<span class="bg-success-500" style="width:${availPct}%"></span>` : ''}
      ${occupied ? `<span class="bg-warning-500" style="width:${occPct}%"></span>` : ''}
      ${reserved ? `<span class="bg-accent-500" style="width:${resPct}%"></span>` : ''}
    </div>
  `;

  return `
    <div class="bg-white rounded-xl p-5 border border-brand-200">
      <h3 class="text-base font-bold text-brand-900 mb-4">Table Status</h3>
      <div class="flex items-center gap-6">
        <div class="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-neutral-100, #f3f4f6)" stroke-width="${strokeW}" />
            ${arcElements}
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-brand-900">
            ${effectiveTotal}
          </span>
        </div>
        <ul class="flex flex-col gap-2" role="list" aria-label="Table status counts">
          ${legendItems}
        </ul>
      </div>
      ${stackedBar}
    </div>
  `;
}

export function init() {
  /* purely presentational — no listeners */
}

export function destroy() {
  /* no-op */
}
