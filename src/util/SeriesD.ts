import zip from "lodash/zip";
import { ISpecValue } from "./ColorSpace";
import { Spectrum, SPECTYPE } from "@/util/ColorSpace";
interface IDSeriesSPD {
  S0: number[];
  S1: number[];
  S2: number[];
  range: number[];
}
// tslint:disable-next-line:no-var-requires
const dSeriesSpd: IDSeriesSPD = require("../assets/spec_color_match/d_series_spd.json");

function getXdYdFromTemp(temp: number): { [name: string]: number } | null {
  if (temp < 4000 || temp > 25000) {
    return null;
  }
  let xd = 0;
  if (temp <= 7000) {
    xd =
      0.244063 +
      (0.09911 * 1000) / temp +
      (2.9678 * Math.pow(10, 6)) / (temp * temp) -
      (4.607 * Math.pow(10, 9)) / Math.pow(temp, 3);
  } else {
    xd =
      0.23704 +
      (0.24748 * 1000) / temp +
      (1.9018 * Math.pow(10, 6)) / (temp * temp) -
      (2.0064 * Math.pow(10, 9)) / Math.pow(temp, 3);
  }
  const yd = -3.0 * xd * xd + 2.87 * xd - 0.275;
  const M = 0.0241 + 0.2562 * xd - 0.7341 * yd;
  const M1 = (-1.3515 - 1.7703 * xd + 5.9114 * yd) / M;
  const M2 = (0.03 - 31.4424 * xd + 30.0717 * yd) / M;
  return {
    M1,
    M2
  };
}

const dSPD = (temp: number): number[] | null => {
  const param = getXdYdFromTemp(temp);
  if (param === null) {
    return null;
  }
  const ziped = zip(dSeriesSpd.S0, dSeriesSpd.S1, dSeriesSpd.S2);
  const rv = ziped.map(item => {
    const citem = item as [number, number, number];
    return citem[0] + param.M1 * citem[1] + param.M2 * citem[2];
  });
  return rv;
};

export const getDSeries = (T: number): Spectrum | null => {
  const values = dSPD(T);
  if (values === null) {
    return null;
  }
  const spec = Spectrum.makeFromValue(
    values,
    `D${Math.round(T / 100)}`,
    SPECTYPE.Illuminant
  );
  return spec;
};
