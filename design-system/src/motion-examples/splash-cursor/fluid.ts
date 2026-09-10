/*
 * Fluid simulation for the Splash cursor example.
 *
 * Rebuilt from WebGL-Fluid-Simulation by Pavel Dobryakov, MIT.
 * Origin: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 * File: script.js on master, commit a2d2929, pushed 2024-11-12.
 * Licence text: ./LICENSE-webgl-fluid-simulation.txt
 *
 * This is a typed port of the simulation core: splat, curl, vorticity,
 * divergence, pressure, gradient subtract, advection, and the shaded display
 * pass. Bloom, sunrays, the checkerboard, screenshot capture, the dat.GUI
 * panel, and the promo popup are not ported.
 *
 * The React Bits Splash Cursor port (MIT plus Commons Clause) was read for
 * prop names and defaults only. Its code was not copied.
 */

export type FluidColor = { r: number; g: number; b: number };

export type FluidConfig = {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  CAPTURE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  SHADING: boolean;
  COLOR_UPDATE_SPEED: number;
  BACK_COLOR: FluidColor;
  TRANSPARENT: boolean;
  RAINBOW_MODE: boolean;
  COLOR: string;
};

type GL = WebGLRenderingContext | WebGL2RenderingContext;

type Format = { internalFormat: number; format: number };

type GLExt = {
  formatRGBA: Format;
  formatRG: Format;
  formatR: Format;
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
};

type Target = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
};

type DoubleTarget = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: Target;
  write: Target;
};

type Uniforms = Record<string, WebGLUniformLocation | null>;

type Program = {
  program: WebGLProgram;
  uniforms: Uniforms;
};

type PointerState = {
  seen: boolean;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  moved: boolean;
  color: FluidColor;
};

const MAX_DT = 1 / 60;

/* Shaders. GLSL ES 1.00 so the same source runs on WebGL 1 and 2. */

const BASE_VERTEX_SHADER = `
precision highp float;

attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;

void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const COPY_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
uniform sampler2D uTexture;

void main () {
  gl_FragColor = texture2D(uTexture, vUv);
}
`;

const CLEAR_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;

void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

const COLOR_SHADER = `
precision mediump float;

uniform vec4 color;

void main () {
  gl_FragColor = color;
}
`;

const DISPLAY_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uTexture;
uniform vec2 texelSize;

void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;

#ifdef SHADING
  vec3 lc = texture2D(uTexture, vL).rgb;
  vec3 rc = texture2D(uTexture, vR).rgb;
  vec3 tc = texture2D(uTexture, vT).rgb;
  vec3 bc = texture2D(uTexture, vB).rgb;

  float dx = length(rc) - length(lc);
  float dy = length(tc) - length(bc);

  vec3 n = normalize(vec3(dx, dy, length(texelSize)));
  vec3 l = vec3(0.0, 0.0, 1.0);

  float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
  c *= diffuse;
#endif

  float a = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c, a);
}
`;

const SPLAT_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const ADVECTION_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;

  vec2 iuv = floor(st);
  vec2 fuv = fract(st);

  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
#ifdef MANUAL_FILTERING
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
#endif
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}
`;

const DIVERGENCE_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;

  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }

  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const CURL_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const VORTICITY_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const PRESSURE_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float C = texture2D(uPressure, vUv).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_SUBTRACT_SHADER = `
precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

/* Context and format probes. */

function getContext(
  canvas: HTMLCanvasElement,
): { gl: GL; gl2: WebGL2RenderingContext | null; ext: GLExt } | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl2: WebGL2RenderingContext | null = null;
  let gl: GL | null;
  try {
    gl2 = canvas.getContext('webgl2', params);
    gl = gl2 ?? canvas.getContext('webgl', params);
  } catch {
    gl = null;
  }
  if (!gl) return null;

  let halfFloatTexType: number;
  let supportLinearFiltering: boolean;
  if (gl2) {
    gl2.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl2.getExtension('OES_texture_float_linear') != null;
    halfFloatTexType = gl2.HALF_FLOAT;
  } else {
    const halfFloat = gl.getExtension('OES_texture_half_float');
    if (!halfFloat) return null;
    supportLinearFiltering =
      gl.getExtension('OES_texture_half_float_linear') != null;
    halfFloatTexType = halfFloat.HALF_FLOAT_OES;
  }

  gl.clearColor(0, 0, 0, 1);

  let formatRGBA: Format | null;
  let formatRG: Format | null;
  let formatR: Format | null;
  if (gl2) {
    formatRGBA = supportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
    formatRG = supportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
    formatR = supportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
  } else {
    formatRGBA = supportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = formatRGBA;
    formatR = formatRGBA;
  }
  if (!formatRGBA || !formatRG || !formatR) return null;

  return {
    gl,
    gl2,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  };
}

function supportedFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
): Format | null {
  if (renderable(gl, internalFormat, format, type)) {
    return { internalFormat, format };
  }
  const gl2 = gl as WebGL2RenderingContext;
  if ('R16F' in gl) {
    if (internalFormat === gl2.R16F) {
      return supportedFormat(gl, gl2.RG16F, gl2.RG, type);
    }
    if (internalFormat === gl2.RG16F) {
      return supportedFormat(gl, gl2.RGBA16F, gl2.RGBA, type);
    }
  }
  return null;
}

function renderable(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
): boolean {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

/* Shader helpers. */

function compileShader(
  gl: GL,
  type: number,
  source: string,
  keywords: string[] = [],
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Fluid: cannot create shader');
  const defines = keywords.map((word) => `#define ${word}\n`).join('');
  gl.shaderSource(shader, defines + source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? '';
    gl.deleteShader(shader);
    throw new Error(`Fluid: shader compile failed. ${log}`);
  }
  return shader;
}

function createProgram(
  gl: GL,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): Program {
  const program = gl.createProgram();
  if (!program) throw new Error('Fluid: cannot create program');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? '';
    gl.deleteProgram(program);
    throw new Error(`Fluid: program link failed. ${log}`);
  }
  const uniforms: Uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

/* Colour helpers. */

function hsvToRgb(h: number, s: number, v: number): FluidColor {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      return { r: v, g: t, b: p };
    case 1:
      return { r: q, g: v, b: p };
    case 2:
      return { r: p, g: v, b: t };
    case 3:
      return { r: p, g: q, b: v };
    case 4:
      return { r: t, g: p, b: v };
    default:
      return { r: v, g: p, b: q };
  }
}

export function hexToRgb(hex: string, fallback: FluidColor): FluidColor {
  const raw = hex.trim().replace('#', '');
  const value =
    raw.length === 3
      ? raw
          .split('')
          .map((part) => part + part)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return fallback;
  const n = Number.parseInt(value, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

const FALLBACK_COLOR: FluidColor = { r: 0, g: 53 / 255, b: 177 / 255 };

function wrap(value: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return min;
  return ((value - min) % range) + min;
}

function scaleByPixelRatio(input: number): number {
  // Capped at 2: a phone at 3x drew nine times the pixels of 1x for no gain.
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  return Math.floor(input * ratio);
}

/* The simulation. */

export class FluidSimulation {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: GL;
  private readonly ext: GLExt;
  private readonly onSplat: (() => void) | undefined;
  private config: FluidConfig;

  private readonly vertexShader: WebGLShader;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  private readonly shaders: WebGLShader[] = [];
  private readonly programs: Program[] = [];

  private readonly copyProgram: Program;
  private readonly clearProgram: Program;
  private readonly colorProgram: Program;
  private readonly splatProgram: Program;
  private readonly advectionProgram: Program;
  private readonly divergenceProgram: Program;
  private readonly curlProgram: Program;
  private readonly vorticityProgram: Program;
  private readonly pressureProgram: Program;
  private readonly gradientSubtractProgram: Program;
  private readonly displayPrograms = new Map<string, Program>();
  private displayProgram: Program;

  private dye: DoubleTarget | null = null;
  private velocity: DoubleTarget | null = null;
  private divergence: Target | null = null;
  private curl: Target | null = null;
  private pressure: DoubleTarget | null = null;

  private frameId = 0;
  private running = false;
  private destroyed = false;
  private lastTime = 0;
  private colorTimer = 0;
  private splatCount = 0;
  private readonly pointer: PointerState = {
    seen: false,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    moved: false,
    color: FALLBACK_COLOR,
  };

  /** Returns null when the canvas has no usable WebGL context. */
  static create(
    canvas: HTMLCanvasElement,
    config: FluidConfig,
    onSplat?: () => void,
  ): FluidSimulation | null {
    const context = getContext(canvas);
    if (!context) return null;
    try {
      return new FluidSimulation(canvas, context.gl, context.ext, config, onSplat);
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  private constructor(
    canvas: HTMLCanvasElement,
    gl: GL,
    ext: GLExt,
    config: FluidConfig,
    onSplat: (() => void) | undefined,
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.ext = ext;
    this.onSplat = onSplat;
    this.config = this.normalise(config);

    this.vertexShader = this.shader(gl.VERTEX_SHADER, BASE_VERTEX_SHADER);
    this.copyProgram = this.program(COPY_SHADER);
    this.clearProgram = this.program(CLEAR_SHADER);
    this.colorProgram = this.program(COLOR_SHADER);
    this.splatProgram = this.program(SPLAT_SHADER);
    this.advectionProgram = this.program(
      ADVECTION_SHADER,
      ext.supportLinearFiltering ? [] : ['MANUAL_FILTERING'],
    );
    this.divergenceProgram = this.program(DIVERGENCE_SHADER);
    this.curlProgram = this.program(CURL_SHADER);
    this.vorticityProgram = this.program(VORTICITY_SHADER);
    this.pressureProgram = this.program(PRESSURE_SHADER);
    this.gradientSubtractProgram = this.program(GRADIENT_SUBTRACT_SHADER);
    this.displayProgram = this.display(this.config.SHADING);

    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!vertexBuffer || !indexBuffer) {
      throw new Error('Fluid: cannot create buffers');
    }
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    this.resize();
    this.initFramebuffers();
    this.pointer.color = this.generateColor();
  }

  /* Public API. */

  get splats(): number {
    return this.splatCount;
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Start the frame loop. */
  start(): void {
    if (this.running || this.destroyed) return;
    this.running = true;
    this.lastTime = performance.now();
    const frame = () => {
      if (!this.running) return;
      this.tick();
      this.frameId = requestAnimationFrame(frame);
    };
    this.frameId = requestAnimationFrame(frame);
  }

  /** Stop the frame loop. The last frame stays on the canvas. */
  stop(): void {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  /** Run one update: resize, colours, inputs, simulation step, render. */
  tick(): void {
    if (this.destroyed) return;
    const dt = this.deltaTime();
    if (this.resize()) this.initFramebuffers();
    this.updateColors(dt);
    this.applyInputs();
    this.step(dt);
    this.render();
  }

  /** Replace the configuration. Rebuilds textures or shaders when needed. */
  setConfig(next: FluidConfig): void {
    if (this.destroyed) return;
    const prev = this.config;
    this.config = this.normalise(next);
    if (prev.SHADING !== this.config.SHADING) {
      this.displayProgram = this.display(this.config.SHADING);
    }
    if (
      prev.SIM_RESOLUTION !== this.config.SIM_RESOLUTION ||
      prev.DYE_RESOLUTION !== this.config.DYE_RESOLUTION
    ) {
      this.initFramebuffers();
    }
  }

  /**
   * Record a pointer position in CSS pixels relative to the canvas. The
   * first position after `leavePointer` sets the origin. Later positions
   * add a splat on the next `tick`.
   */
  movePointer(cssX: number, cssY: number): void {
    const { canvas, pointer } = this;
    const posX = scaleByPixelRatio(cssX);
    const posY = scaleByPixelRatio(cssY);
    const texcoordX = posX / canvas.width;
    const texcoordY = 1 - posY / canvas.height;

    if (!pointer.seen) {
      pointer.seen = true;
      pointer.texcoordX = texcoordX;
      pointer.texcoordY = texcoordY;
      pointer.prevTexcoordX = texcoordX;
      pointer.prevTexcoordY = texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.moved = false;
      pointer.color = this.generateColor();
      return;
    }

    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = texcoordX;
    pointer.texcoordY = texcoordY;
    pointer.deltaX = this.correctDeltaX(texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = this.correctDeltaY(texcoordY - pointer.prevTexcoordY);
    pointer.moved =
      Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  }

  /** Forget the pointer so the next move does not draw a long streak. */
  leavePointer(): void {
    this.pointer.seen = false;
    this.pointer.moved = false;
  }

  /** Add one splat. `x` and `y` are texture coordinates from 0 to 1. */
  splat(x: number, y: number, dx: number, dy: number, color: FluidColor): void {
    const { gl, canvas, velocity, dye } = this;
    if (this.destroyed || !velocity || !dye) return;

    gl.disable(gl.BLEND);
    this.bind(this.splatProgram);
    gl.uniform1i(this.splatProgram.uniforms.uTarget, this.attach(velocity.read, 0));
    gl.uniform1f(this.splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0);
    gl.uniform1f(
      this.splatProgram.uniforms.radius,
      this.correctRadius(this.config.SPLAT_RADIUS / 100),
    );
    this.blit(velocity.write);
    this.swap(velocity);

    gl.uniform1i(this.splatProgram.uniforms.uTarget, this.attach(dye.read, 0));
    gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
    this.blit(dye.write);
    this.swap(dye);

    this.splatCount += 1;
    this.onSplat?.();
  }

  /** Add `amount` random splats, as the origin does on load. */
  burst(amount: number): void {
    for (let i = 0; i < amount; i += 1) {
      const color = this.generateColor();
      color.r *= 10;
      color.g *= 10;
      color.b *= 10;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splat(x, y, dx, dy, color);
    }
  }

  /** Clear dye, velocity, and pressure. */
  reset(): void {
    if (this.destroyed) return;
    const { dye, velocity, pressure, divergence, curl } = this;
    for (const target of [dye, velocity, pressure]) {
      if (!target) continue;
      this.clear(target.read);
      this.clear(target.write);
    }
    if (divergence) this.clear(divergence);
    if (curl) this.clear(curl);
    this.leavePointer();
  }

  /** Match the canvas buffer to its CSS size. Returns true when it changed. */
  resize(): boolean {
    const { canvas } = this;
    const width = Math.max(1, scaleByPixelRatio(canvas.clientWidth));
    const height = Math.max(1, scaleByPixelRatio(canvas.clientHeight));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  /** Stop the loop and release every GPU object. */
  destroy(): void {
    if (this.destroyed) return;
    this.stop();
    this.destroyed = true;
    const { gl } = this;
    for (const target of [this.dye, this.velocity, this.pressure]) {
      if (!target) continue;
      this.deleteTarget(target.read);
      this.deleteTarget(target.write);
    }
    if (this.divergence) this.deleteTarget(this.divergence);
    if (this.curl) this.deleteTarget(this.curl);
    this.dye = null;
    this.velocity = null;
    this.pressure = null;
    this.divergence = null;
    this.curl = null;
    for (const program of this.programs) gl.deleteProgram(program.program);
    for (const shader of this.shaders) gl.deleteShader(shader);
    gl.deleteShader(this.vertexShader);
    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
  }

  /* Setup. */

  private normalise(config: FluidConfig): FluidConfig {
    if (this.ext.supportLinearFiltering) return { ...config };
    // Without linear filtering the origin drops quality and shading.
    return {
      ...config,
      DYE_RESOLUTION: Math.min(config.DYE_RESOLUTION, 512),
      SHADING: false,
    };
  }

  private shader(type: number, source: string, keywords?: string[]): WebGLShader {
    const shader = compileShader(this.gl, type, source, keywords);
    this.shaders.push(shader);
    return shader;
  }

  private program(fragmentSource: string, keywords?: string[]): Program {
    const fragment = this.shader(this.gl.FRAGMENT_SHADER, fragmentSource, keywords);
    const program = createProgram(this.gl, this.vertexShader, fragment);
    this.programs.push(program);
    return program;
  }

  private display(shading: boolean): Program {
    const key = shading ? 'SHADING' : '';
    const cached = this.displayPrograms.get(key);
    if (cached) return cached;
    const program = this.program(DISPLAY_SHADER, shading ? ['SHADING'] : []);
    this.displayPrograms.set(key, program);
    return program;
  }

  private initFramebuffers(): void {
    const { gl, ext } = this;
    const simRes = this.resolution(this.config.SIM_RESOLUTION);
    const dyeRes = this.resolution(this.config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);

    this.dye = this.dye
      ? this.resizeDouble(this.dye, dyeRes.width, dyeRes.height, rgba, texType, filtering)
      : this.createDouble(dyeRes.width, dyeRes.height, rgba, texType, filtering);

    this.velocity = this.velocity
      ? this.resizeDouble(this.velocity, simRes.width, simRes.height, rg, texType, filtering)
      : this.createDouble(simRes.width, simRes.height, rg, texType, filtering);

    if (this.divergence) this.deleteTarget(this.divergence);
    if (this.curl) this.deleteTarget(this.curl);
    if (this.pressure) {
      this.deleteTarget(this.pressure.read);
      this.deleteTarget(this.pressure.write);
    }
    this.divergence = this.createTarget(simRes.width, simRes.height, r, texType, gl.NEAREST);
    this.curl = this.createTarget(simRes.width, simRes.height, r, texType, gl.NEAREST);
    this.pressure = this.createDouble(simRes.width, simRes.height, r, texType, gl.NEAREST);
  }

  private createTarget(
    width: number,
    height: number,
    format: Format,
    type: number,
    param: number,
  ): Target {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!texture || !fbo) throw new Error('Fluid: cannot create target');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      format.internalFormat,
      width,
      height,
      0,
      format.format,
      type,
      null,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width,
      height,
      texelSizeX: 1 / width,
      texelSizeY: 1 / height,
    };
  }

  private createDouble(
    width: number,
    height: number,
    format: Format,
    type: number,
    param: number,
  ): DoubleTarget {
    const read = this.createTarget(width, height, format, type, param);
    const write = this.createTarget(width, height, format, type, param);
    return {
      width,
      height,
      texelSizeX: read.texelSizeX,
      texelSizeY: read.texelSizeY,
      read,
      write,
    };
  }

  private resizeTarget(
    target: Target,
    width: number,
    height: number,
    format: Format,
    type: number,
    param: number,
  ): Target {
    const { gl } = this;
    const next = this.createTarget(width, height, format, type, param);
    this.bind(this.copyProgram);
    gl.uniform1i(this.copyProgram.uniforms.uTexture, this.attach(target, 0));
    this.blit(next);
    this.deleteTarget(target);
    return next;
  }

  private resizeDouble(
    target: DoubleTarget,
    width: number,
    height: number,
    format: Format,
    type: number,
    param: number,
  ): DoubleTarget {
    if (target.width === width && target.height === height) return target;
    const read = this.resizeTarget(target.read, width, height, format, type, param);
    this.deleteTarget(target.write);
    const write = this.createTarget(width, height, format, type, param);
    return {
      width,
      height,
      texelSizeX: 1 / width,
      texelSizeY: 1 / height,
      read,
      write,
    };
  }

  private deleteTarget(target: Target): void {
    this.gl.deleteFramebuffer(target.fbo);
    this.gl.deleteTexture(target.texture);
  }

  private clear(target: Target): void {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private resolution(resolution: number): { width: number; height: number } {
    const { gl } = this;
    const bufferWidth = Math.max(1, gl.drawingBufferWidth);
    const bufferHeight = Math.max(1, gl.drawingBufferHeight);
    let aspectRatio = bufferWidth / bufferHeight;
    if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    return bufferWidth > bufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  /* Frame. */

  private deltaTime(): number {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, MAX_DT);
    this.lastTime = now;
    return dt;
  }

  private updateColors(dt: number): void {
    if (!this.config.RAINBOW_MODE) return;
    this.colorTimer += dt * this.config.COLOR_UPDATE_SPEED;
    if (this.colorTimer >= 1) {
      this.colorTimer = wrap(this.colorTimer, 0, 1);
      this.pointer.color = this.generateColor();
    }
  }

  private applyInputs(): void {
    const { pointer } = this;
    if (pointer.moved) {
      pointer.moved = false;
      const dx = pointer.deltaX * this.config.SPLAT_FORCE;
      const dy = pointer.deltaY * this.config.SPLAT_FORCE;
      this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }
  }

  private step(dt: number): void {
    const { gl, ext, config, velocity, dye, divergence, curl, pressure } = this;
    if (!velocity || !dye || !divergence || !curl || !pressure) return;

    gl.disable(gl.BLEND);

    this.bind(this.curlProgram);
    gl.uniform2f(this.curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.attach(velocity.read, 0));
    this.blit(curl);

    this.bind(this.vorticityProgram);
    gl.uniform2f(this.vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.attach(velocity.read, 0));
    gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.attach(curl, 1));
    gl.uniform1f(this.vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(velocity.write);
    this.swap(velocity);

    this.bind(this.divergenceProgram);
    gl.uniform2f(this.divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.attach(velocity.read, 0));
    this.blit(divergence);

    this.bind(this.clearProgram);
    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.attach(pressure.read, 0));
    gl.uniform1f(this.clearProgram.uniforms.value, config.PRESSURE);
    this.blit(pressure.write);
    this.swap(pressure);

    this.bind(this.pressureProgram);
    gl.uniform2f(this.pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.attach(divergence, 0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i += 1) {
      gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.attach(pressure.read, 1));
      this.blit(pressure.write);
      this.swap(pressure);
    }

    this.bind(this.gradientSubtractProgram);
    gl.uniform2f(this.gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(this.gradientSubtractProgram.uniforms.uPressure, this.attach(pressure.read, 0));
    gl.uniform1i(this.gradientSubtractProgram.uniforms.uVelocity, this.attach(velocity.read, 1));
    this.blit(velocity.write);
    this.swap(velocity);

    this.bind(this.advectionProgram);
    gl.uniform2f(this.advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    }
    const velocityId = this.attach(velocity.read, 0);
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    this.blit(velocity.write);
    this.swap(velocity);

    if (!ext.supportLinearFiltering) {
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    }
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.attach(velocity.read, 0));
    gl.uniform1i(this.advectionProgram.uniforms.uSource, this.attach(dye.read, 1));
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    this.blit(dye.write);
    this.swap(dye);
  }

  private render(): void {
    const { gl, config, dye } = this;
    if (!dye) return;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    if (!config.TRANSPARENT) {
      const back = config.BACK_COLOR;
      this.bind(this.colorProgram);
      gl.uniform4f(
        this.colorProgram.uniforms.color,
        back.r / 255,
        back.g / 255,
        back.b / 255,
        1,
      );
      this.blit(null);
    }

    this.bind(this.displayProgram);
    if (config.SHADING) {
      gl.uniform2f(
        this.displayProgram.uniforms.texelSize,
        1 / gl.drawingBufferWidth,
        1 / gl.drawingBufferHeight,
      );
    }
    gl.uniform1i(this.displayProgram.uniforms.uTexture, this.attach(dye.read, 0));
    this.blit(null);
  }

  /* GL plumbing. */

  private bind(program: Program): void {
    this.gl.useProgram(program.program);
  }

  private attach(target: Target, id: number): number {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + id);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    return id;
  }

  private blit(target: Target | null): void {
    const { gl } = this;
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  private swap(target: DoubleTarget): void {
    const read = target.read;
    target.read = target.write;
    target.write = read;
  }

  /* Maths. */

  private correctRadius(radius: number): number {
    const aspectRatio = this.canvas.width / this.canvas.height;
    return aspectRatio > 1 ? radius * aspectRatio : radius;
  }

  private correctDeltaX(delta: number): number {
    const aspectRatio = this.canvas.width / this.canvas.height;
    return aspectRatio < 1 ? delta * aspectRatio : delta;
  }

  private correctDeltaY(delta: number): number {
    const aspectRatio = this.canvas.width / this.canvas.height;
    return aspectRatio > 1 ? delta / aspectRatio : delta;
  }

  private generateColor(): FluidColor {
    const c = this.config.RAINBOW_MODE
      ? hsvToRgb(Math.random(), 1, 1)
      : hexToRgb(this.config.COLOR, FALLBACK_COLOR);
    return { r: c.r * 0.15, g: c.g * 0.15, b: c.b * 0.15 };
  }
}
