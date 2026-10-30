/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — ADMINISTRATIVE CMS & AUDIT PORTAL (PHASE 5)
 * Dedicated Admin & Editor Dashboard
 * Palette: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044, Campus Green #16745B
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  Calendar,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Sliders,
  Check,
  X,
  Bot,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  NoticeRecord,
  EventRecord,
  PlacementRecord,
  RecruiterRecord,
  ComplaintRecord,
  OpportunityRecord,
  FacilityRecord,
  AiDocumentRecord,
  AuditLogRecord,
} from '../types/backend';

type AdminTab =
  | 'overview'
  | 'notices'
  | 'events'
  | 'placements'
  | 'grievances'
  | 'opportunities'
  | 'facilities'
  | 'ai-docs'
  | 'audit-logs';

export const AdminDashboardPage: React.FC<{ onOpenAuth: () => void; onNavigateHome: () => void }> = ({
  onOpenAuth,
  onNavigateHome,
}) => {
  const { user, token, isAdmin, isEditor, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats state
  const [stats, setStats] = useState<any>({
    totalNotices: 12,
    publishedNotices: 12,
    totalEvents: 6,
    upcomingEvents: 4,
    totalRegistrations: 1,
    totalGrievances: 2,
    pendingGrievances: 1,
    totalRecruiters: 12,
    totalAuditLogs: 3,
  });

  // Entities state
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [recruiters, setRecruiters] = useState<RecruiterRecord[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([]);
  const [facilities, setFacilities] = useState<FacilityRecord[]>([]);
  const [aiDocs, setAiDocs] = useState<AiDocumentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  // Search & Filter
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Modal states for Create/Edit
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    refNo: '',
    title: '',
    summary: '',
    category: 'Examination',
    department: 'Controller of Examinations',
    semesterApplicable: 'All Semesters',
    academicYear: '2026-2027',
    displayDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    issuer: 'Prof. Administrative Officer',
    issuerDesignation: 'Director / Registrar MAIT',
    isUrgent: false,
    isImportant: true,
    isDraft: false,
    attachmentFileName: 'MAIT_Official_Circular.pdf',
    documentDownloadUrl: 'https://mait.ac.in',
    officialSourceUrl: 'https://mait.ac.in',
  });

  // Event Modal
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Technical',
    organizer: 'ACM MAIT / Student Society',
    date: '2026-11-20',
    displayDate: '20 Nov 2026',
    time: '10:00 AM – 04:00 PM',
    venue: 'Central Auditorium, Block 1',
    maxCapacity: 300,
    entryFee: 'Free (Students)',
    contactEmail: 'events@mait.ac.in',
    officialSourceUrl: 'https://mait.ac.in',
  });

  // Grievance resolution modal
  const [resolvingComplaint, setResolvingComplaint] = useState<ComplaintRecord | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintRecord['status']>('In Progress');
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [resStats, resNotices, resEvents, resRecruiters, resComplaints, resOpps, resFacs, resAi, resLogs] =
        await Promise.allSettled([
          fetch('/api/stats').then((r) => r.json()),
          fetch('/api/notices').then((r) => r.json()),
          fetch('/api/events').then((r) => r.json()),
          fetch('/api/recruiters').then((r) => r.json()),
          fetch('/api/complaints', { headers }).then((r) => r.json()),
          fetch('/api/opportunities').then((r) => r.json()),
          fetch('/api/facilities').then((r) => r.json()),
          fetch('/api/ai-documents').then((r) => r.json()),
          fetch('/api/admin/audit-logs', { headers }).then((r) => r.json()),
        ]);

      if (resStats.status === 'fulfilled') setStats(resStats.value);
      if (resNotices.status === 'fulfilled' && resNotices.value.notices) setNotices(resNotices.value.notices);
      if (resEvents.status === 'fulfilled' && resEvents.value.events) setEvents(resEvents.value.events);
      if (resRecruiters.status === 'fulfilled' && resRecruiters.value.recruiters) setRecruiters(resRecruiters.value.recruiters);
      if (resComplaints.status === 'fulfilled' && resComplaints.value.complaints) setComplaints(resComplaints.value.complaints);
      if (resOpps.status === 'fulfilled' && resOpps.value.opportunities) setOpportunities(resOpps.value.opportunities);
      if (resFacs.status === 'fulfilled' && resFacs.value.facilities) setFacilities(resFacs.value.facilities);
      if (resAi.status === 'fulfilled' && resAi.value.documents) setAiDocs(resAi.value.documents);
      if (resLogs.status === 'fulfilled' && resLogs.value.logs) setAuditLogs(resLogs.value.logs);
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Notice Handlers
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (editingNotice) {
      await fetch(`/api/notices/${editingNotice.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(noticeForm),
      });
    } else {
      await fetch('/api/notices', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...noticeForm,
          publicationDate: new Date().toISOString().split('T')[0],
          isArchived: false,
          hasAttachment: true,
          attachmentFileType: 'PDF',
          attachmentSize: '1.2 MB',
        }),
      });
    }

    setIsNoticeModalOpen(false);
    setEditingNotice(null);
    fetchData();
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    await fetch(`/api/notices/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  // Event Handlers
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...eventForm,
        department: eventForm.organizer,
        mode: 'Offline',
        registrationDeadline: eventForm.date,
        status: 'Upcoming',
        isFeatured: false,
      }),
    });
    setIsEventModalOpen(false);
    fetchData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this campus event?')) return;
    await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  // Grievance Status Update
  const handleUpdateGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaint) return;
    await fetch(`/api/complaints/${resolvingComplaint.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: resolutionStatus,
        adminRemarks: resolutionRemarks,
      }),
    });
    setResolvingComplaint(null);
    fetchData();
  };

  // AI Doc Approval Toggle
  const handleToggleAiDoc = async (id: string, currentVal: boolean) => {
    await fetch(`/api/ai-documents/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved: !currentVal }),
    });
    fetchData();
  };

  // Role Gate check
  if (!isLoggedIn || (!isAdmin && !isEditor)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F5EF] px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#203044]/15 p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#873A2B]">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#203044]">
              Institutional CMS Access Restricted
            </h2>
            <p className="text-sm text-[#657080] mt-2">
              The Administrative CMS is reserved for authorized university administrative officers and departmental content editors.
            </p>
          </div>
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 text-left">
            <strong>Testing Access:</strong> You can sign in using one of the pre-configured Demo accounts (<code>demo-admin@mait.ac.in</code> or <code>demo-editor@mait.ac.in</code>).
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onOpenAuth}
              className="w-full py-3 px-4 bg-[#873A2B] hover:bg-[#723124] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Sign In with Authorized Account
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#657080] hover:text-[#203044]"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-[#203044]/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#873A2B] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl text-[#203044]">
                  MAIT Central CMS & Admin Command
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-red-50 text-[#873A2B] border border-red-200' : 'bg-amber-50 text-[#B18B50] border border-amber-200'
                }`}>
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-[#657080]">
                Institutional Content Management, Verification Workflows & Audit Logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5EF] hover:bg-slate-200 text-xs font-semibold rounded-lg text-[#203044] border border-[#203044]/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
            <div className="text-xs text-[#657080] border-l border-[#203044]/15 pl-3">
              Signed in as: <strong className="text-[#203044]">{user?.name}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Notices</span>
              <FileText className="w-4 h-4 text-[#873A2B]" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{stats.totalNotices || notices.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              {stats.publishedNotices || notices.length} Published
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Campus Events</span>
              <Calendar className="w-4 h-4 text-[#16745B]" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{stats.totalEvents || events.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              {stats.upcomingEvents || 4} Upcoming
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Event Registrations</span>
              <Users className="w-4 h-4 text-[#B18B50]" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{stats.totalRegistrations || 1}</div>
            <div className="text-[10px] text-[#657080] mt-0.5">Active passes issued</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Grievances</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{complaints.length}</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
              {complaints.filter((c) => c.status !== 'Resolved').length} Active Tickets
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Recruiters</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{recruiters.length}</div>
            <div className="text-[10px] text-[#657080] mt-0.5">Partner companies</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#203044]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#657080] mb-1">
              <span className="text-[11px] font-semibold">Audit Actions</span>
              <Clock className="w-4 h-4 text-[#203044]" />
            </div>
            <div className="text-xl font-bold font-serif text-[#203044]">{auditLogs.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Immutable Logged</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-[#203044]/10 p-1.5 flex flex-wrap gap-1 mb-6 shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Live Overview
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notices'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Notices CMS ({notices.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Events CMS ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grievances'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Student Grievances ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'placements'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Placements & Recruiters
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'opportunities'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'facilities'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Facilities Status
          </button>
          <button
            onClick={() => setActiveTab('ai-docs')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-docs'
                ? 'bg-[#873A2B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Knowledge Base
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audit-logs'
                  ? 'bg-[#873A2B] text-white shadow-xs'
                  : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Audit Logs ({auditLogs.length})
            </button>
          )}
        </div>

        {/* TAB CONTENT */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-2xl border border-[#203044]/10 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#203044] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#873A2B]" />
                  Quick Administrative Actions
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setEditingNotice(null);
                      setNoticeForm({
                        refNo: `MAIT/OFFICE/2026/${Math.floor(100 + Math.random() * 900)}`,
                        title: '',
                        summary: '',
                        category: 'Academic',
                        department: 'Academic Branch MAIT',
                        semesterApplicable: 'All Semesters',
                        academicYear: '2026-2027',
                        displayDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        issuer: user?.name || 'Prof. Administrative Officer',
                        issuerDesignation: 'Registrar / Dean Academics',
                        isUrgent: false,
                        isImportant: true,
                        isDraft: false,
                        attachmentFileName: 'MAIT_Circular_2026.pdf',
                        documentDownloadUrl: 'https://mait.ac.in',
                        officialSourceUrl: 'https://mait.ac.in',
                      });
                      setIsNoticeModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 bg-[#873A2B] hover:bg-[#723124] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>+ Publish New Official Notice</span>
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setEventForm({
                        title: '',
                        tagline: '',
                        description: '',
                        category: 'Technical',
                        organizer: 'MAIT Student Society',
                        date: '2026-11-25',
                        displayDate: '25 Nov 2026',
                        time: '11:00 AM – 04:00 PM',
                        venue: 'Main Auditorium',
                        maxCapacity: 350,
                        entryFee: 'Free (Students)',
                        contactEmail: 'events@mait.ac.in',
                        officialSourceUrl: 'https://mait.ac.in',
                      });
                      setIsEventModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 bg-[#16745B] hover:bg-[#115d49] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>+ Schedule Campus Event</span>
                    <Calendar className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('grievances')}
                    className="w-full py-2.5 px-4 bg-[#F7F5EF] hover:bg-slate-200 text-[#203044] font-semibold text-xs rounded-xl border border-[#203044]/10 transition-colors cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>Triage Student Grievances</span>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </button>
                </div>
              </div>

              {/* Pending Grievances Attention Box */}
              <div className="bg-white rounded-2xl border border-[#203044]/10 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#203044] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Pending Student Grievances
                  </h3>
                  <button
                    onClick={() => setActiveTab('grievances')}
                    className="text-xs font-semibold text-[#873A2B] hover:underline"
                  >
                    View All ({complaints.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {complaints.filter((c) => c.status !== 'Resolved').slice(0, 3).map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3 rounded-xl bg-[#F7F5EF] border border-[#203044]/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#203044]">{comp.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {comp.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-[#657080] line-clamp-2">{comp.description}</p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-[#657080]">
                        <span>By: {comp.studentName} ({comp.enrollmentNumber})</span>
                        <button
                          onClick={() => {
                            setResolvingComplaint(comp);
                            setResolutionStatus(comp.status);
                            setResolutionRemarks(comp.adminRemarks || '');
                          }}
                          className="font-bold text-[#873A2B] hover:underline cursor-pointer"
                        >
                          Update Status &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                  {complaints.filter((c) => c.status !== 'Resolved').length === 0 && (
                    <div className="p-4 text-center text-xs text-[#657080]">
                      No unresolved student complaints pending!
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Audit Activity */}
              <div className="bg-white rounded-2xl border border-[#203044]/10 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#203044] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#203044]" />
                  Recent Administrative Audit
                </h3>
                <div className="space-y-2.5">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-xs border-b border-[#203044]/5 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#203044]">{log.userName}</span>
                        <span className="text-[10px] text-[#657080]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#657080] mt-0.5">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTICES CMS */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F5EF]/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#657080] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="Search notices by title, ref no..."
                    className="pl-9 pr-3 py-2 text-xs bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044] w-64"
                  />
                </div>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-[#203044]/20 rounded-xl focus:outline-none focus:border-[#873A2B] text-[#203044]"
                >
                  <option value="All">All Categories</option>
                  <option value="Examination">Examination</option>
                  <option value="Academic">Academic</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingNotice(null);
                  setNoticeForm({
                    refNo: `MAIT/NOT/2026/${Math.floor(100 + Math.random() * 900)}`,
                    title: '',
                    summary: '',
                    category: 'Examination',
                    department: 'Controller of Examinations',
                    semesterApplicable: 'All Semesters',
                    academicYear: '2026-2027',
                    displayDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    issuer: user?.name || 'Prof. Administrative Officer',
                    issuerDesignation: 'Chief Examination Superintendent',
                    isUrgent: false,
                    isImportant: true,
                    isDraft: false,
                    attachmentFileName: 'Official_Notice.pdf',
                    documentDownloadUrl: 'https://mait.ac.in',
                    officialSourceUrl: 'https://mait.ac.in',
                  });
                  setIsNoticeModalOpen(true);
                }}
                className="py-2 px-4 bg-[#873A2B] hover:bg-[#723124] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Official Notice
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5EF] text-[#657080] uppercase tracking-wider font-semibold border-b border-[#203044]/10">
                  <tr>
                    <th className="px-5 py-3">Reference No</th>
                    <th className="px-5 py-3">Notice Title</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#203044]/10">
                  {notices
                    .filter((n) => {
                      if (noticeCategory !== 'All' && n.category !== noticeCategory) return false;
                      if (noticeSearch && !n.title.toLowerCase().includes(noticeSearch.toLowerCase()) && !n.refNo.toLowerCase().includes(noticeSearch.toLowerCase())) {
                        return false;
                      }
                      return true;
                    })
                    .map((notice) => (
                      <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-mono font-medium text-[#873A2B] whitespace-nowrap">
                          {notice.refNo}
                        </td>
                        <td className="px-5 py-3 max-w-md">
                          <div className="font-semibold text-[#203044] line-clamp-1">{notice.title}</div>
                          <div className="text-[11px] text-[#657080] line-clamp-1">{notice.summary}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#203044] font-medium text-[10px]">
                            {notice.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-[#657080]">
                          {notice.displayDate}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            {notice.isUrgent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                URGENT
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PUBLISHED
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingNotice(notice);
                                setNoticeForm({
                                  refNo: notice.refNo,
                                  title: notice.title,
                                  summary: notice.summary,
                                  category: notice.category,
                                  department: notice.department,
                                  semesterApplicable: notice.semesterApplicable || 'All Semesters',
                                  academicYear: notice.academicYear,
                                  displayDate: notice.displayDate,
                                  issuer: notice.issuer,
                                  issuerDesignation: notice.issuerDesignation,
                                  isUrgent: notice.isUrgent,
                                  isImportant: notice.isImportant,
                                  isDraft: notice.isDraft,
                                  attachmentFileName: notice.attachmentFileName || 'attachment.pdf',
                                  documentDownloadUrl: notice.documentDownloadUrl || 'https://mait.ac.in',
                                  officialSourceUrl: notice.officialSourceUrl,
                                });
                                setIsNoticeModalOpen(true);
                              }}
                              className="p-1 rounded text-[#657080] hover:text-[#873A2B] hover:bg-slate-100"
                              title="Edit Notice"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="p-1 rounded text-[#657080] hover:text-red-700 hover:bg-red-50"
                              title="Delete Notice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EVENTS CMS */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 flex items-center justify-between bg-[#F7F5EF]/50">
              <div>
                <h3 className="font-serif font-bold text-base text-[#203044]">
                  Campus Events Schedule & Capacity Management
                </h3>
                <p className="text-xs text-[#657080]">Create, schedule, and track attendee registration thresholds</p>
              </div>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="py-2 px-4 bg-[#16745B] hover:bg-[#115d49] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule New Event
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5EF] text-[#657080] uppercase tracking-wider font-semibold border-b border-[#203044]/10">
                  <tr>
                    <th className="px-5 py-3">Event Title</th>
                    <th className="px-5 py-3">Organizer</th>
                    <th className="px-5 py-3">Date & Venue</th>
                    <th className="px-5 py-3">Capacity</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#203044]/10">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 max-w-xs">
                        <div className="font-semibold text-[#203044]">{ev.title}</div>
                        <div className="text-[11px] text-[#657080]">{ev.tagline}</div>
                      </td>
                      <td className="px-5 py-3 text-[#657080]">{ev.organizer}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-[#203044]">{ev.displayDate}</div>
                        <div className="text-[11px] text-[#657080]">{ev.venue}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-[#203044]">
                          {ev.registeredCount} / {ev.maxCapacity}
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-[#16745B] h-full"
                            style={{ width: `${Math.min(100, (ev.registeredCount / ev.maxCapacity) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 rounded text-[#657080] hover:text-red-700 hover:bg-red-50"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT GRIEVANCES */}
        {activeTab === 'grievances' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/50">
              <h3 className="font-serif font-bold text-base text-[#203044]">
                Student Grievance Redressal & Support Tickets
              </h3>
              <p className="text-xs text-[#657080]">
                UGC / AICTE Compliant Student Grievance Resolution Desk
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5EF] text-[#657080] uppercase tracking-wider font-semibold border-b border-[#203044]/10">
                  <tr>
                    <th className="px-5 py-3">Ticket ID</th>
                    <th className="px-5 py-3">Student & Branch</th>
                    <th className="px-5 py-3">Category & Subject</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#203044]/10">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-[#873A2B]">{c.id}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-[#203044]">{c.studentName}</div>
                        <div className="text-[11px] text-[#657080]">{c.enrollmentNumber}</div>
                      </td>
                      <td className="px-5 py-3 max-w-sm">
                        <span className="text-[10px] font-bold text-[#16745B] uppercase block">
                          [{c.category}]
                        </span>
                        <div className="font-medium text-[#203044] line-clamp-1">{c.subject}</div>
                        <div className="text-[11px] text-[#657080] line-clamp-1">{c.description}</div>
                        {c.adminRemarks && (
                          <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                            Admin Note: {c.adminRemarks}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : c.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'Under Review'
                            ? 'bg-indigo-100 text-indigo-800'
                            : c.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => {
                            setResolvingComplaint(c);
                            setResolutionStatus(c.status);
                            setResolutionRemarks(c.adminRemarks || '');
                          }}
                          className="py-1 px-3 bg-[#873A2B] hover:bg-[#723124] text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Triage & Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLACEMENTS & RECRUITERS */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#203044]/10 p-6 shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#203044] mb-2">
                Corporate Recruiters Directory
              </h3>
              <p className="text-xs text-[#657080] mb-4">
                Manage visiting companies, tier classification, and compensation package thresholds
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recruiters.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-[#F7F5EF] border border-[#203044]/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#203044] text-xs">{rec.name}</span>
                      {rec.isFortune500 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded">
                          F500
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#657080]">{rec.industry}</div>
                    <div className="text-xs font-semibold text-[#873A2B]">
                      Up to ₹{rec.maxPackageLpa} LPA
                    </div>
                    <div className="text-[10px] text-[#657080] pt-1">
                      Tier: {rec.tier}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: OPPORTUNITIES */}
        {activeTab === 'opportunities' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/50">
              <h3 className="font-serif font-bold text-base text-[#203044]">
                Campus Hackathons, Fellowships & Scholarships
              </h3>
              <p className="text-xs text-[#657080]">Verified external and internal student opportunities</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-4 rounded-xl bg-[#F7F5EF] border border-[#203044]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#873A2B]/10 text-[#873A2B]">
                      {opp.type}
                    </span>
                    <span className="text-[11px] text-[#657080]">Due: {opp.deadline}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#203044]">{opp.title}</h4>
                  <p className="text-xs text-[#657080]">{opp.organizer}</p>
                  <div className="text-xs font-bold text-[#16745B]">{opp.stipendOrPrize}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: FACILITIES STATUS */}
        {activeTab === 'facilities' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/50">
              <h3 className="font-serif font-bold text-base text-[#203044]">
                Campus Infrastructure & Laboratory Status Dashboard
              </h3>
              <p className="text-xs text-[#657080]">Real-time operational status for library, laboratories, and sports arenas</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 rounded-xl border border-[#203044]/10 bg-[#F7F5EF] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-[#203044]">{fac.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      fac.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fac.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#657080]">{fac.blockLocation} &bull; {fac.openingHours}</div>
                  <p className="text-xs text-[#203044]">{fac.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: AI KNOWLEDGE DOCUMENTS */}
        {activeTab === 'ai-docs' && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/50">
              <h3 className="font-serif font-bold text-base text-[#203044]">
                Institutional Knowledge Grounding Documents
              </h3>
              <p className="text-xs text-[#657080]">
                Verified university charters, examination ordinances, and UGC guidelines used for semantic grounding
              </p>
            </div>
            <div className="p-5 space-y-3">
              {aiDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-[#203044]/10 bg-[#F7F5EF] flex items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-[#203044]">
                        {doc.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#203044]">{doc.title}</h4>
                    </div>
                    <p className="text-xs text-[#657080]">{doc.contentSummary}</p>
                    <div className="text-[10px] text-[#657080]">
                      Tokens: <strong>{doc.tokenCount.toLocaleString()}</strong> &bull; Last Verified: {doc.lastVerifiedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleAiDoc(doc.id, doc.isApprovedForGrounding)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                        doc.isApprovedForGrounding
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {doc.isApprovedForGrounding ? 'Grounding Active' : 'Grounding Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: AUDIT LOGS */}
        {activeTab === 'audit-logs' && isAdmin && (
          <div className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/50">
              <h3 className="font-serif font-bold text-base text-[#203044]">
                Administrative Security & Mutation Audit Trail
              </h3>
              <p className="text-xs text-[#657080]">Immutable record of all creations, updates, logins, and status transitions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5EF] text-[#657080] uppercase tracking-wider font-semibold border-b border-[#203044]/10">
                  <tr>
                    <th className="px-5 py-3">Timestamp</th>
                    <th className="px-5 py-3">User & Role</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Entity</th>
                    <th className="px-5 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#203044]/10 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap text-[#657080]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <strong className="text-[#203044] font-sans">{log.userName}</strong>
                        <div className="text-[10px] text-[#657080]">{log.userRole}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'DELETE'
                            ? 'bg-red-100 text-red-800'
                            : log.action === 'STATUS_CHANGE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 uppercase text-[#657080]">{log.entityType}</td>
                      <td className="px-5 py-3 font-sans text-xs text-[#203044]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT NOTICE MODAL */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#203044]/10 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#873A2B] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingNotice ? 'Edit Official Circular' : 'Publish New Official Notice'}
              </h3>
              <button onClick={() => setIsNoticeModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Official Reference Number *</label>
                <input
                  type="text"
                  value={noticeForm.refNo}
                  onChange={(e) => setNoticeForm({ ...noticeForm, refNo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Schedule for End-Term Practical Examinations"
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Executive Summary *</label>
                <textarea
                  value={noticeForm.summary}
                  onChange={(e) => setNoticeForm({ ...noticeForm, summary: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Academic">Academic</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Applicable Semesters</label>
                  <input
                    type="text"
                    value={noticeForm.semesterApplicable}
                    onChange={(e) => setNoticeForm({ ...noticeForm, semesterApplicable: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticeForm.isUrgent}
                    onChange={(e) => setNoticeForm({ ...noticeForm, isUrgent: e.target.checked })}
                    className="rounded text-[#873A2B]"
                  />
                  <span className="font-semibold text-red-700">Flag as URGENT Announcement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noticeForm.isImportant}
                    onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                    className="rounded text-[#873A2B]"
                  />
                  <span className="font-semibold">Pin as Important</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 border border-[#203044]/20 rounded-xl text-[#657080]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#873A2B] hover:bg-[#723124] text-white font-semibold rounded-xl"
                >
                  {editingNotice ? 'Save Changes' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#203044]/10 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#16745B] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Schedule Campus Event</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. MAIT Robotics Hackathon 2026"
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={eventForm.tagline}
                  onChange={(e) => setEventForm({ ...eventForm, tagline: e.target.value })}
                  placeholder="e.g. Build autonomous systems for real-world automation."
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value, displayDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Venue Location</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Participant Capacity</label>
                  <input
                    type="number"
                    value={eventForm.maxCapacity}
                    onChange={(e) => setEventForm({ ...eventForm, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 border border-[#203044]/20 rounded-xl text-[#657080]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16745B] hover:bg-[#115d49] text-white font-semibold rounded-xl"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {resolvingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#203044]/10 max-w-lg w-full">
            <div className="bg-[#203044] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">Grievance Resolution Desk</h3>
              <button onClick={() => setResolvingComplaint(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateGrievance} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#F7F5EF] rounded-xl space-y-1">
                <div className="font-bold text-[#203044]">{resolvingComplaint.subject}</div>
                <div className="text-[#657080]">{resolvingComplaint.description}</div>
                <div className="text-[10px] text-[#657080] pt-1">
                  Submitted by: {resolvingComplaint.studentName} ({resolvingComplaint.studentEmail})
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Update Status</label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress (Action Assigned)</option>
                  <option value="Resolved">Resolved (Completed)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Administrative Action Remarks</label>
                <textarea
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="e.g. Assigned to estate maintenance team under ticket EST-442. Inspection completed."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingComplaint(null)}
                  className="px-4 py-2 border border-[#203044]/20 rounded-xl text-[#657080]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#873A2B] hover:bg-[#723124] text-white font-semibold rounded-xl"
                >
                  Save Status & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
