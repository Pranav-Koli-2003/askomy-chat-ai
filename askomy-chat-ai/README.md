# ✦ AskOmy AI

A modern, responsive AI chat web app built with **React + Vite**. Users can create an account, log in, create chat topics, talk to an AI assistant, and customize the AI's behavior (temperature and system instruction). The frontend talks to a **Django REST** backend that uses the Gemini API.

> Purple-to-blue gradient design (`#8b5cf6 → #5267ed`), works on desktop, tablet and mobile.

---

## ✨ Features

- 🔐 **Authentication** - create account, login, JWT token stored in the browser, auto-login and protected routes
- 💬 **AI chat** - ChatGPT / Gemini style interface with streaming (word-by-word) answers
- 🗂️ **Chat history** - create, open and delete chat titles; history loads when you select a chat
- ⚙️ **AI settings** - change the temperature (0 to 2) and the system instruction
- 🔔 **Toast notifications** - success and error messages with `react-toastify`
- 📱 **Fully responsive** - sidebar becomes a top bar with swipeable chat chips on phones, popups become a bottom sheet
- 🛡️ **Safe error handling** - long-prompt detection, expired-session redirect, backend-offline message

---

## 🧰 Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite |
| Routing | react-router-dom |
| Notifications | react-toastify |
| Styling | Plain CSS (responsive, no UI library) |
| Backend | Django REST API (separate project) |
| Auth | JWT (access + refresh tokens) |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── api_link.js          # all backend API calls
│   └── token.js             # save / read / delete JWT tokens
├── components/
│   ├── Ai_chat.jsx / .css   # chat messages + input box
│   ├── Chat_title.jsx / .css# sidebar chat list
│   ├── New_chat_title.jsx   # create-chat form
│   ├── System.jsx           # AI settings (temperature, instruction)
│   ├── Auto_login.jsx       # redirects based on login status
│   ├── RequireAuth.jsx      # protects private pages
│   ├── Login_token.jsx      # login helper
│   └── Form.css
├── pages/
│   ├── Login.jsx / .css     # login + create account
│   └── Askomy_Ai.jsx        # main chat page
├── App.jsx                  # routes
├── App.css                  # layout + responsive styles
└── main.jsx
```

---

## 🚀 Getting Started

### 1. Requirements

- Node.js 18 or newer
- The AskOmy **Django backend** running locally



### 2. Start the backend

Run your Django server so it is available at:

```
http://127.0.0.1:8000
```

The frontend calls `http://127.0.0.1:8000/api` (set in `src/api/api_link.js`).

### 3. Run the frontend

```bash
npm run dev
```

Open the link shown in the terminal (usually `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 🔌 API Endpoints Used

All requests go to `BASE_URL = http://127.0.0.1:8000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/Create_account/` | Create a new account |
| POST | `/login/` | Login and receive JWT tokens |
| GET | `/verify_user/` | Check that the token is valid |
| GET | `/system_instruction/` | Get AI settings |
| PUT | `/system_instruction/` | Update AI settings |
| GET | `/new_chat/` | List chat titles |
| POST | `/new_chat/` | Create a chat title |
| DELETE | `/new_chat/` | Delete a chat title |
| POST | `/AskOmy_chat_history/` | Get messages of one chat |
| POST | `/AskOmy_Ai/` | Send a prompt, get the AI answer |

Protected requests send the header `Authorization: Bearer <access token>`.

---

## 📱 Responsive Design

| Screen | Layout |
|---|---|
| Desktop (1025px and up) | Sidebar on the left, chat on the right |
| Tablet (769 to 1024px) | Narrower sidebar |
| Mobile (768px and under) | Top bar with New chat and Settings, chats as swipeable chips, popups as bottom sheet |
| Small phone (480px and under) | Icon-only buttons, compact bubbles |

---

## 🔒 Security Notes

- Never commit a `.env` file or any secret key. It is listed in `.gitignore`.
- JWT tokens are stored in `localStorage`. This is simple, but for a production app consider httpOnly cookies.
- On a `401` or `403` response the app deletes the token and redirects to `/Login`.

---

## 🛣️ Roadmap

- [ ] Slide-out sidebar menu on mobile
- [ ] Markdown and code-block rendering in AI answers
- [ ] Rename chat titles
- [ ] Dark mode
- [ ] Move the API URL to an environment variable (`VITE_API_URL`)

---




