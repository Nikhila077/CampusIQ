import { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle,
  Tag,
  Plus,
  Briefcase
} from 'lucide-react';
import opportunityService from '../services/opportunityService.js';

const TYPES = [
  { key: 'all', label: 'All Opportunities' },
  { key: 'internship', label: 'Internships' },
  { key: 'scholarship', label: 'Scholarships' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'competition', label: 'Competitions' },
  { key: 'fellowship', label: 'Fellowships' }
];

export const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch] = useState('');

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
    const timer = setTimeout(fetchOpportunities, 200);
    return () => clearTimeout(timer);
  }, [activeType, search]);

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Student Opportunity Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated internships, hackathons, fellowships, and scholarships tailored to your technical skill profile.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Share Opportunity
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeType === t.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search keywords, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center bg-slate-900/20">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No opportunities found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search filter or be the first to share an opportunity.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const hasDeadline = opp.deadline;
            const deadlineDate = hasDeadline ? new Date(opp.deadline) : null;
            const daysLeft = deadlineDate
              ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={opp._id}
                className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block mb-1">
                        {opp.type}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">{opp.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{opp.provider}</span>
                      </div>
                    </div>

                    {opp.relevanceScore && (
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 block">
                          {opp.relevanceScore}% Match
                        </span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">
                          Profile Match
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mt-2.5">
                    {opp.description}
                  </p>

                  {opp.eligibility && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300 block mb-0.5">Eligibility:</span>
                      <p>{opp.eligibility}</p>
                    </div>
                  )}

                  {opp.tags && opp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
                      {opp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800/60 text-slate-300 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {deadlineDate ? (
                      <span>
                        Deadline: {deadlineDate.toLocaleDateString()}{' '}
                        {daysLeft !== null && daysLeft >= 0 && (
                          <span className="text-yellow-400 font-medium font-sans">
                            ({daysLeft} days left)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>Rolling Deadline</span>
                    )}
                  </div>

                  {opp.applyLink && (
                    <a
                      href={opp.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Opportunity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Post an Opportunity</h3>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handlePostOpportunity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Research Internship 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="internship">Internship</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                    <option value="fellowship">Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Provider / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACM / Google / ISRO"
                    value={form.provider}
                    onChange={(e) => setForm({ ...form, provider: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Application URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.applyLink}
                    onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of opportunity, stipend, dates..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2nd & 3rd year B.Tech students with CGPA > 7.5"
                  value={form.eligibility}
                  onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, AI/ML, Open Source, Remote"
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Posting...' : 'Share Opportunity'}
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
