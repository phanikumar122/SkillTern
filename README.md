# Student Skill & Internship Matching Portal

A full-stack web application that connects students and companies for internships using a **rule-based matching system**. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

![InternMatch](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v5+-brightgreen)

## 🎯 Overview

InternMatch is a centralized platform that helps students find internships by matching their skills with company requirements using a transparent, rule-based algorithm (no AI/ML). The system supports three user roles: Students, Companies, and Admins.

## ✨ Key Features

### For Students
- ✅ Create and manage profile with skills
- ✅ View internships matched by skill percentage
- ✅ Apply to internships with one click
- ✅ Track application status
- ✅ Set location and type preferences

### For Companies
- ✅ Post internship opportunities
- ✅ View matched students for each posting
- ✅ Manage applications (accept/reject)
- ✅ Track all internship postings

### For Admins
- ✅ View platform statistics
- ✅ Manage all users
- ✅ Moderate internship postings
- ✅ Dashboard analytics

## 🏗️ Architecture

```
┌─────────────┐
│  Frontend   │  HTML, CSS, JavaScript
│  (Vanilla)  │
└──────┬──────┘
       │
┌──────▼──────┐
│   Express   │  REST API, JWT Auth
│   Backend   │  MVC Pattern
└──────┬──────┘
       │
┌──────▼──────┐
│   MongoDB   │  5 Collections
│  (Database) │  Indexed for Performance
└─────────────┘
```

## 📊 Database Schema

### Collections:
- **users** - Authentication (email, password, role)
- **students** - Student profiles and skills
- **companies** - Company information
- **internships** - Job postings with required skills
- **applications** - Application tracking

## 🔧 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: MVC Pattern

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB v5 or higher (local installation recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "Smart Internship Checker"
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
    The default `.env` is already configured for local MongoDB:
    ```
    MONGODB_URI=mongodb://localhost:27017/internship-matching
    JWT_SECRET=your_secret_key_here
    PORT=5000
    ```
    ```

4. **Start MongoDB (Local)**
   ```bash
   # Windows - MongoDB should start automatically as a service
   # Or start manually:
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
   
  5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   ```
   Open browser: http://localhost:5000
   ```
## 🧪 Testing

### Manual Testing Steps

1. **Register as Student**
   - Go to `/register.html`
   - Select "Student" role
   - Fill in details and submit
   - Login with credentials

2. **Complete Student Profile**
   - Navigate to Profile section
   - Add skills (e.g., "javascript, react, node.js")
   - Set preferences
   - Save profile

3. **Register as Company**
   - Logout and register as Company
   - Complete company profile

4. **Post an Internship**
   - Add required skills that match student skills
   - Set eligibility criteria
   - Post internship

5. **Test Matching**
   - Login as student
   - View "Matched Internships"
   - Check match percentage
   - Apply to internship

6. **Review Applications (Company)**
   - Login as company
   - View "Applications"
   - Accept/Reject applications

## 🎨 Design System

The application uses a modern design system with:
- **Dark Theme** with glassmorphism effects
- **Gradient Buttons** with hover animations
- **Responsive Grid** layout
- **Custom CSS Variables** for consistency
- **Mobile-First** approach

## 🔍 Matching Algorithm

### How It Works

```javascript
1. Compare student skills with internship required skills
2. Calculate base match: (matched_skills / required_skills) × 100
3. Check eligibility:
   - Minimum CGPA
   - Degree requirement
   - Year of study
4. Apply preference bonuses:
   - Location match: +5%
   - Internship type match: +5%
5. Show if match ≥ 40%
6. Highlight as "Strong Match" if ≥ 70%
```

### Example

**Student Profile:**
- Skills: `['javascript', 'react', 'html', 'css']`
- CGPA: 8.5

**Internship Requirements:**
- Required Skills: `['javascript', 'react', 'html']`
- Min CGPA: 7.5

**Match Calculation:**
- Matched: 3 out of 3 required skills
- Base match: (3/3) × 100 = 100%
- CGPA: ✅ Eligible (8.5 ≥ 7.5)
- **Final Match**: 100% (Strong Match)

## 📁 Project Structure

```
smart-internship-checker/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── config.js             # Environment config
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── studentController.js  # Student operations
│   │   ├── companyController.js  # Company operations
│   │   ├── internshipController.js
│   │   ├── matchingController.js # Matching algorithm ⭐
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── roleAuth.js          # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   ├── Internship.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── student.js
│   │   ├── company.js
│   │   ├── internship.js
│   │   ├── matching.js
│   │   ├── application.js
│   │   └── admin.js
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js                # Main entry point
├── public/
│   ├── css/
│   │   ├── main.css            # Design system
│   │   └── dashboard.css       # Dashboard styles
│   ├── js/
│   │   ├── api.js              # API utilities
│   │   ├── auth.js             # Auth management
│   │   ├── utils.js            # Helper functions
│   │   ├── student.js          # Student dashboard
│   │   ├── company.js          # Company dashboard
│   │   └── admin.js            # Admin dashboard
│   ├── index.html              # Landing page
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── company-dashboard.html
│   └── admin-dashboard.html
├── test-data/
│   └── sample-data.json        # Test data
└── README.md
```

**⭐ If you find this project helpful, please star it!**
