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
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

// ─── TIMEOUT & LOCAL STORAGE HELPERS ─────────────────────────────────────────

export const withTimeout = (promise, ms = 5000, fallbackValue = null) => {
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      console.warn(`[Firestore] Operation timed out after ${ms}ms. Using fallback.`);
      if (fallbackValue !== null) {
        resolve(fallbackValue);
      } else {
        reject(new Error(`Operation timed out after ${ms}ms`));
      }
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

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

// ─── STREAK & DATE HELPERS ───────────────────────────────────────────────────

export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export const generateWeeklyActivity = (existingActivity = []) => {
  const today = new Date();
  // 0 = Monday, ..., 6 = Sunday
  const todayIndex = (today.getDay() + 6) % 7;

  return DAYS_OF_WEEK.map((dayName, idx) => {
    const prev = existingActivity?.find(
      (a) => a.day === dayName || a.short === DAYS_SHORT[idx]
    );
    const isToday = idx === todayIndex;
    const active = isToday ? true : Boolean(prev?.active && idx <= todayIndex);

    return {
      day: dayName,
      short: DAYS_SHORT[idx],
      active,
      isToday,
    };
  });
};

export const calculateStreakUpdate = (userData = {}) => {
  const todayStr = getLocalDateString();
  const yesterdayStr = getYesterdayDateString();
  const lastActive = userData.lastActiveDate;

  let currentStreak = userData.currentStreak ?? 1;
  let longestStreak = userData.longestStreak ?? currentStreak;
  let shouldUpdate = false;

  if (!lastActive) {
    currentStreak = 1;
    longestStreak = Math.max(longestStreak, 1);
    shouldUpdate = true;
  } else if (lastActive === todayStr) {
    // Visited already today - maintain current streak
  } else if (lastActive === yesterdayStr) {
    // Consecutive active day!
    currentStreak += 1;
    longestStreak = Math.max(longestStreak, currentStreak);
    shouldUpdate = true;
  } else {
    // Streak broken (missed day)
    currentStreak = 1;
    shouldUpdate = true;
  }

  const weeklyActivity = generateWeeklyActivity(userData.weeklyActivity);

  // Check if weekly activity needs updating
  const activityMatches =
    JSON.stringify(weeklyActivity) === JSON.stringify(userData.weeklyActivity);
  if (!activityMatches) {
    shouldUpdate = true;
  }

  return {
    shouldUpdate,
    updates: {
      currentStreak,
      longestStreak,
      lastActiveDate: todayStr,
      weeklyActivity,
    },
  };
};

// ─── USER PROFILE ────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  if (!userId) return null;

  const defaultProfile = {
    id: userId,
    uid: userId,
    name: "Student",
    fullName: "Student",
    email: "",
    university: "",
    program: "Undergraduate",
    semester: "1st Semester",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      userId
    )}&backgroundColor=6347f5`,
    role: "Student",
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: getLocalDateString(),
    weeklyActivity: generateWeeklyActivity(),
    totalStudyHours: 0,
    dailyGoalMinutes: 120,
    onboardingCompleted: false,
    studyPreferences: {
      dailyStudyTime: "2 hours",
      preferredTime: "Evening (6–10 PM)",
      studyGoal: "Score above 80% in finals",
    },
    notifications: {
      studyReminders: true,
      quizRecommendations: true,
      planUpdates: false,
    },
  };

  if (!isFirebaseConfigured) {
    const local = getLocalData(`user_${userId}`, defaultProfile);
    const streakCheck = calculateStreakUpdate(local);
    if (streakCheck.shouldUpdate) {
      const updated = { ...local, ...streakCheck.updates };
      setLocalData(`user_${userId}`, updated);
      return updated;
    }
    return local;
  }

  try {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await withTimeout(getDoc(userDocRef), 4000, null);

    if (userSnap && userSnap.exists()) {
      const data = userSnap.data();
      const streakCheck = calculateStreakUpdate(data);

      if (streakCheck.shouldUpdate) {
        try {
          await updateDoc(userDocRef, {
            ...streakCheck.updates,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          console.warn("[Firestore] Could not sync streak update to cloud:", err);
        }
        const updated = { id: userId, ...data, ...streakCheck.updates };
        setLocalData(`user_${userId}`, updated);
        return updated;
      }

      const current = { id: userId, ...data };
      setLocalData(`user_${userId}`, current);
      return current;
    } else {
      // Initialize profile in Firestore
      const initialProfile = {
        ...defaultProfile,
        createdAt: serverTimestamp(),
      };
      await withTimeout(setDoc(userDocRef, initialProfile, { merge: true }), 4000);
      setLocalData(`user_${userId}`, initialProfile);
      return initialProfile;
    }
  } catch (error) {
    console.warn("[Firestore] getUserProfile falling back to local:", error);
    return getLocalData(`user_${userId}`, defaultProfile);
  }
};

// Unlike getUserProfile, this never creates a document. It is used during sign-in
// so an unregistered account cannot be treated as an onboarded student.
export const getExistingUserProfile = async (userId) => {
  if (!userId) return null;
  const localProfile = getLocalData(`user_${userId}`, null);
  if (!isFirebaseConfigured) return localProfile;

  try {
    const snapshot = await withTimeout(getDoc(doc(db, "users", userId)), 4000, null);
    if (!snapshot?.exists()) return localProfile;
    const profile = { id: userId, ...snapshot.data() };
    setLocalData(`user_${userId}`, profile);
    return profile;
  } catch (error) {
    console.warn("[Firestore] Could not load existing user profile:", error);
    return localProfile;
  }
};

export const saveUserProfile = async (userId, data) => {
  if (!userId) return data;

  const currentLocal = getLocalData(`user_${userId}`, {});
  const merged = { ...currentLocal, ...data };
  setLocalData(`user_${userId}`, merged);

  if (!isFirebaseConfigured) return merged;

  try {
    const userDocRef = doc(db, "users", userId);
    await withTimeout(
      setDoc(userDocRef, { ...data, updatedAt: serverTimestamp() }, { merge: true }),
      4000
    );
    return merged;
  } catch (error) {
    console.error("[Firestore] Error updating user profile:", error);
    return merged;
  }
};

// ─── ONBOARDING DATA & PIPELINE ──────────────────────────────────────────────

export const saveOnboardingData = async (userId, onboarding) => {
  const completedAt = new Date().toISOString();
  const todayStr = getLocalDateString();

  const onboardingPayload = {
    semester: onboarding.semester || "1st Semester",
    subject: onboarding.subject || "",
    professor: onboarding.professor || "",
    fileCount: onboarding.files ? onboarding.files.length : 0,
    completedAt,
  };

  // 1. Update user profile
  await saveUserProfile(userId, {
    semester: onboarding.semester || "1st Semester",
    onboardingCompleted: true,
    onboardingData: onboardingPayload,
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: todayStr,
    weeklyActivity: generateWeeklyActivity(),
  });

  // 2. Automatically create the initial course based on the subject & professor!
  if (onboarding.subject) {
    const subjectClean = onboarding.subject.trim();
    const words = subjectClean.split(" ");
    const code =
      words.length > 1
        ? words.map((w) => w[0]?.toUpperCase()).join("").slice(0, 4)
        : subjectClean.slice(0, 4).toUpperCase();

    const createdCourse = await addCourse(userId, {
      name: subjectClean,
      code,
      teacher: onboarding.professor || "Instructor",
      currentStage: "In Progress",
      currentTopic: `${subjectClean} Fundamentals`,
      topics: [],
      materials: onboarding.files ? onboarding.files.length : 0,
      color: "#6347F5",
    });

  }

  // 4. Save uploaded study materials metadata directly to Firestore
  if (onboarding.files && onboarding.files.length > 0) {
    for (const file of onboarding.files) {
      try {
        await addMaterial(userId, {
          name: file.name,
          size: file.size,
          type: file.type || "Notes",
          course: onboarding.subject || "General",
          url: file.url || "",
          uploadedAt: completedAt,
          status: "analyzed",
        });
      } catch (err) {
        console.warn("[Firestore] Non-blocking notice saving material:", err);
      }
    }
  }

  // 5. Initialize personalized Study Plan in Firestore
  const subjectName = onboarding.subject || "Your Course";
  const initialPlan = [
    {
      day: 1,
      date: todayStr,
      label: "Day 1",
      status: "today",
      tasks: [
        {
          id: "sp_init_1",
          topic: `${subjectName} Fundamentals`,
          duration: "30 min",
          priority: "high",
          status: "in-progress",
          type: "Review",
          difficulty: "easy",
        },
        {
          id: "sp_init_2",
          topic: "Diagnostic Practice Quiz",
          duration: "20 min",
          priority: "medium",
          status: "pending",
          type: "Quiz",
          difficulty: "medium",
        },
      ],
    },
    {
      day: 2,
      date: getLocalDateString(new Date(Date.now() + 86400000)),
      label: "Day 2",
      status: "upcoming",
      tasks: [
        {
          id: "sp_init_3",
          topic: "Core Principles & Notes Review",
          duration: "45 min",
          priority: "high",
          status: "pending",
          type: "Study",
          difficulty: "medium",
        },
      ],
    },
    {
      day: 3,
      date: getLocalDateString(new Date(Date.now() + 86400000 * 2)),
      label: "Day 3",
      status: "upcoming",
      tasks: [
        {
          id: "sp_init_4",
          topic: "Problem Solving & Examples",
          duration: "35 min",
          priority: "medium",
          status: "pending",
          type: "Practice",
          difficulty: "hard",
        },
      ],
    },
  ];

  await saveStudyPlan(userId, initialPlan);

  return onboardingPayload;
};

// ─── COURSES ─────────────────────────────────────────────────────────────────

export const getUserCourses = async (userId) => {
  const localCourses = getLocalData(`courses_${userId}`, []);

  if (!userId) return localCourses;

  if (!isFirebaseConfigured) {
    return localCourses;
  }

  try {
    const coursesRef = collection(db, "users", userId, "courses");
    const snapshot = await withTimeout(getDocs(coursesRef), 4000, null);

    if (!snapshot || snapshot.empty) {
      // Do not force-seed mock courses for real users; return local or empty array
      return localCourses;
    }

    const courses = [];
    snapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() });
    });
    setLocalData(`courses_${userId}`, courses);
    return courses;
  } catch (error) {
    console.warn("[Firestore] getUserCourses falling back to local:", error);
    return localCourses;
  }
};

export const addCourse = async (userId, courseData) => {
  const localCourses = getLocalData(`courses_${userId}`, []);
  const normalize = (value = "") => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const courseKey = normalize(courseData.code) || normalize(courseData.name);
  const existingLocal = localCourses.find((course) =>
    normalize(course.code) === normalize(courseData.code) &&
    normalize(course.name) === normalize(courseData.name)
  );
  if (existingLocal) return { ...existingLocal, existing: true };
  const newCourse = {
    id: `course_${courseKey || Date.now()}`,
    topics: [],
    color: "#6347F5",
    ...courseData,
    createdAt: new Date().toISOString(),
  };

  const updated = [newCourse, ...localCourses.filter((c) => c.id !== newCourse.id)];
  setLocalData(`courses_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newCourse;
  }

  try {
    const courseRef = doc(db, "users", userId, "courses", newCourse.id);
    const existing = await withTimeout(getDoc(courseRef), 4000, null);
    if (existing?.exists()) return { id: existing.id, ...existing.data(), existing: true };
    await withTimeout(setDoc(courseRef, { ...newCourse, createdAt: serverTimestamp() }), 4000);
    return newCourse;
  } catch (error) {
    console.error("[Firestore] Error adding course:", error);
    return newCourse;
  }
};

// ─── TOPIC MASTERY ───────────────────────────────────────────────────────────

export const getTopicMastery = async (userId, courseId) => {
  const localTopics = getLocalData(`topic_mastery_${userId}`, []);

  if (!isFirebaseConfigured || !userId) {
    const filtered = courseId
      ? localTopics.filter((t) => !t.courseId || t.courseId === courseId)
      : localTopics;
    return filtered;
  }

  try {
    const topicsRef = collection(db, "users", userId, "topicMastery");
    const snapshot = await withTimeout(getDocs(topicsRef), 4000, null);

    if (!snapshot || snapshot.empty) {
      return localTopics;
    }

    const topics = [];
    snapshot.forEach((docSnap) => {
      topics.push({ id: docSnap.id, ...docSnap.data() });
    });

    setLocalData(`topic_mastery_${userId}`, topics);
    return courseId ? topics.filter((t) => !t.courseId || t.courseId === courseId) : topics;
  } catch (error) {
    console.warn("[Firestore] getTopicMastery falling back to local:", error);
    return localTopics;
  }
};

export const addTopicMastery = async (userId, topicData) => {
  const localTopics = getLocalData(`topic_mastery_${userId}`, []);
  const newTopic = {
    id: topicData.id || "t_" + Date.now(),
    mastery: 50,
    status: "moderate",
    trend: "stable",
    ...topicData,
  };
  setLocalData(`topic_mastery_${userId}`, [...localTopics, newTopic]);

  if (!isFirebaseConfigured || !userId) return newTopic;

  try {
    const topicsRef = collection(db, "users", userId, "topicMastery");
    await addDoc(topicsRef, { ...newTopic, updatedAt: serverTimestamp() });
  } catch (err) {
    console.error("[Firestore] Error adding topic mastery:", err);
  }
  return newTopic;
};

export const updateTopicMastery = async (userId, topicName, newScore) => {
  const localTopics = getLocalData(`topic_mastery_${userId}`, []);
  const updatedTopics = localTopics.map((t) => {
    if (t.name.toLowerCase() === topicName.toLowerCase()) {
      const status = newScore >= 80 ? "strong" : newScore >= 60 ? "moderate" : "weak";
      const trend = newScore > t.mastery ? "up" : newScore < t.mastery ? "down" : "stable";
      return {
        ...t,
        mastery: newScore,
        status,
        trend,
        needsRevision: newScore < 60,
      };
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
        const trend = newScore > (data.mastery || 0) ? "up" : newScore < (data.mastery || 0) ? "down" : "stable";
        await updateDoc(docSnap.ref, {
          mastery: newScore,
          status,
          trend,
          needsRevision: newScore < 60,
          lastTestedDate: getLocalDateString(),
        });
      }
    });
  } catch (err) {
    console.error("[Firestore] Error updating topic mastery:", err);
  }
  return updatedTopics;
};

// ─── STUDY PLAN & ADAPTIVE SCHEDULING ────────────────────────────────────────

export const getStudyPlan = async (userId) => {
  const localPlan = getLocalData(`study_plan_${userId}`, null);

  if (!userId) {
    return localPlan || [];
  }

  if (!isFirebaseConfigured) {
    return localPlan || [];
  }

  try {
    const planDocRef = doc(db, "users", userId, "studyPlan", "active");
    const planSnap = await withTimeout(getDoc(planDocRef), 4000, null);

    if (planSnap && planSnap.exists()) {
      const data = planSnap.data();
      const planDays = data.days || localPlan || [];
      setLocalData(`study_plan_${userId}`, planDays);
      return planDays;
    } else {
      if (localPlan) {
        await withTimeout(
          setDoc(planDocRef, { days: localPlan, updatedAt: serverTimestamp() }),
          4000
        );
        return localPlan;
      }
      return [];
    }
  } catch (error) {
    console.warn("[Firestore] getStudyPlan falling back to local:", error);
    return localPlan || [];
  }
};

export const updateTaskStatus = async (userId, dayIndex, taskId, newStatus) => {
  const currentPlan = getLocalData(`study_plan_${userId}`, []);
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
    await withTimeout(
      setDoc(planDocRef, { days: planDays, updatedAt: serverTimestamp() }, { merge: true }),
      4000
    );
  } catch (error) {
    console.error("[Firestore] Error saving study plan:", error);
  }

  return planDays;
};

/**
 * Adaptive AI Scheduler:
 * Injects a targeted revision task when a student scores < 60% on a topic.
 */
export const adaptStudyPlanForWeakTopic = async (userId, topicName, score) => {
  try {
    const currentPlan = await getStudyPlan(userId);
    if (!currentPlan || !Array.isArray(currentPlan) || currentPlan.length === 0) return null;

    const updatedPlan = [...currentPlan];

    // Find the current active day (status === 'today' or day 1)
    const targetDayIndex = updatedPlan.findIndex((d) => d.status === "today");
    const dayIdx = targetDayIndex !== -1 ? targetDayIndex : 0;

    const day = { ...updatedPlan[dayIdx] };
    const tasks = [...(day.tasks || [])];

    // Check if revision task for this topic already exists
    const hasExistingTask = tasks.some(
      (t) => t.topic && t.topic.toLowerCase().includes(topicName.toLowerCase()) && t.isAutoAdapted
    );

    if (!hasExistingTask) {
      const newTask = {
        id: `adapt_${Date.now()}`,
        topic: `Targeted Revision: ${topicName}`,
        duration: "25 min",
        priority: "critical",
        status: "pending",
        type: "Targeted Revision",
        difficulty: "hard",
        isAutoAdapted: true,
        reason: `Triggered by ${score}% on recent quiz`,
      };

      // Add to front of today's tasks
      day.tasks = [newTask, ...tasks];
      day.aiUpdated = true;
      day.aiReason = `Plan adapted: Targeted revision added for ${topicName} due to ${score}% quiz score.`;

      updatedPlan[dayIdx] = day;
      await saveStudyPlan(userId, updatedPlan);
      return updatedPlan;
    }
  } catch (err) {
    console.error("[Firestore] Error adapting study plan:", err);
  }
  return null;
};

// ─── QUIZZES & PRACTICE ──────────────────────────────────────────────────────

export const getQuizHistory = async (userId) => {
  const localHistory = getLocalData(`quiz_history_${userId}`, []);

  if (!isFirebaseConfigured || !userId) {
    return localHistory;
  }

  try {
    const quizzesRef = collection(db, "users", userId, "quizzes");
    const q = query(quizzesRef, orderBy("completedAt", "desc"));
    const snapshot = await withTimeout(getDocs(q), 4000, null);

    if (!snapshot || snapshot.empty) {
      return localHistory;
    }

    const list = [];
    snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
    setLocalData(`quiz_history_${userId}`, list);
    return list;
  } catch (error) {
    console.warn("[Firestore] getQuizHistory falling back to local:", error);
    return localHistory;
  }
};

export const saveQuizResult = async (userId, quizResult) => {
  const localHistory = getLocalData(`quiz_history_${userId}`, []);
  const record = {
    id: "q_" + Date.now(),
    date: getLocalDateString(),
    completedAt: new Date().toISOString(),
    percentage: quizResult.score,
    ...quizResult,
  };

  const updated = [record, ...localHistory];
  setLocalData(`quiz_history_${userId}`, updated);

  // 1. Update topic mastery score
  if (quizResult.topic && quizResult.score !== undefined) {
    await updateTopicMastery(userId, quizResult.topic, quizResult.score);

    // 2. If weak performance (<60%), trigger the Adaptive Scheduler!
    if (quizResult.score < 60) {
      await adaptStudyPlanForWeakTopic(userId, quizResult.topic, quizResult.score);
    }
  }

  if (!isFirebaseConfigured || !userId) {
    return record;
  }

  try {
    const quizzesRef = collection(db, "users", userId, "quizzes");
    const docRef = await withTimeout(
      addDoc(quizzesRef, {
        ...record,
        createdAt: serverTimestamp(),
      }),
      4000
    );
    return { ...record, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error saving quiz result:", error);
    return record;
  }
};

// ─── STUDY MATERIALS (METADATA IN FIRESTORE) ─────────────────────────────────

export const getMaterials = async (userId) => {
  const localMaterials = getLocalData(`materials_${userId}`, []);

  if (!isFirebaseConfigured || !userId) {
    return localMaterials;
  }

  try {
    const matRef = collection(db, "users", userId, "materials");
    const snapshot = await withTimeout(getDocs(matRef), 4000, null);

    if (!snapshot || snapshot.empty) {
      return localMaterials;
    }

    const items = [];
    snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
    setLocalData(`materials_${userId}`, items);
    return items;
  } catch (error) {
    console.warn("[Firestore] getMaterials falling back to local:", error);
    return localMaterials;
  }
};

export const addMaterial = async (userId, materialData) => {
  const localMaterials = getLocalData(`materials_${userId}`, []);
  const newMaterial = {
    id: "m_" + Date.now(),
    date: getLocalDateString(),
    status: "analyzed",
    uploadedAt: new Date().toISOString(),
    ...materialData,
  };

  const updated = [newMaterial, ...localMaterials];
  setLocalData(`materials_${userId}`, updated);

  if (!isFirebaseConfigured || !userId) {
    return newMaterial;
  }

  try {
    const matRef = collection(db, "users", userId, "materials");
    const docRef = await withTimeout(
      addDoc(matRef, {
        ...newMaterial,
        createdAt: serverTimestamp(),
      }),
      4000
    );
    return { ...newMaterial, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error adding material:", error);
    return newMaterial;
  }
};

// ─── AI COACH CHAT ───────────────────────────────────────────────────────────

export const getChatMessages = async (userId) => {
  const localMessages = getLocalData(`chat_messages_${userId}`, []);

  if (!isFirebaseConfigured || !userId) {
    return localMessages;
  }

  try {
    const messagesRef = collection(db, "users", userId, "chatMessages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await withTimeout(getDocs(q), 4000, null);

    if (!snapshot || snapshot.empty) {
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
  const localMessages = getLocalData(`chat_messages_${userId}`, []);
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
    const docRef = await withTimeout(
      addDoc(messagesRef, {
        ...newMsg,
        createdAt: serverTimestamp(),
      }),
      4000
    );
    return { ...newMsg, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error saving chat message:", error);
    return newMsg;
  }
};

// ─── PROGRESS & ANALYTICS ────────────────────────────────────────────────────

export const getProgressStats = async (userId) => {
  const localStats = getLocalData(`stats_${userId}`, {});

  if (!isFirebaseConfigured || !userId) {
    return localStats;
  }

  try {
    const statsRef = doc(db, "users", userId, "stats", "current");
    const snap = await withTimeout(getDoc(statsRef), 4000, null);
    if (snap && snap.exists()) {
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
  const localPapers = getLocalData(`past_papers_${userId}`, []);

  if (!isFirebaseConfigured || !userId) {
    return localPapers;
  }

  try {
    const papersRef = collection(db, "users", userId, "pastPapers");
    const snapshot = await withTimeout(getDocs(papersRef), 4000, null);

    if (!snapshot || snapshot.empty) {
      return localPapers;
    }

    const papers = [];
    snapshot.forEach((d) => papers.push({ id: d.id, ...d.data() }));
    setLocalData(`past_papers_${userId}`, papers);
    return papers;
  } catch (error) {
    console.warn("[Firestore] getPastPapers falling back to local:", error);
    return localPapers;
  }
};

export const addPastPaper = async (userId, paperData) => {
  const localPapers = getLocalData(`past_papers_${userId}`, []);
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
    const docRef = await withTimeout(
      addDoc(papersRef, {
        ...newPaper,
        createdAt: serverTimestamp(),
      }),
      4000
    );
    return { ...newPaper, id: docRef.id };
  } catch (error) {
    console.error("[Firestore] Error adding past paper:", error);
    return newPaper;
  }
};
