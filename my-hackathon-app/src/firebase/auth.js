import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./config";
import { getUserProfile, saveUserProfile } from "./firestore";

// Simulated user for demo fallback when Firebase is not yet provisioned
const DEMO_USER = {
  uid: "demo-student-ali",
  displayName: "Ali Raza",
  email: "ali.raza@student.fast.edu.pk",
  photoURL: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Google Login.");
    const demoUser = { ...DEMO_USER, displayName: "Google Student", email: "student@gmail.com" };
    localStorage.setItem("study_coach_demo_user", JSON.stringify(demoUser));
    await saveUserProfile(demoUser.uid, {
      id: demoUser.uid,
      name: "Student",
      fullName: "Google Student",
      email: demoUser.email,
      avatarUrl: demoUser.photoURL,
    });
    return demoUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check & populate profile in Firestore
    const existing = await getUserProfile(user.uid);
    if (!existing || !existing.fullName) {
      await saveUserProfile(user.uid, {
        id: user.uid,
        name: user.displayName ? user.displayName.split(" ")[0] : "Student",
        fullName: user.displayName || "Study Coach Student",
        email: user.email || "",
        avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        university: "FAST National University",
        program: "BS Computer Science",
        semester: "4th Semester",
      });
    }

    return user;
  } catch (error) {
    console.error("[Auth] Google Sign-In error:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Email Login.");
    const demoUser = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      displayName: email ? email.split("@")[0] : DEMO_USER.displayName,
    };
    localStorage.setItem("study_coach_demo_user", JSON.stringify(demoUser));
    return demoUser;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("[Auth] Email Sign-In error:", error);
    throw error;
  }
};

export const signUpWithEmail = async ({ fullName, university, email, password }) => {
  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Email Sign-Up.");
    const demoUser = {
      uid: "user_" + Date.now(),
      displayName: fullName || "Student",
      email: email,
      photoURL: "https://i.pravatar.cc/150?u=" + Date.now(),
    };
    localStorage.setItem("study_coach_demo_user", JSON.stringify(demoUser));
    await saveUserProfile(demoUser.uid, {
      id: demoUser.uid,
      name: fullName.split(" ")[0],
      fullName: fullName,
      university: university || "FAST National University",
      email: email,
      avatarUrl: demoUser.photoURL,
    });
    return demoUser;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name in Firebase Auth
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName,
        photoURL: `https://i.pravatar.cc/150?u=${user.uid}`,
      });
    }

    // Save profile into Firestore
    await saveUserProfile(user.uid, {
      id: user.uid,
      name: fullName ? fullName.split(" ")[0] : "Student",
      fullName: fullName || "Student",
      university: university || "FAST National University",
      program: "BS Computer Science",
      semester: "1st Semester",
      email: email,
      avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`,
      role: "Student",
    });

    return user;
  } catch (error) {
    console.error("[Auth] Sign-Up error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  localStorage.removeItem("study_coach_demo_user");
  if (!isFirebaseConfigured) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("[Auth] Sign-Out error:", error);
  }
};

export const resetPassword = async (email) => {
  if (!isFirebaseConfigured) {
    return true;
  }
  return sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (callback) => {
  if (!isFirebaseConfigured) {
    const saved = localStorage.getItem("study_coach_demo_user");
    callback(saved ? JSON.parse(saved) : null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
