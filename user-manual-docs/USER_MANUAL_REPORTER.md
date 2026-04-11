# Reporter User Manual
## For Students and Teachers

Welcome to the School Incident Reporting System! This guide will help you report incidents using the web application your school provides.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating an Account](#creating-an-account)
3. [Logging In](#logging-in)
4. [Home Page](#home-page)
5. [Submitting a Report](#submitting-a-report)
6. [Anonymous Reporting](#anonymous-reporting)
7. [Uploading Photos](#uploading-photos)
8. [Follow-Up and Status](#follow-up-and-status)
9. [Email Notifications](#email-notifications)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

The School Incident Reporting System allows you to submit reports in these categories:

| Type | Use for |
|------|---------|
| **Bullying** | Harassment or bullying incidents |
| **Maintenance** | Broken equipment, facilities issues |
| **Safety** | Safety hazards or concerns |
| **Lost Item** | Lost and found |
| **Other** | Other school-related concerns |

You must be **logged in** to submit a report. The report form is available from the navigation bar after you sign in.

---

## Creating an Account

1. Open the application URL provided by your school.
2. On the login page, click **Sign up here** (or open the **Sign Up** link from the home page).
3. Complete the form:
   - **Username** — unique name for your account  
   - **Email** — address you will use to log in  
   - **Password** — at least **6 characters**  
   - **Confirm Password** — must match your password  
   - **Role** — **Student** or **Teacher** (administrator accounts are assigned separately; they do not appear in this list)
4. Optionally leave **Remember me** checked so your session persists on trusted personal devices.
5. Click **Sign Up**.

After a successful registration you are signed in automatically. You may briefly land on the dashboard URL; if your account is not an administrator, you are taken to the **Report an Incident** page.

---

## Logging In

1. Open **Login** from the site navigation (or the home page).
2. Enter your **email** and **password**.
3. Optionally use **Remember me** on a personal device.
4. Click **Login →** (the button shows a loading state while signing in).

**Forgot password?** The **Forgot password?** link is shown on the login page; in this build, password reset is not fully configured—use your school’s process or contact an administrator if you are locked out.

**Where you land:** After login, non-administrator users are directed to the **Report an Incident** page so you can file a report right away.

---

## Home Page

When you are **not** logged in, the home page describes the system and offers **Login** and **Get Started** (sign up). After you log in, use **Report Incident** in the top navigation to open the form.

---

## Submitting a Report

1. Go to **Report Incident** (or open `/report` after signing in).
2. Fill in the fields:

### Incident Type
Choose one: **Bullying**, **Maintenance**, **Safety**, **Lost Item**, or **Other**.

### Location
**Required.** Be specific so staff can find the issue. Examples:

- Main Building — Room 201  
- Cafeteria, near the salad bar  
- Parking lot, Section B  
- Gymnasium, bleacher area  

### Brief title / subject
**Optional.** A short label such as “Broken projector” or “Noise complaint.” If you enter text here, it is added at the start of your **Description** when the report is saved (as a subject line plus your detailed text).

### Description
**Required.** Include what happened, when, who was involved (if appropriate), and any other useful details.

**Good example:**  
> At about 10:30 AM during lunch, the locker by the water fountain jammed; the door will not close.

**Poor example:**  
> Locker broken

### Optional photo
See [Uploading Photos](#uploading-photos).

3. Click **Submit Report**. While the request runs, the button shows **Submitting...** and is disabled.
4. On success, a green message appears: **Report submitted successfully.** It clears automatically after a few seconds. The form resets (including the optional photo).

---

## Anonymous Reporting

The server can support anonymous submissions in principle, but **this version of the form does not include a “Report anonymously” checkbox.** Every report you submit from the app is tied to your **logged-in account** for staff to review.

If your school adds anonymous reporting to the form later, follow their instructions. Until then, assume administrators can associate the report with your username when handling the case.

---

## Uploading Photos

Photos help staff understand maintenance, safety, or other visible issues.

### How to add a photo
1. Under **Upload photo (Optional)**, click **Choose File**.
2. Pick one image from your device. The file name appears next to the button.
3. To remove the image before submitting, click **Remove**.

There is no drag-and-drop upload in this build—use **Choose File**.

### Requirements
- **Types:** JPEG, JPG, PNG, or GIF (the app checks the file type).
- **Maximum size:** 5 MB per file.
- **One photo** per submission.

### Tips
- Use good lighting and a clear view of the problem.  
- Avoid showing people’s faces when it is not necessary.  
- If one angle is not enough, describe the rest in the **Description** (only one image per report).

---

## Follow-Up and Status

**There is no “My Reports” list in this application** for students and teachers. After you submit, you see the success message on the form; you cannot currently open a history of your past reports or live status in the same UI.

To learn whether something was addressed, rely on your school’s normal channels (email, phone, in-person follow-up). Administrators use the **Admin Dashboard** to view and update report status; they may contact you using information from your account if your school’s policy allows it.

---

## Email Notifications

The application **does not send automatic emails** from the incident workflow in the code you are running here. Status changes and notes may be stored on the server for staff, but you should **not** expect email updates from the app itself unless your school adds that integration.

Use a valid email at registration so staff or IT can reach you outside the app if needed.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| **Cannot log in** | Confirm email and password, caps lock off. Use **Forgot password?** only if your school has enabled reset; otherwise contact support. |
| **Validation errors on signup** | Passwords must match and be at least 6 characters. Email must look like a valid address. |
| **“Please enter a location” or description error** | Both **Location** and **Description** are required. |
| **Photo rejected** | Use JPEG, PNG, or GIF under 5 MB. |
| **Submit fails** | Check your network. Wait and try again. If it continues, contact technical support. |
| **I need to know if my report was resolved** | There is no in-app tracker for reporters in this build—ask your school how they will follow up. |
| **I expected anonymous reporting** | Not exposed in this build; reports are submitted under your account. |

---

*Footer shown on the report page: JWT secured · incident reporting*
