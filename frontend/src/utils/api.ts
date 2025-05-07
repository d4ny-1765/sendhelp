export async function apiFetch(path: string, options?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  
  const response = await fetch(url, {
    
    ...options,
    credentials: 'include', // if your backend uses cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    
  });

  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
}
