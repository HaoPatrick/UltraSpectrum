import { app } from "./firebase";

export async function getAt(index: number = 10) {
    const db = app.firestore();
    const specRef = db.collection("Spectrum");
    specRef.limit(100).get().then(
        querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
            })
        }
    );
}
