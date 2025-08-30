import { db } from "@/services/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const usersCollection = collection(db, "users");

export default async function getUsersInfo(familyId: string) {
  try {
    if (!familyId) throw new Error("No family Id passed.");

    const q = query(usersCollection, where("familyId", "==", familyId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const usersDocs = querySnapshot.docs;
      const users = usersDocs.map((user) => user.data());
      return users;
    } else return null;
  } catch (error) {
    console.error("While retrieving users info: ", error);
  }
}
