import { app } from "./firebase";
import { SpecValue, ISpecName } from "./index";
(async () =>
    app.firestore().enablePersistence()
)();

const db = app.firestore();
const specRef = db.collection("Spectrum");
const specNameRef = db.collection("specNames");

export async function getAt(index: number = 10) {
    const querySnapshot = await specRef.limit(100).get();
    console.log(querySnapshot.docs);
}

export async function getSpectrum(name: string): Promise<SpecValue> {
    const result = await specRef.where("name", "==", name).get();
    return result.docs[0].data() as SpecValue;
}

export async function getSpectrumNames(): Promise<ISpecName[]> {
    const response = await specNameRef.get();
    const results = response.docs.map(item => {
        return item.data();
    });
    return results as ISpecName[];
}
