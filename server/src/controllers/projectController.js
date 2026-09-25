import Project from '../models/Project.js';
import ProjectRequest from '../models/ProjectRequest.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all student projects (with requester status if authenticated student has sent a request)
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = async (req, res, next) => {
  try {
    const { status, collaboratorsOnly, myProjects } = req.query;
    const filter = {};

    if (myProjects === 'true') {
      filter.userId = req.user._id;
    } else {
      if (status) filter.status = status;
      if (collaboratorsOnly === 'true') filter.isLookingForCollaborators = true;
    }

    const projects = await Project.find(filter)
      .populate('userId', 'name email college branch year rollNumber avatar')
      .sort({ createdAt: -1 });

    // Fetch student's existing requests
    const myRequests = await ProjectRequest.find({ requesterId: req.user._id });
    const requestMap = new Map();
    for (const r of myRequests) {
      requestMap.set(r.projectId.toString(), r);
    }

    // Attach student's interaction info
    const enriched = projects.map((p) => {
      const isOwner = p.userId?._id?.toString() === req.user._id.toString();
      const existingRequest = requestMap.get(p._id.toString());
      return {
        ...p.toObject(),
        isOwner,
        requestStatus: existingRequest ? existingRequest.status : null
      };
    });

    return sendSuccess(res, 200, 'Projects fetched.', { projects: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      techStack,
      repoUrl,
      liveUrl,
      status,
      isLookingForCollaborators,
      requiredSkills,
      teamSize
    } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, 400, 'Project title is required.');
    }

    const project = await Project.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      techStack: Array.isArray(techStack) ? techStack.map((s) => s.trim()).filter(Boolean) : [],
      repoUrl: repoUrl ? repoUrl.trim() : '',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      status: ['planning', 'in-progress', 'completed', 'paused'].includes(status)
        ? status
        : 'in-progress',
      isLookingForCollaborators: Boolean(isLookingForCollaborators),
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills.map((s) => s.trim()).filter(Boolean)
        : [],
      teamSize: teamSize ? Number(teamSize) : 1
    });

    const populated = await project.populate('userId', 'name email college branch');
    return sendSuccess(res, 201, 'Project created successfully.', { project: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project (owner only)
 * @route   PUT /api/projects/:id
 * @access  Private
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      techStack,
      repoUrl,
      liveUrl,
      status,
      isLookingForCollaborators,
      requiredSkills,
      teamSize
    } = req.body;

    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return sendError(res, 404, 'Project not found or you are not the owner.');
    }

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (techStack !== undefined && Array.isArray(techStack)) {
      project.techStack = techStack.map((s) => s.trim()).filter(Boolean);
    }
    if (repoUrl !== undefined) project.repoUrl = repoUrl.trim();
    if (liveUrl !== undefined) project.liveUrl = liveUrl.trim();
    if (status !== undefined && ['planning', 'in-progress', 'completed', 'paused'].includes(status)) {
      project.status = status;
    }
    if (isLookingForCollaborators !== undefined) {
      project.isLookingForCollaborators = Boolean(isLookingForCollaborators);
    }
    if (requiredSkills !== undefined && Array.isArray(requiredSkills)) {
      project.requiredSkills = requiredSkills.map((s) => s.trim()).filter(Boolean);
    }
    if (teamSize !== undefined) project.teamSize = Number(teamSize);

    await project.save();
    const populated = await project.populate('userId', 'name email college branch');

    return sendSuccess(res, 200, 'Project updated successfully.', { project: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project (owner only)
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!project) {
      return sendError(res, 404, 'Project not found or permission denied.');
    }

    // Clean up related requests
    await ProjectRequest.deleteMany({ projectId: id });

    return sendSuccess(res, 200, 'Project deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request to join a project as collaborator
 * @route   POST /api/projects/:id/request
 * @access  Private
 */
export const requestToJoin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return sendError(res, 404, 'Project not found.');
    }

    if (project.userId.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot send a collaboration request to your own project.');
    }

    if (!project.isLookingForCollaborators) {
      return sendError(res, 400, 'This project is currently not accepting collaborators.');
    }

    const existing = await ProjectRequest.findOne({
      projectId: id,
      requesterId: req.user._id
    });

    if (existing) {
      return sendError(res, 400, `You have already submitted a request (Status: ${existing.status}).`);
    }

    const request = await ProjectRequest.create({
      projectId: id,
      requesterId: req.user._id,
      message: message ? message.trim() : 'I would like to collaborate on this project.',
      status: 'pending'
    });

    return sendSuccess(res, 201, 'Collaboration request sent successfully.', { request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current student's sent collaboration requests
 * @route   GET /api/projects/my-requests
 * @access  Private
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await ProjectRequest.find({ requesterId: req.user._id })
      .populate('projectId', 'title description techStack status userId')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Sent collaboration requests fetched.', { requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get requests for a project (owner only)
 * @route   GET /api/projects/:id/requests
 * @access  Private
 */
export const getProjectRequests = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return sendError(res, 404, 'Project not found or you are not the owner.');
    }

    const requests = await ProjectRequest.find({ projectId: id })
      .populate('requesterId', 'name email college branch year rollNumber avatar')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Project requests fetched.', { requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept or reject a collaboration request (project owner only)
 * @route   PUT /api/projects/requests/:requestId
 * @access  Private
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return sendError(res, 400, 'Status must be either "accepted" or "rejected".');
    }

    const request = await ProjectRequest.findById(requestId).populate('projectId');
    if (!request) {
      return sendError(res, 404, 'Request not found.');
    }

    // Verify authenticated user owns the project
    if (request.projectId.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Permission denied: Only the project owner can manage collaboration requests.');
    }

    request.status = status;
    await request.save();

    // If accepted, increment project team size
    if (status === 'accepted') {
      await Project.findByIdAndUpdate(request.projectId._id, { $inc: { teamSize: 1 } });
    }

    return sendSuccess(res, 200, `Collaboration request ${status}.`, { request });
  } catch (error) {
    next(error);
  }
};
