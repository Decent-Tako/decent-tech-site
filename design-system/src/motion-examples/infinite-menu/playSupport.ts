function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

// Drag the pointer across the target. The arcball reads the pointer once per
// animation frame, so each event waits for a frame. The pointer stays down for
// `holdFrames` frames after the last move so the eased drag reaches the end.
export async function dragPointer(
  target: Element,
  deltaX: number,
  steps = 3,
  holdFrames = 12,
): Promise<void> {
  const rect = target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 - deltaX / 2;
  const clientY = rect.top + rect.height / 2;
  const init = (clientX: number, buttons: number): PointerEventInit => ({
    clientX,
    clientY,
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
    button: 0,
    buttons,
  });

  target.dispatchEvent(new PointerEvent('pointerdown', init(startX, 1)));
  await nextFrame();
  for (let step = 1; step <= steps; step += 1) {
    const x = startX + (deltaX * step) / steps;
    target.dispatchEvent(new PointerEvent('pointermove', init(x, 1)));
    await nextFrame();
  }
  for (let frame = 0; frame < holdFrames; frame += 1) {
    await nextFrame();
  }
  target.dispatchEvent(new PointerEvent('pointerup', init(startX + deltaX, 0)));
}

export type PaintSample = {
  // Grid samples whose colour differs from the background.
  painted: number;
  // Total grid samples.
  samples: number;
  width: number;
  height: number;
};

// Colour distance above which a sample counts as painted. The discs are
// darker or lighter than the background by far more than this.
const TOLERANCE = 8;

// Copy the WebGL canvas into a 2D canvas and sample a `grid` by `grid` set
// of pixels against the background colour.
//
// The WebGL context has no `preserveDrawingBuffer`, so the browser clears the
// drawing buffer after every composite. `drawImage` sees the frame only
// inside an animation frame callback that runs after the menu's own callback
// painted it. The menu registers its next callback while its current one
// runs, so a callback registered from a task (not from inside a frame) always
// runs after the menu's callback in the next frame.
export function sampleCanvas(
  source: HTMLCanvasElement,
  background: string,
  grid = 16,
): Promise<PaintSample> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          resolve(sampleNow(source, background, grid));
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    }, 0);
  });
}

function sampleNow(
  source: HTMLCanvasElement,
  background: string,
  grid: number,
): PaintSample {
  const { width, height } = source;
  const result = { painted: 0, samples: grid * grid, width, height };
  if (!width || !height) return result;

  const probe = document.createElement('canvas');
  probe.width = width;
  probe.height = height;
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('The 2D probe context is not available.');

  // Composite the frame over the background, as the page does.
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  const reference = ctx.getImageData(0, 0, 1, 1).data;
  ctx.drawImage(source, 0, 0);
  const data = ctx.getImageData(0, 0, width, height).data;

  for (let gy = 0; gy < grid; gy += 1) {
    for (let gx = 0; gx < grid; gx += 1) {
      const x = Math.floor(((gx + 0.5) / grid) * width);
      const y = Math.floor(((gy + 0.5) / grid) * height);
      const i = (y * width + x) * 4;
      const distance =
        Math.abs(data[i] - reference[0]) +
        Math.abs(data[i + 1] - reference[1]) +
        Math.abs(data[i + 2] - reference[2]);
      if (distance > TOLERANCE) result.painted += 1;
    }
  }
  return result;
}

// Assert that the menu paints the canvas. Samples once per frame for up to
// `frames` frames and returns the first sample with painted pixels. Throws
// when every sample matches the background.
export async function assertCanvasPainted(
  source: HTMLCanvasElement,
  background: string,
  frames = 60,
): Promise<PaintSample> {
  let last: PaintSample = { painted: 0, samples: 0, width: 0, height: 0 };
  for (let frame = 0; frame < frames; frame += 1) {
    last = await sampleCanvas(source, background);
    if (last.painted > 0) return last;
  }
  throw new Error(
    `The canvas did not paint: 0 of ${last.samples} samples differ from ${background} ` +
      `after ${frames} frames (${last.width} by ${last.height} pixels).`,
  );
}
