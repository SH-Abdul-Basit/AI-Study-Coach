import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginWithGoogle as fbLoginWithGoogle,
  loginWithEmail as fbLoginWithEmail,
  signUpWithEmail as fbSignUpWithEmail,
  logoutUser,
  subscribeToAuthChanges,
} from "../firebase/auth";
import { getUserProfile, saveUserProfile } from "../firebase/firestore";
import { mockUser } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(mockUser);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setUserProfile(mockUser);
      return;
    }
    try {
      const profile = await getUserProfile(userId);
      setUserProfile((prev) => ({ ...prev, ...profile }));
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setUserProfile(mockUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const loginWithGoogle = async () => {
    const resUser = await fbLoginWithGoogle();
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
    setUserProfile(mockUser);
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
