import { gammaCorrection, gammaCorrectionRev, arrayMulti } from "./ColorMath";
import colorMatchX from "../assets/spec_color_match/x.json";
import colorMatchY from "../assets/spec_color_match/y.json";
import colorMatchZ from "../assets/spec_color_match/z.json";
import d65 from "@/assets/spec_lights/d65.json";

export interface ISpecValue {
  name: string;
  type: string;
  type_max: number;
  start_nm: number;
  end_nm: number;
  resolution: number;
  data: number[];
  rgb_d65?: [number, number, number];
  xyz_d65?: [number, number, number];
}
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

  public toNumbers(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  public toXYZ(): XYZ {
    const lr = gammaCorrectionRev(this.r);
    const lg = gammaCorrectionRev(this.g);
    const lb = gammaCorrectionRev(this.b);
    const x = 0.4124 * lr + 0.3576 * lg + 0.1805 * lb;
    const y = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    const z = 0.0193 * lr + 0.1192 * lg + 0.9505 * lb;
    return new XYZ(x, y, z);
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

  public toNumbers(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}

export enum SPECTYPE {
  Reflectance = "REFLECTANCE",
  Illuminant = "ILLUMINANT"
}

// tslint:disable-next-line:max-classes-per-file
export class Spectrum {
  public static spec2xyz(spec: number[]): XYZ {
    const x = arrayMulti(spec, colorMatchX.data);
    const y = arrayMulti(spec, colorMatchY.data);
    const z = arrayMulti(spec, colorMatchZ.data);
    const xSum = x.filter(item => item).reduce((a, b) => a + b, 0);
    const ySum = y.filter(item => item).reduce((a, b) => a + b, 0);
    const zSum = z.filter(item => item).reduce((a, b) => a + b, 0);
    return new XYZ(xSum, ySum, zSum);
  }
  public static makeFromValue(
    values: number[],
    name: string,
    type: SPECTYPE = SPECTYPE.Reflectance,
    start: number = 400,
    resolution: number = 5
  ): Spectrum {
    const maxValue = Math.max(...values);
    const scaledValues = values.map(item => item / maxValue);
    const end = values.length * resolution + start;

    let xyzD65: [number, number, number];
    let rgbD65: [number, number, number];
    if (type === SPECTYPE.Reflectance) {
      const underD65 = arrayMulti(scaledValues, d65.data);
      const xyz = Spectrum.spec2xyz(underD65);
      xyzD65 = xyz.toNumbers();
      rgbD65 = xyz.toRGB().toNumbers();
    } else {
      rgbD65 = [0, 0, 0];
      xyzD65 = [0, 0, 0];
    }
    const spec: ISpecValue = {
      name,
      data: scaledValues,
      type,
      type_max: 1,
      start_nm: start,
      end_nm: end,
      resolution,
      rgb_d65: rgbD65,
      xyz_d65: xyzD65
    };
    return new Spectrum(spec);
  }

  public data: number[];
  public start: number;
  public end: number;
  public resolution: number;
  public type: SPECTYPE;
  public typeMax: number = 1;
  public rgbD65: RGB | null | undefined;
  public xyzD65: XYZ | null | undefined;
  public name: string;

  public constructor(spec: ISpecValue) {
    this.name = spec.name;
    this.data = spec.data;
    this.start = spec.start_nm;
    this.end = spec.end_nm;
    this.resolution = spec.resolution;
    this.type = spec.type as SPECTYPE;
    this.typeMax = spec.type_max;

    if (spec.rgb_d65 !== undefined && spec.xyz_d65 !== undefined) {
      this.rgbD65 = new RGB(spec.rgb_d65[0], spec.rgb_d65[1], spec.rgb_d65[2]);
      this.xyzD65 = new XYZ(spec.xyz_d65[0], spec.xyz_d65[1], spec.xyz_d65[2]);
    } else {
      this.rgbD65 = null;
      this.xyzD65 = null;
    }
  }

  public toXYZ(): XYZ {
    return Spectrum.spec2xyz(this.data);
  }
}
