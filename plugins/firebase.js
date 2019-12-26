// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBsrBP4PVDUBFJVQ87psrE1AqqFlAHsAsA',
    authDomain: 'leplab-marec-2019.firebaseapp.com',
    databaseURL: 'https://leplab-marec-2019.firebaseio.com',
    projectId: 'leplab-marec-2019',
    storageBucket: 'leplab-marec-2019.appspot.com',
    messagingSenderId: '97449749605',
    appId: '1:97449749605:web:c5dd580497f2bbd040ea8c',
    measurementId: 'G-7H2R6Y7SRS'
  })
  const db = firebase.firestore()
  db.enablePersistence({ synchronizeTabs: true })
}

export default firebase
