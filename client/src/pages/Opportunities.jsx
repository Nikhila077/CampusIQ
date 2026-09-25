import { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle,
  Tag,
  Plus,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Sparkles,
  SlidersHorizontal,
  X,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import opportunityService from '../services/opportunityService.js';
import useAuth from '../hooks/useAuth.js';

const CATEGORIES = [
  { key: 'all', label: 'All Opportunities' },
  { key: 'internship', label: 'Internships' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'competition', label: 'Competitions' },
  { key: 'scholarship', label: 'Scholarships' },
  { key: 'fellowship', label: 'Fellowships' },
  { key: 'workshop', label: 'Workshops' }
];

export const Opportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('studentlens_saved_opps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [viewSavedOnly, setViewSavedOnly] = useState(false);

  // Post modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'internship',
    provider: '',
    description: '',
    deadline: '',
    eligibility: '',
    applyLink: '',
    tagsInput: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await opportunityService.getOpportunities({
        type: activeType === 'all' ? undefined : activeType,
        search: search || undefined
      });

      if (res?.success) {
        setOpportunities(res.data.opportunities || []);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOpportunities, 250);
    return () => clearTimeout(timer);
  }, [activeType, search]);

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('studentlens_saved_opps', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tags = form.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await opportunityService.createOpportunity({
        ...form,
        tags
      });

      setModalOpen(false);
      setForm({
        title: '',
        type: 'internship',
        provider: '',
        description: '',
        deadline: '',
        eligibility: '',
        applyLink: '',
        tagsInput: ''
      });
      await fetchOpportunities();
    } catch (err) {
      setError(err.message || 'Failed to post opportunity.');
    } finally {
      setSaving(false);
    }
  };

  const displayedOpportunities = opportunities.filter((opp) => {
    if (viewSavedOnly && !savedIds.includes(opp._id)) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Header: Discovery Workspace Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
              Discovery Workspace
            </span>
            {user?.targetRole && (
              <span className="text-xs text-slate-500 font-medium">
                Calibrated for: <strong className="text-[#102A2A]">{user.targetRole}</strong>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#102A2A] mt-1 flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-[#3B8F83]" />
            Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Discover opportunities aligned with your skills and career goals. Filter by deadline, role category, or verified student submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewSavedOnly(!viewSavedOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              viewSavedOnly
                ? 'bg-[#102A2A] text-white border-[#102A2A]'
                : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {viewSavedOnly ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-[#3B8F83]" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Saved ({savedIds.length})</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Share Opportunity</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search opportunities, companies, skills, or domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3B8F83] shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono font-medium shrink-0">
            {displayedOpportunities.length} opportunities available
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeType === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveType(cat.key);
                  if (viewSavedOnly) setViewSavedOnly(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#102A2A] text-white border-[#102A2A] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Opportunities Discovery Feed */}
      {loading ? (
        <div className="p-16 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          Scanning opportunity registry and matching skill profile...
        </div>
      ) : displayedOpportunities.length === 0 ? (
        /* Professional Empty State */
        <div className="p-12 sm:p-16 rounded-2xl border border-dashed border-slate-300 text-center bg-white space-y-3.5 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#3B8F83] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#102A2A]">
              {viewSavedOnly ? 'No saved opportunities yet' : 'No opportunities to show yet'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {viewSavedOnly
                ? 'Bookmark opportunities from the discovery feed to review them later in your saved shortlist.'
                : 'Complete your profile and technical skills in your Profile to unlock calibrated recommendations, or be the first to share an opening.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {viewSavedOnly ? (
              <button
                onClick={() => setViewSavedOnly(false)}
                className="px-4 py-2 rounded-xl bg-[#3B8F83] text-white text-xs font-semibold"
              >
                View All Opportunities
              </button>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#3B8F83] text-white text-xs font-semibold shadow-xs"
              >
                + Share First Opportunity
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Discovery Feed — Horizontal Cards */
        <div className="space-y-3.5">
          {displayedOpportunities.map((opp) => {
            const hasDeadline = opp.deadline;
            const deadlineDate = hasDeadline ? new Date(opp.deadline) : null;
            const daysLeft = deadlineDate
              ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
              : null;
            const isSaved = savedIds.includes(opp._id);

            return (
              <div
                key={opp._id}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 sm:p-6 transition-all shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5"
              >
                {/* Left/Middle Content */}
                <div className="space-y-3 flex-1">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
                      {opp.type}
                    </span>

                    {opp.relevanceScore ? (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{opp.relevanceScore}% Skill Match</span>
                      </span>
                    ) : null}

                    {opp.isVerified && (
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#3B8F83]" />
                        <span>Verified Post</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#102A2A] tracking-tight hover:text-[#3B8F83] transition-colors">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{opp.provider}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Eligibility Note */}
                  {opp.eligibility && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-1.5">
                      <strong className="text-[#102A2A] shrink-0 font-bold">Eligibility:</strong>
                      <span>{opp.eligibility}</span>
                    </div>
                  )}

                  {/* Skills / Tech Tags */}
                  {opp.tags && opp.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {opp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action & Deadline Panel */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Deadline Indicator */}
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Application Deadline
                    </span>
                    {deadlineDate ? (
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {daysLeft !== null && daysLeft >= 0 && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              daysLeft <= 3
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : daysLeft <= 7
                                ? 'bg-teal-50 text-teal-900 border border-teal-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        Rolling Submissions
                      </span>
                    )}
                  </div>

                  {/* Actions: Bookmark & Apply CTA */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSave(opp._id)}
                      className={`p-2 rounded-xl border text-xs transition-all ${
                        isSaved
                          ? 'bg-teal-50 border-teal-300 text-[#3B8F83]'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-[#3B8F83]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {opp.applyLink ? (
                      <a
                        href={opp.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <span>Apply</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
                      >
                        Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Share Opportunity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A2A] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#3B8F83]" />
                  <span>Share an Opportunity</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Post a verified internship, hackathon, or competition for student peers.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handlePostOpportunity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Software Engineering Internship 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opportunity Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    <option value="internship">Internship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="fellowship">Fellowship</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Microsoft, HackNIT"
                    value={form.provider}
                    onChange={(e) => setForm({ ...form, provider: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of the role, requirements, or perks..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd/4th Year B.Tech, CGPA > 7.0"
                    value={form.eligibility}
                    onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Application URL</label>
                <input
                  type="url"
                  placeholder="https://careers.example.com/apply"
                  value={form.applyLink}
                  onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills & Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, React, DSA, Machine Learning"
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white font-semibold transition-all disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Share Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
