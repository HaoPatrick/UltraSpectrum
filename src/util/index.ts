import { colorMatch, lights } from "./colorData";

export interface ISpecValue {
  name: string;
  type: string;
  type_max: number;
  start_nm: number;
  end_nm: number;
  resolution: number;
  data: number[];
  rgb_d65: number[];
}

export interface ISpecName {
  name: string;
}
export interface Ixyz {
  x: number;
  y: number;
  z: number;
}

export interface Irgb {
  r: number;
  g: number;
  b: number;
}

export function arrayMulti(data1: number[], data2: number[]) {
  const multipled = data1.map((_, i) => {
    return data1[i] * data2[i];
  });
  return multipled;
}

export function round3(val: number): number {
  return Math.round(val * 1000) / 1000;
}

export function gammaCorrection(v: number): number {
  if (v <= 0.0031308) {
    return 12.92 * v;
  } else {
    return (1 + 0.055) * Math.pow(v, 1 / 2.4) - 0.055;
  }
}

export function norm3(vector: number[]) {
  return Math.sqrt(
    Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2)
  );
}

export function lightMax(spec: ISpecValue): number {
  const yData = arrayMulti(spec.data, colorMatch.y.data);
  const ySum = yData.filter(item => item).reduce((a, b) => a + b);
  return ySum;
}

export function spec2xyz(spec: ISpecValue): Ixyz {
  const xData = arrayMulti(spec.data, colorMatch.x.data);
  const yData = arrayMulti(spec.data, colorMatch.y.data);
  const zData = arrayMulti(spec.data, colorMatch.z.data);
  const xSum = xData.filter(item => item).reduce((a, b) => a + b);
  const ySum = yData.filter(item => item).reduce((a, b) => a + b);
  const zSum = zData.filter(item => item).reduce((a, b) => a + b);
  return { x: xSum, y: ySum, z: zSum };
}

export function xyz2rgb(xyz: Ixyz): Irgb {
  const r = 3.2406 * xyz.x - 1.5372 * xyz.y - 0.4986 * xyz.z;
  const g = -0.9689 * xyz.x + 1.8758 * xyz.y + 0.0415 * xyz.z;
  const b = 0.0557 * xyz.x - 0.204 * xyz.y + 1.057 * xyz.z;
  return {
    r: gammaCorrection(r),
    g: gammaCorrection(g),
    b: gammaCorrection(b)
  };
}

export function numers2spec(
  numbers: number[],
  name = "unamed",
  start = 400,
  resolution = 5,
  type: string = "untyped"
): ISpecValue {
  const maxValue = Math.max(...numbers);
  const scaledValues = numbers.map(item => item / maxValue);
  const end = start + resolution * numbers.length;
  const spectrum: ISpecValue = {
    name,
    type,
    type_max: 1,
    start_nm: start,
    end_nm: end,
    resolution,
    data: scaledValues,
    rgb_d65: []
  };
  return spectrum;
}
