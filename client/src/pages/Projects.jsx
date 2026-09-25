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
  UserCheck,
  GitBranch,
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import projectService from '../services/projectService.js';
import useAuth from '../hooks/useAuth.js';

const STAGES = [
  { key: 'idea', label: 'Idea', step: 1, percent: 25 },
  { key: 'planning', label: 'Planning', step: 2, percent: 50 },
  { key: 'in-progress', label: 'Building', step: 3, percent: 75 },
  { key: 'completed', label: 'Completed', step: 4, percent: 100 }
];

export const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'collaborators' | 'mine' | 'requests'

  // Create/Edit Project Modal
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
  const [activeManageProject, setActiveManageProject] = useState(null);
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

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSendingRequest(true);
    setRequestError('');

    try {
      await projectService.requestToJoin(selectedProject._id, requestMessage);
      setRequestModalOpen(false);
      setRequestMessage('');
      await fetchProjects();
    } catch (err) {
      setRequestError(err.message || 'Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleOpenManageRequests = async (project) => {
    setActiveManageProject(project);
    setManageRequestsModalOpen(true);
    setLoadingRequests(true);
    try {
      const res = await projectService.getProjectRequests(project._id);
      if (res?.success) setProjectRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
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
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await projectService.deleteProject(id);
        await fetchProjects();
      } catch (err) {
        alert(err.message || 'Failed to delete project.');
      }
    }
  };

  const getStageInfo = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', step: 4, percent: 100, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'planning':
        return { label: 'Planning', step: 2, percent: 50, color: 'text-teal-900 bg-teal-50 border-teal-200' };
      case 'idea':
        return { label: 'Idea', step: 1, percent: 25, color: 'text-slate-800 bg-slate-100 border-slate-200' };
      case 'in-progress':
      default:
        return { label: 'Building', step: 3, percent: 75, color: 'text-[#102A2A] bg-teal-50 border-teal-300' };
    }
  };

  // Find a candidate featured project (user's project or first active project)
  const featuredProject = projects.find((p) => p.isOwner) || (projects.length > 0 ? projects[0] : null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Header: Project Workspace Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
              Project Workspace
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Portfolio & Collaboration Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#102A2A] mt-1 flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-[#3B8F83]" />
            Project Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Build, track and showcase your work. Assemble student teams, track engineering lifecycle milestones, and collaborate on open-source repositories.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Project</span>
        </button>
      </div>

      {/* 2. Project Lifecycle Progress Pipeline Indicator */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#3B8F83]" />
            <span className="text-xs font-bold text-[#102A2A] uppercase tracking-wider">
              Engineering Lifecycle Stages
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Standard project progression flow
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {STAGES.map((stg, i) => (
            <div key={stg.key} className="space-y-1.5 text-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-300 text-[#3B8F83] text-xs font-bold font-mono flex items-center justify-center mx-auto">
                  0{stg.step}
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A2A] block">{stg.label}</span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:block">
                {stg.percent}% Progress
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Workspace Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-3 overflow-x-auto scrollbar-none">
        {[
          { key: 'all', label: 'All Projects' },
          { key: 'collaborators', label: 'Looking for Collaborators' },
          { key: 'mine', label: 'My Projects' },
          { key: 'requests', label: `My Sent Requests (${myRequests.length})` }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#102A2A] text-white border-[#102A2A] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. TAB: My Sent Requests */}
      {activeTab === 'requests' ? (
        <div className="space-y-3.5">
          {myRequests.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-600 bg-white border border-dashed border-slate-300 rounded-2xl shadow-xs space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">You haven't requested to join any projects yet.</p>
              <p className="text-slate-500 text-[11px]">Browse projects marked "Looking for Collaborators" and apply with your skills.</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#102A2A]">
                      {req.projectId?.title || 'Project'}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Sent on {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{req.message}"</p>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      req.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : req.status === 'rejected'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-teal-50 text-teal-900 border-teal-200'
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
        <div className="p-16 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          Loading student engineering projects...
        </div>
      ) : projects.length === 0 ? (
        /* Professional Empty State */
        <div className="p-12 sm:p-16 rounded-2xl border border-dashed border-slate-300 text-center bg-white space-y-3.5 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#3B8F83] flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#102A2A]">No projects found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {activeTab === 'mine'
                ? 'You have not created any projects yet. Publish your software, hardware, or research project to build your engineering portfolio.'
                : 'No projects match this category. Be the first student to publish a project on the hub!'}
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs"
          >
            + Create a Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 5. Featured Project Panel (If viewing all or mine) */}
          {featuredProject && activeTab !== 'collaborators' && (
            <div className="bg-[#102A2A] text-white border border-[#102A2A] rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#3B8F83]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3B8F83]/20 text-[#E8F5F2] border border-[#3B8F83]/40">
                      Featured Workspace Project
                    </span>
                    {featuredProject.isOwner && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                        Your Project
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-300 font-mono">
                    Updated {new Date(featuredProject.updatedAt || featuredProject.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {featuredProject.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                    {featuredProject.description}
                  </p>
                </div>

                {/* Stage Progress Bar */}
                <div className="bg-[#143333] border border-[#3B8F83]/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Lifecycle Stage:</span>
                    <span className="font-bold text-[#E8F5F2] uppercase tracking-wider">
                      {getStageInfo(featuredProject.status).label} ({getStageInfo(featuredProject.status).percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3B8F83] h-full rounded-full transition-all duration-300"
                      style={{ width: `${getStageInfo(featuredProject.status).percent}%` }}
                    />
                  </div>
                </div>

                {/* Tech Stack & Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {featuredProject.techStack?.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md text-[11px] bg-white/10 text-slate-200 font-mono border border-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {featuredProject.repoUrl && (
                      <a
                        href={featuredProject.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {featuredProject.isOwner ? (
                      <button
                        onClick={() => handleOpenManageRequests(featuredProject)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#102A2A] text-xs font-bold transition-all"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Manage Team</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProject(featuredProject);
                          setRequestModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold transition-all"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Request to Join</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const stage = getStageInfo(proj.status);
              return (
                <div
                  key={proj._id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#102A2A] tracking-tight">
                            {proj.title}
                          </h3>
                          {proj.isOwner && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 font-bold border border-teal-200">
                              Owner
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          By {proj.userId?.name || 'Student'}{' '}
                          {proj.userId?.college && `• ${proj.userId.college}`}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stage.color}`}
                      >
                        {stage.label}
                      </span>
                    </div>

                    {/* Stage Mini Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3B8F83] h-full rounded-full transition-all duration-300"
                        style={{ width: `${stage.percent}%` }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tech Stack */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200"
                          >
                            #{tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Collaborator Vacancy Banner */}
                    {proj.isLookingForCollaborators && (
                      <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/80 text-[11px] text-teal-950 flex items-start gap-2">
                        <Users className="w-3.5 h-3.5 text-[#3B8F83] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#102A2A]">Seeking Collaborators:</strong>
                          <span>
                            {proj.requiredSkills && proj.requiredSkills.length > 0
                              ? `Roles: ${proj.requiredSkills.join(', ')}`
                              : 'Open to contributors of all skills'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-[#3B8F83] flex items-center gap-1 font-semibold"
                          title="View Repository"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-[#3B8F83] flex items-center gap-1 font-semibold"
                          title="View Live App"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {proj.isOwner ? (
                        <>
                          <button
                            onClick={() => handleOpenManageRequests(proj)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A2A] font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Users className="w-3.5 h-3.5 text-[#3B8F83]" />
                            <span>Team ({proj.collaborators?.length || 0})</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj._id, proj.title)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedProject(proj);
                            setRequestModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Join</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A2A] flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#3B8F83]" />
                  <span>Publish Workspace Project</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Showcase engineering projects and assemble student contributors.
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {projectError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {projectError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Orchestrator"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the problem solved, architecture, and technology decisions..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Lifecycle Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    <option value="idea">Idea (01)</option>
                    <option value="planning">Planning (02)</option>
                    <option value="in-progress">Building (03)</option>
                    <option value="completed">Completed (04)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Team Size</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={createForm.teamSize}
                    onChange={(e) => setCreateForm({ ...createForm, teamSize: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technology Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js, React, Docker, Redis, TypeScript"
                  value={createForm.techStackInput}
                  onChange={(e) => setCreateForm({ ...createForm, techStackInput: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Repository URL (GitHub / GitLab)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/project"
                    value={createForm.repoUrl}
                    onChange={(e) => setCreateForm({ ...createForm, repoUrl: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://project.vercel.app"
                    value={createForm.liveUrl}
                    onChange={(e) => setCreateForm({ ...createForm, liveUrl: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={createForm.isLookingForCollaborators}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, isLookingForCollaborators: e.target.checked })
                    }
                    className="rounded text-[#3B8F83] focus:ring-0"
                  />
                  <span>Recruit Student Collaborators</span>
                </label>

                {createForm.isLookingForCollaborators && (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Required Roles / Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Backend Developer, UI/UX Designer"
                      value={createForm.requiredSkillsInput}
                      onChange={(e) => setCreateForm({ ...createForm, requiredSkillsInput: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white font-semibold transition-all disabled:opacity-50"
                >
                  {savingProject ? 'Saving...' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Request to Join Team Modal */}
      {requestModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A2A]">
                  Request to Join Team
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Project: <strong className="text-[#3B8F83]">{selectedProject.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {requestError}
              </div>
            )}

            <form onSubmit={handleSendRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Introduction & Skills you bring *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hi! I have experience with React and Node.js and would love to contribute to the API layer..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white font-semibold disabled:opacity-50"
                >
                  {sendingRequest ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Manage Project Requests Modal (Owner) */}
      {manageRequestsModalOpen && activeManageProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A2A]">
                  Manage Team Requests
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Project: <strong>{activeManageProject.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setManageRequestsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingRequests ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading candidate requests...</div>
            ) : projectRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                No join requests received yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {projectRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#102A2A]">
                        {req.userId?.name || 'Student Candidate'}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          req.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-teal-50 text-teal-900'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{req.message}"</p>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateStatus(req._id, 'accepted')}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, 'rejected')}
                          className="px-3 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
