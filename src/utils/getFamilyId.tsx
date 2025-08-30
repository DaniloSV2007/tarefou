import { db } from "@/services/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const usersCollection = collection(db, "users");

export default async function getFamilyId() {
  const familyId = await AsyncStorage.getItem("familyId");
  if (familyId) {
    return familyId;
  }

  const username = await AsyncStorage.getItem("username");
  try {
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0];
      const userRef = user.ref;

      const userPrivateRef = doc(userRef, "private", "data");
      const userPrivate = await getDoc(userPrivateRef);
      const userPrivateData = userPrivate.data();

      return userPrivateData?.familyId;
    }
  } catch (error) {
    console.error("Error while getting Family Id: ", error);
  }
}
