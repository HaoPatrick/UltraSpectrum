import { RGB, ISpecValue, Spectrum } from "@/util/ColorSpace";

const API_ENDPOINT = "https://ultraspectrum.azurewebsites.net/api";

export async function getSpecByName(name: string): Promise<Spectrum> {
  const result = await fetch(`${API_ENDPOINT}/GetSpectrum?name=${name}`);
  const jsonResponse = await result.json();
  return new Spectrum(jsonResponse as ISpecValue);
}

export async function getAllNames(): Promise<string[]> {
  const response = await fetch(`${API_ENDPOINT}/AllSpectrum`);
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function findRGBMatch(rgb: RGB): Promise<Spectrum> {
  const result = await fetch(
    `${API_ENDPOINT}/RGB2Spectrum?r=${rgb.r}&g=${rgb.g}&b=${rgb.b}`
  );
  const jsonResponse = await result.json();
  return new Spectrum(jsonResponse as ISpecValue);
}
