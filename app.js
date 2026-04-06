const N8N_WEBHOOK_URL =
  "https://yeshitamotwani.app.n8n.cloud/webhook/meeting-tasks";
const SUPABASE_URL = "https://zedglulzwijzhmtvibqh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGdsdWx6d2lqemhtdHZpYnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTY3MzQsImV4cCI6MjA5MDg3MjczNH0.nFniU6J6tlxteW4A3sTVQLIJrjNtK534qoYWgMpJ3iQ";


// import { CONFIG } from "./config.js";

// const N8N_WEBHOOK_URL = CONFIG.N8N_WEBHOOK_URL;
// const SUPABASE_URL = CONFIG.SUPABASE_URL;
// const SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;

async function generateTasks() {
  const title = document.getElementById("title").value.trim();
  const participants = document.getElementById("participants").value.trim();
  const transcript = document.getElementById("transcript").value.trim();
  const btn = document.getElementById("generateBtn");
  const statusEl = document.getElementById("status");
  // Basic validation
  if (!title || !transcript) {
    showStatus("Please fill in Meeting Title and Transcript.", "error");

    return;
  }
  // First, create the meeting in Supabase and get its ID
  btn.disabled = true;
  showStatus("\n Saving meeting...", "loading");
  try {
    // Step 1: Insert meeting into Supabase
    const meetingRes = await fetch(`${SUPABASE_URL}/rest/v1/meetings`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ title, participants, transcript }),
    });
    if (!meetingRes.ok) throw new Error("Failed to save meeting");
    const [meeting] = await meetingRes.json();
    const meeting_id = meeting.id;
    // Step 2: Send to N8N webhook for AI processing
    showStatus("\n AI is generating tasks...", "loading");
    // const n8nRes = await fetch(N8N_WEBHOOK_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ title, transcript, participants, meeting_id }),
    // });

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      //   mode: "no-cors", // ⭐ IMPORTANT FIX
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, transcript, participants, meeting_id }),
    });
    if (!n8nRes.ok) throw new Error("N8N workflow failed");

    //New lines added

    // const text = await n8nRes.text();

    // if (!text) throw new Error("Empty response from server");
    // // const data = await n8nRes.json();
    // const data = JSON.parse(text);
    // console.log("N8N Response:", data);

    // // ✅ Proper JSON parsing
    // const data = await n8nRes.json();

    // console.log("N8N Response:", data);

    // // ✅ Safety check
    // if (!data || !data.tasks || data.tasks.length === 0) {
    //   throw new Error("No tasks returned from server");
    // }

    // 🔥 Read text FIRST (safe)
    const text = await n8nRes.text();

    if (!text) {
      throw new Error("Empty response from server");
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Raw response:", text);
      throw new Error("Invalid JSON from server");
    }

    console.log("N8N Response:", data);

    if (!data.tasks || data.tasks.length === 0) {
      throw new Error("No tasks returned");
    }
    // Step 3: Wait a moment then fetch tasks from Supabase
    showStatus("\n Tasks generated! Loading...", "loading");
    await new Promise((r) => setTimeout(r, 3000)); // wait 2s for N8N to finish
    await loadTasks(meeting_id);
    showStatus("\n All tasks created successfully!", "success");
  } catch (err) {
    showStatus(`\n Error: ${err.message}`, "error");
    console.error(err);
  } finally {
    btn.disabled = false;
  }
}
async function loadTasks(meeting_id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tasks?meeting_id=eq.${meeting_id}&select=*`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  const tasks = await res.json();
  const listEl = document.getElementById("tasksList");
  const sectionEl = document.getElementById("tasksSection");
  listEl.innerHTML = "";
  tasks.forEach((t) => {
    const div = document.createElement("div");
    div.className = "task-item";
    //     div.innerHTML = `
    // <span class='task-text'>${t.task}</span>
    // <span class='task-badge'>${t.priority}</span>
    // <span class='task-badge'>${t.status}</span>
    // `;

    div.innerHTML = `
  <span class='task-text'>${t.task}</span>
  <span class='task-badge'>${t.priority}</span>

  <select onchange="updateStatus('${t.id}', this.value)">
    <option ${t.status === "Pending" ? "selected" : ""}>Pending</option>
    <option ${t.status === "In Progress" ? "selected" : ""}>In Progress</option>
    <option ${t.status === "Done" ? "selected" : ""}>Done</option>
  </select>
`;
    listEl.appendChild(div);
  });
  sectionEl.style.display = tasks.length > 0 ? "block" : "none";
}
function showStatus(msg, type) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.className = `status ${type}`;
}



async function updateStatus(taskId, newStatus) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${taskId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    showStatus("Status updated!", "success");
  } catch (err) {
    console.error(err);
    showStatus("Failed to update status", "error");
  }
}