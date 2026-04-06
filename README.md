# 🚀 AI Meeting Task Generator

An AI-powered web application that converts meeting transcripts into structured, actionable tasks automatically using **Gemini AI, N8N, and Supabase**.

---

## 📌 Overview

After every meeting, manually extracting tasks is time-consuming and error-prone.
This project automates that process by:

* Taking a **meeting transcript**
* Using **AI (Gemini 1.5 Flash)** to extract tasks
* Assigning **priority and owner**
* Storing tasks in a **database (Supabase)**
* Displaying them in a clean **web interface**

---

## 🧠 Key Features

* ✨ AI-powered task extraction
* 📊 Automatic priority classification (High / Medium / Low)
* 👥 Participant-based task assignment
* 🗂️ Task status tracking (Pending / In Progress / Done)
* ⚡ Real-time task generation workflow
* 🌐 Fully deployed frontend (Netlify-ready)

---

## 🏗️ Tech Stack

| Layer              | Technology            |
| ------------------ | --------------------- |
| Frontend           | HTML, CSS, JavaScript |
| Backend Automation | N8N                   |
| AI Model           | Gemini 1.5 Flash API  |
| Database           | Supabase (PostgreSQL) |
| Hosting            | Netlify               |

---

## 🔄 Architecture Flow

```
User Input (Frontend)
        ↓
Supabase (Store Meeting)
        ↓
N8N Webhook Trigger
        ↓
Gemini API (AI Processing)
        ↓
Code Node (Parse + Structure Data)
        ↓
Supabase (Store Tasks)
        ↓
Frontend (Fetch + Display Tasks)
```

---

## ⚙️ How It Works

1. User enters:

   * Meeting title
   * Participants
   * Transcript

2. Frontend:

   * Saves meeting to Supabase
   * Sends data to N8N webhook

3. N8N Workflow:

   * Receives data via webhook
   * Calls Gemini API
   * Extracts tasks in structured format
   * Parses tasks using JavaScript
   * Inserts tasks into Supabase

4. Frontend:

   * Fetches tasks from Supabase
   * Displays them with status controls

---

## 📁 Project Structure

```
meeting-task-generator/
│
├── index.html        # UI structure
├── style.css         # Styling
├── app.js            # Frontend logic
├── README.md         # Documentation
```

---

## 🔐 Environment Variables

Update the following in `app.js`:

```js
const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL";
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

---

## 🧪 Sample Input

```
Alice: We need to redesign the login page by next Friday.
Bob: I'll set up the staging server this week.
Alice: Can someone write unit tests?
```

---

## ✅ Sample Output

```
Redesign login page ||| High ||| Alice
Set up staging server ||| Medium ||| Bob
Write unit tests ||| Medium ||| Unassigned
```

---

## 🧩 N8N Workflow Overview

* **Webhook Node** → Receives frontend data
* **Edit Fields Node** → Extracts required fields
* **HTTP Request Node** → Calls Gemini API
* **Code Node** → Parses tasks
* **HTTP Request Node** → Inserts tasks into Supabase
* **Respond Node** → Sends response back

---

## 🚧 Challenges Faced

* Handling inconsistent AI responses
* Managing CORS between frontend and N8N
* Parsing structured text reliably
* Synchronizing async workflow execution

---

## 🚀 Future Improvements

* 📅 Deadline extraction (e.g. "by Friday")
* 🧾 AI-generated meeting summaries
* 🔐 User authentication (Supabase Auth)
* ⚡ Real-time updates (remove delay)
* 📧 Email notifications for tasks
* 📊 Dashboard analytics

---

## 🎯 Use Cases

* Team meetings
* Hackathons
* Agile standups
* Project planning sessions
* Academic group work

---

## 🏁 Deployment

* Frontend hosted on **Netlify**
* Backend automation via **N8N Cloud**
* Database managed with **Supabase**



