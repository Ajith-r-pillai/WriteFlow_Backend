```markdown
# 📝 Collaborative Notes App — Backend

This is the **Node.js + Express + MongoDB** backend for the Collaborative Notes App. It provides REST APIs for auth, note management, and supports real-time collaboration using **Socket.IO**.

---

## 🚀 Tech Stack

- 🛠 Node.js + Express
- 🗃 MongoDB + Mongoose
- 🔐 JWT Authentication
- 🔄 Socket.IO for real-time collaboration
- 🧂 Bcrypt for password hashing
- ✉️ CORS for frontend communication

---

## 📦 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/collab-notes-app.git
cd collab-notes-app/backend
npm install
2. Configure environment


Create a .env file:

.env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes
JWT_SECRET=your-secret-key

3. Run development server

npm start
