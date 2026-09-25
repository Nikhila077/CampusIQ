import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './src/app.js';
import User from './src/models/User.js';

const runTests = async () => {
  console.log('==================================================');
  console.log(' Starting CampusIQ Gamification & Reminders Verification');
  console.log('==================================================\n');

  let server;
  try {
    // 1. Database Connection
    console.log('[Test 1] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ [Test 1 Passed] Connected to MongoDB Atlas:', mongoose.connection.name);

    // Start ephemeral server
    const port = 5055;
    await new Promise((resolve) => {
      server = app.listen(port, () => {
        console.log(`[Test Server] Running on http://localhost:${port}`);
        resolve();
      });
    });

    const baseUrl = `http://localhost:${port}`;

    // 2. Health Check
    console.log('\n[Test 2] Health Endpoint /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status !== 200 || healthJson.status !== 'OK') {
      throw new Error(`Health check failed: ${JSON.stringify(healthJson)}`);
    }
    console.log('✅ [Test 2 Passed] Server is healthy (HTTP 200)');

    // 3. Demo Student Login
    console.log('\n[Test 3] Authenticating Demo Student (Alex Johnson)...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@campusiq.edu', password: 'password123' })
    });
    const loginJson = await loginRes.json();
    if (loginRes.status !== 200 || !loginJson.success) {
      throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);
    }
    const token = loginJson.data.token;
    console.log(`✅ [Test 3 Passed] Logged in as ${loginJson.data.user.name} (${loginJson.data.user.email})`);

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    // 4. Gamification Summary
    console.log('\n[Test 4] Fetching Gamification Summary...');
    const gameRes = await fetch(`${baseUrl}/api/gamification/summary`, { headers: authHeaders });
    const gameJson = await gameRes.json();
    if (gameRes.status !== 200 || !gameJson.success) {
      throw new Error(`Gamification summary failed: ${JSON.stringify(gameJson)}`);
    }
    const { xp, level, currentStreak } = gameJson.data;
    console.log(`✅ [Test 4 Passed] Gamification active: Level ${level} • ${xp} XP • ${currentStreak}d Streak 🔥`);

    // 5. Daily Brain Boost
    console.log('\n[Test 5] Fetching Today\'s Brain Boost Question...');
    const boostRes = await fetch(`${baseUrl}/api/brain-boost/today`, { headers: authHeaders });
    const boostJson = await boostRes.json();
    if (boostRes.status !== 200 || !boostJson.success) {
      throw new Error(`Brain boost retrieval failed: ${JSON.stringify(boostJson)}`);
    }
    const question = boostJson.data.question;
    if (!question) {
      throw new Error('No question returned for today');
    }
    console.log(`✅ [Test 5 Passed] Question: "${question.question}" [Category: ${question.category}]`);

    // 6. Submit Brain Boost Answer
    console.log('\n[Test 6] Submitting Answer to Daily Brain Boost...');
    const answerRes = await fetch(`${baseUrl}/api/brain-boost/answer`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ questionId: question._id, selectedOption: 1 })
    });
    const answerJson = await answerRes.json();
    if (answerRes.status !== 200 || !answerJson.success) {
      throw new Error(`Brain boost submission failed: ${JSON.stringify(answerJson)}`);
    }
    console.log(`✅ [Test 6 Passed] Result: ${answerJson.data.correct ? 'Correct' : 'Evaluated'} - XP: +${answerJson.data.xpAwarded || 0}`);

    // 7. Smart Reminders & In-App Notifications
    console.log('\n[Test 7] Synchronizing Smart Reminders...');
    const notifRes = await fetch(`${baseUrl}/api/notifications`, { headers: authHeaders });
    const notifJson = await notifRes.json();
    if (notifRes.status !== 200 || !notifJson.success) {
      throw new Error(`Notification fetch failed: ${JSON.stringify(notifJson)}`);
    }
    const { notifications, unreadCount } = notifJson.data;
    console.log(`✅ [Test 7 Passed] Reminders synchronized: ${notifications.length} notifications (${unreadCount} unread)`);
    if (notifications.length > 0) {
      console.log(`   Sample alert: [${notifications[0].severity}] ${notifications[0].title}: ${notifications[0].message}`);
    }

    // 8. Mark Notification Read
    if (notifications.length > 0) {
      console.log('\n[Test 8] Marking notification as read...');
      const readRes = await fetch(`${baseUrl}/api/notifications/${notifications[0]._id}/read`, {
        method: 'PUT',
        headers: authHeaders
      });
      const readJson = await readRes.json();
      if (readRes.status !== 200 || !readJson.success) {
        throw new Error(`Mark read failed: ${JSON.stringify(readJson)}`);
      }
      console.log(`✅ [Test 8 Passed] Notification marked read. New unread count: ${readJson.data.unreadCount}`);
    }

    // 9. Planner Task Completion XP
    console.log('\n[Test 9] Logging Planner Task Completion (+5 XP)...');
    const actionRes = await fetch(`${baseUrl}/api/gamification/action`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ actionType: 'planner_task', extraData: { taskId: 'test_task_1' } })
    });
    const actionJson = await actionRes.json();
    if (actionRes.status !== 200 || !actionJson.success) {
      throw new Error(`Gamification action failed: ${JSON.stringify(actionJson)}`);
    }
    console.log(`✅ [Test 9 Passed] Action logged! New Total XP: ${actionJson.data.newTotalXp}`);

    // 10. New Student Clean Slate / Tenant Isolation
    console.log('\n[Test 10] Testing New Registration Clean Slate & Data Isolation...');
    const freshEmail = `test.fresh.${Date.now()}@campusiq.edu`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fresh Student',
        email: freshEmail,
        password: 'password123',
        college: 'Test College',
        branch: 'CSE',
        year: 1,
        semester: 1
      })
    });
    const regJson = await regRes.json();
    if (regRes.status !== 201 || !regJson.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regJson)}`);
    }
    const freshToken = regJson.data.token;
    const freshHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${freshToken}`
    };

    // Verify fresh student has 0 subjects and 0 streak
    const freshSubRes = await fetch(`${baseUrl}/api/subjects`, { headers: freshHeaders });
    const freshSubJson = await freshSubRes.json();
    if (freshSubJson.data.subjects.length !== 0) {
      throw new Error('Fresh student has leaked subjects from demo user!');
    }

    const freshGameRes = await fetch(`${baseUrl}/api/gamification/summary`, { headers: freshHeaders });
    const freshGameJson = await freshGameRes.json();
    if (freshGameJson.data.xp !== 0 || freshGameJson.data.currentStreak !== 0) {
      throw new Error('Fresh student has leaked gamification stats!');
    }

    console.log('✅ [Test 10 Passed] Fresh user completely isolated: 0 subjects, 0 XP, 0 streak.');

    // Cleanup fresh user
    await User.findByIdAndDelete(regJson.data.user._id);

    console.log('\n==================================================');
    console.log(' ALL 10 TESTS PASSED CLEANLY WITH ZERO ERRORS! 🚀');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ [Test Error]:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runTests();
