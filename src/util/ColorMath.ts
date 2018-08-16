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
