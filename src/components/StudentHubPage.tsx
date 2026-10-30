/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — STUDENT HUB & DIGITAL SERVICE PORTAL (PHASE 5)
 * Dedicated student hub for registered events, bookmarks, grievances, and lost & found
 * Palette: Warm Ivory #F7F5EF, Pure White #FFFFFF, Brick Red #873A2B, Deep Navy #203044, Campus Green #16745B
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Bookmark,
  AlertCircle,
  Search,
  Plus,
  QrCode,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Building,
  HelpCircle,
  FileText,
  User as UserIcon,
  Ticket,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  EventRegistrationRecord,
  SavedItemRecord,
  ComplaintRecord,
  LostItemRecord,
  FoundItemRecord,
  ItemClaimRequest,
  NotesResourceRecord,
} from '../types/backend';

type StudentTab = 'registrations' | 'bookmarks' | 'grievances' | 'lost-found' | 'notes';
type LostFoundMatch = {
  foundItem: Omit<FoundItemRecord, 'foundByStudentId' | 'foundByName' | 'claimRequests'>;
  matchScore: number;
  matchReasons: string[];
};
type StudentLostFoundClaim = {
  type: 'lost' | 'found';
  itemId: string;
  itemTitle: string;
  claim: ItemClaimRequest;
};

export const StudentHubPage: React.FC<{ onOpenAuth: () => void; onNavigate: (page: any) => void }> = ({
  onOpenAuth,
  onNavigate,
}) => {
  const { user, token, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<StudentTab>('registrations');

  // State
  const [registrations, setRegistrations] = useState<EventRegistrationRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<SavedItemRecord[]>([]);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [lostItems, setLostItems] = useState<LostItemRecord[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItemRecord[]>([]);
  const [myLostItems, setMyLostItems] = useState<LostItemRecord[]>([]);
  const [myFoundItems, setMyFoundItems] = useState<FoundItemRecord[]>([]);
  const [myClaims, setMyClaims] = useState<StudentLostFoundClaim[]>([]);
  const [lostFoundSearch, setLostFoundSearch] = useState('');
  const [lostFoundCategory, setLostFoundCategory] = useState('All');
  const [matchesFor, setMatchesFor] = useState<string | null>(null);
  const [matches, setMatches] = useState<LostFoundMatch[]>([]);
  const [claimTarget, setClaimTarget] = useState<{ type: 'lost' | 'found'; itemId: string; title: string } | null>(null);
  const [claimProof, setClaimProof] = useState('');
  const [claimIdentifyingMark, setClaimIdentifyingMark] = useState('');
  const [lostFoundError, setLostFoundError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New Grievance form
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [grievanceForm, setGrievanceForm] = useState({
    category: 'Infrastructure',
    subject: '',
    description: '',
    location: 'Block 1 / Central Campus',
    priority: 'Medium',
  });
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Lost Item modal
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [lostForm, setLostForm] = useState({
    type: 'lost' as 'lost' | 'found',
    title: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    heldAtOffice: 'Proctorial Verification Desk (Block 1)',
    imageUrl: '',
  });

  // Ticket Preview modal
  const [selectedTicket, setSelectedTicket] = useState<EventRegistrationRecord | null>(null);

  const fetchStudentData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resRegs, resBooks, resComps, resLost, resFound, resActivity] = await Promise.allSettled([
        fetch('/api/student/registrations', { headers }).then((r) => r.json()),
        fetch('/api/student/bookmarks', { headers }).then((r) => r.json()),
        fetch('/api/complaints', { headers }).then((r) => r.json()),
        fetch('/api/lost-items').then((r) => r.json()),
        fetch('/api/found-items').then((r) => r.json()),
        fetch('/api/student/lost-found', { headers }).then((r) => r.json()),
      ]);

      if (resRegs.status === 'fulfilled' && resRegs.value.registrations) {
        setRegistrations(resRegs.value.registrations);
      }
      if (resBooks.status === 'fulfilled' && resBooks.value.bookmarks) {
        setBookmarks(resBooks.value.bookmarks);
      }
      if (resComps.status === 'fulfilled' && resComps.value.complaints) {
        setComplaints(resComps.value.complaints);
      }
      if (resLost.status === 'fulfilled' && resLost.value.items) {
        setLostItems(resLost.value.items);
      }
      if (resFound.status === 'fulfilled' && resFound.value.items) {
        setFoundItems(resFound.value.items);
      }
      if (resActivity.status === 'fulfilled') {
        setMyLostItems(resActivity.value.lostItems || []);
        setMyFoundItems(resActivity.value.foundItems || []);
        setMyClaims(resActivity.value.claims || []);
      }
    } catch (err) {
      console.warn('Error loading student hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStudentData();
    }
  }, [isLoggedIn, token]);

  const handleCancelRegistration = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return;
    try {
      const res = await fetch(`/api/student/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (type: string, id: string) => {
    try {
      await fetch(`/api/student/bookmarks/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks((prev) => prev.filter((b) => !(b.itemType === type && b.itemId === id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceForm.subject || !grievanceForm.description) return;

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(grievanceForm),
      });
      if (res.ok) {
        const newComp = await res.json();
        setComplaints((prev) => [newComp, ...prev]);
        setIsGrievanceModalOpen(false);
        setSubmitSuccessMsg('Grievance ticket created successfully. The proctorial desk will review it.');
        setTimeout(() => setSubmitSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitLostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLostFoundError(null);
    try {
      const body = lostForm.type === 'lost'
        ? {
            title: lostForm.title,
            category: lostForm.category,
            locationLost: lostForm.location,
            dateLost: lostForm.date,
            description: lostForm.description,
            imageUrl: lostForm.imageUrl || undefined,
          }
        : {
            title: lostForm.title,
            category: lostForm.category,
            locationFound: lostForm.location,
            dateFound: lostForm.date,
            heldAtOffice: lostForm.heldAtOffice,
            description: lostForm.description,
            imageUrl: lostForm.imageUrl || undefined,
          };
      const res = await fetch(lostForm.type === 'lost' ? '/api/lost-items' : '/api/found-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit the report.');
      setIsLostModalOpen(false);
      setSubmitSuccessMsg(`${lostForm.type === 'lost' ? 'Lost' : 'Found'} item report posted.`);
      setTimeout(() => setSubmitSuccessMsg(null), 4000);
      await fetchStudentData();
    } catch (err) {
      setLostFoundError(err instanceof Error ? err.message : 'Unable to submit the report.');
    }
  };

  const handleFindMatches = async (itemId: string) => {
    setLostFoundError(null);
    setMatchesFor(itemId);
    setMatches([]);
    try {
      const res = await fetch(`/api/lost-items/matches/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to find matching reports.');
      setMatches(data.matches || []);
    } catch (err) {
      setLostFoundError(err instanceof Error ? err.message : 'Unable to find matching reports.');
      setMatchesFor(null);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTarget) return;
    setLostFoundError(null);
    try {
      const res = await fetch('/api/items/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...claimTarget,
          proofDescription: claimProof,
          identifyingMark: claimIdentifyingMark,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit claim.');
      setClaimTarget(null);
      setClaimProof('');
      setClaimIdentifyingMark('');
      setSubmitSuccessMsg('Claim sent for private verification. Track its status in your activity below.');
      setTimeout(() => setSubmitSuccessMsg(null), 4000);
      await fetchStudentData();
    } catch (err) {
      setLostFoundError(err instanceof Error ? err.message : 'Unable to submit claim.');
    }
  };

  const handleReviewClaim = async (
    type: 'lost' | 'found',
    itemId: string,
    claimId: string,
    status: 'Approved for Collection' | 'Rejected'
  ) => {
    setLostFoundError(null);
    try {
      const res = await fetch(`/api/items/${type}/${itemId}/claims/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update claim.');
      await fetchStudentData();
    } catch (err) {
      setLostFoundError(err instanceof Error ? err.message : 'Unable to update claim.');
    }
  };

  // If not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F5EF] px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#203044]/15 p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#16745B]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#203044]">
              Student Digital Hub
            </h2>
            <p className="text-sm text-[#657080] mt-2">
              Sign in to manage your campus event passes, check exam circular bookmarks, submit grievance tickets, and report lost items.
            </p>
          </div>
          <div className="p-3.5 bg-[#F7F5EF] rounded-xl border border-[#203044]/10 text-xs text-[#203044] text-left">
            <strong>Quick Demo Access:</strong> Use the 1-click student demo profile (Aarav Sharma, CSE Sem 6) to test the portal instantly.
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onOpenAuth}
              className="w-full py-3 px-4 bg-[#16745B] hover:bg-[#125d49] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Sign In to Student Hub
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#657080] hover:text-[#203044]"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] pb-24">
      {/* Student Banner Header */}
      <div className="bg-white border-b border-[#203044]/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#16745B] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
                {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-2xl text-[#203044]">{user?.name}</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#16745B] border border-emerald-200">
                    Verified Student
                  </span>
                </div>
                <p className="text-xs text-[#657080] mt-0.5">
                  {user?.department} &bull; Enrollment: <strong>{user?.enrollmentNumber || '02114802722'}</strong> &bull; Semester {user?.semester || 6}
                </p>
                <div className="text-[11px] text-[#657080] mt-1 flex items-center gap-2">
                  <span>Session: 2026–2027</span>
                  <span>&bull;</span>
                  <span>Institutional Email: {user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGrievanceModalOpen(true)}
                className="py-2 px-4 bg-[#873A2B] hover:bg-[#723124] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Submit Grievance / Request
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="py-2 px-4 bg-[#F7F5EF] hover:bg-slate-200 text-[#203044] text-xs font-semibold rounded-xl border border-[#203044]/10 transition-colors cursor-pointer"
              >
                Browse All Campus Events &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Success Alert */}
        {submitSuccessMsg && (
          <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submitSuccessMsg}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="bg-white rounded-xl border border-[#203044]/10 p-1.5 flex flex-wrap gap-1 mb-6 shadow-xs">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'registrations'
                ? 'bg-[#16745B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            My Event Passes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-[#16745B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved Circulars & PYQs ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grievances'
                ? 'bg-[#16745B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            My Grievance Tickets ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('lost-found')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lost-found'
                ? 'bg-[#16745B] text-white shadow-xs'
                : 'text-[#657080] hover:text-[#203044] hover:bg-[#F7F5EF]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Lost & Found ({lostItems.length + foundItems.length})
          </button>
        </div>
        {/* TAB CONTENT */}
        {activeTab === 'lost-found' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#203044]">Campus Lost & Found Bulletin</h3>
                <p className="text-xs text-[#657080]">Public reports hide student contact details. Claims are shared only with the reporter.</p>
              </div>
              <button
                onClick={() => {
                  setLostFoundError(null);
                  setLostForm({ ...lostForm, type: 'lost' });
                  setIsLostModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#873A2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#723124]"
              >
                <Plus className="h-3.5 w-3.5" />
                Report an item
              </button>
            </div>
            {lostFoundError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">{lostFoundError}</div>}
                    <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#657080]" />
                      <input
                        type="search"
                        value={lostFoundSearch}
                        onChange={(event) => setLostFoundSearch(event.target.value)}
                        placeholder="Search item, description, or campus location"
                        className="w-full rounded-lg border border-[#203044]/15 bg-white py-2.5 pl-9 pr-3 text-sm"
                      />
                    </label>
                    <select
                      aria-label="Filter by item category"
                      value={lostFoundCategory}
                      onChange={(event) => setLostFoundCategory(event.target.value)}
                      className="rounded-lg border border-[#203044]/15 bg-white px-3 py-2.5 text-sm"
                    >
                      {['All', 'Electronics', 'Documents', 'Clothing', 'Books', 'Accessories', 'Other'].map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <section className="space-y-3" aria-labelledby="lost-list-heading">
                      <h4 id="lost-list-heading" className="font-serif font-bold text-base text-[#873A2B]">Lost items</h4>
                      {lostItems
                        .filter((item) => lostFoundCategory === 'All' || item.category === lostFoundCategory)
                        .filter((item) => `${item.title} ${item.description} ${item.locationLost}`.toLowerCase().includes(lostFoundSearch.toLowerCase()))
                        .map((item) => (
                          <article key={item.id} className="rounded-xl border border-[#203044]/10 bg-white p-4 shadow-xs">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h5 className="font-semibold text-sm text-[#203044]">{item.title}</h5>
                                <p className="mt-1 text-[11px] text-[#657080]">{item.category} · Lost {item.dateLost} · {item.locationLost}</p>
                              </div>
                              <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-800">{item.status}</span>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-[#657080]">{item.description}</p>
                            <p className="mt-2 text-[10px] text-[#657080]">Contact through Proctorial Verification Desk (Block 1)</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => handleFindMatches(item.id)}
                                className="rounded-lg border border-[#16745B]/25 px-3 py-1.5 text-xs font-semibold text-[#16745B] hover:bg-emerald-50"
                              >
                                Find possible matches
                              </button>
                              <button
                                onClick={() => setClaimTarget({ type: 'lost', itemId: item.id, title: item.title })}
                                className="rounded-lg bg-[#16745B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#125d49]"
                              >
                                Submit claim
                              </button>
                            </div>
                            {matchesFor === item.id && (
                              <div className="mt-3 border-t border-[#203044]/10 pt-3">
                                <p className="mb-2 text-[11px] font-semibold text-[#203044]">Suggested found reports</p>
                                {matches.length === 0 ? (
                                  <p className="text-[11px] text-[#657080]">No close matches yet.</p>
                                ) : matches.map((match) => (
                                  <div key={match.foundItem.id} className="mb-2 rounded-lg bg-[#F7F5EF] p-3 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                      <strong>{match.foundItem.title}</strong>
                                      <span className="text-[#16745B]">{match.matchScore}% match</span>
                                    </div>
                                    <p className="mt-1 text-[10px] text-[#657080]">{match.matchReasons.join(' · ')}</p>
                                    <button
                                      onClick={() => setClaimTarget({ type: 'found', itemId: match.foundItem.id, title: match.foundItem.title })}
                                      className="mt-2 text-[11px] font-semibold text-[#873A2B] underline"
                                    >
                                      Claim this found item
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </article>
                        ))}
                      {lostItems.length === 0 && <p className="rounded-lg bg-white p-5 text-xs text-[#657080]">No lost-item reports yet.</p>}
                    </section>

                    <section className="space-y-3" aria-labelledby="found-list-heading">
                      <h4 id="found-list-heading" className="font-serif font-bold text-base text-[#16745B]">Found items</h4>
                      {foundItems
                        .filter((item) => lostFoundCategory === 'All' || item.category === lostFoundCategory)
                        .filter((item) => `${item.title} ${item.description} ${item.locationFound}`.toLowerCase().includes(lostFoundSearch.toLowerCase()))
                        .map((item) => (
                          <article key={item.id} className="rounded-xl border border-[#203044]/10 bg-white p-4 shadow-xs">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h5 className="font-semibold text-sm text-[#203044]">{item.title}</h5>
                                <p className="mt-1 text-[11px] text-[#657080]">{item.category} · Found {item.dateFound} · {item.locationFound}</p>
                              </div>
                              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">{item.status}</span>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-[#657080]">{item.description}</p>
                            <p className="mt-2 text-[10px] font-semibold text-[#16745B]">Held at: {item.heldAtOffice}</p>
                            {item.status !== 'Returned' && (
                              <button
                                onClick={() => setClaimTarget({ type: 'found', itemId: item.id, title: item.title })}
                                className="mt-3 rounded-lg bg-[#16745B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#125d49]"
                              >
                                This may be mine
                              </button>
                            )}
                          </article>
                        ))}
                      {foundItems.length === 0 && <p className="rounded-lg bg-white p-5 text-xs text-[#657080]">No found-item reports yet.</p>}
                    </section>
                  </div>

                  <section className="space-y-3 border-t border-[#203044]/10 pt-5">
                    <h4 className="font-serif font-bold text-base text-[#203044]">Your reports and claims</h4>
                    {myLostItems.length + myFoundItems.length === 0 && myClaims.length === 0 ? (
                      <p className="rounded-lg bg-white p-5 text-xs text-[#657080]">Your reports and claim requests will appear here.</p>
                    ) : (
                      <div className="grid gap-3 lg:grid-cols-2">
                        {[...myLostItems, ...myFoundItems].map((item) => {
                          const itemType = 'reportedByStudentId' in item ? 'lost' : 'found';
                          const claims = item.claimRequests || [];
                          return (
                            <article key={item.id} className="rounded-xl border border-[#203044]/10 bg-white p-4">
                              <h5 className="font-semibold text-sm">{item.title} <span className="font-normal text-[#657080]">· Your {itemType} report</span></h5>
                              {claims.length === 0 ? <p className="mt-2 text-[11px] text-[#657080]">No claims have been submitted.</p> : claims.map((claim) => (
                                <div key={claim.id} className="mt-3 border-t border-[#203044]/10 pt-3 text-xs">
                                  <div className="flex justify-between gap-2">
                                    <strong>{claim.studentName}</strong>
                                    <span>{claim.status}</span>
                                  </div>
                                  <p className="mt-1 text-[#657080]">Proof: {claim.proofDescription}</p>
                                  {claim.identifyingMark && <p className="mt-1 text-[#657080]">Identifying mark: {claim.identifyingMark}</p>}
                                  {claim.status === 'Pending Verification' && (
                                    <div className="mt-2 flex gap-2">
                                      <button onClick={() => handleReviewClaim(itemType, item.id, claim.id, 'Approved for Collection')} className="rounded-md bg-[#16745B] px-2.5 py-1.5 text-[11px] font-semibold text-white">Approve collection</button>
                                      <button onClick={() => handleReviewClaim(itemType, item.id, claim.id, 'Rejected')} className="rounded-md border border-[#873A2B]/30 px-2.5 py-1.5 text-[11px] font-semibold text-[#873A2B]">Reject</button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </article>
                          );
                        })}
                        {myClaims.map(({ type, itemId, itemTitle, claim }) => (
                          <article key={claim.id} className="rounded-xl border border-[#203044]/10 bg-white p-4 text-xs">
                            <div className="flex justify-between gap-2"><strong>{itemTitle}</strong><span>{claim.status}</span></div>
                            <p className="mt-1 text-[#657080]">Your claim on a {type} report · submitted {new Date(claim.requestedAt).toLocaleDateString()}</p>
                            {claim.verificationNotes && <p className="mt-2 text-[#657080]">Review note: {claim.verificationNotes}</p>}
                            <span className="sr-only">Report {itemId}</span>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
        )}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#203044]">Confirmed Event Registrations & Admission Passes</h3>
              <span className="text-xs text-[#657080]">Show this digital barcode pass at event entry desks</span>
            </div>
            {registrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#203044]/10 p-12 text-center space-y-3">
                <Ticket className="w-10 h-10 text-[#657080] mx-auto opacity-50" />
                <h4 className="font-serif font-bold text-base text-[#203044]">No registered events yet</h4>
                <p className="text-xs text-[#657080] max-w-sm mx-auto">
                  Browse hackathons, technical workshops, and cultural symposiums on the Campus Events platform.
                </p>
                <button
                  onClick={() => onNavigate('events')}
                  className="py-2 px-4 bg-[#16745B] text-white text-xs font-semibold rounded-xl hover:bg-[#125d49] transition-colors cursor-pointer"
                >
                  Explore Upcoming Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl border border-[#203044]/10 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 border-b border-[#203044]/10 bg-[#F7F5EF]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {reg.status} PASS
                        </span>
                        <span className="text-xs font-mono font-bold text-[#873A2B]">{reg.ticketCode}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#203044]">{reg.eventTitle}</h4>
                      <div className="text-xs text-[#657080] flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#16745B]" />
                          {reg.eventDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#873A2B]" />
                          {reg.eventVenue}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-8 h-8 text-[#203044]" />
                        <div className="text-[10px] text-[#657080]">
                          <div>Attendee: {reg.studentName}</div>
                          <div>ID: {reg.enrollmentNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTicket(reg)}
                          className="py-1.5 px-3 bg-[#F7F5EF] hover:bg-slate-200 text-xs font-semibold rounded-lg text-[#203044] border border-[#203044]/10 cursor-pointer"
                        >
                          View Pass
                        </button>
                        <button
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="py-1.5 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#203044]">
              Saved Official Notices, Syllabi & Resources
            </h3>
            {bookmarks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#203044]/10 p-12 text-center text-xs text-[#657080]">
                No bookmarked circulars or syllabi. Save notices from the Notice Board or Academic Resource Centre.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bookmarks.map((b) => (
                  <div key={b.id} className="p-4 bg-white rounded-xl border border-[#203044]/10 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#203044]">
                        {b.itemType.toUpperCase()}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#203044] mt-1">{b.itemTitle}</h4>
                      <span className="text-[11px] text-[#657080]">{b.itemCategory}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(b.itemType, b.itemId)}
                      className="p-1.5 text-[#657080] hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GRIEVANCES */}
        {activeTab === 'grievances' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#203044]">
                  Grievance Tickets & Redressal Status
                </h3>
                <p className="text-xs text-[#657080]">Track campus maintenance and academic requests</p>
                <p className="text-[11px] font-semibold text-[#873A2B]">Student-built prototype; not an official MAIT grievance channel.</p>
              </div>
              <button
                onClick={() => setIsGrievanceModalOpen(true)}
                className="py-2 px-4 bg-[#873A2B] hover:bg-[#723124] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                File New Grievance
              </button>
            </div>

            <div className="space-y-3">
              {complaints.map((comp) => (
                <div key={comp.id} className="bg-white rounded-xl border border-[#203044]/10 p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#873A2B]">{comp.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'Under Review'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#203044]">{comp.subject}</h4>
                  <p className="text-xs text-[#657080]">{comp.description}</p>
                  <div className="text-[11px] text-[#657080] flex items-center gap-3 pt-1 border-t border-[#203044]/5">
                    <span>Category: <strong>{comp.category}</strong></span>
                    <span>&bull;</span>
                    <span>Location: {comp.location}</span>
                    <span>&bull;</span>
                    <span>Submitted: {new Date(comp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {comp.adminRemarks && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-900 mt-2">
                      <strong>Admin Resolution Note:</strong> {comp.adminRemarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* TICKET PASS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#203044]/10 max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-[#16745B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#873A2B] uppercase">
                Official Event Admission Pass
              </span>
              <h3 className="font-serif font-bold text-lg text-[#203044] mt-1">{selectedTicket.eventTitle}</h3>
            </div>
            <div className="p-4 bg-[#F7F5EF] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#657080]">Date:</span>
                <strong className="text-[#203044]">{selectedTicket.eventDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#657080]">Venue:</span>
                <strong className="text-[#203044]">{selectedTicket.eventVenue}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#657080]">Ticket Code:</span>
                <strong className="font-mono text-[#873A2B]">{selectedTicket.ticketCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#657080]">Student:</span>
                <strong className="text-[#203044]">{selectedTicket.studentName}</strong>
              </div>
            </div>
            <div className="py-2 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-[#203044]" />
            </div>
            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 px-4 bg-[#203044] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* GRIEVANCE SUBMIT MODAL */}
      {isGrievanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#203044]/10 max-w-lg w-full">
            <div className="bg-[#873A2B] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">File Grievance / Maintenance Request</h3>
              <button onClick={() => setIsGrievanceModalOpen(false)} className="text-white/80 hover:text-white">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitGrievance} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Grievance Category</label>
                  <select
                    value={grievanceForm.category}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  >
                    <option value="Infrastructure">Campus Infrastructure / AC / Desks</option>
                    <option value="Academic">Academic Curriculum / Lecture Scheduling</option>
                    <option value="Library">Library Resources & Books</option>
                    <option value="Hostel">Hostel Facilities & Accommodation</option>
                    <option value="Mess">Cafeteria & Food Hygiene</option>
                    <option value="Administration">Exam Branch / Administrative Verification</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Priority</label>
                  <select
                    value={grievanceForm.priority}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  value={grievanceForm.subject}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
                  placeholder="Brief summary of the issue"
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Exact Campus Location</label>
                <input
                  type="text"
                  value={grievanceForm.location}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, location: e.target.value })}
                  placeholder="e.g. Block 1, Room 114"
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Description *</label>
                <textarea
                  value={grievanceForm.description}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                  placeholder="Provide complete details to help the maintenance/proctorial team..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGrievanceModalOpen(false)}
                  className="px-4 py-2 border border-[#203044]/20 rounded-xl text-[#657080]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#873A2B] hover:bg-[#723124] text-white font-semibold rounded-xl"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOST ITEM MODAL */}
      {isLostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div role="dialog" aria-modal="true" aria-labelledby="lost-found-modal-title" className="bg-white rounded-xl shadow-2xl border border-[#203044]/10 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 id="lost-found-modal-title" className="font-serif font-bold text-base text-[#203044]">Report a campus item</h3>
              <p className="mt-1 text-xs text-[#657080]">Personal contact details are not published.</p>
            </div>
            <div role="group" aria-label="Report type" className="grid grid-cols-2 gap-2 rounded-lg bg-[#F7F5EF] p-1">
              {(['lost', 'found'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={lostForm.type === type}
                  onClick={() => setLostForm({ ...lostForm, type })}
                  className={`rounded-md px-3 py-2 text-xs font-semibold capitalize ${lostForm.type === type ? 'bg-[#16745B] text-white' : 'text-[#657080]'}`}
                >
                  {type} item
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmitLostItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Item Title *</label>
                <input
                  type="text"
                  value={lostForm.title}
                  onChange={(e) => setLostForm({ ...lostForm, title: e.target.value })}
                  maxLength={120}
                  placeholder="Describe the item briefly"
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select value={lostForm.category} onChange={(e) => setLostForm({ ...lostForm, category: e.target.value })} className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg">
                    {['Electronics', 'Documents', 'Clothing', 'Books', 'Accessories', 'Other'].map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">{lostForm.type === 'lost' ? 'Date lost' : 'Date found'} *</label>
                  <input type="date" value={lostForm.date} onChange={(e) => setLostForm({ ...lostForm, date: e.target.value })} required className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Approximate campus location *</label>
                <input
                  type="text"
                  value={lostForm.location}
                  onChange={(e) => setLostForm({ ...lostForm, location: e.target.value })}
                  maxLength={160}
                  placeholder="Building, floor, or nearby facility"
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description and identifying details *</label>
                <textarea
                  value={lostForm.description}
                  onChange={(e) => setLostForm({ ...lostForm, description: e.target.value })}
                  maxLength={2000}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg"
                />
              </div>
              {lostForm.type === 'found' && (
                <div>
                  <label className="block font-semibold mb-1">Held at</label>
                  <input type="text" value={lostForm.heldAtOffice} onChange={(e) => setLostForm({ ...lostForm, heldAtOffice: e.target.value })} maxLength={160} className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg" />
                </div>
              )}
              <div>
                <label className="block font-semibold mb-1">Photo URL (optional)</label>
                <input type="url" value={lostForm.imageUrl} onChange={(e) => setLostForm({ ...lostForm, imageUrl: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-[#203044]/20 rounded-lg" />
                <p className="mt-1 text-[10px] text-[#657080]">Direct file upload is unavailable until a campus storage service is configured.</p>
              </div>
              {lostFoundError && <p role="alert" className="text-xs text-red-700">{lostFoundError}</p>}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLostModalOpen(false)}
                  className="px-4 py-2 border border-[#203044]/20 rounded-lg text-[#657080]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#873A2B] text-white font-semibold rounded-lg"
                >
                  Post Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {claimTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203044]/60 backdrop-blur-xs">
          <div role="dialog" aria-modal="true" aria-labelledby="claim-modal-title" className="w-full max-w-md space-y-4 rounded-xl border border-[#203044]/10 bg-white p-6 shadow-2xl">
            <div>
              <h3 id="claim-modal-title" className="font-serif font-bold text-base text-[#203044]">Claim {claimTarget.title}</h3>
              <p className="mt-1 text-xs text-[#657080]">Your claim details are visible only to the report owner and authorized administrators.</p>
            </div>
            <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold">Proof of ownership *</label>
                <textarea value={claimProof} onChange={(event) => setClaimProof(event.target.value)} maxLength={1000} rows={4} required className="w-full rounded-lg border border-[#203044]/20 px-3 py-2" placeholder="Describe details only the owner would know." />
              </div>
              <div>
                <label className="mb-1 block font-semibold">Identifying mark (optional)</label>
                <input value={claimIdentifyingMark} onChange={(event) => setClaimIdentifyingMark(event.target.value)} maxLength={300} className="w-full rounded-lg border border-[#203044]/20 px-3 py-2" />
              </div>
              {lostFoundError && <p role="alert" className="text-xs text-red-700">{lostFoundError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setClaimTarget(null)} className="rounded-lg border border-[#203044]/20 px-4 py-2 text-[#657080]">Cancel</button>
                <button type="submit" className="rounded-lg bg-[#16745B] px-4 py-2 font-semibold text-white">Send claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
