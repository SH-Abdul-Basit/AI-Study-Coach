import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import {
  mockUser,
  mockCourses,
  mockTopicMastery,
  mockStudyPlan,
  mockTodayPlan,
  mockQuizHistory,
  mockMaterials,
  mockCoachInsights,
  mockCoachMessages,
  mockProgressStats,
  mockPlanChanges,
  mockPastPapers,
} from "../data/mockData";

// Helper for local storage fallback when Firebase is not yet provisioned
const getLocalData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`study_coach_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = (key, value) => {
  try {
    localStorage.setItem(`study_coach_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error("Local storage error:", err);
  }
};

// ─── USER PROFILE ────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  if (!isFirebaseConfigured || !userId) {
    return getLocalData(`user_${userId}`, {
      ...mockUser,
      id: userId || mockUser.id,
      notifications: {
        studyReminders: true,
        quizRecommendations: true,
        planUpdates: false,
      },
    });
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return { id: userId, ...userSnap.data() };
    } else {
      // Create initial profile in Firestore
      const initialProfile = {
        name: "Ali",
        fullName: "Ali Raza",
        email: "",
        university: "FAST National University",
        program: "BS Computer Science",
        semester: "4th Semester",
        avatarUrl: "https://i.pravatar.cc/150?u=" + userId,
        role: "Student",
        studyPreferences: {
          dailyStudyTime: "4 hours",
          preferredTime: "Evening (6–10 PM)",
          studyGoal: "Score above 80% in finals",
        },
        notifications: {
          studyReminders: true,
          quizRecommendations: true,
          planUpdates: false,
        },
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, initialProfile, { merge: true });
      return { id: userId, ...initialProfile };
    }
  } catch (error) {
    console.warn("[Firestore] getUserProfile falling back to local:", error);
    return getLocalData(`user_${userId}`, { ...mockUser, id: userId });
  }
};

export const saveUserProfile = async (userId, data) => {
  setLocalData(`user_${userId}`, data);

  if (!isFirebaseConfigured || !userId) return data;

  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return data;
  } catch (error) {
    console.error("[Firestore] Error updating user profile:", error);
    return data;
  }
};

// ─── ONBOARDING DATA ────────────────────────────────────────────────────────

export const saveOnboardingData = async (userId, onboarding) => {
  const onboardingPayload = {
    semester: onboarding.semester,
    subject: onboarding.subject,
    professor: onboarding.professor,
    fileCount: onboarding.files ? onboarding.files.length : 0,
    completedAt: new Date().toISOString(),
  };

  // Update user profile with semester
  await saveUserProfile(userId, {
    semester: onboarding.semester,
    onboardingCompleted: true,
    onboardingData: onboardingPayload,
  });

  // Automatically create the initial course based on the subject & professor!
  if (onboarding.subject) {
    await addCourse(userId, {
      name: onboarding.subject,
      code: onboarding.subject.slice(0, 4).toUpperCase(),
      teacher: onboarding.professor || "Instructor",
      progress: 10,
      examDate: "2026-10-15",
      examType: "Final",
      daysUntilExam: 38,
      topics: 6,
      materials: onboarding.files ? onboarding.files.length : 0,
      quizzesTaken: 0,
      color: "#6347F5",
    });
  }

  return onboardingPayload;
};

// ─── COURSES ─────────────────────────────────────────────────────────────────

export const getUserCourses = async (userId) => {
  const localCourses = getLocalData(`courses_${userId}`, mockCourses);

  if (!isFirebaseConfigured || !userId) {
    return localCourses;
  }

  try {
    const coursesRef = collection(db, "users", userId, "courses");
    const snapshot = await getDocs(coursesRef);

    if (snapshot.empty) {
      // Seed default courses
      for (const course of mockCourses) {
        await addDoc(coursesRef, course);
      }
      return mockCourses;
    }

    const courses = [];
    snapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() });
    });
    return courses;
  } catch (error) {
    console.warn("[Firestore] getUserCourses falling back to local:", error);
    return localCourses;
  }
};

export const addCourse = async (userId, courseData) => {
  const localCourses = getLocalData(`courses_${userId}`, mockCourses);
  const newCourse = {
    id: "c_" + Date.now(),
    progress: 0,
    topics: 6,
    materials: 0,
    quizzesTaken: 0,
    color: "#6347F5",
    daysUntilExam: 30,
    ...courseData,
    createdAt: new Date().toISOString(),
  };

  const updated = [newCourse, ...localCourses];
  setLocalData(`courses_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newCourse;
  }

  try {
    const coursesRef = collection(db, "users", userId, "courses");
    const docRef = await addDoc(coursesRef, {
      ...newCourse,
      createdAt: serverTimestamp(),
    });
    return { ...newCourse, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error adding course:", error);
    return newCourse;
  }
};

// ─── TOPIC MASTERY ───────────────────────────────────────────────────────────

export const getTopicMastery = async (userId, courseId) => {
  const localTopics = getLocalData(`topic_mastery_${userId}`, mockTopicMastery);

  if (!isFirebaseConfigured || !userId) {
    return courseId ? localTopics.filter((t) => !t.courseId || t.courseId === courseId) : localTopics;
  }

  try {
    const topicsRef = collection(db, "users", userId, "topicMastery");
    const snapshot = await getDocs(topicsRef);

    if (snapshot.empty) {
      // Seed initial topic mastery
      for (const topic of mockTopicMastery) {
        await addDoc(topicsRef, topic);
      }
      return mockTopicMastery;
    }

    const topics = [];
    snapshot.forEach((docSnap) => {
      topics.push({ id: docSnap.id, ...docSnap.data() });
    });

    return courseId ? topics.filter((t) => !t.courseId || t.courseId === courseId) : topics;
  } catch (error) {
    console.warn("[Firestore] getTopicMastery falling back to local:", error);
    return localTopics;
  }
};

export const updateTopicMastery = async (userId, topicName, newScore) => {
  const localTopics = getLocalData(`topic_mastery_${userId}`, mockTopicMastery);
  const updatedTopics = localTopics.map((t) => {
    if (t.name.toLowerCase() === topicName.toLowerCase()) {
      const status = newScore >= 80 ? "strong" : newScore >= 60 ? "moderate" : "weak";
      const trend = newScore > t.mastery ? "up" : newScore < t.mastery ? "down" : "stable";
      return { ...t, mastery: newScore, status, trend };
    }
    return t;
  });
  setLocalData(`topic_mastery_${userId}`, updatedTopics);

  if (!isFirebaseConfigured || !userId) return updatedTopics;

  try {
    const topicsRef = collection(db, "users", userId, "topicMastery");
    const snapshot = await getDocs(topicsRef);
    snapshot.forEach(async (docSnap) => {
      const data = docSnap.data();
      if (data.name && data.name.toLowerCase() === topicName.toLowerCase()) {
        const status = newScore >= 80 ? "strong" : newScore >= 60 ? "moderate" : "weak";
        const trend = newScore > data.mastery ? "up" : newScore < data.mastery ? "down" : "stable";
        await updateDoc(docSnap.ref, { mastery: newScore, status, trend });
      }
    });
  } catch (err) {
    console.error("[Firestore] Error updating topic mastery:", err);
  }
  return updatedTopics;
};

// ─── STUDY PLAN ──────────────────────────────────────────────────────────────

export const getStudyPlan = async (userId) => {
  const localPlan = getLocalData(`study_plan_${userId}`, mockStudyPlan);

  if (!isFirebaseConfigured || !userId) {
    return localPlan;
  }

  try {
    const planDocRef = doc(db, "users", userId, "studyPlan", "active");
    const planSnap = await getDoc(planDocRef);

    if (planSnap.exists()) {
      return planSnap.data().days || localPlan;
    } else {
      await setDoc(planDocRef, { days: mockStudyPlan, updatedAt: serverTimestamp() });
      return mockStudyPlan;
    }
  } catch (error) {
    console.warn("[Firestore] getStudyPlan falling back to local:", error);
    return localPlan;
  }
};

export const updateTaskStatus = async (userId, dayIndex, taskId, newStatus) => {
  const currentPlan = getLocalData(`study_plan_${userId}`, mockStudyPlan);
  const updatedPlan = [...currentPlan];

  if (updatedPlan[dayIndex]) {
    const tasks = [...updatedPlan[dayIndex].tasks];
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], status: newStatus };
      updatedPlan[dayIndex] = { ...updatedPlan[dayIndex], tasks };
      setLocalData(`study_plan_${userId}`, updatedPlan);
    }
  }

  if (!isFirebaseConfigured || !userId) {
    return updatedPlan;
  }

  try {
    const planDocRef = doc(db, "users", userId, "studyPlan", "active");
    await setDoc(planDocRef, { days: updatedPlan, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("[Firestore] Error updating task status:", error);
  }

  return updatedPlan;
};

export const saveStudyPlan = async (userId, planDays) => {
  setLocalData(`study_plan_${userId}`, planDays);

  if (!isFirebaseConfigured || !userId) return planDays;

  try {
    const planDocRef = doc(db, "users", userId, "studyPlan", "active");
    await setDoc(planDocRef, { days: planDays, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("[Firestore] Error saving study plan:", error);
  }

  return planDays;
};

// ─── QUIZZES & PRACTICE ──────────────────────────────────────────────────────

export const getQuizHistory = async (userId) => {
  const localHistory = getLocalData(`quiz_history_${userId}`, mockQuizHistory);

  if (!isFirebaseConfigured || !userId) {
    return localHistory;
  }

  try {
    const quizzesRef = collection(db, "users", userId, "quizzes");
    const q = query(quizzesRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return localHistory;
    }

    const list = [];
    snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (error) {
    console.warn("[Firestore] getQuizHistory falling back to local:", error);
    return localHistory;
  }
};

export const saveQuizResult = async (userId, quizResult) => {
  const localHistory = getLocalData(`quiz_history_${userId}`, mockQuizHistory);
  const record = {
    id: "q_" + Date.now(),
    date: new Date().toISOString().split("T")[0],
    ...quizResult,
  };

  const updated = [record, ...localHistory];
  setLocalData(`quiz_history_${userId}`, updated);

  // Update topic mastery
  if (quizResult.topic && quizResult.score !== undefined) {
    await updateTopicMastery(userId, quizResult.topic, quizResult.score);
  }

  if (!isFirebaseConfigured || !userId) {
    return record;
  }

  try {
    const quizzesRef = collection(db, "users", userId, "quizzes");
    const docRef = await addDoc(quizzesRef, {
      ...record,
      createdAt: serverTimestamp(),
    });
    return { ...record, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error saving quiz result:", error);
    return record;
  }
};

// ─── STUDY MATERIALS ─────────────────────────────────────────────────────────

export const getMaterials = async (userId) => {
  const localMaterials = getLocalData(`materials_${userId}`, mockMaterials);

  if (!isFirebaseConfigured || !userId) {
    return localMaterials;
  }

  try {
    const matRef = collection(db, "users", userId, "materials");
    const snapshot = await getDocs(matRef);

    if (snapshot.empty) {
      return localMaterials;
    }

    const items = [];
    snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (error) {
    console.warn("[Firestore] getMaterials falling back to local:", error);
    return localMaterials;
  }
};

export const addMaterial = async (userId, materialData) => {
  const localMaterials = getLocalData(`materials_${userId}`, mockMaterials);
  const newMaterial = {
    id: "m_" + Date.now(),
    date: new Date().toISOString().split("T")[0],
    status: "analyzed",
    ...materialData,
  };

  const updated = [newMaterial, ...localMaterials];
  setLocalData(`materials_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newMaterial;
  }

  try {
    const matRef = collection(db, "users", userId, "materials");
    const docRef = await addDoc(matRef, {
      ...newMaterial,
      createdAt: serverTimestamp(),
    });
    return { ...newMaterial, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error adding material:", error);
    return newMaterial;
  }
};

// ─── AI COACH CHAT ───────────────────────────────────────────────────────────

export const getChatMessages = async (userId) => {
  const localMessages = getLocalData(`chat_messages_${userId}`, mockCoachMessages);

  if (!isFirebaseConfigured || !userId) {
    return localMessages;
  }

  try {
    const messagesRef = collection(db, "users", userId, "chatMessages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return localMessages;
    }

    const messages = [];
    snapshot.forEach((d) => messages.push({ id: d.id, ...d.data() }));
    return messages;
  } catch (error) {
    console.warn("[Firestore] getChatMessages falling back to local:", error);
    return localMessages;
  }
};

export const saveChatMessage = async (userId, message) => {
  const localMessages = getLocalData(`chat_messages_${userId}`, mockCoachMessages);
  const newMsg = {
    id: "msg_" + Date.now(),
    createdAt: new Date().toISOString(),
    ...message,
  };

  const updated = [...localMessages, newMsg];
  setLocalData(`chat_messages_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newMsg;
  }

  try {
    const messagesRef = collection(db, "users", userId, "chatMessages");
    const docRef = await addDoc(messagesRef, {
      ...newMsg,
      createdAt: serverTimestamp(),
    });
    return { ...newMsg, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error saving chat message:", error);
    return newMsg;
  }
};

// ─── PROGRESS & ANALYTICS ────────────────────────────────────────────────────

export const getProgressStats = async (userId) => {
  const localStats = getLocalData(`stats_${userId}`, mockProgressStats);

  if (!isFirebaseConfigured || !userId) {
    return localStats;
  }

  try {
    const statsRef = doc(db, "users", userId, "stats", "current");
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      return snap.data();
    }
    return localStats;
  } catch (error) {
    console.warn("[Firestore] getProgressStats falling back to local:", error);
    return localStats;
  }
};

// ─── PAST PAPERS ─────────────────────────────────────────────────────────────

export const getPastPapers = async (userId) => {
  const localPapers = getLocalData(`past_papers_${userId}`, mockPastPapers);

  if (!isFirebaseConfigured || !userId) {
    return localPapers;
  }

  try {
    const papersRef = collection(db, "users", userId, "pastPapers");
    const snapshot = await getDocs(papersRef);

    if (snapshot.empty) {
      return localPapers;
    }

    const papers = [];
    snapshot.forEach((d) => papers.push({ id: d.id, ...d.data() }));
    return papers;
  } catch (error) {
    console.warn("[Firestore] getPastPapers falling back to local:", error);
    return localPapers;
  }
};

export const addPastPaper = async (userId, paperData) => {
  const localPapers = getLocalData(`past_papers_${userId}`, mockPastPapers);
  const newPaper = {
    id: "paper_" + Date.now(),
    year: new Date().getFullYear().toString(),
    term: "Final",
    questionsCount: 15,
    difficulty: "Medium",
    aiAnalyzed: true,
    keyTopics: ["General Review"],
    createdAt: new Date().toISOString(),
    ...paperData,
  };

  const updated = [newPaper, ...localPapers];
  setLocalData(`past_papers_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newPaper;
  }

  try {
    const papersRef = collection(db, "users", userId, "pastPapers");
    const docRef = await addDoc(papersRef, {
      ...newPaper,
      createdAt: serverTimestamp(),
    });
    return { ...newPaper, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error adding past paper:", error);
    return newPaper;
  }
};
