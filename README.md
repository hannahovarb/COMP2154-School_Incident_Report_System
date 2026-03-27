# School Incident Reporting System

A comprehensive web application for students, teachers, and administrators to report and manage school incidents including bullying, maintenance issues, safety concerns, and lost items.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [User Manuals](#user-manuals)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)

---

## Overview

The School Incident Reporting System provides a centralized digital platform for reporting and managing school incidents. Instead of relying on verbal reports, emails, or paper forms that often get lost or forgotten, this system allows students, teachers, and staff to submit incident reports quickly from any device. Administrators can then view, prioritize, and track issues through an intuitive dashboard, ensuring problems are addressed promptly and documentation is maintained.

---

## Features

### For Students & Teachers (Reporters)
- User registration and login with JWT authentication
- Submit incident reports with type, location, and description
- Optional photo upload (JPEG, PNG, GIF up to 5MB)
- Anonymous reporting option
- Receive email notifications when report status changes
- Responsive mobile-optimized interface

### For Administrators
- Secure admin dashboard with role-based access
- View all submitted incident reports in a sortable table
- Filter reports by type, status, and date
- Search reports by description or location
- Update incident status (Pending, In Progress, Resolved)
- View status history for each incident
- Summary analytics showing incident counts by status and type
- Mobile-responsive dashboard with card-based layout on small screens

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | 18.2.0 |
| | React Router DOM | 6.22.0 |
| | Axios | 1.6.5 |
| | Tailwind CSS | 3.4.1 |
| | Vite | 5.0.12 |
| **Backend** | Node.js | 18.x+ |
| | Express | 4.18.2 |
| | PostgreSQL | 14.x+ |
| | JWT (jsonwebtoken) | 9.0.2 |
| | Bcrypt | 5.1.1 |
| | Multer | 1.4.5 |
| | Nodemailer | 6.9.7 |
| **Tools** | Git | - |
| | GitHub Projects | - |

---

## Prerequisites

Before installing the application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** (comes with Node.js)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-incident-reporting.git
cd school-incident-reporting