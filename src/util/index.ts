import { colorMatch } from "./colorData";

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
        Math.pow(vector[0], 2) +
        Math.pow(vector[1], 2) +
        Math.pow(vector[2], 2)
    )
}

export function colorMatching(spec: ISpecValue): Ixyz {
    const xData = arrayMulti(spec.data, colorMatch.x.data);
    const yData = arrayMulti(spec.data, colorMatch.y.data);
    const zData = arrayMulti(spec.data, colorMatch.z.data);
    const xSum = xData.filter(item => item).reduce((a, b) => a + b);
    const ySum = yData.filter(item => item).reduce((a, b) => a + b);
    const zSum = zData.filter(item => item).reduce((a, b) => a + b);
    return {
        x: xSum,
        y: ySum,
        z: zSum
    };
}
