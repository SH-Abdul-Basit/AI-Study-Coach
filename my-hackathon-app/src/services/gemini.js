const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_MODEL = "gemini-3.6-flash";

const COACH_INSTRUCTIONS = `You are Study Coach, a warm and practical AI coach for university students.
Give accurate, concise explanations and concrete next steps. Use the student's course context when it is supplied. If the question lacks enough detail, ask one helpful follow-up question. Do not invent information about the student's performance, materials, or deadlines. Only answer questions related to studying, courses, assignments, exams, learning strategies, or the student's supplied materials. For unrelated requests, politely explain that you can only help with study-related topics and do not answer the unrelated question.`;

const toConversationTranscript = (messages) => {
  const history = messages
    .filter((message) => message.text?.trim())
    .map((message) => `${message.role === "assistant" || message.role === "bot" ? "Coach" : "Student"}: ${message.text.trim()}`);
  const firstStudentMessage = history.findIndex((message) => message.startsWith("Student:"));
  return (firstStudentMessage === -1 ? history : history.slice(firstStudentMessage)).join("\n\n");
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

const loadDocumentInputs = async (materials = []) => {
  const documents = [];
  for (const material of materials.slice(0, 3)) {
    if (!material?.url || material.url.startsWith("blob:") === false && !material.url.startsWith("http")) continue;
    try {
      const response = await fetch(material.url);
      if (!response.ok) continue;
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > 8 * 1024 * 1024) continue;
      let binary = "";
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      const mimeType = material.mimeType || (material.type === "PDF Document" ? "application/pdf" : "application/octet-stream");
      documents.push({ type: "document", data: btoa(binary), mime_type: mimeType });
    } catch {
      // Metadata remains available in the text context when a file URL is unavailable.
    }
  }
  return documents;
};

export async function askStudyCoach(messages, studentContext = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI coach is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the app.");
  }

  const context = compactStudentContext(studentContext);
  const documents = await loadDocumentInputs(studentContext.materials);

  const prompt = `${COACH_INSTRUCTIONS}\n\nStudent data from the app (treat it as the source of truth):\n${context}\n\nConversation:\n${toConversationTranscript(messages)}`;
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      store: false,
      input: [{ type: "user_input", content: prompt }, ...documents],
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || "The AI coach could not respond. Please try again.");
  }

  const text = payload.output_text || payload.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
  if (!text) throw new Error("The AI coach returned an empty response. Please try again.");
  return text;
}

export async function generatePracticeQuiz(studentContext = {}, topic = "", courseId = "") {
  const selectedCourse = studentContext.courses?.find((course) => course.id === courseId);
  const scopedContext = courseId ? {
    ...studentContext,
    courses: selectedCourse ? [selectedCourse] : studentContext.courses,
    materials: (studentContext.materials || []).filter((material) => material.courseId === courseId || (!material.courseId && [selectedCourse?.name, selectedCourse?.code].filter(Boolean).includes(material.course))),
    topicMastery: (studentContext.topicMastery || []).filter((entry) => entry.courseId === courseId),
    quizHistory: (studentContext.quizHistory || []).filter((quiz) => quiz.courseId === courseId),
  } : studentContext;
  const prompt = `Create a 5-question multiple-choice practice quiz for a university student.
Topic: ${topic || "the student's weakest available topic"}
Use only the supplied student data and study-material metadata/content. Adapt difficulty to the student's previous performance. Return JSON only in this exact shape: {"topic":"string","questions":[{"question":"string","options":["string","string","string","string"],"correctAnswer":0,"explanation":"string","source":"string"}]}. correctAnswer must be a zero-based option index. Do not include markdown.

${compactStudentContext(scopedContext)}`;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI coach is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the app.");
  const documents = await loadDocumentInputs(scopedContext.materials);
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ model: GEMINI_MODEL, store: false, input: [{ type: "user_input", content: prompt }, ...documents] }),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error?.message || "The AI could not generate a quiz.");
  const output = payload.output_text || payload.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content || [])
    .map((content) => content.text || "")
    .join("");
  try {
    const json = output.match(/\{[\s\S]*\}/)?.[0];
    const quiz = JSON.parse(json || output);
    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) throw new Error("Quiz was empty.");
    return quiz;
  } catch {
    throw new Error("The AI returned an invalid quiz. Please try again.");
  }
}
