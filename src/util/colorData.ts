import { ISpecValue } from "./index";

const lights: { [name: string]: ISpecValue } = {
  // tslint:disable:no-var-requires
  d50: require("../assets/spec_lights/d50.json"),
  d65: require("../assets/spec_lights/d65.json"),
  illA: require("../assets/spec_lights/illA.json"),
  illC: require("../assets/spec_lights/illC.json"),
  illF: require("../assets/spec_lights/illF.json")
};
const reflectance: ISpecValue[] = [
  ...require("../assets/spec_reflectance/natural.json")
];
const colorMatch: { x: ISpecValue; y: ISpecValue; z: ISpecValue } = {
  x: require("../assets/spec_color_match/x.json"),
  y: require("../assets/spec_color_match/y.json"),
  z: require("../assets/spec_color_match/z.json")
};

export { lights, reflectance, colorMatch };
