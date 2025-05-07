export async function apiFetch(path: string, options?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_URL;

  const cleanedPath = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const response = await fetch(cleanedPath, options);

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}
