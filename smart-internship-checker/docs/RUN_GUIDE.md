# Complete Guide to Run Student Skill & Internship Matching Portal

**Date**: February 14, 2026  
**Project**: Student Skill & Internship Matching Portal  
**Version**: 1.0.0

This is a **complete step-by-step guide** for running this project from scratch. Follow every step carefully!

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Installation](#step-by-step-installation)
3. [Starting the Application](#starting-the-application)
4. [Creating Test Accounts](#creating-test-accounts)
5. [Testing the Features](#testing-the-features)
6. [Troubleshooting](#troubleshooting)
7. [Stopping the Application](#stopping-the-application)

---

## ✅ Prerequisites

Before you begin, you need the following installed on your computer:

### 1. Node.js (Required)

**Check if you have it:**
```cmd
node --version
```

### 2. MongoDB (Required)

This project is configured to use **Local MongoDB** by default.

**Advantages**: 
- ✅ Fast performance
- ✅ Works offline
- ✅ Complete data privacy
- ✅ No internet dependency

**Installation Steps:**

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your OS (Windows/Mac/Linux)
   - Download the latest version (7.0 or higher)

2. **Install MongoDB**
   
   **Windows:**
   - Run the installer (.msi file)
   - Choose "Complete" installation
   - ✅ **IMPORTANT**: Check "Install MongoDB as a Service" (this auto-starts MongoDB)
   - Click "Next" through the wizard
   - Installation will complete in 2-5 mins

3. **Verify MongoDB is Running**
   
   **Windows:**
   ```cmd
   # Check if MongoDB service is running
   Get-Service MongoDB
   # Should show "Running" status

4. **Test MongoDB Connection (Optional)**
   ```cmd
   # Open MongoDB Shell
   mongosh
   # You should see: "Connected to: mongodb://localhost:27017"
   # Type 'exit' to quit


## 🚀 Step-by-Step Installation

### Step 1: Open PowerShell/Terminal

- Type `command prompt`
- Press Enter

### Step 2: Navigate to Project Directory

```cmd
cd "c:\Users\phani\OneDrive\Documents\Projects\Smart Internship Checker"
```

**Verify you're in the right place:**
```cmd
ls
```

**You should see folders:** `backend`, `public`, `test-data`, etc.

### Step 3: Navigate to Backend

```cmd
cd backend
```

### Step 4: Install Dependencies

```cmd
npm install
```

**What you'll see:**
- Lines of text showing packages being downloaded
- Progress bars
- Takes about 1-3 minutes
- Should end with something like: "added 150+ packages"

**If you see errors about execution policy**, go back to Prerequisites #3.

### Step 5: Configure Database Connection

#### ✅ If using Local MongoDB (Default - Recommended):

**No changes needed!** The `.env` file is already configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/internship-matching
```

### Step 6: Verify Your Setup

**Check that everything is ready:**

```cmd
# You should be in the backend folder
pwd
# Output should end with: ...\Smart Internship Checker\backend

# Check .env file exists
ls .env
# Should show the file

# Check node_modules folder exists
ls node_modules
# Should show a folder (means npm install worked)
```

## ▶️ Starting the Application


### Manual Start

**From the backend folder:**

```cmd
# Make sure you're in backend folder
cd backend

# Start the server
npm start
```

### What Success Looks Like

**For Local MongoDB**, you should see:

```   
MongoDB Connected: localhost
Database indexes created successfully
Server running in development mode on port 5000
Frontend: http://localhost:5000
API: http://localhost:5000/api
```


**🎉 If you see "MongoDB Connected" and "Server running", you're good to go!**

---

## 🌐 Opening the Application

### Step 1: Open Your Browser

**Recommended browsers:** Chrome, Edge, Firefox

### Step 2: Go to the Application

**In the address bar, type:**
```
http://localhost:5000
```

**Press Enter**

### What You Should See

You should see the **InternMatch landing page** with:
- A hero section: "Find Your Perfect Internship Match"
- Features grid with 6 cards
- "How It Works" section
- Buttons: "Get Started" and "Login"

**If you see this: ✅ SUCCESS! Your application is running!**

---

## 👤 Creating Test Accounts

Now you need to create accounts to test the application.

### Create a Student Account

1. **Click "Get Started"** or go to: `http://localhost:5000/register.html`

2. **Select "Student" role card** (click the 👨‍🎓 Student box)

3. **Fill in the form:**
   - **Email**: `student@test.com`
   - **Password**: `student123`
   - **Confirm Password**: `student123`
   - **Full Name**: `John Doe`

4. **Click "Create Account"**

5. You should see "Registration successful!" and be redirected to the student dashboard

### Create a Company Account

1. **Logout** by clicking "Logout" in the top right

2. **Go to register page**: `http://localhost:5000/register.html`

3. **Select "Company" role card** (click the 🏢 Company box)

4. **Fill in the form:**
   - **Email**: `company@test.com`
   - **Password**: `company123`
   - **Confirm Password**: `company123`
   - **Company Name**: `Tech Corp`

5. **Click "Create Account"**

6. You should be redirected to the company dashboard

### Create an Admin Account

**Admin accounts must be created via API call or database:**

**Using PowerShell:**

```powershell
# In a new PowerShell window (keep the server running in the other one)
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"admin@internmatch.com","password":"admin123","role":"admin"}'
```

**Or using curl (if you have Git Bash):**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@internmatch.com","password":"admin123","role":"admin"}'
```


## 🧪 Testing the Features

### Test 1: Student Profile & Skills

1. **Login as student:**
   - Email: `student@test.com`
   - Password: `student123`

2. **Click "Profile" in the sidebar**

3. **Fill in your profile:**
   - **Name**: John Doe
   - **Phone**: 1234567890
   - **College**: Massachusetts Institute of Technology
   - **Degree**: B.Tech Computer Science
   - **Year**: 3
   - **CGPA**: 8.5
   - **Skills**: `javascript, react, node.js, python, mongodb`
   - **Preferred Locations**: `Bangalore, Mumbai, Remote`
   - **Preferred Internship Type**: Remote

4. **Click "Save Profile"**

5. You should see "Profile updated successfully!"

---

### Test 2: Company Posts Internship

1. **Logout and login as company:**
   - Email: `company@test.com`
   - Password: `company123`

2. **Click "Company Profile" in sidebar**

3. **Fill in company details:**
   - **Company Name**: Tech Corp
   - **Industry**: Technology
   - **Website**: https://techcorp.com
   - **Location**: Bangalore, India
   - **Company Size**: 51-200
   - **Contact Person**: HR Manager
   - **Contact Email**: hr@techcorp.com

4. **Click "Save Profile"**

5. **Click "Post Internship" in sidebar**

6. **Fill in internship details:**
   - **Title**: `Frontend Developer Intern`
   - **Description**: `Join our team to work on React applications. Learn modern web development.`
   - **Location**: `Bangalore`
   - **Type**: Full Time
   - **Duration**: `3 months`
   - **Stipend**: `15000`
   - **Number of Openings**: `2`
   - **Required Skills**: `javascript, react, html, css`
   - **Optional Skills**: `typescript`
   - **Minimum CGPA**: `7.5`
   - **Eligible Degrees**: `B.Tech, B.Sc`
   - **Eligible Years**: `2, 3, 4`

7. **Click "Post Internship"**

8. You should see "Internship posted successfully!"

---

### Test 3: See Matching in Action

1. **Logout and login as student again:**
   - Email: `student@test.com`
   - Password: `student123`

2. **Click "Matched Internships" in sidebar** (should be selected by default)

3. **You should see the internship you created!**
   - Match percentage should be shown (likely 100%)
   - Green badges for matched skills (javascript, react)
   - The internship details

4. **Click "Apply Now"**

5. Confirm the application

6. You should see "Application submitted successfully!"

7. **Click "My Applications" in sidebar**

8. You should see your application with status "Pending"

---

### Test 4: Company Reviews Application

1. **Logout and login as company:**
   - Email: `company@test.com`
   - Password: `company123`

2. **Click "Applications" in sidebar**

3. **You should see the student's application:**
   - Student name: John Doe
   - Match %: Displayed
   - Status: Pending

4. **Click "Accept"** (green button)

5. The status should change to "Accepted"

6. **Click "My Internships" in sidebar**

7. **Click "View Matched Students"** on your internship

8. You should see a list of students who match your requirements

---

### Test 5: Admin Dashboard

1. **Logout and login as admin:**
   - Email: `admin@internmatch.com`
   - Password: `admin123`

2. **You should see the admin dashboard with:**
   - Total Users count
   - Students count
   - Companies count
   - Active Internships count
   - Total Applications
   - Accepted Applications

3. **Click "Users" in sidebar:**
   - Should show all registered users

4. **Click "Internships" in sidebar:**
   - Should show all posted internships

---

## 🔧 Troubleshooting

### Problem 1: "Port 5000 already in use"

**Solution:**

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with the PID number shown)
taskkill /PID XXXX /F

# Or change the port in backend\.env:
PORT=3000
```

---

### Problem 2: "Cannot connect to MongoDB" or "MongoServerError"

**For Local MongoDB:**

**Windows:**
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If it shows "Stopped", start it:
net start MongoDB

# If service doesn't exist, MongoDB might not be installed as a service
# Start MongoDB manually:
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe --dbpath="C:\data\db"
```

**Mac:**
```bash
# Check MongoDB status
brew services list | grep mongodb

# If not running, start it:
brew services start mongodb-community@7.0

# Or start manually:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
# Check status
sudo systemctl status mongod

# If not running, start it:
sudo systemctl start mongod

# Enable auto-start on boot:
sudo systemctl enable mongod
```

**Common Local MongoDB Issues:**

1. **"Data directory not found"**
   ```powershell
   # Windows: Create data directory
   mkdir C:\data\db
   ```
   
2. **Port 27017 already in use**
   ```powershell
   # Find what's using port 27017
   netstat -ano | findstr :27017
   
   # Kill the process (replace PID with actual number)
   taskkill /PID <PID> /F
   ```

3. **Permission denied**
   - Run PowerShell/Terminal as Administrator
   - Or change data directory permissions

**For MongoDB Atlas (Cloud):**

1. **Check connection string in `.env`**
   - Make sure it starts with `mongodb+srv://`
   - Verify username and password are correct (no special characters issues)
   
2. **Whitelist your IP address**
   - Go to Atlas Dashboard → Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for testing
   
3. **Check database user credentials**
   - Go to Atlas Dashboard → Database Access
   - Verify user exists and has read/write permissions

---

### Problem 3: "npm: cannot be loaded"

**Solution:**

```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### Problem 4: Page shows "Cannot GET /"

**This means the server isn't running.**

**Solution:**
1. Go back to your PowerShell where server is running
2. If it crashed, restart: `npm start`
3. Wait for "Server running" message
4. Refresh browser

---

### Problem 5: "Login failed" or "Invalid credentials"

**Make sure:**
- You registered the account first
- Email and password are typed correctly
- Check browser console (F12) for error messages

---

### Problem 6: "No matched internships" for student

**Reasons:**
- Student profile not complete (add skills!)
- No internships posted yet (login as company and post one)
- Skills don't match (add skills that match the internship requirements)
- CGPA too low (check internship requirements)

---

## ⏹️ Stopping the Application

### Stop the Server

In the PowerShell/Terminal where the server is running:

1. Press `Ctrl + C`
2. Type `Y` if asked
3. You should see the command prompt return

**The application is now stopped.**

---

## 🔄 Restarting the Application

**Next time you want to run it:**

```powershell
# Navigate to project (if not already there)
cd "c:\Users\phani\OneDrive\Documents\Projects\Smart Internship Checker"

# Run the start script
.\start.bat

# OR manually:
cd backend
npm start
```

**No need to run `npm install` again** (unless you delete `node_modules` folder)

---

## 📊 Quick Reference

### URLs
- **Landing Page**: http://localhost:5000
- **Login**: http://localhost:5000/login.html
- **Register**: http://localhost:5000/register.html
- **Student Dashboard**: http://localhost:5000/student-dashboard.html
- **Company Dashboard**: http://localhost:5000/company-dashboard.html
- **Admin Dashboard**: http://localhost:5000/admin-dashboard.html
- **API Health Check**: http://localhost:5000/api/health

### Test Credentials
- **Student**: student@test.com / student123
- **Company**: company@test.com / company123
- **Admin**: admin@internmatch.com / admin123

### Folder Structure
```
Smart Internship Checker/
├── backend/          ← Backend server code
│   ├── server.js     ← Main entry point
│   ├── .env          ← Configuration
│   └── package.json  ← Dependencies
├── public/           ← Frontend files
│   ├── index.html    ← Landing page
│   ├── css/          ← Stylesheets
│   └── js/           ← JavaScript
├── start.bat         ← Quick start script
├── README.md         ← Project overview
├── SETUP.md          ← Installation guide
└── RUN_GUIDE.md      ← This file!
```

### Common Commands
```powershell
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## ✅ Checklist - Did Everything Work?

Use this checklist to verify your setup:

- [ ] Node.js installed and verified
- [ ] MongoDB running (Atlas or Local)
- [ ] `npm install` completed successfully
- [ ] Server starts without errors
- [ ] Can access http://localhost:5000
- [ ] Landing page displays correctly
- [ ] Can register as student
- [ ] Can register as company
- [ ] Admin account created
- [ ] Student can complete profile
- [ ] Company can post internship
- [ ] Student sees matched internships
- [ ] Student can apply to internship
- [ ] Company can see applications
- [ ] Company can accept/reject applications
- [ ] Admin dashboard shows statistics

**If all boxes are checked: 🎉 Congratulations! Everything is working perfectly!**

---

## 🆘 Still Having Issues?

1. **Check the error message** - Read what it says carefully
2. **Check browser console** - Press F12 in browser, look for errors in Console tab
3. **Check server terminal** - Look for error messages where server is running
4. **Restart everything**:
   - Stop server (Ctrl + C)
   - Close browser
   - Restart server (`npm start`)
   - Open browser again
5. **Review the SETUP.md** file for more detailed troubleshooting
6. **Check the audit-report.md** for known issues

---

## 🎓 Learning Path

After successfully running the application, you can:

1. **Explore the code**:
   - Backend: `backend/controllers/` - Business logic
   - Frontend: `public/js/` - Client-side code
   - Models: `backend/models/` - Database schemas

2. **Modify and experiment**:
   - Change colors in `public/css/main.css`
   - Add new fields to models
   - Create new API endpoints

3. **Add features**:
   - Email notifications
   - File uploads for resumes
   - Advanced search filters
   - Real-time chat

---

## 📚 Additional Resources

- **Project README**: `README.md`
- **Setup Guide**: `SETUP.md`
- **Walkthrough**: Check artifacts folder
- **Audit Report**: Check artifacts folder
- **Sample Data**: `test-data/sample-data.json`

---

**🎉 You're all set! Enjoy using the Student Skill & Internship Matching Portal!**

---

*Last Updated: February 14, 2026*  
*Version: 1.0.0*  
*For support, check the documentation files in the project root.*
