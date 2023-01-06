// import firestore from 'firebase/firestore';
import { firebase } from '@react-native-firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCb-NPaNXE8b1R_3nwXgztDphHzH9qDLBM',
  authDomain: 'reactnativefirebase-00000.firebaseapp.com',
  databaseURL: "https://bega-370917-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: 'bega-370917',
  storageBucket: 'gs://bega-370917.appspot.com',
  appId: '1:133359035367:android:5cca53acad3560a6689342',
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()
export default firebase
