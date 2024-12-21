import { makeAutoObservable } from "mobx";
import { auth } from "../firebaseConfig"; // Import your Firebase auth
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.initAuthStateListener(); // Initialize listener for authentication state
  }

  // Initialize listener to persist authentication
  initAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setUser(user);
      } else {
        this.clearUser();
      }
    });
  }

  // Login with Google
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      this.setUser(result.user); // Set the user after successful login
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      this.clearUser();
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  }

  // Set the user
  setUser(user) {
    this.user = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
    };
  }

  // Clear the user
  clearUser() {
    this.user = null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.user !== null;
  }
}

const userStore = new UserStore();
export default userStore;
