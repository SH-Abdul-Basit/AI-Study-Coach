import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "./config";

export const uploadFile = async (userId, file, folder = "materials") => {
  const fileData = {
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    type: file.type || "Document",
    lastModified: file.lastModified,
  };

  if (!isFirebaseConfigured || !userId) {
    console.warn("[Storage] Firebase Storage not configured. Simulating file upload.");
    return {
      ...fileData,
      url: URL.createObjectURL(file),
      path: `simulated/${folder}/${file.name}`,
    };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `users/${userId}/${folder}/${Date.now()}_${cleanFileName}`;
    const fileRef = ref(storage, filePath);

    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);

    return {
      ...fileData,
      url: downloadUrl,
      path: filePath,
    };
  } catch (error) {
    console.warn("[Storage] Upload failed, falling back to local object URL:", error);
    return {
      ...fileData,
      url: URL.createObjectURL(file),
      path: `local/${folder}/${file.name}`,
    };
  }
};
