import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const ROLE_DEFINITIONS = {
  'Software Engineer': {
    description: 'Core software engineering focusing on problem solving, data structures, and computer science fundamentals.',
    coreSkills: ['DSA', 'OOP', 'DBMS', 'Git', 'Java', 'Python', 'Operating Systems', 'Computer Networks'],
    recommendedProjects: ['Algorithms Visualizer', 'Distributed Cache', 'CLI Tool']
  },
  'Frontend Developer': {
    description: 'User interface development, interactive web applications, and state management.',
    coreSkills: ['JavaScript', 'React', 'HTML/CSS', 'Tailwind CSS', 'TypeScript', 'Git', 'REST APIs'],
    recommendedProjects: ['Responsive Dashboard', 'E-Commerce Frontend', 'Design System Library']
  },
  'Backend Developer': {
    description: 'Server architecture, API design, database modeling, and microservices.',
    coreSkills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git', 'Docker', 'System Design'],
    recommendedProjects: ['Authentication Microservice', 'Real-Time Chat Backend', 'Scalable Task Queue']
  },
  'Full Stack Developer': {
    description: 'End-to-end web product engineering from UI components to database schemas.',
    coreSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'Git', 'HTML/CSS', 'REST APIs'],
    recommendedProjects: ['SaaS Decision Platform', 'Collaborative Workspace', 'Marketplace Application']
  },
  'Data Analyst': {
    description: 'Transforming data into insights, building business intelligence dashboards, and SQL reporting.',
    coreSkills: ['Python', 'SQL', 'Pandas', 'Data Cleaning', 'Statistics', 'Power BI', 'Excel'],
    recommendedProjects: ['Sales Forecasting Dashboard', 'Customer Churn Analysis', 'Automated ETL Pipeline']
  },
  'ML Engineer': {
    description: 'Building, training, evaluating, and deploying machine learning models.',
    coreSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Statistics', 'Pandas', 'Scikit-learn', 'Git'],
    recommendedProjects: ['Computer Vision Classifier', 'NLP Sentiment Analyzer', 'Recommendation Engine']
  }
};

/**
 * @desc    Get career readiness metrics for current student
 * @route   GET /api/career/readiness
 * @access  Private
 */
export const getReadiness = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    const currentRole = user.targetRole || 'Software Engineer';
    const studentSkills = (user.skills || []).map((s) => s.trim().toLowerCase());

    const roleData = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS['Software Engineer'];
    const coreSkills = roleData.coreSkills;

    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of coreSkills) {
      const isMatched = studentSkills.some(
        (s) => s.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(s.toLowerCase())
      );
      if (isMatched) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const readinessScore =
      coreSkills.length > 0 ? Math.round((matchedSkills.length / coreSkills.length) * 100) : 0;

    return sendSuccess(res, 200, 'Career readiness metrics computed.', {
      targetRole: currentRole,
      availableRoles: Object.keys(ROLE_DEFINITIONS),
      roleDescription: roleData.description,
      studentSkills: user.skills || [],
      matchedSkills,
      missingSkills,
      readinessScore,
      totalCoreSkills: coreSkills.length,
      recommendedProjects: roleData.recommendedProjects,
      disclaimer:
        'Readiness percentage measures syllabus and skill inventory coverage. It provides direction for self-study and does not guarantee job placement or interview outcomes.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update target career role and skills
 * @route   PUT /api/career/target
 * @access  Private
 */
export const updateTarget = async (req, res, next) => {
  try {
    const { targetRole, skills, interests } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    if (targetRole !== undefined) user.targetRole = targetRole.trim();
    if (skills !== undefined && Array.isArray(skills)) {
      user.skills = skills.map((s) => s.trim()).filter(Boolean);
    }
    if (interests !== undefined && Array.isArray(interests)) {
      user.interests = interests.map((i) => i.trim()).filter(Boolean);
    }

    await user.save();
    return sendSuccess(res, 200, 'Career preferences updated.', { user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};
