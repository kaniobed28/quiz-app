import { makeAutoObservable } from "mobx";
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

class SubscriptionStore {
  subscriptions = []; // List of subscriptions

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch subscriptions for a specific user
  async fetchSubscriptions(userId) {
    try {
      const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      this.subscriptions = snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  }

  // Subscribe to an admin
  async subscribe(userId, adminId) {
    try {
      const subscriptionData = {
        userId,
        adminId,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "subscriptions", `${userId}_${adminId}`), subscriptionData);
      this.subscriptions.push(subscriptionData);
    } catch (error) {
      console.error("Error subscribing to admin:", error);
    }
  }

  // Unsubscribe from an admin
  async unsubscribe(userId, adminId) {
    try {
      await deleteDoc(doc(db, "subscriptions", `${userId}_${adminId}`));
      this.subscriptions = this.subscriptions.filter(
        (sub) => !(sub.userId === userId && sub.adminId === adminId)
      );
    } catch (error) {
      console.error("Error unsubscribing from admin:", error);
    }
  }

  // Check if the user is subscribed to an admin
  isSubscribed(adminId) {
    return this.subscriptions.some((sub) => sub.adminId === adminId);
  }
}

const subscriptionStore = new SubscriptionStore();
export default subscriptionStore;
