StudyTop - E-Learning Platform
StudyTop is a comprehensive, full-stack e-learning platform designed to provide high-quality educational content, track student progress, and issue verifiable certificates. Built with modern web technologies, it offers a seamless experience for both students and administrators.

Project Overview
The platform allows users to register, browse a catalog of courses, stream video lectures, and track their learning history. Upon completion, students can request certificates, which administrators can generate and issue. The system includes a robust verification tool for employers or third parties to validate the authenticity of the issued certificates.

Key Features
Student Portal
Authentication: Secure login and registration system.

Course Catalog: Browse available courses with detailed overviews, lecture counts, and progress tracking.

Video Player: Integrated cinematic video player supporting external embeds (e.g., YouTube) with lecture navigation.

Dashboard: Personalized user dashboard displaying profile credibility, watch history, active courses, and achievements.

Certificate System: Automated requests for course completion certificates via integrated Telegram bot notifications.

Admin Dashboard
Course Management: Create new courses, upload thumbnails, and define lecture counts.

Content Updates: Append new video lectures to existing courses.

Certificate Generation: Issue official certificates tied to a unique Certificate ID, Student Name, and Course Name.

System Utilities
Certificate Verification: Public verification portal to authenticate certificates using their unique ID.

Responsive Design: Fully responsive UI built with modern CSS, ensuring accessibility across mobile, tablet, and desktop devices.

Dynamic Animations: Custom CSS animations and dynamic typing effects for an engaging user interface.

Tech Stack
Frontend
Library: React.js

Routing: React Router DOM

Form Handling: React Hook Form

Styling: Custom CSS (Flexbox, Grid, CSS Animations)

UI Components: FontAwesome Icons, React Type Animation

Backend & API
Runtime: Node.js

Framework: Express.js

Database: MongoDB (or compatible NoSQL database)

Authentication: Credential-based session management / JWT

Integration: Telegram Bot API (for internal notifications)

Installation and Local Setup
To run this project locally, follow these steps:

Prerequisites
Node.js installed on your local machine

Git installed on your local machine

1. Clone the Repository
Bash
git clone https://github.com/your-username/studytop.git
cd studytop
2. Frontend Setup
Navigate to the frontend directory and install the dependencies:

Bash
npm install
Start the frontend development server:

Bash
npm run dev
3. Backend Setup
Ensure your backend server is running locally or update the API endpoint references in the frontend code to point to your live backend (e.g., https://studytop-backend.onrender.com).

If running the backend locally:

Bash
cd backend
npm install
npm start
Environment Variables
For security and configuration, create a .env file in your project root and add the following required variables (ensure you adapt these based on your specific backend setup):

Code snippet
VITE_API_BASE_URL=http://localhost:5000
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
(Note: In the current implementation, API URLs and tokens are hardcoded. It is highly recommended to migrate them to environment variables before deploying to production.)

API Endpoints Overview
The frontend interacts with the following primary backend endpoints:

GET /check - Validates user session status.

POST /create - Registers a new user account.

POST /login - Authenticates a user.

GET /logout - Terminates the current user session.

GET /getName - Retrieves the authenticated user's profile data.

GET /v - Fetches the complete list of available courses.

POST /addC - Creates a new course (Admin only).

POST /appendC - Adds new lectures to an existing course (Admin only).

POST /addCert - Generates a new certificate (Admin only).

GET /verify/:id - Verifies the authenticity of a certificate using its ID.

Contributing
Contributions are welcome. Please adhere to the following workflow:

Fork the repository.

Create a new feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

License
Distributed under the MIT License. See LICENSE for more information.