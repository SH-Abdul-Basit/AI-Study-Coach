import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginWithGoogle as fbLoginWithGoogle,
  loginWithEmail as fbLoginWithEmail,
  signUpWithEmail as fbSignUpWithEmail,
  logoutUser,
  subscribeToAuthChanges,
} from "../firebase/auth";
import { getExistingUserProfile, saveUserProfile } from "../firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setUserProfile(null);
      return null;
    }
    try {
      const profile = await getExistingUserProfile(userId);
      setUserProfile(profile);
      return profile;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const loginWithGoogle = async (mode = "login") => {
    const resUser = await fbLoginWithGoogle(mode);
    if (!resUser) return null;
    setUser(resUser);
    await fetchProfile(resUser.uid);
    return resUser;
  };

  const loginWithEmail = async (email, password) => {
    const resUser = await fbLoginWithEmail(email, password);
    setUser(resUser);
    await fetchProfile(resUser.uid);
    return resUser;
  };

  const signUpWithEmail = async (data) => {
    const resUser = await fbSignUpWithEmail(data);
    setUser(resUser);
    await fetchProfile(resUser.uid);
    return resUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (updates) => {
    const userId = user ? user.uid : "u1";
    const updated = await saveUserProfile(userId, updates);
    setUserProfile((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        updateProfileData,
        reloadProfile: () => fetchProfile(user?.uid),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default AuthContext;
