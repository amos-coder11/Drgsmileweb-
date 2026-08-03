import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";

export interface ShaderConfig {
  source: string;
}

export interface MouseState {
  x: number;
  y: number;
  clickX: number;
  clickY: number;
}

export interface HSVControls {
  hue: number;
  saturation: number;
  brightness: number;
}

export type MouseMode = "click" | "hover";

export class InspiraShaderToy {
  private renderer: Renderer;
  private camera: Camera;
  private scene: Transform;
  private geometry: Geometry;
  private program: Program | null = null;
  private mesh: Mesh | null = null;
  private resizeObserver?: ResizeObserver;
  private animationFrameId = 0;
  private removeEventListeners: (() => void)[] = [];

  private isPlaying = false;
  private firstDrawTime = 0;
  private prevDrawTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / 60;
  private lastFrameTime = 0;

  private onDrawCallback?: () => void;

  private iFrame = 0;
  private iMouse: MouseState = { x: 0, y: 0, clickX: 0, clickY: 0 };
  private hsv: HSVControls = { hue: 0, saturation: 1, brightness: 1 };
  private _mouseMode: MouseMode = "click";
  private _mouseSensitivity = 1.0;
  private _mouseDamping = 0.9;

  private _speed = 1;
  private _pixelRatio = 1;

  private shaderSource = "";

  private readonly vertexShader = `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
#endif
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  private readonly fragmentShaderHeader = `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform vec4 iMouse;
uniform vec4 iDate;
uniform vec3 iHSV;
uniform float iSpeed;

out vec4 fragColor;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 applyHSV(vec3 color, vec3 hsvAdjust) {
  vec3 hsvColor = rgb2hsv(color);
  hsvColor.x = fract(hsvColor.x + hsvAdjust.x / 360.0);
  hsvColor.y = clamp(hsvColor.y * hsvAdjust.y, 0.0, 1.0);
  hsvColor.z = clamp(hsvColor.z * hsvAdjust.z, 0.0, 1.0);
  return hsv2rgb(hsvColor);
}

void mainImage(out vec4 c, in vec2 f);

void main() {
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainImage(color, gl_FragCoord.xy);

  if (iHSV.x != 0.0 || iHSV.y != 1.0 || iHSV.z != 1.0) {
    color.rgb = applyHSV(color.rgb, iHSV);
  }

  fragColor = color;
}
`;

  constructor(
    private container: HTMLElement,
    mouseMode?: MouseMode,
    fps?: number,
    pixelRatio = 1
  ) {
    if (mouseMode) this._mouseMode = mouseMode;
    if (fps) this.setFrameRate(fps);
    this.setPixelRatio(pixelRatio);

    this.renderer = new Renderer({
      width: this.getSafeWidth(),
      height: this.getSafeHeight(),
      dpr: this._pixelRatio,
      alpha: true,
      depth: false,
      stencil: false,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!this.renderer.gl || !(this.renderer.gl instanceof WebGL2RenderingContext)) {
      throw new Error("WebGL 2 not supported");
    }

    this.container.appendChild(this.renderer.gl.canvas);

    this.camera = new Camera(this.renderer.gl);
    this.camera.position.z = 1;

    this.scene = new Transform();

    this.geometry = new Geometry(this.renderer.gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1]),
      },
    });

    this.setup();
  }

  private setup(): void {
    this.setupMouseEvents();
    this.setupResizeHandler();
  }

  private getSafeWidth(): number {
    return Math.max(1, this.container.clientWidth);
  }

  private getSafeHeight(): number {
    return Math.max(1, this.container.clientHeight);
  }

  private getResolution(): [number, number, number] {
    const width = this.getSafeWidth();
    const height = this.getSafeHeight();
    const dpr = this._pixelRatio;
    return [width * dpr, height * dpr, dpr];
  }

  private updateProgramResolution(): void {
    if (this.program) {
      this.program.uniforms.iResolution.value = this.getResolution();
    }
  }

  private resize(): void {
    const width = this.getSafeWidth();
    const height = this.getSafeHeight();
    const dpr = this._pixelRatio;

    this.renderer.dpr = dpr;
    this.renderer.setSize(width, height);
    this.renderer.setViewport(width * dpr, height * dpr);
    this.updateProgramResolution();
  }

  private addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    this.removeEventListeners.push(() => {
      target.removeEventListener(type, listener, options);
    });
  }

  private setupMouseEvents(): void {
    const canvas = this.renderer.gl.canvas;
    let isMouseDown = false;

    const getScaledMousePos = (event: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = this._pixelRatio;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return {
        x: x * dpr * this._mouseSensitivity,
        y: (canvas.height - y * dpr) * this._mouseSensitivity,
      };
    };

    const onMouseMove = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const { x: newX, y: newY } = getScaledMousePos(mouseEvent);
      this.iMouse.x = this.iMouse.x * this._mouseDamping + newX * (1 - this._mouseDamping);
      this.iMouse.y = this.iMouse.y * this._mouseDamping + newY * (1 - this._mouseDamping);

      if (this._mouseMode === "hover" && !isMouseDown) {
        this.iMouse.clickX = this.iMouse.x;
        this.iMouse.clickY = this.iMouse.y;
      } else if (isMouseDown) {
        this.iMouse.clickX = newX;
        this.iMouse.clickY = newY;
      }
    };

    const onMouseDown = (event: Event) => {
      isMouseDown = true;
      const { x: clickX, y: clickY } = getScaledMousePos(event as MouseEvent);
      if (this._mouseMode === "click") {
        this.iMouse.clickX = clickX;
        this.iMouse.clickY = clickY;
      }
    };

    const stopPress = () => {
      isMouseDown = false;
    };

    this.addEventListener(canvas, "mousemove", onMouseMove);
    this.addEventListener(canvas, "mousedown", onMouseDown);
    this.addEventListener(canvas, "mouseup", stopPress);
    this.addEventListener(canvas, "mouseleave", stopPress);
    this.addEventListener(window, "mouseup", stopPress);
  }

  private setupResizeHandler(): void {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
  }

  private compileProgram(): boolean {
    if (!this.shaderSource) return false;

    const fullFragmentShader = this.fragmentShaderHeader + this.shaderSource;

    try {
      const program = new Program(this.renderer.gl, {
        vertex: this.vertexShader,
        fragment: fullFragmentShader,
        uniforms: {
          iResolution: { value: this.getResolution() },
          iTime: { value: 0 },
          iTimeDelta: { value: 0 },
          iFrameRate: { value: this.targetFPS },
          iFrame: { value: 0 },
          iMouse: { value: [0, 0, 0, 0] },
          iDate: { value: [0, 0, 0, 0] },
          iHSV: { value: [this.hsv.hue, this.hsv.saturation, this.hsv.brightness] },
          iSpeed: { value: this._speed },
        },
      });

      const mesh = new Mesh(this.renderer.gl, {
        geometry: this.geometry,
        program,
      });

      this.program?.remove();
      this.program = program;
      this.mesh = mesh;
      return true;
    } catch (error) {
      console.error("Failed to compile shader:", error);
      return false;
    }
  }

  private draw(): void {
    if (!this.program || !this.mesh) return;

    const now = this.isPlaying ? Date.now() : this.prevDrawTime;
    const date = new Date(now);

    if (this.firstDrawTime === 0) this.firstDrawTime = now;
    if (this.onDrawCallback) this.onDrawCallback();

    const iTimeDelta = (now - this.prevDrawTime) * 0.001 * this._speed;
    const iTime = (now - this.firstDrawTime) * 0.001 * this._speed;
    const iDate = [date.getFullYear(), date.getMonth(), date.getDate(), date.getTime() * 0.001];

    this.program.uniforms.iResolution.value = this.getResolution();
    this.program.uniforms.iTime.value = iTime;
    this.program.uniforms.iTimeDelta.value = iTimeDelta;
    this.program.uniforms.iFrameRate.value = this.targetFPS;
    this.program.uniforms.iFrame.value = this.iFrame;
    this.program.uniforms.iMouse.value = [
      this.iMouse.x,
      this.iMouse.y,
      this.iMouse.clickX,
      this.iMouse.clickY,
    ];
    this.program.uniforms.iDate.value = iDate;
    this.program.uniforms.iHSV.value = [this.hsv.hue, this.hsv.saturation, this.hsv.brightness];
    this.program.uniforms.iSpeed.value = this._speed;

    this.renderer.render({ scene: this.mesh, camera: this.camera });

    this.prevDrawTime = now;
    this.iFrame++;
  }

  private animate = (): void => {
    this.animationFrameId = 0;
    if (!this.isPlaying) return;

    let shouldDraw = true;
    if (this.targetFPS < 60) {
      const now = Date.now();
      const elapsed = now - this.lastFrameTime;
      if (elapsed < this.frameInterval) {
        shouldDraw = false;
      } else {
        this.lastFrameTime = now - (elapsed % this.frameInterval);
      }
    }

    if (shouldDraw) this.draw();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public setShader(config: ShaderConfig): boolean {
    this.shaderSource = config.source;
    const success = this.compileProgram();
    if (success && this.isPlaying) this.draw();
    return success;
  }

  public setHSV(hsv: Partial<HSVControls>): void {
    if (hsv.hue !== undefined) this.hsv.hue = hsv.hue;
    if (hsv.saturation !== undefined) this.hsv.saturation = hsv.saturation;
    if (hsv.brightness !== undefined) this.hsv.brightness = hsv.brightness;
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public setSpeed(val: number): void {
    this._speed = Math.max(0, val);
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public setFrameRate(fps: number): void {
    this.targetFPS = Math.max(1, Math.min(60, fps));
    this.frameInterval = 1000 / this.targetFPS;
  }

  public setPixelRatio(pixelRatio: number): void {
    this._pixelRatio = Math.max(0.25, Math.min(2, pixelRatio));
    if (this.renderer) {
      this.resize();
      if (!this.isPlaying && this.program && this.mesh) this.draw();
    }
  }

  public setMouseSensitivity(sensitivity: number): void {
    this._mouseSensitivity = Math.max(0.1, Math.min(5.0, sensitivity));
  }

  public setMouseDamping(damping: number): void {
    this._mouseDamping = Math.max(0, Math.min(0.99, damping));
  }

  public play(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      const now = Date.now();
      const elapsed = this.prevDrawTime - this.firstDrawTime;
      this.firstDrawTime = now - elapsed;
      this.prevDrawTime = now;
      this.lastFrameTime = now;
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  public dispose(): void {
    this.pause();
    this.resizeObserver?.disconnect();
    this.removeEventListeners.forEach((remove) => remove());
    this.program?.remove();
    this.geometry.remove();

    if (this.renderer.gl.canvas.parentElement) {
      this.renderer.gl.canvas.parentElement.removeChild(this.renderer.gl.canvas);
    }
  }
}
