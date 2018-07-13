import { SpecValue, ISpecName } from "./index";

const API_ENDPOINT = "https://ultraspectrum.azurewebsites.net/api";


export async function getSpecByName(name: string): Promise<SpecValue> {
    const result = await fetch(`${API_ENDPOINT}/GetSpectrum?name=${name}`);
    const jsonResponse = await result.json();
    return jsonResponse;
}

export async function getAllNames(): Promise<string[]> {
    const response = await fetch(`${API_ENDPOINT}/AllSpectrum`);
    const jsonResponse = await response.json();
    return jsonResponse;
}
