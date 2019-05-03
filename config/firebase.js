import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyCVU8US9KcrlMhUqdiOegKI-KLZQWyCxDA",
  authDomain: "eazer-ml.firebaseapp.com",
  databaseURL: "https://eazer-ml.firebaseio.com",
  projectId: "eazer-ml",
  storageBucket: "eazer-ml.appspot.com",
  messagingSenderId: "56745284055"
};
firebase.initializeApp(config);
const DB = firebase.database().ref("/gallery-app");

export { firebase, DB };
