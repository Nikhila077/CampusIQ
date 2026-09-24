import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const seedStudent = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected successfully to database:', mongoose.connection.name);

    const demoEmail = 'student@campusiq.edu';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      console.log(`[Seed] Sample user already exists: ${demoEmail}`);
      console.log('[Seed] You can log in using:');
      console.log(`  Email:    ${demoEmail}`);
      console.log(`  Password: password123`);
    } else {
      const newUser = new User({
        name: 'Alex Johnson',
        email: demoEmail,
        password: 'password123',
        college: 'Apex Institute of Technology',
        branch: 'Computer Science & Engineering',
        year: 3,
        semester: 6,
        rollNumber: 'CS2026042'
      });

      await newUser.save();
      console.log('[Seed] Sample student account created successfully in MongoDB Atlas!');
      console.log('--------------------------------------------------');
      console.log(' Credentials for Login:');
      console.log(`  Email:       ${newUser.email}`);
      console.log('  Password:    password123');
      console.log(`  Name:        ${newUser.name}`);
      console.log(`  College:     ${newUser.college}`);
      console.log(`  Branch:      ${newUser.branch}`);
      console.log(`  Roll Number: ${newUser.rollNumber}`);
      console.log('--------------------------------------------------');
    }

    await mongoose.disconnect();
    console.log('[Seed] Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed user:', error.message);
    process.exit(1);
  }
};

seedStudent();
