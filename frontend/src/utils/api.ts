export async function apiFetch(path: string, options?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const response = await fetch(url, options);

  const contentType = response.headers.get("Content-Type") || "";

  if (!response.ok) {
    let errorData = null;
    if (contentType.includes("application/json")) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
    throw new Error(
      `API Error ${response.status}: ${response.statusText} - ${JSON.stringify(errorData)}`
    );
  }

  if (contentType.includes("application/json")) {
    return response.json();
  } else if (contentType.includes("text/")) {
    return response.text();
  }

  return null;
}
