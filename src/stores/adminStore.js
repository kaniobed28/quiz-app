import { makeAutoObservable } from "mobx";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore instance

class AdminStore {
  isAdmin = false; // State to track admin status
  currentAdmin = null; // Details of the currently logged-in admin
  admins = []; // List of all admins
  userSubscriptions = []; // List of subscriptions for the current user

  constructor() {
    makeAutoObservable(this);
  }

  // Check if the current user is an admin
  async checkAdminStatus(userId) {
    try {
      const adminDocRef = doc(db, "admins", userId); // Reference to the admin document
      const adminDoc = await getDoc(adminDocRef); // Fetch the document
      if (adminDoc.exists()) {
        this.isAdmin = true;
        this.currentAdmin = adminDoc.data();
      } else {
        this.isAdmin = false;
        this.currentAdmin = null;
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  }

  // Register the current user as an admin
  async registerAsAdmin(user) {
    try {
      const adminData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
      };

      const adminDocRef = doc(db, "admins", user.uid); // Reference to the admin document
      await setDoc(adminDocRef, adminData); // Save the document
      this.isAdmin = true;
      this.currentAdmin = adminData;
    } catch (error) {
      console.error("Error registering admin:", error);
      throw error; // Re-throw the error for the dialog to handle
    }
  }

  // Fetch all admins
  async fetchAdmins() {
    try {
      const adminsCollectionRef = collection(db, "admins"); // Reference to the admins collection
      const snapshot = await getDocs(adminsCollectionRef); // Get all documents in the collection
      this.admins = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })); // Map the documents to data
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }

  // Fetch user subscriptions
  async fetchUserSubscriptions(userId) {
    try {
      const subscriptionDocRef = doc(db, "subscriptions", userId); // Reference to the subscriptions document
      const subscriptionDoc = await getDoc(subscriptionDocRef); // Fetch the document
      if (subscriptionDoc.exists()) {
        this.userSubscriptions = subscriptionDoc.data().adminIds || [];
      } else {
        this.userSubscriptions = [];
      }
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
    }
  }

  // Subscribe to an admin
  async subscribeToAdmin(userId, adminId) {
    try {
      const subscriptionDocRef = doc(db, "subscriptions", userId); // Reference to the subscriptions document
      const updatedSubscriptions = [...this.userSubscriptions, adminId]; // Add the admin ID to subscriptions

      await setDoc(subscriptionDocRef, { adminIds: updatedSubscriptions }, { merge: true }); // Update Firestore
      this.userSubscriptions.push(adminId); // Update local state
    } catch (error) {
      console.error("Error subscribing to admin:", error);
    }
  }

  // Unsubscribe from an admin
  async unsubscribeFromAdmin(userId, adminId) {
    try {
      const subscriptionDocRef = doc(db, "subscriptions", userId); // Reference to the subscriptions document
      const updatedSubscriptions = this.userSubscriptions.filter((id) => id !== adminId); // Remove the admin ID

      await updateDoc(subscriptionDocRef, { adminIds: updatedSubscriptions }); // Update Firestore
      this.userSubscriptions = updatedSubscriptions; // Update local state
    } catch (error) {
      console.error("Error unsubscribing from admin:", error);
    }
  }

  // Remove admin status (optional)
  async removeAdmin(userId) {
    try {
      const adminDocRef = doc(db, "admins", userId); // Reference to the admin document
      await deleteDoc(adminDocRef); // Delete the document
      this.isAdmin = false;
      this.currentAdmin = null;
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  }
}

const adminStore = new AdminStore();
export default adminStore;
