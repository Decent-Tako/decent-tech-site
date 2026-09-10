export const MEASURES = {
  narrow: { label: 'Narrow', ch: 50, className: 'prose-measure-narrow' },
  default: { label: 'Default', ch: 65, className: 'prose-measure-default' },
  wide: { label: 'Wide', ch: 80, className: 'prose-measure-wide' },
} as const;

export type Measure = keyof typeof MEASURES;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function measureZeroCharacters(element: HTMLElement): number {
  const style = getComputedStyle(element);
  const probe = document.createElement('span');
  probe.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'visibility:hidden',
    'white-space:nowrap',
    'font-synthesis:none',
    `font-family:${style.fontFamily}`,
    `font-weight:${style.fontWeight}`,
    `font-size:${style.fontSize}`,
    `font-stretch:${style.fontStretch}`,
    `letter-spacing:${style.letterSpacing}`,
    'line-height:1',
  ].join(';');
  const zeros = '0'.repeat(100);
  probe.textContent = zeros;
  document.body.append(probe);
  const zeroWidth = probe.getBoundingClientRect().width / zeros.length;
  probe.remove();
  if (zeroWidth === 0) {
    return 0;
  }

  const padding =
    (Number.parseFloat(style.paddingLeft) || 0) +
    (Number.parseFloat(style.paddingRight) || 0);
  const border =
    (Number.parseFloat(style.borderLeftWidth) || 0) +
    (Number.parseFloat(style.borderRightWidth) || 0);
  const usedWidth = element.getBoundingClientRect().width;
  const widthForCh =
    style.boxSizing === 'border-box' ? usedWidth : usedWidth - padding - border;
  return Math.round(widthForCh / zeroWidth);
}
