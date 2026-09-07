const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const COACH_INSTRUCTIONS = `You are Study Coach, a warm and practical AI coach for university students.
Give accurate, concise explanations and concrete next steps. Use the student's course context when it is supplied. If the question lacks enough detail, ask one helpful follow-up question. Do not invent information about the student's performance, materials, or deadlines.`;

const toGeminiHistory = (messages) => {
  const history = messages
    .filter((message) => message.text?.trim())
    .map((message) => ({
      role: message.role === "assistant" || message.role === "bot" ? "model" : "user",
      parts: [{ text: message.text.trim() }],
    }));
  const firstUserMessage = history.findIndex((message) => message.role === "user");
  return firstUserMessage === -1 ? history : history.slice(firstUserMessage);
};

const compactStudentContext = (studentContext) => {
  const context = {
    profile: studentContext.profile,
    courses: studentContext.courses,
    studyPlan: studentContext.studyPlan,
    topicMastery: studentContext.topicMastery,
    quizHistory: studentContext.quizHistory,
    materials: studentContext.materials,
    pastPapers: studentContext.pastPapers,
  };

  return JSON.stringify(context, (_key, value) => {
    if (value?.toDate) return value.toDate().toISOString();
    return value;
  }, 2);
};

export async function askStudyCoach(messages, studentContext = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI coach is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the app.");
  }

  const context = compactStudentContext(studentContext);

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: `${COACH_INSTRUCTIONS}\n\nStudent data from the app (treat it as the source of truth):\n${context}` }],
      },
      contents: toGeminiHistory(messages),
      generationConfig: { temperature: 0.5, maxOutputTokens: 700 },
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || "The AI coach could not respond. Please try again.");
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
  if (!text) throw new Error("The AI coach returned an empty response. Please try again.");
  return text;
}
