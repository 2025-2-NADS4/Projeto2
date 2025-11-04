const BASE_URL = "http://localhost:3000/api/auth";

export async function registerUser({ name, email, password, role = "client" }) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!response.ok) throw new Error("Erro ao cadastrar usuário.");
    return await response.json();
  } catch (error) {
    console.error("❌ registerUser error:", error);
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("E-mail ou senha incorretos.");
    return await response.json();
  } catch (error) {
    console.error("❌ loginUser error:", error);
    throw error;
  }
}
