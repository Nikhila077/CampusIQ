import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

// Seed demo opportunities if collection is empty
const SAMPLE_OPPORTUNITIES = [
  {
    title: 'Google Summer of Code (GSoC) 2026',
    type: 'fellowship',
    provider: 'Google Open Source',
    description: 'Global program focused on introducing students to open source software development. Work with open source organizations on 12-week programming projects.',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    eligibility: 'Enrolled undergraduate or postgraduate student in computer science or related discipline.',
    applyLink: 'https://summerofcode.withgoogle.com',
    tags: ['Open Source', 'Git', 'Python', 'JavaScript', 'C++'],
    isVerified: true
  },
  {
    title: 'Microsoft Explore Internship',
    type: 'internship',
    provider: 'Microsoft',
    description: 'Rotational 12-week summer internship program for undergraduate students interested in software engineering and program management.',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    eligibility: '1st or 2nd year undergraduate students in STEM disciplines.',
    applyLink: 'https://careers.microsoft.com',
    tags: ['Software Engineering', 'DSA', 'Problem Solving', 'Python', 'Java'],
    isVerified: true
  },
  {
    title: 'Smart India Hackathon (SIH) 2026',
    type: 'hackathon',
    provider: 'Ministry of Education & AICTE',
    description: 'National initiative providing students a platform to solve pressing problems of ministries, departments, industries and other organizations.',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    eligibility: 'Teams of 6 college students (at least 1 female team member).',
    applyLink: 'https://sih.gov.in',
    tags: ['Hackathon', 'Web Development', 'AI/ML', 'IoT', 'Mobile Apps'],
    isVerified: true
  },
  {
    title: 'Reliance Foundation Undergraduate Scholarship',
    type: 'scholarship',
    provider: 'Reliance Foundation',
    description: 'Merit-cum-means scholarship supporting exceptional undergraduate students throughout their degree program with financial grant and mentoring.',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    eligibility: '1st year full-time undergraduate students with household income under threshold.',
    applyLink: 'https://scholarships.reliancefoundation.org',
    tags: ['Scholarship', 'Undergraduate', 'Financial Aid', 'Merit'],
    isVerified: true
  },
  {
    title: 'ACM ICPC Regional Contest',
    type: 'competition',
    provider: 'International Collegiate Programming Contest',
    description: 'Prestigious algorithmic programming contest for college students worldwide, testing problem solving, data structures, and speed.',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    eligibility: 'Teams of 3 students from the same university/college.',
    applyLink: 'https://icpc.global',
    tags: ['Competitive Programming', 'DSA', 'Algorithms', 'C++', 'Java'],
    isVerified: true
  }
];

/**
 * @desc    Browse opportunities with filtering and student relevance matching
 * @route   GET /api/opportunities
 * @access  Private
 */
export const getOpportunities = async (req, res, next) => {
  try {
    const count = await Opportunity.countDocuments();
    if (count === 0) {
      await Opportunity.insertMany(SAMPLE_OPPORTUNITIES);
    }

    const { type, search, tag } = req.query;
    const filter = {};

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { provider: regex }, { description: regex }, { tags: regex }];
    }

    const opportunities = await Opportunity.find(filter)
      .populate('postedBy', 'name email college')
      .sort({ deadline: 1, createdAt: -1 });

    // Personalize relevance for authenticated student
    const student = await User.findById(req.user._id);
    const studentSkills = (student?.skills || []).map((s) => s.toLowerCase());

    const enriched = opportunities.map((opp) => {
      const oppObj = opp.toObject();
      let matchCount = 0;
      const matchedTags = [];

      for (const t of opp.tags || []) {
        if (studentSkills.includes(t.toLowerCase())) {
          matchCount++;
          matchedTags.push(t);
        }
      }

      let relevanceScore = 50; // base score
      if (opp.tags && opp.tags.length > 0) {
        relevanceScore = Math.min(
          98,
          Math.max(40, Math.round(50 + (matchCount / opp.tags.length) * 45))
        );
      }

      return {
        ...oppObj,
        relevanceScore,
        matchedTags
      };
    });

    // Sort by relevance score desc if no specific search query
    if (!search && !type) {
      enriched.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    return sendSuccess(res, 200, 'Opportunities fetched.', {
      opportunities: enriched,
      total: enriched.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Post a new opportunity
 * @route   POST /api/opportunities
 * @access  Private
 */
export const createOpportunity = async (req, res, next) => {
  try {
    const { title, type, provider, description, deadline, eligibility, applyLink, tags } = req.body;

    if (!title || !type || !provider) {
      return sendError(res, 400, 'Title, type, and provider are required.');
    }

    const opportunity = await Opportunity.create({
      title: title.trim(),
      type,
      provider: provider.trim(),
      description: description ? description.trim() : '',
      deadline: deadline ? new Date(deadline) : null,
      eligibility: eligibility ? eligibility.trim() : '',
      applyLink: applyLink ? applyLink.trim() : '',
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
      postedBy: req.user._id,
      isVerified: false
    });

    return sendSuccess(res, 201, 'Opportunity posted successfully.', { opportunity });
  } catch (error) {
    next(error);
  }
};
