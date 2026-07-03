export const API_URL = "https://available-dichotomously-clare.ngrok-free.dev"; // replace with your LAN IP

export async function signup(
  username: string,
  email: string,
  password: string,
  phone_num?: string,
  address?: string
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ username, email, password, phone_num, address }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Signup failed");
  return data;
}

export async function login(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }), // Added username here
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data; // { access_token, token_type }
}