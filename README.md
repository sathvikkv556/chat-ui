# 🤖 Metawurks AI Chatbot

A modern, responsive chatbot interface built as part of my internship at **Metawurks AI**.
This project focuses on delivering a clean UI/UX experience with real-time interaction features and modern frontend practices.

---

## 🚀 Live Demo

🔗https://chat-ui-three-sigma.vercel.app

---

## 👨‍💻 About the Project

The **Metawurks AI Chatbot** is a web-based chat interface that simulates real-time conversation between a user and an AI assistant.
It is designed with a focus on usability, responsiveness, and modern UI design.

---
## Data Flow (End-to-End)

User types message
      ↓
Frontend sends → /api/chat-ai
      ↓
Backend:
   → check search need
   → fetch web data (optional)
   → call Groq AI
      ↓
Response returned:
   → reply
   → sources
      ↓
Frontend displays:
   → message bubble
   → clickable links
      ↓
(Optional) Save to MongoDB


### 🔐 Authentication

* Google OAuth login
* GitHub OAuth login
* Session-based authentication using NextAuth
* Secure cookies (production-ready)

### 💬 Chat System

* Multiple chat threads per user
* Persistent chat history (MongoDB)
* User-specific conversations
* Auto chat title generation

### ⚡ AI Integration

* Streaming responses (real-time typing effect)
* Integrated with Groq (LLaMA 3.1)
* Regenerate responses
* Copy message feature

### 🌐 Web Search

* Conditional web search (Serper API)
* Sources displayed with responses
* Toggle web search per message

### 🎨 UI/UX

* Modern glassmorphism UI
* Dark / Light mode support
* Responsive (mobile + desktop)
* Sidebar with chat management
* Rename & delete chats

### 📦 Backend

* REST APIs using Next.js App Router
* MongoDB Atlas database
* Structured models (User, Chat, Message)
* Clean separation of concerns

---

## 🏗️ Tech Stack

* **Frontend:** Next.js, React, TailwindCSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB Atlas
* **Authentication:** NextAuth (Google + GitHub)
* **AI:** Groq API (LLaMA 3.1)
* **Web Search:** Serper API
* **Deployment:** Vercel

---

## ⚙️ Environment Variables

```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

MONGODB_URI=your_mongodb_connection

GROQ_API_KEY=your_groq_key
SERPER_API_KEY=your_serper_key
```

---

## 🚀 Setup Instructions

```bash
git clone https://github.com/your-repo/chat-ui.git
cd chat-ui
npm install
npm run dev
```

---

## 📁 Project Structure

```
app/
  api/
    auth/
    chat/
    chat-ai/
components/
lib/
models/
types/
```

---

## 🔥 Key Highlights

* Production-ready authentication flow
* Streaming AI responses (ChatGPT-like)
* User-specific data handling
* Clean scalable architecture
* Fully deployed on Vercel

---

## 📌 Future Improvements

* Markdown & code block rendering
* Rate limiting & API protection
* Chat export/download
* Advanced prompt memory

---





