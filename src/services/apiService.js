import { getToken, login } from "./authService";

const API_URL = "https://netsievexapi-h6eagwbhczcqaqcy.canadacentral-01.azurewebsites.net";

export async function apiFetch(endpoint, options = {}) {
  let token = getToken();
  if (!token) {
    await login("juan@test.com", "123456");
    token = getToken();
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return await response.json();
}