export async function apiFetch(path: string, options?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';  // Provide empty string as fallback
  const url = path.startsWith("http") ? path : `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options?.headers || {}),
    },
  });

  // Check if response is ok before trying to parse JSON
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
    throw new Error(error.error || response.statusText);
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response;
}
