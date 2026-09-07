/**
 * Client-Side Storage Service (Spark/Free Plan friendly)
 * Decoupled from Firebase Storage to eliminate Blaze plan dependency and infinite retry hangs.
 * Stores document metadata and local object URLs directly into Firestore.
 */

export const uploadFile = async (userId, file, folder = "materials") => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Calculate clean human-readable size
  const sizeInBytes = file.size || 0;
  const sizeDisplay =
    sizeInBytes >= 1024 * 1024
      ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;

  // Determine material/document category from extension and name
  const fileName = file.name || "Untitled_Document";
  const ext = fileName.split(".").pop().toLowerCase();
  let type = "Notes";
  const lowerName = fileName.toLowerCase();

  if (["ppt", "pptx"].includes(ext)) {
    type = "Lecture Slides";
  } else if (lowerName.includes("syllabus") || lowerName.includes("outline")) {
    type = "Syllabus";
  } else if (lowerName.includes("assign") || lowerName.includes("homework")) {
    type = "Assignment";
  } else if (lowerName.includes("paper") || lowerName.includes("exam") || lowerName.includes("quiz")) {
    type = "Past Paper";
  } else if (["doc", "docx"].includes(ext)) {
    type = "Document";
  } else if (ext === "pdf") {
    type = "PDF Document";
  }

  let objectUrl = "";
  try {
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      objectUrl = URL.createObjectURL(file);
    }
  } catch (err) {
    console.warn("[Storage] Could not create object URL:", err);
  }

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  return {
    name: fileName,
    fileName: cleanFileName,
    size: sizeDisplay,
    type,
    mimeType: file.type || "application/octet-stream",
    url: objectUrl,
    path: `users/${userId || "student"}/${folder}/${cleanFileName}`,
    lastModified: file.lastModified || Date.now(),
    uploadedAt: new Date().toISOString(),
  };
};
