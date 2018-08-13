import { gammaCorrection } from "./index";

export class RGB {
  public r: number;
  public g: number;
  public b: number;
  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  public sum(): number {
    return this.r + this.g + this.b;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class XYZ {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  public sum(): number {
    return this.x + this.y + this.z;
  }
  public toRGB(): RGB {
    const r = 3.2406 * this.x - 1.5372 * this.y - 0.4986 * this.z;
    const g = -0.9689 * this.x + 1.8758 * this.y + 0.0415 * this.z;
    const b = 0.0557 * this.x - 0.204 * this.y + 1.057 * this.z;
    return new RGB(gammaCorrection(r), gammaCorrection(g), gammaCorrection(b));
  }
  public norm(): XYZ {
    const sumValue = this.sum();
    return new XYZ(this.x / sumValue, this.y / sumValue, this.z / sumValue);
  }
}