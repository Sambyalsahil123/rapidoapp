import { firebase } from '../../Core/api/firebase/config';
import AppConfig from '../../config';

export class OrdersAPIManager {
  constructor() {
    this.tripsRef = firebase.firestore().collection('taxi_trips');
  }

  subscribe = (driverID, callback) => {
    if (!driverID) {
      return;
    }
    const ref = this.tripsRef
      .where('driverID', '==', driverID)
      .where('status', '==', 'trip_completed');
    // .orderBy('createdAt', 'desc');

    this.unsubscribeSnapshot = ref.onSnapshot(
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        data.sort((a, b) => b.tripEndTime - a.tripEndTime);
        callback && callback(data);
      },
      (error) => {
        console.log(error);
        alert(error);
      },
    );
  };

  unsubscribe = () => {
    this.unsubscribeSnapshot && this.unsubscribeSnapshot();
  };
}
