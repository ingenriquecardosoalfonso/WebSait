const API_URL = "https://netsievexapi-h6eagwbhczcqaqcy.canadacentral-01.azurewebsites.net";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) throw new Error("Credenciales inválidas");

  const data = await response.json();
  localStorage.setItem("token", data.token); 
  return data.token;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
} 
