import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Attendance from './models/Attendance.js';
import Assignment from './models/Assignment.js';
import Exam from './models/Exam.js';
import Mark from './models/Mark.js';
import Timetable from './models/Timetable.js';
import Opportunity from './models/Opportunity.js';
import Project from './models/Project.js';
import BrainBoostQuestion from './models/BrainBoostQuestion.js';
import DailyActivity from './models/DailyActivity.js';
import { getTodayDateString } from './services/gamificationService.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected successfully to database:', mongoose.connection.name);

    // 1. Seed Questions Pool
    console.log('[Seed] Seeding Brain Boost questions pool...');
    const questions = [
      {
        question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        category: 'DSA',
        difficulty: 'medium',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, the height of the tree is bounded by O(log n), making search, insertion, and deletion operations take logarithmic time.',
        targetRoles: ['Software Engineer', 'Backend Developer', 'ML Engineer']
      },
      {
        question: 'Which SQL clause is used to filter grouped rows after an aggregation like GROUP BY?',
        category: 'SQL',
        difficulty: 'easy',
        options: ['WHERE', 'ORDER BY', 'HAVING', 'FILTER'],
        correctAnswer: 2,
        explanation: 'The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions like COUNT(), SUM(), AVG().',
        targetRoles: ['Software Engineer', 'Backend Developer', 'Data Analyst']
      },
      {
        question: 'In Object-Oriented Programming, which principle focuses on exposing only essential features while hiding background details?',
        category: 'OOP',
        difficulty: 'easy',
        options: ['Inheritance', 'Abstraction', 'Polymorphism', 'Composition'],
        correctAnswer: 1,
        explanation: 'Abstraction simplifies complex reality by modeling classes appropriate to the problem, and working at the most relevant level of inheritance.',
        targetRoles: ['Software Engineer', 'Frontend Developer', 'Backend Developer']
      },
      {
        question: 'Which ACID property guarantees that multiple concurrent transactions occur without leading to database inconsistency?',
        category: 'DBMS',
        difficulty: 'medium',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswer: 2,
        explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially.',
        targetRoles: ['Backend Developer', 'Software Engineer', 'Data Analyst']
      },
      {
        question: 'In Python, what is the output of `bool([])`, `bool({})`, and `bool("")`?',
        category: 'Python',
        difficulty: 'easy',
        options: ['True, True, True', 'False, False, False', 'False, True, False', 'Error'],
        correctAnswer: 1,
        explanation: 'In Python, empty sequences and collections (such as empty lists, dictionaries, strings, sets, and tuples) evaluate to falsy values in boolean context.',
        targetRoles: ['Software Engineer', 'ML Engineer', 'Data Analyst']
      },
      {
        question: 'What is the worst-case time complexity of QuickSort when a naive pivot selection is used on an already sorted array?',
        category: 'DSA',
        difficulty: 'medium',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
        correctAnswer: 2,
        explanation: 'When naive pivot (e.g. first or last element) is chosen on already sorted data, the partition divides into 0 and n-1 elements, yielding an O(n^2) worst case.',
        targetRoles: ['Software Engineer', 'Backend Developer']
      },
      {
        question: 'In React, which hook should be used to memoize the result of an expensive calculation?',
        category: 'Web Tech',
        difficulty: 'medium',
        options: ['useCallback', 'useEffect', 'useMemo', 'useRef'],
        correctAnswer: 2,
        explanation: 'useMemo caches the result of a calculation between re-renders, whereas useCallback memoizes a callback function definition.',
        targetRoles: ['Frontend Developer', 'Software Engineer']
      },
      {
        question: 'Which normal form eliminates partial functional dependencies on a composite primary key?',
        category: 'DBMS',
        difficulty: 'medium',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correctAnswer: 1,
        explanation: '2NF requires a table to be in 1NF and have all non-prime attributes fully functionally dependent on the entire candidate key.',
        targetRoles: ['Backend Developer', 'Software Engineer', 'Data Analyst']
      }
    ];

    for (const q of questions) {
      await BrainBoostQuestion.findOneAndUpdate(
        { question: q.question },
        { ...q, isActive: true },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${questions.length} Brain Boost questions.`);

    // 2. Seed Alex Johnson Demo User
    const demoEmail = 'student@campusiq.edu';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = new User({
        name: 'Alex Johnson',
        email: demoEmail,
        password: 'password123',
        college: 'Apex Institute of Technology',
        branch: 'Computer Science & Engineering',
        year: 3,
        semester: 6,
        rollNumber: 'CS2026042',
        targetRole: 'Software Engineer',
        skills: ['Python', 'Java', 'SQL', 'React', 'DSA', 'DBMS', 'Git'],
        interests: ['Artificial Intelligence', 'Web Development', 'System Architecture'],
        xp: 240,
        level: 3,
        currentStreak: 7,
        longestStreak: 7,
        lastActiveDate: getTodayDateString(),
        notificationPreferences: {
          attendanceWarnings: true,
          assignmentReminders: true,
          examReminders: true,
          plannerReminders: true,
          dailyBrainBoost: true,
          emailAlerts: true,
          desktopAlerts: false
        }
      });
      await demoUser.save();
      console.log(`[Seed] Created demo user: ${demoEmail}`);
    } else {
      demoUser.name = 'Alex Johnson';
      demoUser.college = 'Apex Institute of Technology';
      demoUser.branch = 'Computer Science & Engineering';
      demoUser.year = 3;
      demoUser.semester = 6;
      demoUser.rollNumber = 'CS2026042';
      demoUser.targetRole = 'Software Engineer';
      demoUser.skills = ['Python', 'Java', 'SQL', 'React', 'DSA', 'DBMS', 'Git'];
      demoUser.interests = ['Artificial Intelligence', 'Web Development', 'System Architecture'];
      demoUser.xp = 240;
      demoUser.level = 3;
      demoUser.currentStreak = 7;
      demoUser.longestStreak = 7;
      demoUser.lastActiveDate = getTodayDateString();
      await demoUser.save();
      console.log(`[Seed] Updated demo user profile: ${demoEmail}`);
    }

    const userId = demoUser._id;

    // 3. Seed Subjects with exact target attendance numbers
    console.log('[Seed] Seeding subjects for Alex Johnson...');
    const subjectConfigs = [
      {
        name: 'Artificial Intelligence',
        code: 'CS601',
        faculty: 'Dr. Aris Vance',
        minAttendancePercent: 75,
        priority: 'high',
        semester: 6,
        credits: 4,
        conducted: 25,
        attended: 21 // 21/25 = 84% (Safe, buffer: 3)
      },
      {
        name: 'Database Management Systems',
        code: 'CS602',
        faculty: 'Prof. Sarah Jenkins',
        minAttendancePercent: 75,
        priority: 'high',
        semester: 6,
        credits: 4,
        conducted: 28,
        attended: 22 // 22/28 = 78.5% (Safe, buffer: 1)
      },
      {
        name: 'Operating Systems',
        code: 'CS603',
        faculty: 'Prof. David Thorne',
        minAttendancePercent: 75,
        priority: 'high',
        semester: 6,
        credits: 4,
        conducted: 27,
        attended: 20 // 20/27 = 74.07% (At Risk! Needs 2 classes to recover 75%)
      },
      {
        name: 'Web Technologies',
        code: 'CS604',
        faculty: 'Dr. Maya Lin',
        minAttendancePercent: 75,
        priority: 'medium',
        semester: 6,
        credits: 3,
        conducted: 22,
        attended: 20 // 20/22 = 90.9% (Safe, buffer: 4)
      },
      {
        name: 'Machine Learning Lab',
        code: 'CS605L',
        faculty: 'Prof. Nathan Reed',
        minAttendancePercent: 75,
        priority: 'medium',
        semester: 6,
        credits: 2,
        conducted: 16,
        attended: 14 // 14/16 = 87.5% (Safe, buffer: 2)
      }
    ];

    const subjectMap = {};
    for (const sc of subjectConfigs) {
      let sub = await Subject.findOne({ userId, code: sc.code });
      if (!sub) {
        sub = await Subject.create({
          userId,
          name: sc.name,
          code: sc.code,
          faculty: sc.faculty,
          minAttendancePercent: sc.minAttendancePercent,
          priority: sc.priority,
          semester: sc.semester,
          credits: sc.credits
        });
      } else {
        sub.name = sc.name;
        sub.minAttendancePercent = sc.minAttendancePercent;
        sub.priority = sc.priority;
        await sub.save();
      }
      subjectMap[sc.name] = sub;

      // Populate exact attendance records
      await Attendance.deleteMany({ userId, subjectId: sub._id });
      const attendanceDocs = [];
      for (let i = 1; i <= sc.conducted; i++) {
        const isPresent = i <= sc.attended;
        const dateObj = new Date(Date.now() - (sc.conducted - i) * 24 * 60 * 60 * 1000);
        attendanceDocs.push({
          userId,
          subjectId: sub._id,
          date: dateObj,
          status: isPresent ? 'present' : 'absent',
          classNumber: i,
          remarks: isPresent ? 'Attended' : 'Absence recorded'
        });
      }
      if (attendanceDocs.length > 0) {
        await Attendance.insertMany(attendanceDocs);
      }
    }
    console.log('[Seed] Populated subjects and attendance records successfully.');

    // 4. Seed Assignments
    console.log('[Seed] Seeding assignments...');
    await Assignment.deleteMany({ userId });
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await Assignment.create([
      {
        userId,
        subjectId: subjectMap['Database Management Systems']._id,
        title: 'DBMS Normalization & B+ Trees',
        description: 'Complete normalization problem set up to BCNF and draw B+ Tree index insertion diagrams.',
        dueDate: tomorrow,
        status: 'pending',
        priority: 'high'
      },
      {
        userId,
        subjectId: subjectMap['Artificial Intelligence']._id,
        title: 'AI Mini Project Milestone 1',
        description: 'Implement A* search algorithm with Manhattan distance heuristic on 8-puzzle problem.',
        dueDate: in5Days,
        status: 'pending',
        priority: 'medium'
      },
      {
        userId,
        subjectId: subjectMap['Web Technologies']._id,
        title: 'React Dashboard Component System',
        description: 'Develop responsive React analytics widget system with Tailwind styling.',
        dueDate: yesterday,
        status: 'submitted',
        priority: 'medium',
        submittedAt: yesterday,
        grade: 'A+'
      }
    ]);

    // 5. Seed Exams
    console.log('[Seed] Seeding exams...');
    await Exam.deleteMany({ userId });
    await Exam.create([
      {
        userId,
        subjectId: subjectMap['Database Management Systems']._id,
        examType: 'midterm',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        startTime: '10:00 AM',
        venue: 'Hall B-204',
        syllabus: 'ER Modeling, Relational Algebra, SQL DDL/DML, 1NF to BCNF'
      },
      {
        userId,
        subjectId: subjectMap['Artificial Intelligence']._id,
        examType: 'midterm',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        startTime: '02:00 PM',
        venue: 'Auditorium Block A',
        syllabus: 'Uninformed & Informed Search, Heuristics, Adversarial Search & Minimax'
      },
      {
        userId,
        subjectId: subjectMap['Operating Systems']._id,
        examType: 'midterm',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        startTime: '10:00 AM',
        venue: 'Hall C-101',
        syllabus: 'Processes, Threads, CPU Scheduling, Deadlock Prevention & Avoidance'
      }
    ]);

    // 6. Seed Marks
    console.log('[Seed] Seeding marks...');
    await Mark.deleteMany({ userId });
    await Mark.create([
      {
        userId,
        subjectId: subjectMap['Artificial Intelligence']._id,
        examType: 'quiz',
        marksObtained: 18,
        totalMarks: 20,
        percentage: 90,
        grade: 'A+',
        semester: 6,
        remarks: 'Excellent grasp of search strategies'
      },
      {
        userId,
        subjectId: subjectMap['Database Management Systems']._id,
        examType: 'quiz',
        marksObtained: 15,
        totalMarks: 20,
        percentage: 75,
        grade: 'B',
        semester: 6,
        remarks: 'Review SQL subqueries and join syntax'
      },
      {
        userId,
        subjectId: subjectMap['Operating Systems']._id,
        examType: 'quiz',
        marksObtained: 12,
        totalMarks: 20,
        percentage: 60,
        grade: 'C',
        semester: 6,
        remarks: 'Needs improvement in deadlock avoidance formulas'
      },
      {
        userId,
        subjectId: subjectMap['Web Technologies']._id,
        examType: 'practical',
        marksObtained: 19,
        totalMarks: 20,
        percentage: 95,
        grade: 'A+',
        semester: 6,
        remarks: 'Outstanding UI implementation and clean code'
      }
    ]);

    // 7. Seed Timetable
    console.log('[Seed] Seeding weekly timetable...');
    await Timetable.deleteMany({ userId });
    const timetableEntries = [
      { dayOfWeek: 'mon', startTime: '09:00', endTime: '10:00', subject: 'Operating Systems', room: 'LHC-101' },
      { dayOfWeek: 'mon', startTime: '10:15', endTime: '11:15', subject: 'Database Management Systems', room: 'LHC-102' },
      { dayOfWeek: 'mon', startTime: '11:30', endTime: '12:30', subject: 'Artificial Intelligence', room: 'LHC-103' },
      { dayOfWeek: 'mon', startTime: '14:00', endTime: '16:00', subject: 'Machine Learning Lab', room: 'Lab 4' },

      { dayOfWeek: 'tue', startTime: '09:00', endTime: '10:00', subject: 'Web Technologies', room: 'LHC-201' },
      { dayOfWeek: 'tue', startTime: '10:15', endTime: '11:15', subject: 'Operating Systems', room: 'LHC-101' },
      { dayOfWeek: 'tue', startTime: '11:30', endTime: '12:30', subject: 'Database Management Systems', room: 'LHC-102' },

      { dayOfWeek: 'wed', startTime: '09:00', endTime: '10:00', subject: 'Artificial Intelligence', room: 'LHC-103' },
      { dayOfWeek: 'wed', startTime: '10:15', endTime: '11:15', subject: 'Web Technologies', room: 'LHC-201' },

      { dayOfWeek: 'thu', startTime: '09:00', endTime: '10:00', subject: 'Operating Systems', room: 'LHC-101' },
      { dayOfWeek: 'thu', startTime: '10:15', endTime: '11:15', subject: 'Artificial Intelligence', room: 'LHC-103' },
      { dayOfWeek: 'thu', startTime: '11:30', endTime: '12:30', subject: 'Web Technologies', room: 'LHC-201' },

      { dayOfWeek: 'fri', startTime: '09:00', endTime: '11:00', subject: 'Machine Learning Lab', room: 'Lab 4' },
      { dayOfWeek: 'fri', startTime: '11:15', endTime: '12:15', subject: 'Database Management Systems', room: 'LHC-102' }
    ];

    for (const entry of timetableEntries) {
      const sub = subjectMap[entry.subject];
      if (sub) {
        await Timetable.create({
          userId,
          subjectId: sub._id,
          dayOfWeek: entry.dayOfWeek,
          startTime: entry.startTime,
          endTime: entry.endTime,
          room: entry.room,
          semester: 6
        });
      }
    }

    // 8. Seed Projects
    console.log('[Seed] Seeding projects...');
    await Project.deleteMany({ userId });
    await Project.create([
      {
        userId,
        title: 'AI Resume Analyzer',
        description: 'End-to-end intelligent platform that parses PDF resumes, calculates role matching scores, and provides ATS optimization feedback.',
        techStack: ['Python', 'FastAPI', 'React', 'Tailwind', 'NLP'],
        repoUrl: 'https://github.com/alex-dev/ai-resume-analyzer',
        liveUrl: 'https://resume-iq.demo.app',
        status: 'in-progress',
        isLookingForCollaborators: true,
        requiredSkills: ['React', 'Python', 'FastAPI'],
        teamSize: 2
      },
      {
        userId,
        title: 'Campus Event Platform',
        description: 'Collaborative student portal for discovering, registering, and ticketing college tech fests, workshops, and hackathons.',
        techStack: ['Node.js', 'Express', 'React', 'MongoDB', 'Tailwind'],
        repoUrl: 'https://github.com/alex-dev/campus-events',
        status: 'planning',
        isLookingForCollaborators: true,
        requiredSkills: ['Node.js', 'React'],
        teamSize: 3
      }
    ]);

    // 9. Seed Opportunities
    console.log('[Seed] Seeding opportunities...');
    await Opportunity.deleteMany({ postedBy: userId });
    await Opportunity.create([
      {
        title: 'AI / Machine Learning Summer Engineering Intern',
        type: 'internship',
        provider: 'Apex Cognitive Labs',
        description: 'Build predictive algorithms and generative AI integrations for student productivity workflows. Competitive stipend offered.',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: '3rd/4th year CSE/IT students with Python and ML fundamentals.',
        applyLink: 'https://internships.apexlabs.io/apply/cs2026',
        tags: ['Python', 'Machine Learning', 'AI', 'FastAPI'],
        postedBy: userId,
        isVerified: true
      },
      {
        title: 'HackCampus National Student Hackathon 2026',
        type: 'hackathon',
        provider: 'National Student Developer Network',
        description: '48-hour virtual hackathon solving EdTech, Healthcare, and FinTech challenges with industry mentors and cash prizes.',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        eligibility: 'All undergraduate engineering students.',
        applyLink: 'https://hackcampus2026.devpost.com',
        tags: ['Hackathon', 'React', 'Node.js', 'Full Stack'],
        postedBy: userId,
        isVerified: true
      },
      {
        title: 'Full-Stack Modern React & TypeScript Masterclass',
        type: 'workshop',
        provider: 'Frontend Guild',
        description: 'Live interactive weekend workshop on state management, architecture design patterns, and enterprise React.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eligibility: 'Open to all students interested in frontend engineering.',
        applyLink: 'https://frontendguild.org/workshops/react-mastery',
        tags: ['React', 'JavaScript', 'TypeScript', 'Web Tech'],
        postedBy: userId,
        isVerified: true
      }
    ]);

    // 10. Seed DailyActivity for today to establish 7-day streak
    const todayStr = getTodayDateString();
    await DailyActivity.findOneAndUpdate(
      { userId, date: todayStr },
      {
        userId,
        date: todayStr,
        completedActions: ['study_session', 'planner_task'],
        dailyGoal: 3,
        xpEarned: 15,
        brainBoostCompleted: false
      },
      { upsert: true }
    );

    console.log('==================================================');
    console.log(' [Seed Complete] Demo Data Loaded Successfully!');
    console.log(' Demo Account:');
    console.log('   Email:    student@campusiq.edu');
    console.log('   Password: password123');
    console.log('   Name:     Alex Johnson');
    console.log('   Level:    3 (240 XP)');
    console.log('   Streak:   7 Days 🔥');
    console.log('==================================================');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

// If run directly via CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    mongoose.disconnect();
    process.exit(0);
  });
}

export default seedDatabase;
