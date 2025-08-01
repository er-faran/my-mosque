const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const apiClient = {
  get: async (endpoint, headers = {}) =>
    request("GET", endpoint, null, headers),

  post: async (endpoint, body, headers = {}) =>
    request("POST", endpoint, body, headers),

  put: async (endpoint, body, headers = {}) =>
    request("PUT", endpoint, body, headers),

  del: async (endpoint, headers = {}) =>
    request("DELETE", endpoint, null, headers),
};

async function request(method, endpoint, body, headers = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) throw new Error(data.message || "API Error");

  return data;
}
