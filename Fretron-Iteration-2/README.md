Fretron

Fretron is a logistics platform that connects people who want to send goods with drivers and transport businesses that can carry them.

This is the frontend part of the project. It is the side users see and interact with in the browser. It includes the landing page, login/signup pages, dashboards, and admin pages.

What Fretron Does

Fretron is not just a simple courier app.

Its main idea is that both sides can post:

A user/shipper can post a shipment they want delivered
A driver can post an available route and cargo space
A transporter business can later manage larger transport operations

So the platform works like a two-sided logistics exchange, where demand and supply can meet from both directions.

Main User Types
1. User / Shipper

This is the normal customer who wants to send goods.

They can:

sign up
log in
open the user dashboard
post shipments
view bookings
browse drivers and routes
manage profile and notifications
2. Driver

This is an individual driver who wants to offer transport service.

They can:

sign up through a detailed form
submit vehicle and identity details
wait for admin approval
log in only after approval
use the driver dashboard once approved

Important:
A driver does not get dashboard access immediately after signup. Their account stays pending until admin approves it.

3. Transporter / Business

This is a transport company or logistics business.

They can:

sign up through a separate business form
submit company and verification details
wait for admin approval
log in after approval

Right now, the transporter dashboard is still very basic and is planned to be completed later.

4. Admin

This is the platform manager.

Admin can:

log in through the admin portal
view pending driver requests
view pending transporter requests
view users, active drivers, and active businesses
approve or reject driver/transporter applications

Admin controls which partner accounts become active.

Project Flow
Public Side

The landing page is the first screen of the project.

From there, people can go to:

User login/signup
Driver login/signup
Transporter login/signup
Admin portal
User Flow
User Signup

A normal user creates an account.

User Login

After login, the user is taken to the User Dashboard.

User Dashboard

The user dashboard currently includes:

Dashboard home
Post shipment
My shipment posts
Browse routes/drivers
Active bookings
Booking history
Notifications
Profile

Some pages are already structured well, but some still use placeholder or mock data for now.

Driver Flow
Driver Signup

Driver signup is a multi-step application form.

The driver enters things like:

full name
email
phone
password
CNIC
city
address
license details
vehicle details
capacity
documents/images

After submitting:

the account is created as pending
the driver is sent to the login page
dashboard access is not given yet
Driver Login

When a driver logs in:

if status is approved, they can open the dashboard
if status is pending, access is blocked
if status is rejected, access is blocked
Driver Dashboard

Once approved, the driver can use:

Dashboard home
Post route
My route posts
Browse shipment requests
Active cargo
Trip history
Reviews
Profile
Transporter Flow
Transporter Signup

Transporter signup is a separate application process for businesses.

They provide:

business name
owner/contact details
registration details
city and address
business documents

After signup:

the account stays pending
the transporter is redirected to login
Transporter Login

When logging in:

if approved, access is allowed
if pending or rejected, access is blocked
Transporter Dashboard

Right now, this dashboard is only a placeholder. Full features will be added later.

Admin Flow
Admin Login

Admin enters through the admin portal.

Admin Work

Admin can review:

pending driver applications
pending transporter applications
users
active drivers
active businesses
Approval System

If admin approves a driver or transporter:

their account status becomes approved
they can then log in and use their dashboard

If admin rejects them:

they stay blocked from dashboard access
Tech Stack
Frontend
React
Vite
React Router
Tailwind CSS
Backend
Node.js
Express.js
MySQL
JWT authentication
Cookie-based auth
Bcrypt password hashing
Database
MySQL
Authentication System

The project uses JWT tokens with HTTP-only cookies.

How it works
user logs in
backend checks email and password
backend creates a JWT token
token is stored in a cookie
protected routes use that token to identify the logged-in user
Supported Roles

The system supports these roles:

user
driver
transporter
admin
Approval Check

For drivers and transporters, login also checks account status:

pending
approved
rejected

This is important because business/partner accounts should not become active automatically.

Database Design

The project follows a role-based structure.

Main Tables
users

This table stores common account information such as:

full name
email
phone
password hash
role
account status
active state
timestamps
driver_profiles

This stores driver-specific details such as:

CNIC
license number
vehicle details
city/address
uploaded document paths
verification status
transporter_profiles

This stores transporter/business-specific details such as:

business name
owner details
registration details
uploaded documents
verification status

This design keeps basic login data separate from role-specific profile data.

Frontend Setup
Install dependencies
npm install
Create environment file

Make a .env file in the root and add:

VITE_API_URL=http://localhost:5000/api
Start the project
npm run dev

The frontend will usually run on:

http://localhost:5173
Available Scripts
npm run dev
npm run build
npm run preview
What they do
npm run dev → starts local development server
npm run build → creates production build
npm run preview → previews production build locally
API Handling

All API requests go through the shared helper in:

src/lib/api.js

This helper:

sends requests to the backend
attaches cookies automatically
sets JSON content type
shows readable errors when something fails

The default backend URL is:

http://localhost:5000/api

But this can be changed using VITE_API_URL.

Project Structure
src/
├── App.jsx
├── LandingPage.jsx
├── main.jsx
├── index.css
├── lib/
│   └── api.js
├── assets/
├── data/
│   └── dashboardData.js
├── components/
│   ├── admin/
│   └── dashboard/
└── pages/
    ├── UserLogin.jsx
    ├── UserSignup.jsx
    ├── DriverLogin.jsx
    ├── DriverSignup.jsx
    ├── TransporterLogin.jsx
    ├── TransporterSignup.jsx
    ├── TermsPage.jsx
    ├── PrivacyPage.jsx
    ├── user-dashboard/
    ├── driver-dashboard/
    ├── transporter/
    └── Admin*.jsx
Simple meaning
App.jsx → main routing file
LandingPage.jsx → homepage
lib/api.js → shared API helper
components/ → reusable UI parts
pages/ → login pages, dashboards, admin pages
assets/ → images
data/ → static data for dashboards
Current Project Status
Already Working
landing page
user signup/login
driver signup/login
transporter signup/login
admin login
admin management pages
user dashboard structure
driver dashboard structure
transporter placeholder dashboard
role-based authentication
admin approval flow
MySQL-based backend setup
Not Fully Completed Yet
real shipment storage
real route posting storage
booking engine
route matching logic
advanced transporter features
complete dashboard data integration
full notifications, reviews, and history modules
Iteration Plan
Iteration 1 Focus

The first iteration mainly covers:

project setup
role-based authentication
authorization
admin approval system
separation of user, driver, and transporter flows
dashboard structure
strong base architecture
Planned for Later Iterations

Later iterations will add:

full transporter dashboard
real shipment posting
real route posting
matching and booking system
deeper dashboard features
reporting and advanced workflows
Important Notes
Admin has a separate login page and separate layout.
Transporter dashboard is not fully built yet.
The app does not use Redux or any global state library.
Most state is handled inside components.
Authentication mainly depends on backend sessions and cookies.
High-Level Folder Layout
Fretron/
  frontend/
    src/
      pages/
      components/
      assets/
      App.jsx
      main.jsx

  backend/
    src/
      config/
      controllers/
      routes/
      services/
      middleware/
      utils/
      server.js
    init.sql