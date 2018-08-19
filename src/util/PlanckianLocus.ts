import range from "lodash/range";
import { Spectrum, SPECTYPE } from "./ColorSpace";

const c1: number = 3.74177179e-16;
const c2: number = 0.0143877736;
const firstRadiationConstant = c1;
const secondRadiationConstant = c2;

const M = (t: number) => (lambda: number) =>
  c1 / Math.pow(lambda, 5) / (Math.exp(c2 / (lambda * t)) - 1);

export function spectrumAtTemp(
  temp: number,
  start: number = 400,
  end: number = 700,
  resolution: number = 5
): Spectrum {
  const plankianT = M(temp);
  const lambdas = range(start, end + resolution, resolution);
  const values = lambdas.map(item => plankianT(item * Math.pow(10, -9)));
  return Spectrum.makeFromValue(
    values,
    `Planckian-${temp}K`,
    SPECTYPE.Illuminant
  );
}
