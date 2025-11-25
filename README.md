# My Task Manager Project

Hi! This is a Task Manager application I built using **React**, **Node.js**, and **Tailwind CSS**.
The goal of this project was to create a clean, easy-to-use app where you can organize your daily tasks, set priorities, and even get automatic reminders.

## What it does

### On the Frontend (The User Interface)
* **Stay Logged In:** You can log in securely. The app remembers you even if you refresh the page (until you close the tab).
* **Smart Search:** I added a "debounce" feature. This means you can type fast, and the search won't lag or freeze; it waits for you to finish typing before showing results.
* **Organization:** You can filter tasks to see just the "High Priority" ones or the ones you haven't finished yet.
* **Safety First:** If you try to delete a task, it asks "Are you sure?" so you don't delete things by accident.

### On the Backend (The Server)
* **Task Management:** The server handles saving, updating, and deleting your tasks.
* **Automatic Reminders:** I wrote a background function that runs every **20 minutes**. It checks if you have any unfinished tasks and "sends" a mock email reminder to the console.

---

## Tools I Used
* **React:** For building the website.
* **Tailwind CSS:** For making it look good.
* **Node.js & Express:** For the server logic.
* **Git:** For version control.

---

## How to Run It

This project has two parts: the **Client** (website) and the **Server** (backend). You need to run both for it to work.

### 1. Get the Code
Open your terminal and clone the repository:
```bash
git clone [https://github.com/SyedAbdulRauf-12/Nelo-assessment.git](https://github.com/SyedAbdulRauf-12/Nelo-assessment.git)
cd task-manager
```
### 2. Start the Backend
Open a terminal in the project folder and run these commands one by one:
```bash
cd server
npm install
npm run dev
```
note: You might see "Mock Email" logs appear here every 10 seconds.

### 3. Start the Frontend
Open a new terminal window (keep the other one running) and run these commands one by one:
```bash
cd client
npm install
npm run dev
```
Click the link it gives you (usually http://localhost:5173) to open the app in your browser.

---

## Login Info
Since this is a demo, I created a test account for you to use:

* **Email**: admin@dummy.com
* **Password**: 123456
  
---

### API Details
Here is how the frontend talks to the backend:
* GET /tasks: Grabs the list of tasks. You can also filter them (e.g., ?priority=High).
* POST /tasks: Adds a new task.
* PUT /tasks/:id: Updates a task (like checking it off or changing the name).
* DELETE /tasks/:id: Removes a task permanently.

---

### About the Automation
I set up a timer on the server that wakes up every 20 minutes.
It looks through the list of tasks.
If it finds any that aren't done yet, it prints a "Reminder Email" to the server console.
