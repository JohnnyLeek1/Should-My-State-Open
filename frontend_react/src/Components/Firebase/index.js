import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

const db = firebase.firestore();

export const setData = async(setUpdatedDate, setDataState) => {
    await db.collection('data').orderBy('createdAt', 'desc').limit(1).get()
        .then(async(documents) => {
            const dataRef = documents.docs[0];
            let data = dataRef.data();
            const sorted = Object.keys(data.info)
                                 .sort()
                                 .reduce((acc, key) => ({
                                    ...acc, [key]: data.info[key]
                                 }), {})
            console.log(data.createdAt);
            await setUpdatedDate(data.createdAt.toDate());
            await setDataState(sorted);
        })
       // .catch(error => console.log(error.message));
}

export default {
    firebase, db
}
