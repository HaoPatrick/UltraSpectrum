import firebase from "firebase";

const config = {
    apiKey: "AIzaSyDn5P46ksjiwyX9WutQ3qHXKDfHwFhgNGU",
    authDomain: "database-81b2c.firebaseapp.com",
    databaseURL: "https://database-81b2c.firebaseio.com",
    projectId: "database-81b2c",
    storageBucket: "database-81b2c.appspot.com",
    messagingSenderId: "231214365957"
};

const app: firebase.app.App = !firebase.apps.length ?
    firebase.initializeApp(config) : firebase.app();
export { app };
