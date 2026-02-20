# Student Skill & Internship Matching Portal - Setup Guide

## ⚠️ Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v5 or higher)
   - **Option A - Local Installation (Recommended)**:
     - Download from: https://www.mongodb.com/try/download/community
     - Install and start MongoDB service

## 🚀 Installation Steps

### Step 1: Navigate to Project

```powershell
cd "c:\Users\phani\OneDrive\Documents\Projects\Smart Internship Checker"
```

### Step 2: Install Backend Dependencies

```powershell
cd backend
npm install
```

**Expected Output:**
```
added 150+ packages in ~30s
```

### Step 3: Configure Environment Variables

The `.env` file is already pre-configured for local MongoDB. No changes are needed unless you are using MongoDB Atlas:

```powershell
# Default configuration in backend\.env:
MONGODB_URI=mongodb://localhost:27017/internship-matching
```

**Default Configuration Summary:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/internship-matching
JWT_SECRET=internship_matching_secret_key_2026_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5000
```

### Step 4: Start MongoDB (if using local installation)

**Windows:**
```powershell
# MongoDB should start automatically as a service
# Or run manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**Mac/Linux:**
```bash
brew services start mongodb-community  # Mac
sudo systemctl start mongod            # Linux
```

### Step 5: Start the Server

```powershell
# Make sure you're in the backend directory
cd "c:\Users\phani\OneDrive\Documents\Projects\Smart Internship Checker\backend"
npm start
```

**Expected Output:**
```
MongoDB Connected: localhost
Server running in development mode on port 5000
Frontend: http://localhost:5000
API: http://localhost:5000/api
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 🧪 Create Test Accounts

### Option 1: Manual Registration

1. Go to `http://localhost:5000/register.html`
2. Create accounts for each role:
   - **Admin**: Register with role admin (you may need to manually update in database)
   - **Student**: Select student role, fill details
   - **Company**: Select company role, fill details

### Option 2: Using MongoDB Compass (Recommended)

1. **Install MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Connect** to your database:
   - Local: `mongodb://localhost:27017`
   - Atlas: Use your connection string
3. **Import Sample Data**:
   - Navigate to database: `internship-matching`
   - Create users manually or import from `test-data/sample-data.json`

### Option 3: Create Admin via MongoDB Shell

```bash
# Connect to MongoDB
mongo internship-matching

# Or for MongoDB 6+:
mongosh internship-matching

# Create admin user
db.users.insertOne({
  email: "admin@internmatch.com",
  password: "$2a$10$YourHashedPasswordHere", // You'll need to hash this
  role: "admin",
  createdAt: new Date()
})
```

**Better way - Use the registration endpoint:**

```powershell
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"admin@internmatch.com","password":"admin123","role":"admin"}'
```

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@internmatch.com","password":"admin123","role":"admin"}'
```

## 📋 Testing Checklist

### ✅ Backend Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-14T..."
}
```

### ✅ Test Student Flow

1. **Register as Student**
   - URL: `http://localhost:5000/register.html`
   - Email: `student@test.com`
   - Password: `student123`
   - Role: Student
   - Name: Test Student

2. **Complete Profile**
   - Add skills: `javascript, react, node.js, python`
   - Set CGPA: `8.5`
   - College: `MIT`
   - Year: `3`

3. **View Matched Internships**
   - Should show matches based on skills

### ✅ Test Company Flow

1. **Register as Company**
   - Email: `company@test.com`
   - Password: `company123`
   - Role: Company
   - Company Name: Test Corp

2. **Post Internship**
   - Title: `Frontend Developer Intern`
   - Required Skills: `javascript, react, html, css`
   - Location: `Remote`
   - Stipend: `15000`

3. **View Matched Students**
   - Should show students with matching skills

### ✅ Test Admin Flow

1. **Login as Admin**
   - Email: `admin@internmatch.com`
   - Password: `admin123`

2. **View Dashboard**
   - Check user statistics
   - View all internships
   - Manage users

## 🐛 Troubleshooting

### Problem: "npm: cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: "MongoDB connection error"

**Solutions:**
1. **Check MongoDB is running**:
   ```powershell
   # Windows
   Get-Service MongoDB
   
   # If not running:
   net start MongoDB
   ```

2. **Verify connection string** in `.env`:
   - Local: `mongodb://localhost:27017/internship-matching`
   - Atlas: Check for correct username, password, and cluster name

3. **Check firewall**: Ensure port 27017 is not blocked

### Problem: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env:
PORT=3000
```

### Problem: "CORS error in browser console"

**Solution:**
- The server already has CORS enabled
- Clear browser cache and reload

### Problem: "JWT token invalid"

**Solution:**
- Logout and login again
- Clear browser localStorage:
  ```javascript
  // In browser console:
  localStorage.clear()
  ```

## 📊 Verify Database Collections

Using MongoDB Compass or mongosh:

```javascript
// Check all collections exist
show collections

// Should show:
// - users
// - students
// - companies
// - internships
// - applications

// Count documents
db.users.countDocuments()
db.students.countDocuments()
db.companies.countDocuments()
db.internships.countDocuments()
```

## 🔧 Development Mode

For development with auto-reload:

```powershell
cd backend
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## 📦 Project Structure Verification

Verify all files exist:

```
Smart Internship Checker/
├── backend/
│   ├── config/
│   │   ├── db.js ✅
│   │   └── config.js ✅
│   ├── controllers/ (7 files) ✅
│   ├── middleware/ (2 files) ✅
│   ├── models/ (5 files) ✅
│   ├── routes/ (7 files) ✅
│   ├── .env ✅
│   ├── package.json ✅
│   └── server.js ✅
├── public/
│   ├── css/ (2 files) ✅
│   ├── js/ (6 files) ✅
│   └── *.html (6 files) ✅
├── test-data/
│   └── sample-data.json ✅
└── README.md ✅
```

## 🚀 Production Deployment

### Deploy to Heroku

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Login and Create App**:
```bash
heroku login
heroku create internship-matcher
```

3. **Set Environment Variables**:
```bash
heroku config:set MONGODB_URI="your_atlas_connection_string"
heroku config:set JWT_SECRET="your_secure_random_string"
heroku config:set NODE_ENV=production
```

4. **Deploy**:
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Open App**:
```bash
heroku open
```

### Deploy to Railway

1. **Install Railway CLI**: https://docs.railway.app/develop/cli

2. **Initialize**:
```bash
railway login
railway init
```

3. **Add Variables**:
- Go to Railway dashboard
- Add environment variables (MONGODB_URI, JWT_SECRET, etc.)

4. **Deploy**:
```bash
railway up
```

## ✅ Final Verification

Run through this complete checklist:

- [ ] MongoDB is running
- [ ] `npm install` completed successfully
- [ ] Server starts without errors
- [ ] Can access `http://localhost:5000`
- [ ] Can register new users (Student, Company)
- [ ] Can login with created users
- [ ] Student can view profile page
- [ ] Company can post internship
- [ ] Student sees matched internships
- [ ] Application flow works
- [ ] Admin dashboard accessible

## 📞 Support

**Common Issues Fixed:**
1. ✅ Fixed typo in `student.js` (variable naming)
2. ✅ Fixed missing exports in `matchingController.js`
3. ✅ All backend routes properly configured
4. ✅ All frontend pages linked correctly

**All systems are ready to run!** 🎉

---

## Quick Start (TL;DR)

```powershell
# 1. Navigate to backend
cd "c:\Users\phani\OneDrive\Documents\Projects\Smart Internship Checker\backend"

# 2. Install dependencies (one time only)
npm install

# 3. Start server
npm start

# 4. Open browser
start http://localhost:5000
```

That's it! The application should now be running. 🚀
