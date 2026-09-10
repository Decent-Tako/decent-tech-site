const PROBE_SIZE = '64px';
const PROBE_SAMPLE = 'Hamburgefons Rg';

export function measureAdvance(
  fontFamily: string,
  fontWeight: string | number,
  sample: string,
  fontStretch = '100%',
): number {
  const el = document.createElement('span');
  el.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'visibility:hidden',
    'white-space:nowrap',
    'font-synthesis:none',
    `font-family:${fontFamily}`,
    `font-weight:${fontWeight}`,
    `font-stretch:${fontStretch}`,
    `font-size:${PROBE_SIZE}`,
    'font-style:normal',
    'line-height:1',
  ].join(';');
  el.textContent = sample;
  document.body.append(el);
  const width = el.getBoundingClientRect().width;
  el.remove();
  return width;
}

export async function assertFaceNotFallback(
  family: string,
  weight: string | number,
  sample = PROBE_SAMPLE,
): Promise<void> {
  const spec = `${weight} ${PROBE_SIZE} "${family}"`;
  await document.fonts.ready;
  await document.fonts.load(spec, sample);
  if (!document.fonts.check(spec, sample)) {
    throw new Error(`Font face did not load: ${spec}`);
  }

  const rendered = measureAdvance(`"${family}", Arial, sans-serif`, weight, sample);
  const arial = measureAdvance('Arial, sans-serif', weight, sample);
  if (rendered === arial) {
    throw new Error(
      `"${family}" ${weight} fell back to Arial (advance ${arial}px for ${JSON.stringify(sample)})`,
    );
  }
}

export function assertNoBoxOverlap(elements: Element[]): void {
  const boxes = elements.map((el) => el.getBoundingClientRect());
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      const overlap = !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
      if (overlap) {
        throw new Error(`Specimen boxes ${i} and ${j} overlap`);
      }
    }
  }
}
