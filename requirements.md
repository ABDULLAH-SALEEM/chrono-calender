# AI-Driven Software Development

**Summer Semester 2025**

## Final Project: Calendar Application (Part I)

**Publication:** 2025-06-23  
**Requirements update:** 2025-07-07  
**Final submission:** 2025-07-28 23:59 CEST

**Instructors:**  
Prof. Dr. G. Fraser  
Benedikt Fein  
Philipp Straubinger

---

## 1. Introduction

For your final project, you will develop a **calendar web application**. Similar to the ToDo app project, this will be a **full-stack web application**. The frontend must be implemented using a JavaScript or TypeScript framework of your choice. The backend should be developed in a **JVM-based language** and include both an API layer and a database connection.

You may choose any database implementation as long as it can run locally (e.g., H2, SQLite, PostgreSQL, MySQL, MongoDB).

Design thinking and creating UI/UX prototypes is highly recommended, though not mandatory.

---

## 2. Application Requirements

Updated and additional requirements will be published on **2025-07-07**.

### 2.1 Functional Requirements

- **User Management**: Register, log in, log out, and change password.
- **Calendar View**: Support for monthly and daily views.
- **Add Events**: Create events with title, description, start and end date/time.
- **Edit and Delete Events**
- **Reminders**: Browser notifications (only if calendar is open).
- **Recurring Events**: Daily, weekly, monthly repeat options.
- **Event Tags**: User-defined tags (e.g., work, personal, university).
- **Data Persistence**: Events must persist in the database.

### 2.2 Non-Functional Requirements

- **Usability**: Clear, intuitive, modern UI; responsive for desktop and mobile.
- **Security**: Input validation, password hashing, secure authentication.
- **Performance**: Load within one second on stable internet connection.

---

## 3. Organisational Requirements and Grading

This is an **individual assignment**. Group work is **not allowed**.  
AI-based tools **are allowed and encouraged**.

### 3.1 Development Process

- **Track requirements as issues**, preferably using user story format.
- **Create issues for bugs, refactorings, and tasks.**
- **Do not commit directly to `main/master`.**  
  Use pull requests for all changes.
- **Link pull requests to issues.**
- Use **AI-based review tools** instead of human code reviews.
- **Test coverage** must be **≥90%** for backend and frontend.
- **Continuous Integration (CI)** pipeline should include:
  - Tests (unit, integration, system)
  - Linters
  - Formatters
  - Other tools to enforce guidelines

### 3.2 Written Project Report

You must submit a written report with the following recommended structure:

1. **System architecture and design decisions**
2. **Used LLMs and AI-based tools**
3. **Where AI tools worked well**
4. **Where AI tools did not work as intended**
5. **Missing AI tools (optional)**

No fixed format is required. Acceptable formats: Markdown, AsciiDoc, LaTeX (+ PDF).  
**Link relevant issues, pull requests, or commits where applicable.**

### 3.3 Submission

Use the GitHub Classroom repository:

👉 [GitHub Classroom Assignment Link](https://classroom.github.com/a/6hBsRUe3)

- Deadline: **2025-07-28 23:59 CEST**
- Only the **default branch** will be graded.
- You **must** include a `WHOAMI.txt` file:
