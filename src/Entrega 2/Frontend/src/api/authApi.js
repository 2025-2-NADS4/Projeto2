const API_URL = "http://localhost:3000/api/auth";

export async function registerUser({ name, email, password, role = "client" }) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) throw new Error("Erro ao cadastrar usuário");
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("E-mail ou senha incorretos");
  return res.json(); // { user, token }
}
