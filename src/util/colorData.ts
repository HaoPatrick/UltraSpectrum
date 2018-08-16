import { ISpecValue } from "./index";
import { Spectrum } from "@/util/ColorSpace";

const lights: { [name: string]: Spectrum } = {
  // tslint:disable:no-var-requires
  d50: new Spectrum(require("../assets/spec_lights/d50.json") as ISpecValue),
  d65: new Spectrum(require("../assets/spec_lights/d65.json") as ISpecValue),
  illA: new Spectrum(require("../assets/spec_lights/illA.json") as ISpecValue),
  illC: new Spectrum(require("../assets/spec_lights/illC.json") as ISpecValue),
  illF: new Spectrum(require("../assets/spec_lights/illF.json") as ISpecValue)
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
