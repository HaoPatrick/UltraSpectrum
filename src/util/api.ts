import { app } from "./firebase";
(async () =>
    app.firestore().enablePersistence()
)();
export async function getAt(index: number = 10) {
    const db = app.firestore();
    const specRef = db.collection("Spectrum");
    const querySnapshot = await specRef.limit(100).get();
    console.log(querySnapshot.docs);
}
