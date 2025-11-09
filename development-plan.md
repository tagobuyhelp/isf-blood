🩸 ISF Blood Donor Website
Project Concept & Development Plan

Prepared by: Tarik Aziz — Full Stack Software Engineer
Stack: Next.js (JavaScript), Node.js, Express.js, MongoDB (MERN-based architecture)
Client: International Social Forum (ISF)
Date: October 2025

1. Project Concept

The ISF Blood Donor Website is a digital humanitarian platform designed to create a centralized and reliable system for connecting voluntary blood donors with patients and hospitals in real-time.

In emergency situations, patients often struggle to find matching donors quickly. ISF aims to solve this through technology — by building a web-based blood donor management system that enables:

Verified donors to register and update their availability,

Recipients to post urgent blood requests,

Hospitals and ISF administrators to coordinate and verify the donation process.

This platform is more than just a database — it’s a life-saving network, where technology bridges compassion and speed, ensuring that “no life is lost due to lack of blood.”

2. Project Objectives
Functional Objectives

Develop a centralized digital platform to manage donors, requests, and hospitals.

Implement location-based donor search for quick emergency matches.

Introduce real-time request notifications via SMS and email.

Allow ISF admins to verify donors, manage content, and monitor activities.

Maintain data privacy, security, and transparency across the platform.

Social Objectives

Encourage voluntary blood donation and raise awareness.

Build partnerships with hospitals, clinics, and NGOs.

Promote community engagement through verified ISF initiatives.

Recognize and reward active donors with badges and certifications.

3. Target Users

Donors: Individuals willing to donate blood voluntarily.

Recipients: Patients or family members requesting blood.

Hospitals/Clinics: Institutions managing and confirming blood donations.

ISF Admins: Authorized staff managing verification, data, and system operations.

4. Key Features
Category	Description
Donor Registration	Sign up with personal, medical, and location details; set availability status.
Recipient Requests	Create and manage blood requests with urgency, units, and hospital details.
Geo-based Matching	Match recipients with nearest eligible donors via coordinates (MongoDB GeoJSON).
OTP Verification	Phone/email verification for donors and recipients.
Notifications	Send alerts to donors via SMS and email in emergencies.
Admin Panel	Verify users, manage hospitals, view analytics and reports.
Reports & Analytics	Dashboard with active donors, requests, and area-wise shortages.
Multilingual Interface	English & Bengali (for accessibility).
Data Privacy & Security	Encrypted data storage, role-based access, and secure authentication.
5. System Architecture

Type: Client–Server (MERN-based architecture)

Frontend (Next.js)

Built with Next.js and Tailwind CSS for a fast, responsive UI.

Uses fetch/axios to communicate with backend REST APIs.

Supports SSR (Server-Side Rendering) for better SEO and performance.

Handles authentication, donor dashboards, and search UI.

Backend (Node.js + Express)

REST API built with Express.js.

Handles business logic, donor matching, verification, and notifications.

Secured with JWT authentication and bcrypt password hashing.

Integrates third-party services (Twilio/Fast2SMS, SendGrid).

Database (MongoDB Atlas)

Stores users, requests, donation records, and admin data.

Utilizes GeoJSON indexes for fast location-based searches.

Cloud-hosted, scalable, and automatically backed up.

Hosting

Frontend: Vercel

Backend: Render / VPS (Ubuntu + PM2 + NGINX)

Database: MongoDB Atlas (Cloud Cluster)

6. Development Plan (Phase-wise)
Phase 1 — Backend Foundation (Week 1–2)

Goal: Build secure API and database structure.
Tasks:

Initialize Node.js & Express project.

Connect MongoDB Atlas.

Create core models:

User (role-based: donor, recipient, hospital, admin)

Request (blood requests)

DonationRecord

Implement JWT Authentication (signup/login).

Add routes for donors and requests.

Configure environment variables (dotenv).

Test APIs in Postman.

Deliverables:

Functional backend server (/api/auth, /api/donors, /api/requests)

MongoDB connected with sample data

Phase 2 — Frontend Development (Week 3–5)

Goal: Develop user interface and connect APIs.
Tasks:

Initialize Next.js project.

Set up Tailwind CSS and responsive design.

Build pages:

Home (/)

Donor Registration (/register)

Blood Request (/request-blood)

Donor Search (/donors)

Admin Panel (/admin)

Create components:

Navbar, Footer, DonorCard, RequestForm, OTP Modal

Integrate APIs for:

Signup/Login

Search Donors

Create Request

Setup .env.local for backend URL.

Deliverables:

Frontend UI connected with live backend

Auth, search, and request workflows functioning

Phase 3 — Integration & Features (Week 6)

Goal: Add communication, analytics, and admin functionalities.
Tasks:

SMS OTP integration (Twilio / Fast2SMS).

Email notifications (SendGrid).

Implement Google Maps for donor location.

Create admin panel (verify donors, approve hospitals, manage reports).

Add analytics (requests, fulfilled cases, donors by blood group).

Deliverables:

Admin dashboard working

Notification system live

Donor verification and analytics enabled

Phase 4 — Testing, Optimization & Deployment (Week 7–8)

Goal: Prepare the platform for production.
Tasks:

Test all user flows (auth, donor match, requests).

Fix validation and security issues.

Optimize frontend and backend performance.

Deploy backend on VPS/Render.

Deploy frontend on Vercel.

Setup domain (blood.isf.org) and SSL.

Deliverables:

Fully functional live system

Secured production deployment

Admin training and documentation

7. API Overview (Sample Routes)
Method	Endpoint	Description
POST	/api/auth/signup	User registration (donor/recipient)
POST	/api/auth/login	Login via email/phone
GET	/api/donors	Search donors by group, city, or radius
POST	/api/requests	Create new blood request
GET	/api/requests	List or filter open requests
POST	/api/requests/:id/accept	Donor accepts a request
PATCH	/api/admin/verify/:userId	Verify donor/hospital
GET	/api/admin/stats	Dashboard analytics
8. Security Plan

✅ Passwords hashed with bcrypt
✅ JWT + Refresh Token auth system
✅ CORS restricted to frontend domain
✅ Encrypted communication via HTTPS
✅ Input sanitization with express-validator
✅ Rate limiting on OTP endpoints
✅ Hidden donor details until verified
✅ Admin action logs maintained

9. Deployment Plan
Frontend

Host on Vercel (auto-build from GitHub)

Environment variables in Vercel dashboard

Domain: blood.isf.org

Backend

Host on Render / VPS

Run via PM2 (pm2 start server.js)

Reverse proxy via NGINX (https://api.isf.org)

Configure SSL (Certbot or Cloudflare)

Database

Use MongoDB Atlas (M0/M10 cluster)

Enable automatic backups and IP whitelist

10. Maintenance & Scaling

Weekly DB backups (auto in Atlas)

Monthly security audit

Add caching layer (Redis) for high traffic

Prepare REST API for future mobile app integration

Monitor uptime via UptimeRobot / BetterStack

Feature upgrades via CI/CD (GitHub + Vercel + Render)

11. Future Expansion

Mobile App (React Native / Flutter)

QR-based donor verification

AI-driven donor availability prediction

Leaderboard system & donor reward badges

API integration with hospital blood bank management systems

12. Summary

The ISF Blood Donor Website will empower ISF to manage, verify, and mobilize blood donors across regions — combining technology with humanity.

It delivers a secure, scalable, and user-friendly digital solution to ensure every blood request finds a matching donor in time.

“A single click can save a life — ISF Blood Donor Network makes it possible.”