import { app } from "./firebase";
import { SpecValue } from "./index";
(async () =>
    app.firestore().enablePersistence()
)();

const db = app.firestore();
const specRef = db.collection("Spectrum");
export async function getAt(index: number = 10) {
    const querySnapshot = await specRef.limit(100).get();
    console.log(querySnapshot.docs);
}

export async function getSpectrum(name: string): Promise<SpecValue> {
    const result = await specRef.where("name", "==", name).get();
    return result.docs[0].data() as SpecValue;
}
