export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : "Request failed";
    throw new Error(message);
  }

  return data;
}

// alias used by admin files
export const apiFetch = apiRequest;

// helper used by admin document/image preview cards
export function fileUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const base = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}