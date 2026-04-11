# Administrator User Manual
## For School Administrators and Staff

Welcome to the School Incident Reporting System Admin Dashboard! This guide will help you manage and respond to incident reports effectively.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [Viewing Incidents](#viewing-incidents)
4. [Filtering and Searching](#filtering-and-searching)
5. [Managing Incident Status](#managing-incident-status)
6. [Viewing Incident Details](#viewing-incident-details)
7. [Recent Activity and Summaries](#recent-activity-and-summaries)
8. [Email Notifications and Audit Trail](#email-notifications-and-audit-trail)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Access Requirements
- Administrator account (`admin` role), assigned by your school or system administrator (self-service signup only offers Student and Teacher roles)
- Email address and password used at login
- A supported web browser and network access to the application URL

### First Time Login
1. Open the application URL provided by your school.
2. Enter your **email** and **password** on the login page.
3. After a successful login, you are taken to the **Admin Dashboard** (`/dashboard`).  
   - **Note:** Users who are not administrators are redirected away from the dashboard to the report page; only admin accounts remain on the dashboard.

### Password and Account Security
- Use a strong password and keep it private.
- **Forgot password** and in-app **Settings** are not available in this build; use your school’s process or contact a system administrator if you need a reset or account changes.
- If you were given default credentials, change them as soon as your school’s process allows.

---

## Admin Dashboard Overview

The dashboard is your central hub for reviewing and updating incident reports submitted by students and staff.

### Main Sections

| Area | Purpose |
|------|---------|
| **Header** | Title, navigation (**Dashboard**, **Reports** scroll to the incident list), **Settings** (not available in this build) and **Sign out** |
| **Quick action cards** | **New Incident** opens the same incident report form used by reporters; **View Incidents** jumps to the searchable **Incident Reports** table |
| **Recent Incidents** | The three most recently created reports (date, student/reporter label, type, status) |
| **Quick Links** | Placeholders (Incident Guidelines, Emergency Contacts, Safety Resources, Help & Support) — not available in this build |
| **Filters** | Narrow the **Incident Reports** list by type, status and text search |
| **Incident Reports** | Full table of reports matching your filters, with actions to update status or view details |

---

## Viewing Incidents

### Recent Incidents
- Shows the **last three** reports system-wide, newest first.
- Columns: **Date**, **Student** (reporter name shortened for privacy where applicable, or **Anonymous**), **Type**, **Status**.
- Status labels in this table: **Resolved**, **Under Review** (for reports being worked on), **Open** (not yet resolved).

### Incident Reports table
- Columns: **ID**, **Type**, **Reporter**, **Location**, **Status**, **Actions**.
- The line under the title shows how many reports match the current filters (for example, “12 reports”).
- **Pending** items may appear as **Open** in the status column when you filter using **Open** (see [Filtering](#filtering-and-searching)).

---

## Filtering and Searching

Use the **Filter by type** section above the incident table.

### Type
Choose **All Types** or one category:
- Bullying  
- Maintenance  
- Safety  
- Lost Item  
- Other  

### Status
Choose **All Statuses** or narrow by workflow state:

| Filter option | What it shows |
|---------------|----------------|
| **All Statuses** | Every report (subject to type and search) |
| **Pending** / **Open** | Reports not yet finished (stored as *pending*; **Open** is mainly how they are *labeled* in the table when this filter is selected) |
| **In Review** | Reports marked as in progress |
| **Resolved** | Closed reports |

### Search
- Enter text that might appear in the **description** or **location** fields, then click **Filter** (or press **Enter** in the search box).
- Matching is case-insensitive and partial.

### Filter button
- Click **Filter** to apply type, status, and search together. The list and count update after the request completes.

---

## Managing Incident Status

1. In **Incident Reports**, find the row and click **Update** under **Actions**.
2. Choose one of the following:
   - **In review** — marks the report as being actively handled (in progress).
   - **Resolve** — marks the report as completed.
   - **Cancel** — closes the action menu without changing status.
3. While an update is saving, buttons are disabled; if something fails, an error message asks you to try again.

Each successful update refreshes the incident list and **Recent Incidents**. The system records a status change with a short automated note on the server for accountability.

---

## Viewing Incident Details

- Click **View** on a row to open a summary with **Type**, **Description**, **Location**, and current **Status** (in a browser dialog).
- For the full picture (including any image attached at submission), rely on your organization’s procedures and database or API access if provided outside this UI.

---

## Recent Activity and Summaries

- **Recent Incidents** gives a quick snapshot of the latest three reports without changing filters.
- The **Incident Reports** header shows the **number of reports** currently shown (after filters). There is no separate analytics or charts page in this build.

---

## Email Notifications and Audit Trail

- **In-app email alerts** when a status changes are **not shown** in this application’s interface; whether your school connects the server to email depends on deployment.
- The server **stores status updates** (including notes tied to the change) when you use **In review** or **Resolve**, which supports auditing and future reporting.

---

## Best Practices

- **Triage regularly** — use **In review** when someone is actively working a case so reporters and staff see clear progress where the UI reflects it.
- **Resolve** only when the issue is actually addressed or formally closed per school policy.
- **Use filters** to focus on one category (for example, Safety) during busy periods.
- **Search** by keywords from the description or location to find related reports.
- **Submit through “New Incident”** if you need to file a report yourself using the same form as students and teachers.

---

## Troubleshooting

| Issue | What to try |
|-------|----------------|
| **Blank page or redirect to login** | Your session may have expired. Sign in again. Ensure you are using an **admin** account. |
| **Sent to the report page instead of the dashboard** | Your account may not have the **admin** role. Contact your system administrator. |
| **“No reports found”** | Widen filters (**All Types**, **All Statuses**), clear search, and click **Filter** again. |
| **Status update fails** | Check your connection, wait a moment, and retry. If it persists, contact technical support. |
| **Settings / Quick Links / Forgot password** | These features are **not available in this build**; use school channels for passwords and reference materials. |
| **Search does not find a report by ID** | Use **Filter** after checking type/status; locate by **ID** in the table when fewer rows are shown, or search words from **description** or **location**. |

---

*Footer shown in the app: JWT secured · School Incident Reporting*
