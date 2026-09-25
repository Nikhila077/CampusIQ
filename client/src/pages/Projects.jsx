import { useState, useEffect } from 'react';
import {
  FolderGit2,
  Users,
  Plus,
  Code2,
  Globe,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Trash2,
  Edit2,
  UserCheck
} from 'lucide-react';
import projectService from '../services/projectService.js';
import useAuth from '../hooks/useAuth.js';

export const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'collaborators' | 'mine' | 'requests'

  // Create Project Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    techStackInput: '',
    repoUrl: '',
    liveUrl: '',
    status: 'in-progress',
    isLookingForCollaborators: true,
    requiredSkillsInput: '',
    teamSize: 1
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState('');

  // Request to Join Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Owner Project Requests Management Modal
  const [manageRequestsModalOpen, setManageRequestsModalOpen] = useState(false);
  const [projectRequests, setProjectRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab === 'collaborators') params.collaboratorsOnly = 'true';
      if (activeTab === 'mine') params.myProjects = 'true';

      const [projRes, reqRes] = await Promise.all([
        projectService.getProjects(params),
        projectService.getMyRequests()
      ]);

      if (projRes?.success) setProjects(projRes.data.projects || []);
      if (reqRes?.success) setMyRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectError('');

    try {
      const techStack = createForm.techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const requiredSkills = createForm.requiredSkillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await projectService.createProject({
        ...createForm,
        techStack,
        requiredSkills
      });

      setCreateModalOpen(false);
      setCreateForm({
        title: '',
        description: '',
        techStackInput: '',
        repoUrl: '',
        liveUrl: '',
        status: 'in-progress',
        isLookingForCollaborators: true,
        requiredSkillsInput: '',
        teamSize: 1
      });
      await fetchProjects();
    } catch (err) {
      setProjectError(err.message || 'Failed to create project.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleOpenRequestModal = (proj) => {
    setSelectedProject(proj);
    setRequestMessage(`Hi, I would love to collaborate on "${proj.title}". My skills align well with your tech stack.`);
    setRequestError('');
    setRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSendingRequest(true);
    setRequestError('');
    try {
      await projectService.requestToJoin(selectedProject._id, requestMessage);
      setRequestModalOpen(false);
      await fetchProjects();
    } catch (err) {
      setRequestError(err.message || 'Failed to submit request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleOpenManageRequests = async (proj) => {
    setSelectedProject(proj);
    setManageRequestsModalOpen(true);
    setLoadingRequests(true);
    try {
      const res = await projectService.getProjectRequests(proj._id);
      if (res?.success) {
        setProjectRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Error loading project requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      await projectService.updateRequestStatus(requestId, status);
      setProjectRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
      await fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to update request.');
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Delete project "${title}"?`)) {
      try {
        await projectService.deleteProject(id);
        await fetchProjects();
      } catch (err) {
        alert(err.message || 'Failed to delete project.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-indigo-400" />
            Student Project Collaboration Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showcase technical projects, assemble student developer teams, and find project collaborators.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
        {[
          { key: 'all', label: 'All Projects' },
          { key: 'collaborators', label: 'Looking for Collaborators' },
          { key: 'mine', label: 'My Projects' },
          { key: 'requests', label: `My Sent Requests (${myRequests.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: My Sent Requests */}
      {activeTab === 'requests' ? (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              You haven't requested to join any projects yet.
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req._id}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {req.projectId?.title || 'Project'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 italic">"{req.message}"</p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Sent on {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      req.status === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : req.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading student projects...</div>
      ) : projects.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center bg-slate-900/20">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'mine'
              ? 'You have not created any projects yet. Publish a project to build your portfolio and invite team members.'
              : 'Be the first student to publish a project on the hub!'}
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Create a Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {proj.title}
                      </h3>
                      {proj.isOwner && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      By {proj.userId?.name || 'Student'}{' '}
                      {proj.userId?.college && `• ${proj.userId.college}`}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : proj.status === 'planning'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mt-2.5">
                  {proj.description || 'No description provided.'}
                </p>

                {/* Tech Stack */}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800/60 text-slate-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Looking for collaborators banner */}
                {proj.isLookingForCollaborators && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 flex items-start gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Looking for Collaborators</span>
                      {proj.requiredSkills && proj.requiredSkills.length > 0 && (
                        <span className="text-slate-400 text-[10px]">
                          Needed: {proj.requiredSkills.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Repository"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Live Demo"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Demo</span>
                    </a>
                  )}
                  <span className="text-[11px] text-slate-500">Team: {proj.teamSize || 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  {proj.isOwner ? (
                    <>
                      <button
                        onClick={() => handleOpenManageRequests(proj)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-[11px] font-semibold"
                      >
                        Requests
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj._id, proj.title)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded-lg"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : proj.requestStatus ? (
                    <span className="text-[11px] font-medium text-slate-400">
                      Request: <strong className="capitalize text-indigo-400">{proj.requestStatus}</strong>
                    </span>
                  ) : proj.isLookingForCollaborators ? (
                    <button
                      onClick={() => handleOpenRequestModal(proj)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Join Project
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Create Student Project</h3>

            {projectError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {projectError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Key-Value Store in Go"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2.5}
                  placeholder="What problem does this project solve? Architecture details..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB, Redis, Docker"
                  value={createForm.techStackInput}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, techStackInput: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={createForm.repoUrl}
                    onChange={(e) => setCreateForm({ ...createForm, repoUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={createForm.liveUrl}
                    onChange={(e) => setCreateForm({ ...createForm, liveUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Current Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={createForm.teamSize}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, teamSize: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isLookingForCollaborators}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        isLookingForCollaborators: e.target.checked
                      })
                    }
                    className="rounded text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-white">
                    Looking for student collaborators / contributors
                  </span>
                </label>
              </div>

              {createForm.isLookingForCollaborators && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Required Collaborator Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tailwind CSS, Express, Docker"
                    value={createForm.requiredSkillsInput}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, requiredSkillsInput: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {savingProject ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request to Join Modal */}
      {requestModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Request to Collaborate</h3>
            <p className="text-xs text-slate-400 mb-4">
              Send a collaboration request for <strong>{selectedProject.title}</strong>.
            </p>

            {requestError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {requestError}
              </div>
            )}

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Introductory Pitch & Skills
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Project Collaboration Requests Modal (Owner) */}
      {manageRequestsModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Collaboration Requests</h3>
            <p className="text-xs text-slate-400 mb-4">
              Manage incoming join requests for <strong>{selectedProject.title}</strong>.
            </p>

            {loadingRequests ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading requests...</div>
            ) : projectRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No join requests received yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {projectRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">
                          {req.requesterId?.name || 'Student'}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {req.requesterId?.branch || ''} • {req.requesterId?.college || ''}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          req.status === 'accepted'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : req.status === 'rejected'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{req.message}"</p>

                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2 pt-1 border-t border-slate-800/60">
                        <button
                          onClick={() => handleUpdateRequestStatus(req._id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req._id, 'accepted')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                        >
                          Accept as Collaborator
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
              <button
                type="button"
                onClick={() => setManageRequestsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
