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


## ✨ Features

* 💬 Interactive chat interface (User & Bot messages)
* 🌙 Dark / Light mode toggle
* 🔄 Smooth auto-scrolling
* ⌨️ Typing indicator
* 🧹 Clear chat functionality
* 📱 Fully responsive design
* 🎨 Modern UI (gradient + glassmorphism style)

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router)
* React.js
* Tailwind CSS

**Backend**

* Next.js API Routes

**Tools & Deployment**

* Vercel
* GitHub

---



## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## 🌐 Deployment

This project is deployed using **Vercel**.

To deploy:

1. Push code to GitHub
2. Import project in Vercel
3. Click deploy

---

## ⚠️ Notes

* Currently uses **mock responses** due to API quota limitations
* Can be extended with real AI APIs (OpenAI, etc.)

---

## 📚 Learnings

* Advanced React & Next.js concepts
* Tailwind CSS for modern UI design
* State management and component structuring
* Handling UI/UX improvements
* Debugging and problem-solving in real projects

---

## 🔮 Future Improvements

* 🤖 Real AI integration (OpenAI API)
* 💾 Chat history persistence
* 🔐 User authentication
* 📊 Analytics & usage tracking

---

## 🙌 Acknowledgment

Thanks to **Metawurks AI** for providing the opportunity to work on this project and enhance my full-stack development skills.

---

---

⭐ If you like this project, consider giving it a star!
