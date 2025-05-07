export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const url = path.startsWith("http")
    ? path
    : `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

  // Get token from localStorage
  const storedAuth = localStorage.getItem('auth');
  const token = storedAuth ? JSON.parse(storedAuth).token : null;

  // Set the Authorization header if token is available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add any custom headers from options
  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...headers, // Include the default headers with the Authorization if applicable
      ...(options.headers || {}) // Merge any custom headers from the options
    },
  };

  // Perform the fetch request
  const response = await fetch(url, finalOptions);

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
