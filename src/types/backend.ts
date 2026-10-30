/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — DATA SCHEMAS & TYPES (PHASE 5 + PHASE 6)
 * Core Models for Complete Student Hub & Institutional Services
 */

export type UserRole = 'Student' | 'Content Editor' | 'Administrator';

export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  enrollmentNumber?: string;
  semester?: number;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface RolePermission {
  id: string;
  name: UserRole;
  description: string;
  canManageNotices: boolean;
  canManageEvents: boolean;
  canManagePlacements: boolean;
  canManageDepartments: boolean;
  canManageResources: boolean;
  canManageGrievances: boolean;
  canManageUsers: boolean;
  canViewAuditLogs: boolean;
  canManageAiDocs: boolean;
}

export interface DepartmentRecord {
  id: string;
  code: string;
  name: string;
  establishedYear: number;
  block: string;
  hodName: string;
  hodEmail: string;
  intakeSeats: number;
  programs: string[];
  vision: string;
  mission: string[];
  laboratoriesCount: number;
  facultyCount: number;
  officialUrl: string;
  status: 'Active' | 'Archived';
  updatedAt: string;
}

export type NoticeCategory =
  | 'Examination'
  | 'Admissions'
  | 'Academic'
  | 'Registration'
  | 'Scholarships'
  | 'Administration'
  | 'Events'
  | 'Placements'
  | 'Other';

export interface NoticeRecord {
  id: string;
  refNo: string;
  title: string;
  summary: string;
  fullContent?: string[];
  category: NoticeCategory;
  department: string;
  semesterApplicable?: string;
  academicYear: string;
  publicationDate: string;
  displayDate: string;
  issuer: string;
  issuerDesignation: string;
  isImportant: boolean;
  isUrgent: boolean;
  isDraft: boolean;
  isArchived: boolean;
  scheduledPublishAt?: string;
  hasAttachment: boolean;
  attachmentFileName?: string;
  attachmentFileType?: string;
  attachmentSize?: string;
  documentDownloadUrl?: string;
  officialSourceUrl: string;
  viewCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Workshop'
  | 'Seminar'
  | 'Competition'
  | 'Hackathon'
  | 'Club Activity'
  | 'Sports'
  | 'Placement Drive'
  | 'Academic';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface EventRecord {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  category: EventCategory;
  department: string;
  organizer: string;
  date: string;
  displayDate: string;
  time: string;
  venue: string;
  mode: 'Offline' | 'Online' | 'Hybrid';
  registrationDeadline: string;
  maxCapacity: number;
  registeredCount: number;
  entryFee: string;
  prizesOrCertificates?: string;
  contactEmail: string;
  status: EventStatus;
  isFeatured: boolean;
  officialSourceUrl: string;
  coverImage?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementRecord {
  id: string;
  academicYear: string;
  highestPackageLpa: number;
  averagePackageLpa: number;
  medianPackageLpa: number;
  totalOffers: number;
  companiesVisited: number;
  placementPercentage: number;
  highlights: string[];
  topOffers: {
    studentName: string;
    branch: string;
    company: string;
    lpa: number;
  }[];
  createdBy: string;
  updatedAt: string;
}

export interface RecruiterRecord {
  id: string;
  name: string;
  tier: 'Marquee (20+ LPA)' | 'Super Dream (10-20 LPA)' | 'Dream (6-10 LPA)' | 'Mass / Core (4-6 LPA)';
  industry: string;
  minPackageLpa: number;
  maxPackageLpa: number;
  visitsPerYear: number;
  logoText: string;
  isFortune500: boolean;
  activeRecruitment: boolean;
  verifiedBy: string;
  updatedAt: string;
}

export interface AcademicResourceRecord {
  id: string;
  title: string;
  departmentCode: string;
  semester: number;
  resourceType: 'Syllabus' | 'Calendar' | 'PYQ' | 'Form' | 'LabManual' | 'Handbook';
  subjectName?: string;
  subjectCode?: string;
  downloadPdfUrl: string;
  fileName: string;
  fileSize: string;
  academicYear: string;
  downloadsCount: number;
  isOfficial: boolean;
  uploadedBy: string;
  createdAt: string;
}

export interface FacilityRecord {
  id: string;
  name: string;
  category: 'Academic' | 'Sports' | 'Hostel' | 'Cafeteria' | 'Medical' | 'Library' | 'Transport';
  blockLocation: string;
  openingHours: string;
  inChargeName: string;
  description: string;
  features: string[];
  status: 'Operational' | 'Maintenance' | 'Restricted';
  updatedAt: string;
}

// ==========================================
// PHASE 6: LOST & FOUND SCHEMAS
// ==========================================
export interface ItemClaimRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentNumber: string;
  proofDescription: string;
  identifyingMark: string;
  status: 'Pending Verification' | 'Approved for Collection' | 'Rejected';
  requestedAt: string;
  verificationNotes?: string;
}

export interface LostItemRecord {
  id: string;
  title: string;
  category: 'Electronics' | 'Documents' | 'Clothing' | 'Books' | 'Accessories' | 'Other';
  reportedByStudentId: string;
  reportedByName: string;
  locationLost: string;
  dateLost: string;
  description: string;
  contactEmail: string;
  imageUrl?: string;
  status: 'Open' | 'Claim Requested' | 'Claimed' | 'Closed';
  claimRequests?: ItemClaimRequest[];
  createdAt: string;
}

export interface FoundItemRecord {
  id: string;
  title: string;
  category: 'Electronics' | 'Documents' | 'Clothing' | 'Books' | 'Accessories' | 'Other';
  foundByStudentId: string;
  foundByName: string;
  locationFound: string;
  dateFound: string;
  heldAtOffice: string;
  description: string;
  imageUrl?: string;
  status: 'Unclaimed' | 'Claim Requested' | 'Returned';
  claimRequests?: ItemClaimRequest[];
  createdAt: string;
}

// ==========================================
// PHASE 6: COMPLAINT & GRIEVANCE SCHEMAS
// ==========================================
export type ComplaintCategory =
  | 'Classroom Equipment'
  | 'Projector & AV'
  | 'Wi-Fi & Network'
  | 'Water Cooler & Hygiene'
  | 'Washroom Maintenance'
  | 'Library Facility'
  | 'Lab Hardware & Benches'
  | 'Hostel & Mess'
  | 'Administration';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Pending' | 'Under Review' | 'In Progress' | 'Resolved' | 'Rejected';

export interface ComplaintHistoryEntry {
  status: ComplaintStatus;
  timestamp: string;
  remarks: string;
  updatedBy: string;
}

export interface ComplaintRecord {
  id: string;
  trackingId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentNumber: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  imageUrl?: string;
  adminRemarks?: string;
  history: ComplaintHistoryEntry[];
  studentRating?: number;
  studentFeedback?: string;
  isFlaggedDuplicate?: boolean;
  duplicateOfId?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// PHASE 6: NOTES & PYQ SCHEMAS
// ==========================================
export interface NotesResourceRecord {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: number;
  resourceType: 'Lecture Notes' | 'Handwritten' | 'PYQ Paper' | 'Formula Sheet' | 'Lab Solution';
  year?: string;
  examType?: 'End-Term' | 'Mid-Term' | 'Practical';
  authorName: string;
  authorStudentId: string;
  fileUrl: string;
  fileSize: string;
  downloadsCount: number;
  likesCount: number;
  ratingAverage: number;
  ratingsCount: number;
  verifiedByFaculty: boolean;
  moderationStatus: 'Approved' | 'Under Review' | 'Flagged';
  reportedCount: number;
  createdAt: string;
}

// ==========================================
// PHASE 6: OPPORTUNITY RADAR SCHEMAS
// ==========================================
export interface OpportunityRecord {
  id: string;
  title: string;
  type: 'Internship' | 'Hackathon' | 'Competition' | 'Scholarship' | 'Workshop' | 'Campus Ambassador';
  organizer: string;
  eligibility: string;
  skillsRequired: string[];
  stipendOrPrize: string;
  deadline: string;
  applyUrl: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  status: 'Active' | 'Closing Soon' | 'Expired';
  postedBy: string;
  createdAt: string;
}

export interface TrackedApplication {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunityTitle: string;
  companyOrOrganizer: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Selected' | 'Rejected';
  appliedDate?: string;
  notes: string;
  updatedAt: string;
}

// ==========================================
// PHASE 6: CAMPUS QUEUE TRACKER SCHEMAS
// ==========================================
export type QueueLocationKey =
  | 'canteen'
  | 'nescafe'
  | 'admin-fee-counter'
  | 'library-desk'
  | 'exam-cell'
  | 'stationery-shop';

export interface CrowdReport {
  id: string;
  studentId: string;
  studentName: string;
  locationKey: QueueLocationKey;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak Surge';
  estimatedWaitMinutes: number;
  comment?: string;
  reportedAt: string;
}

export interface QueueLocationStatus {
  key: QueueLocationKey;
  name: string;
  block: string;
  currentCrowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak Surge';
  estimatedWaitMinutes: number;
  lastReportedTime: string;
  recentReports: CrowdReport[];
  historicalPeakTimes: string;
}

// ==========================================
// PHASE 6: ACADEMIC PLANNER SCHEMAS
// ==========================================
export interface PlannerTask {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  type: 'Assignment' | 'Lab Record' | 'Project Milestone' | 'Revision';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  createdAt: string;
}

export interface SubjectAttendanceRecord {
  id: string;
  studentId: string;
  subjectCode: string;
  subjectName: string;
  classesAttended: number;
  totalClassesHeld: number;
}

// ==========================================
// PHASE 6: CAMPUS & CLASSROOM FINDER SCHEMAS
// ==========================================
export interface CampusRoomRecord {
  id: string;
  roomNumber: string;
  name: string;
  blockId: string;
  blockName: string;
  floor: 'Ground Floor' | '1st Floor' | '2nd Floor' | '3rd Floor' | '4th Floor' | '5th Floor';
  category: 'Classroom' | 'Computing Lab' | 'Hardware Lab' | 'Auditorium' | 'Faculty Cabin' | 'Restroom' | 'Amenity';
  capacity?: number;
  equipment?: string[];
  nearbyAmenities: string[];
  timetableSummary?: string;
}

// ==========================================
// EVENT REGISTRATIONS & SAVED ITEMS
// ==========================================
export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentNumber: string;
  department: string;
  semester: number;
  ticketCode: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  registeredAt: string;
}

export interface SavedItemRecord {
  id: string;
  studentId: string;
  itemType: 'notice' | 'event' | 'resource' | 'opportunity' | 'note';
  itemId: string;
  itemTitle: string;
  itemCategory: string;
  savedAt: string;
}

export interface NotificationRecord {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 'System' | 'Notice' | 'Event' | 'Grievance' | 'Placement' | 'Queue' | 'LostFound';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AiDocumentRecord {
  id: string;
  title: string;
  category: 'Statutes' | 'Curriculum' | 'Ordinance' | 'Affiliation' | 'ExamRules' | 'Guidelines';
  sourceUrl: string;
  contentSummary: string;
  tokenCount: number;
  lastVerifiedDate: string;
  isApprovedForGrounding: boolean;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'LOGIN' | 'STATUS_CHANGE';
  entityType:
    | 'notice'
    | 'event'
    | 'placement'
    | 'recruiter'
    | 'complaint'
    | 'user'
    | 'department'
    | 'resource'
    | 'opportunity'
    | 'facility'
    | 'lost_found'
    | 'queue';
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
