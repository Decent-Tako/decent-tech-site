// Prove that a canvas has drawn something other than its background.
//
// Works for WebGL, WebGL 2, and 2D canvases. Each attempt waits for a task
// and then an animation frame, so a sketch that draws every frame has drawn
// before the read and the drawing buffer is still intact. A WebGL sketch
// that draws once and then stops needs `preserveDrawingBuffer: true`, or
// the story asserts a data attribute instead. Record either in the fixed
// note.

type Rgb = readonly [number, number, number];

export type CanvasPaintOptions = {
  // Points per axis in the sample grid. Default 8, so 64 samples.
  grid?: number;
  // Per-channel distance from the background that counts as paint. Default 16.
  tolerance?: number;
  // How long to keep trying. Default 5000 ms.
  timeoutMs?: number;
};

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value) || full.length !== 6) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => requestAnimationFrame(() => resolve()), 0);
  });
}

function readWebgl(canvas: HTMLCanvasElement): Uint8Array | null {
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  try {
    gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
  } catch {
    return null;
  }
  if (!gl) return null;
  // Read the default framebuffer, then restore the sketch's binding.
  const bound = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(
    0,
    0,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, bound);
  return pixels;
}

function read2d(canvas: HTMLCanvasElement): Uint8ClampedArray | null {
  try {
    const ctx = canvas.getContext('2d');
    if (ctx) return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  } catch {
    // Fall through to a copy.
  }
  try {
    const copy = document.createElement('canvas');
    copy.width = canvas.width;
    copy.height = canvas.height;
    const ctx = copy.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(canvas, 0, 0);
    return ctx.getImageData(0, 0, copy.width, copy.height).data;
  } catch {
    return null;
  }
}

// True when any sampled pixel is opaque and differs from the background.
export function isCanvasPainted(
  canvas: HTMLCanvasElement,
  backgroundHex: string,
  { grid = 8, tolerance = 16 }: CanvasPaintOptions = {},
): boolean {
  const width = canvas.width;
  const height = canvas.height;
  if (width === 0 || height === 0) return false;
  const background = hexToRgb(backgroundHex);
  const data = readWebgl(canvas) ?? read2d(canvas);
  if (!data) return false;

  for (let gy = 0; gy < grid; gy += 1) {
    for (let gx = 0; gx < grid; gx += 1) {
      const x = Math.floor(((gx + 0.5) / grid) * width);
      const y = Math.floor(((gy + 0.5) / grid) * height);
      const offset = (y * width + x) * 4;
      const alpha = data[offset + 3];
      if (alpha === 0) continue;
      const far =
        Math.abs(data[offset] - background[0]) > tolerance ||
        Math.abs(data[offset + 1] - background[1]) > tolerance ||
        Math.abs(data[offset + 2] - background[2]) > tolerance;
      if (far) return true;
    }
  }
  return false;
}

// Throw when the canvas still shows only its background after the timeout.
export async function assertCanvasPainted(
  canvas: HTMLCanvasElement,
  backgroundHex: string,
  options: CanvasPaintOptions = {},
): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const deadline = performance.now() + timeoutMs;
  do {
    await nextPaint();
    if (isCanvasPainted(canvas, backgroundHex, options)) return;
  } while (performance.now() < deadline);
  throw new Error(
    `Canvas ${canvas.width}x${canvas.height} shows only the background ${backgroundHex} after ${timeoutMs} ms.`,
  );
}
