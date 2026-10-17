import { getToken, deleteToken } from "./token";

const BASE_URL = "http://127.0.0.1:8000/api";

// Read JSON safely. Django/Gemini errors sometimes return HTML instead of JSON.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error("Cannot connect to Django. Check that the backend server is running.");
  }

  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();
  let data;

  if (contentType.includes("application/json")) {
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error("The server returned invalid JSON. Please try again.");
    }
  } else {
    const promptLimitError = /too many tokens|token limit|maximum.*token|prompt.*too long|input.*too long|request entity too large|context length/i.test(raw);
    if (path === "/AskOmy_Ai/" && (response.status === 413 || response.status === 400 || promptLimitError)) {
      throw new Error("This prompt is too long. AI is not responding. Please shorten your prompt and try again.");
    }
    if (response.status === 401 || response.status === 403) {
      deleteToken();
      window.location.assign("/Login");
      throw new Error("Your session expired. Please log in again.");
    }
    throw new Error(`The server returned an unexpected response (HTTP ${response.status}). Check the Django terminal.`);
  }

  if (response.status === 401 || response.status === 403) {
    deleteToken();
    window.location.assign("/Login");
    throw new Error("Your session expired. Please log in again.");
  }

  if (!response.ok) {
    const detail = data?.message || data?.detail || data?.error;
    if (path === "/AskOmy_Ai/" && (response.status === 413 || response.status === 400 || /too many tokens|input.*too long|prompt.*too long|token limit|maximum.*token|context length|request entity too large/i.test(String(detail || "")))) {
      throw new Error("This prompt is too long. AI is not responding. Please shorten your prompt and try again.");
    }
    throw new Error(detail || `Request failed (HTTP ${response.status}).`);
  }

  return data;
}

function authHeaders(method = "GET", data) {
  const { access } = getToken();
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  };
}

export const create_account = (data) => request("/Create_account/", authHeaders("POST", data));
export const user_login = (data) => request("/login/", authHeaders("POST", data));
export const verify_user = () => request("/verify_user/", authHeaders());
export const system_instruction_Update = (data) => request("/system_instruction/", authHeaders("PUT", data));
export const system_instruction = () => request("/system_instruction/", authHeaders());
export const display_chat_title = () => request("/new_chat/", authHeaders());
export const add_new_chat_title = (data) => request("/new_chat/", authHeaders("POST", data));
export const chat_title_delete = (data) => request("/new_chat/", authHeaders("DELETE", data));
export const AskOmy_chat_history = (data) => request("/AskOmy_chat_history/", authHeaders("POST", data));
export const AskOmy_Ai_chat = (data) => request("/AskOmy_Ai/", authHeaders("POST", data));
