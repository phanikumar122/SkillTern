const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // No need for useNewUrlParser and useUnifiedTopology in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create indexes
    await createIndexes();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create indexes for better query performance
const createIndexes = async () => {
  try {
    const User = require('../models/User');
    const Student = require('../models/Student');
    const Company = require('../models/Company');
    const Internship = require('../models/Internship');
    const Application = require('../models/Application');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });

    // Student indexes
    await Student.collection.createIndex({ userId: 1 }, { unique: true });
    await Student.collection.createIndex({ skills: 1 });

    // Company indexes
    await Company.collection.createIndex({ userId: 1 }, { unique: true });

    // Internship indexes
    await Internship.collection.createIndex({ companyId: 1 });
    await Internship.collection.createIndex({ requiredSkills: 1 });
    await Internship.collection.createIndex({ status: 1 });

    // Application indexes
    await Application.collection.createIndex({ studentId: 1, internshipId: 1 }, { unique: true });
    await Application.collection.createIndex({ status: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.log('Indexes may already exist or error creating them:', error.message);
  }
};

module.exports = connectDB;
