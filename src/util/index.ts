export interface SpecValue {
    name: string;
    type: string;
    type_max: number;
    start_nm: number;
    end_nm: number;
    resolution: number;
    data: number[];
}

export function arrayMulti(data1: number[], data2: number[]) {
    const multipled = data1.map((_, i) => {
        return data1[i] * data2[i];
    });
    return multipled;
}
