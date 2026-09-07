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
import { getExistingUserProfile, saveUserProfile } from "./firestore";

const isPopupCancellation = (error) =>
  ["auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(error?.code);

export const loginWithGoogle = async (mode = "login") => {
  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Google Login.");
    const savedDemoUser = localStorage.getItem("study_coach_demo_user");
    if (mode === "login" && !savedDemoUser) {
      const error = new Error("No registered account was found. Please sign up first.");
      error.code = "auth/user-not-found";
      throw error;
    }
    const demoUser = savedDemoUser ? JSON.parse(savedDemoUser) : {
      uid: "student_" + Date.now(),
      displayName: "Google Student",
      email: "student@gmail.com",
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=Google%20Student&backgroundColor=6347f5`,
    };
    localStorage.setItem("study_coach_demo_user", JSON.stringify(demoUser));
    if (mode === "signup") await saveUserProfile(demoUser.uid, {
      id: demoUser.uid,
      uid: demoUser.uid,
      name: "Student",
      fullName: "Google Student",
      email: demoUser.email,
      avatarUrl: demoUser.photoURL,
      role: "Student",
      currentStreak: 1,
      longestStreak: 1,
      onboardingCompleted: false,
    });
    return demoUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // A normal sign-in must not create a profile. Only an explicit sign-up may do so.
    const existing = await getExistingUserProfile(user.uid);
    if (mode === "login" && !existing) {
      await signOut(auth);
      const error = new Error("No registered account was found. Please sign up first.");
      error.code = "auth/user-not-found";
      throw error;
    }
    if (mode === "signup" && (!existing || !existing.fullName || existing.fullName === "Student")) {
      const displayName = user.displayName || "Student";
      const firstName = displayName.split(" ")[0] || "Student";
      await saveUserProfile(user.uid, {
        id: user.uid,
        uid: user.uid,
        name: firstName,
        fullName: displayName,
        email: user.email || "",
        avatarUrl:
          user.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            displayName
          )}&backgroundColor=6347f5`,
        university: existing?.university || "",
        program: existing?.program || "Undergraduate",
        semester: existing?.semester || "1st Semester",
        role: "Student",
        currentStreak: existing?.currentStreak || 1,
        longestStreak: existing?.longestStreak || 1,
        onboardingCompleted: existing?.onboardingCompleted || false,
      });
    }

    return user;
  } catch (error) {
    if (isPopupCancellation(error)) return null;
    console.error("[Auth] Google Sign-In error:", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Email Login.");
    const saved = localStorage.getItem("study_coach_demo_user");
    const demoUser = saved ? JSON.parse(saved) : null;
    if (!demoUser || demoUser.email?.toLowerCase() !== email?.trim().toLowerCase()) {
      const error = new Error("No registered account was found. Please sign up first.");
      error.code = "auth/user-not-found";
      throw error;
    }
    return demoUser;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getExistingUserProfile(userCredential.user.uid);
    if (!profile) {
      await signOut(auth);
      const error = new Error("No registered account profile was found. Please sign up first.");
      error.code = "auth/user-not-found";
      throw error;
    }
    return userCredential.user;
  } catch (error) {
    console.error("[Auth] Email Sign-In error:", error);
    throw error;
  }
};

export const signUpWithEmail = async ({ fullName, university, email, password }) => {
  const cleanName = (fullName || "").trim() || "Student";
  const firstName = cleanName.split(" ")[0];
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    cleanName
  )}&backgroundColor=6347f5`;

  if (!isFirebaseConfigured) {
    console.warn("[Auth] Firebase not configured in .env. Running demo Email Sign-Up.");
    const demoUser = {
      uid: "user_" + Date.now(),
      displayName: cleanName,
      email: email,
      photoURL: avatarUrl,
    };
    localStorage.setItem("study_coach_demo_user", JSON.stringify(demoUser));
    await saveUserProfile(demoUser.uid, {
      id: demoUser.uid,
      uid: demoUser.uid,
      name: firstName,
      fullName: cleanName,
      university: university || "",
      program: "Undergraduate",
      semester: "1st Semester",
      email: email,
      avatarUrl,
      role: "Student",
      currentStreak: 1,
      longestStreak: 1,
      onboardingCompleted: false,
    });
    return demoUser;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name in Firebase Auth
    if (cleanName) {
      await updateProfile(user, {
        displayName: cleanName,
        photoURL: avatarUrl,
      });
    }

    // Save initial user profile into Firestore
    await saveUserProfile(user.uid, {
      id: user.uid,
      uid: user.uid,
      name: firstName,
      fullName: cleanName,
      university: university || "",
      program: "Undergraduate",
      semester: "1st Semester",
      email: email,
      avatarUrl,
      role: "Student",
      currentStreak: 1,
      longestStreak: 1,
      onboardingCompleted: false,
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
