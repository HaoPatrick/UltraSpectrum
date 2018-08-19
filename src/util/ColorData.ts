import { Spectrum, ISpecValue } from "./ColorSpace";

import d50 from "../assets/spec_lights/d50.json";
import d65 from "../assets/spec_lights/d65.json";
import illA from "../assets/spec_lights/illA.json";
import illF from "../assets/spec_lights/illF.json";
import illC from "../assets/spec_lights/illC.json";

const lights: { [name: string]: Spectrum } = {
  // tslint:disable:no-var-requires
  d65: new Spectrum(d65 as ISpecValue),
  d50: new Spectrum(d50 as ISpecValue),
  illA: new Spectrum(illA as ISpecValue),
  illC: new Spectrum(illC as ISpecValue),
  illF: new Spectrum(illF as ISpecValue)
};
const reflectance: Spectrum[] = [
  ...require("../assets/spec_reflectance/natural.json")
].map(item => new Spectrum(item));

const colorMatch: { x: Spectrum; y: Spectrum; z: Spectrum } = {
  x: new Spectrum(require("../assets/spec_color_match/x.json") as ISpecValue),
  y: new Spectrum(require("../assets/spec_color_match/y.json") as ISpecValue),
  z: new Spectrum(require("../assets/spec_color_match/z.json") as ISpecValue)
};

export { lights, reflectance, colorMatch };
