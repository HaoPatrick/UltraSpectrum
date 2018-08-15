import { colorMatch } from "./colorData";
import { XYZ, RGB } from "./ColorSpace";
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
export function gammaCorrectionRev(v: number): number {
  if (v <= 0.04045) {
    return v / 12.92;
  } else {
    return Math.pow((v + 0.055) / (1 + 0.055), 2.4);
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

export function spec2xyz(spec: ISpecValue): XYZ {
  const xData = arrayMulti(spec.data, colorMatch.x.data);
  const yData = arrayMulti(spec.data, colorMatch.y.data);
  const zData = arrayMulti(spec.data, colorMatch.z.data);
  const xSum = xData.filter(item => item).reduce((a, b) => a + b);
  const ySum = yData.filter(item => item).reduce((a, b) => a + b);
  const zSum = zData.filter(item => item).reduce((a, b) => a + b);
  return new XYZ(xSum, ySum, zSum);
}

export function numbers2spec(
  numbers: number[],
  name = "unamed",
  type: string = "untyped",
  start = 400,
  resolution = 5
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
