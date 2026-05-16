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
    
    **For MongoDB Atlas (Cloud)**, update the URI:
    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/internship-matching
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
   
   **For MongoDB Atlas**: No action needed, just ensure your connection string is in `.env`

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   ```
   Open browser: http://localhost:5000
   ```

## 📝 Default Test Accounts

### Admin
- Email: `admin@internmatch.com`
- Password: `admin123`

### Student
- Email: `john.doe@student.com`
- Password: `student123`

### Company
- Email: `hr@techcorp.com`
- Password: `company123`

> ⚠️ **Note**: For first-time setup, you'll need to create these accounts manually or use the sample data provided in `test-data/sample-data.json`

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

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login
GET    /api/auth/me          # Get current user
POST   /api/auth/logout      # Logout
```

### Student
```
GET    /api/student/profile          # Get profile
PUT    /api/student/profile          # Update profile
PUT    /api/student/skills           # Update skills
PUT    /api/student/preferences      # Update preferences
```

### Company
```
GET    /api/company/profile/me       # Get own profile
PUT    /api/company/profile/me       # Update profile
GET    /api/company/:id              # Get company by ID
```

### Internship
```
GET    /api/internship               # Get all internships
GET    /api/internship/:id           # Get single internship
POST   /api/internship               # Create internship (Company)
PUT    /api/internship/:id           # Update internship (Company)
DELETE /api/internship/:id           # Delete internship (Company)
GET    /api/internship/my/internships # Get own internships (Company)
```

### Matching
```
GET    /api/matching/internships     # Get matched internships (Student)
GET    /api/matching/students/:id    # Get matched students (Company)
GET    /api/matching/check/:id       # Check specific match (Student)
```

### Application
```
POST   /api/application/apply              # Apply to internship (Student)
GET    /api/application/my-applications    # Get applications (Student)
PUT    /api/application/:id/withdraw       # Withdraw application (Student)
GET    /api/application/internship/:id     # Get applications (Company)
GET    /api/application/company-applications # All applications (Company)
PUT    /api/application/:id/status         # Update status (Company)
```

### Admin
```
GET    /api/admin/stats         # Get statistics
GET    /api/admin/users         # Get all users
GET    /api/admin/internships   # Get all internships
DELETE /api/admin/user/:id      # Delete user
PUT    /api/admin/internship/:id/status # Update internship status
```

## 🌐 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Create Heroku app
   ```bash
   heroku create your-app-name
   ```
3. Add MongoDB Atlas connection
4. Set environment variables
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   ```
5. Deploy
   ```bash
   git push heroku main
   ```

### Deploy to Vercel/Netlify (Frontend) + MongoDB Atlas

1. Host backend on Heroku/Railway/Render
2. Deploy frontend to Vercel
3. Update API_URL in `/public/js/api.js`

## 🛠️ Future Enhancements

1. ✉️ Email notifications for application updates
2. 📤 File upload for resumes and company logos
3. 🔍 Advanced search and filtering
4. 📈 Analytics dashboard for companies
5. 💬 In-app messaging between students and recruiters
6. 📝 Assessment tests for skill verification
7. 📅 Interview scheduling calendar
8. 📊 Export reports (PDF/Excel)
9. 📱 Progressive Web App (PWA)
10. 🌍 Multi-language support

## 🤝 Contributing

This is a complete project ready for submission. For modifications:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - Feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

Built as a demonstration of full-stack development skills covering:
- Backend API development
- Database design and optimization
- Frontend development
- Authentication and authorization
- Algorithmic problem solving
- Clean code practices

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review sample data and test accounts
3. Ensure MongoDB is running
4. Verify environment variables

---

**⭐ If you find this project helpful, please star it!**
