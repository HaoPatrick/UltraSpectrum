import range from "lodash/range";

const c1: number = 3.74177179e-16;
const c2: number = 0.0143877736;
const firstRadiationConstant = c1;
const secondRadiationConstant = c2;

const M = (t: number) => (lambda: number) =>
  c1 / Math.pow(lambda, 5) / (Math.exp(c2 / (lambda * t)) - 1);

export function spectrumAtTemp(
  temp: number,
  start: number = 400,
  end: number = 695,
  resolution: number = 5
): number[] {
  const plankianT = M(temp);
  const lambdas = range(start, end, resolution);
  return lambdas.map(item => plankianT(item * Math.pow(10, -9)));
}
