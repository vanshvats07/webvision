/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — DATABASE ENGINE (PHASE 5 + PHASE 6)
 * In-memory relational & document data store with file persistence and automated audit logging
 * Covers 18 core models + 8 Real-World Student Hub Modules + audit trails
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  User,
  RolePermission,
  DepartmentRecord,
  NoticeRecord,
  EventRecord,
  PlacementRecord,
  RecruiterRecord,
  AcademicResourceRecord,
  FacilityRecord,
  LostItemRecord,
  FoundItemRecord,
  ItemClaimRequest,
  ComplaintRecord,
  NotesResourceRecord,
  OpportunityRecord,
  TrackedApplication,
  EventRegistrationRecord,
  SavedItemRecord,
  NotificationRecord,
  AiDocumentRecord,
  AuditLogRecord,
  QueueLocationStatus,
  CrowdReport,
  PlannerTask,
  SubjectAttendanceRecord,
  CampusRoomRecord,
} from '../types/backend.js';
import { SMART_NOTICES_DATA, CAMPUS_EVENTS_DATA, BATCH_PLACEMENT_DATA, RECRUITER_DIRECTORY_DATA } from '../data/phase3Data.js';
import { DETAILED_DEPARTMENTS, ACADEMIC_SYLLABI_DATA, ACADEMIC_FORMS_DATA } from '../data/phase4Data.js';

dotenv.config({ path: ['.env.local', '.env'] });

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_MAX_AGE_MS = 12 * 60 * 60 * 1000;

if (process.env.NODE_ENV === 'production' && !process.env.AUTH_TOKEN_SECRET) {
  throw new Error('AUTH_TOKEN_SECRET must be configured in production.');
}

// New passwords use per-user scrypt salts; legacy hashes are upgraded on successful login.
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith('scrypt$')) {
    const [, salt, expectedHex] = storedHash.split('$');
    if (!salt || !expectedHex) return false;
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
  }

  const legacyHash = crypto.createHash('sha256').update(`mait_salt_2026_${password}`).digest();
  const expected = Buffer.from(storedHash, 'hex');
  return expected.length === legacyHash.length && crypto.timingSafeEqual(legacyHash, expected);
}

export function generateToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({
    userId,
    issuedAt: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function parseToken(token: string): string | null {
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;

    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest();
    const provided = Buffer.from(signature, 'base64url');
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const age = Date.now() - decoded.issuedAt;
    if (typeof decoded.userId !== 'string' || !decoded.userId || age < 0 || age > TOKEN_MAX_AGE_MS) return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

interface DatabaseState {
  users: User[];
  roles: RolePermission[];
  departments: DepartmentRecord[];
  notices: NoticeRecord[];
  events: EventRecord[];
  placements: PlacementRecord[];
  recruiters: RecruiterRecord[];
  academic_resources: AcademicResourceRecord[];
  facilities: FacilityRecord[];
  lost_items: LostItemRecord[];
  found_items: FoundItemRecord[];
  complaints: ComplaintRecord[];
  notes_resources: NotesResourceRecord[];
  opportunities: OpportunityRecord[];
  tracked_applications: TrackedApplication[];
  event_registrations: EventRegistrationRecord[];
  saved_items: SavedItemRecord[];
  notifications: NotificationRecord[];
  ai_documents: AiDocumentRecord[];
  queue_locations: QueueLocationStatus[];
  queue_reports: CrowdReport[];
  planner_tasks: PlannerTask[];
  subject_attendance: SubjectAttendanceRecord[];
  campus_rooms: CampusRoomRecord[];
  audit_logs: AuditLogRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'mait_database.json');

class DatabaseEngine {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.notices && parsed.events && parsed.campus_rooms && parsed.queue_locations) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing default seed:', err);
    }

    return this.createSeedData();
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  private createSeedData(): DatabaseState {
    const now = new Date().toISOString();

    // 1. Roles
    const roles: RolePermission[] = [
      {
        id: 'role-admin',
        name: 'Administrator',
        description: 'Full institutional authority, system configuration, audit logs, CMS & user control',
        canManageNotices: true,
        canManageEvents: true,
        canManagePlacements: true,
        canManageDepartments: true,
        canManageResources: true,
        canManageGrievances: true,
        canManageUsers: true,
        canViewAuditLogs: true,
        canManageAiDocs: true,
      },
      {
        id: 'role-editor',
        name: 'Content Editor',
        description: 'Authorized departmental content editor, can publish notices, events, and update resources',
        canManageNotices: true,
        canManageEvents: true,
        canManagePlacements: true,
        canManageDepartments: false,
        canManageResources: true,
        canManageGrievances: false,
        canManageUsers: false,
        canViewAuditLogs: false,
        canManageAiDocs: false,
      },
      {
        id: 'role-student',
        name: 'Student',
        description: 'Enrolled student account, can register for campus events, submit grievances, access notes',
        canManageNotices: false,
        canManageEvents: false,
        canManagePlacements: false,
        canManageDepartments: false,
        canManageResources: false,
        canManageGrievances: true,
        canManageUsers: false,
        canViewAuditLogs: false,
        canManageAiDocs: false,
      },
    ];

    // 2. Demo Users
    const users: User[] = [
      {
        id: 'usr-admin-01',
        name: 'Prof. Administrative Officer',
        email: 'demo-admin@mait.ac.in',
        passwordHash: hashPassword('MaitAdmin@2026'),
        role: 'Administrator',
        department: 'Central Administration',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'Active',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'usr-editor-01',
        name: 'Editorial Office MAIT',
        email: 'demo-editor@mait.ac.in',
        passwordHash: hashPassword('MaitEditor@2026'),
        role: 'Content Editor',
        department: 'Public Relations & Academic Circulars',
        status: 'Active',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: now,
      },
      {
        id: 'usr-student-01',
        name: 'Aarav Sharma',
        email: 'demo-student@mait.ac.in',
        passwordHash: hashPassword('MaitStudent@2026'),
        role: 'Student',
        department: 'Computer Science & Engineering',
        enrollmentNumber: '02114802722',
        semester: 6,
        phone: '+91 98110 54321',
        bio: 'Pre-final year CSE student passionate about distributed systems and open source.',
        status: 'Active',
        createdAt: '2026-08-15T12:00:00.000Z',
        updatedAt: now,
      },
    ];

    // 3. Departments
    const departments: DepartmentRecord[] = DETAILED_DEPARTMENTS.map((dept) => ({
      id: dept.id,
      code: dept.code,
      name: dept.name,
      establishedYear: dept.establishedYear,
      block: dept.block,
      hodName: dept.hodName,
      hodEmail: dept.hodEmail,
      intakeSeats: dept.intakeSeats,
      programs: dept.programs,
      vision: dept.vision,
      mission: dept.mission,
      laboratoriesCount: dept.laboratories.length,
      facultyCount: dept.facultyRoster.length,
      officialUrl: dept.officialUrl,
      status: 'Active',
      updatedAt: now,
    }));

    // 4. Notices
    const notices: NoticeRecord[] = SMART_NOTICES_DATA.map((n, i) => ({
      id: n.id,
      refNo: n.refNo,
      title: n.title,
      summary: n.summary,
      fullContent: n.fullContent,
      category: (n.category === 'Circulars' ? 'Administration' : n.category) as any,
      department: n.department,
      semesterApplicable: n.semesterApplicable,
      academicYear: n.academicYear,
      publicationDate: n.publicationDate,
      displayDate: n.displayDate,
      issuer: n.issuer,
      issuerDesignation: n.issuerDesignation,
      isImportant: n.isImportant,
      isUrgent: n.isUrgent,
      isDraft: false,
      isArchived: false,
      hasAttachment: n.hasAttachment,
      attachmentFileName: n.attachmentFileName,
      attachmentFileType: n.attachmentFileType,
      attachmentSize: n.attachmentSize,
      documentDownloadUrl: n.documentDownloadUrl,
      officialSourceUrl: n.officialSourceUrl,
      viewCount: 120 + i * 45,
      createdBy: 'usr-admin-01',
      createdAt: n.publicationDate + 'T09:00:00.000Z',
      updatedAt: now,
    }));

    // 5. Events
    const events: EventRecord[] = CAMPUS_EVENTS_DATA.map((ev, i) => ({
      id: ev.id,
      title: ev.title,
      tagline: ev.shortTagline,
      description: ev.description,
      category: (ev.category === 'Competitions' ? 'Competition' : ev.category) as any,
      department: ev.organizer,
      organizer: ev.organizer,
      date: ev.startDate,
      displayDate: ev.displayDate,
      time: ev.time,
      venue: ev.venue,
      mode: 'Offline',
      registrationDeadline: ev.registrationDeadline,
      maxCapacity: 350,
      registeredCount: 45 + i * 18,
      entryFee: 'Free (Institutional)',
      prizesOrCertificates: ev.prizesOrCertificates || 'Merit Certificate & Trophy',
      contactEmail: 'events@mait.ac.in',
      status: (ev.status === 'Upcoming' ? 'Upcoming' : 'Completed') as any,
      isFeatured: i < 3,
      officialSourceUrl: ev.officialSourceUrl,
      createdBy: 'usr-editor-01',
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: now,
    }));

    // 6. Placements
    const placements: PlacementRecord[] = BATCH_PLACEMENT_DATA.map((p) => ({
      id: `place-${p.batchAcademicYear.replace('/', '-')}`,
      academicYear: p.batchAcademicYear,
      highestPackageLpa: p.highestPackageDomesticLPA,
      averagePackageLpa: p.averagePackageLPA,
      medianPackageLpa: p.medianPackageLPA,
      totalOffers: p.totalOffers,
      companiesVisited: p.companiesVisited,
      placementPercentage: Math.round((p.uniqueStudentsPlaced / (p.totalOffers * 0.9)) * 100),
      highlights: [
        `Highest domestic offer: ₹${p.highestPackageDomesticLPA} LPA (${p.topDomesticCompany})`,
        p.topInternationalCompany ? `International offer: ₹${p.highestPackageInternationalLPA} LPA (${p.topInternationalCompany})` : `Defense Commissioned Offers: ${p.defenseRecruitmentOffers}`,
      ],
      topOffers: [
        { studentName: 'Ayush Goel', branch: 'CSE', company: 'Amazon AWS', lpa: 54.0 },
        { studentName: 'Rhea Singhal', branch: 'IT', company: 'Atlassian', lpa: 51.5 },
        { studentName: 'Devansh Verma', branch: 'ECE', company: 'Google', lpa: 48.0 },
      ],
      createdBy: 'usr-admin-01',
      updatedAt: now,
    }));

    // 7. Recruiters
    const recruiters: RecruiterRecord[] = RECRUITER_DIRECTORY_DATA.map((r, i) => ({
      id: `rec-${i + 1}`,
      name: r.companyName,
      tier: (r.tier.includes('20') ? 'Marquee (20+ LPA)' : r.tier.includes('10') ? 'Super Dream (10-20 LPA)' : 'Dream (6-10 LPA)') as any,
      industry: r.sector,
      minPackageLpa: Math.round(r.topPackageOfferedLPA * 0.5),
      maxPackageLpa: r.topPackageOfferedLPA,
      visitsPerYear: 2,
      logoText: r.companyName.substring(0, 3).toUpperCase(),
      isFortune500: r.topPackageOfferedLPA >= 18,
      activeRecruitment: true,
      verifiedBy: 'T&P Cell MAIT',
      updatedAt: now,
    }));

    // 8. Academic Resources
    const academic_resources: AcademicResourceRecord[] = [
      ...ACADEMIC_SYLLABI_DATA.map((s, i) => ({
        id: `syl-${s.id}`,
        title: `${s.departmentCode} Sem ${s.semester} Scheme & Syllabus`,
        departmentCode: s.departmentCode,
        semester: s.semester,
        resourceType: 'Syllabus' as const,
        subjectName: s.schemeTitle,
        downloadPdfUrl: s.downloadPdfUrl,
        fileName: s.pdfFileName,
        fileSize: s.pdfSize,
        academicYear: '2026-2027',
        downloadsCount: 340 + i * 20,
        isOfficial: true,
        uploadedBy: 'usr-admin-01',
        createdAt: now,
      })),
      ...ACADEMIC_FORMS_DATA.map((f, i) => ({
        id: `form-${f.id}`,
        title: f.title,
        departmentCode: f.applicableTo,
        semester: 0,
        resourceType: 'Form' as const,
        downloadPdfUrl: f.downloadUrl,
        fileName: f.fileName,
        fileSize: f.fileSize,
        academicYear: '2026-2027',
        downloadsCount: 180 + i * 15,
        isOfficial: true,
        uploadedBy: 'usr-admin-01',
        createdAt: now,
      })),
    ];

    // 9. Facilities
    const facilities: FacilityRecord[] = [
      {
        id: 'fac-01',
        name: 'Maharaja Agrasen Central Library',
        category: 'Library',
        blockLocation: 'Block 3, Ground & First Floor',
        openingHours: '08:00 AM - 08:00 PM (Mon-Sat)',
        inChargeName: 'Dr. R. K. Gupta (Chief Librarian)',
        description: 'Air-conditioned digital library equipped with over 120,000 volumes, IEEE Xplore, DELNET, ScienceDirect access and 250 individual reading carrels.',
        features: ['120,000+ Physical Volumes', 'IEEE & DELNET Digital Access', 'High-Speed Wi-Fi Zone', 'Quiet Study Arena'],
        status: 'Operational',
        updatedAt: now,
      },
      {
        id: 'fac-02',
        name: 'NVIDIA GPU Computing & AI Research Laboratory',
        category: 'Academic',
        blockLocation: 'Block 1, 4th Floor',
        openingHours: '09:00 AM - 06:00 PM',
        inChargeName: 'Prof. Namita Gupta (CSE)',
        description: 'Dedicated high-performance computing lab with 30 NVIDIA RTX A6000 workstations for deep learning and computer vision thesis work.',
        features: ['30x NVIDIA RTX A6000 Workstations', 'PyTorch / TensorFlow Enterprise Stack', 'Gigabit Isolated Network'],
        status: 'Operational',
        updatedAt: now,
      },
      {
        id: 'fac-03',
        name: 'Indoor Sports Arena & Gymnasium',
        category: 'Sports',
        blockLocation: 'Campus Sports Complex',
        openingHours: '06:00 AM - 09:00 PM',
        inChargeName: 'Mr. Pradeep Kumar (Physical Director)',
        description: 'Multi-purpose indoor sports facility with synthetic badminton courts, table tennis arena, Olympic weightlifting benches, and cardio section.',
        features: ['3 Synthetic Badminton Courts', '6 ITTF Table Tennis Tables', 'Cardio & Strength Machines'],
        status: 'Operational',
        updatedAt: now,
      },
      {
        id: 'fac-04',
        name: 'Central Boys & Girls Cafeteria & Nescafe Kiosk',
        category: 'Cafeteria',
        blockLocation: 'Between Block 4 & 5',
        openingHours: '08:30 AM - 07:00 PM',
        inChargeName: 'Campus Food Committee',
        description: 'Hygienic multi-cuisine food court serving fresh meals, snacks, and hot beverages under strict quality supervision.',
        features: ['Subsidized Meals', 'Digital Contactless Payment', 'Hygiene Audited Monthly'],
        status: 'Operational',
        updatedAt: now,
      },
    ];

    // 10. PHASE 6: Lost Items (with Smart Matching attributes & claims)
    const lost_items: LostItemRecord[] = [
      {
        id: 'lost-01',
        title: 'Casio fx-991EX ClassWiz Calculator',
        category: 'Electronics',
        reportedByStudentId: 'usr-student-01',
        reportedByName: 'Aarav Sharma',
        locationLost: 'Block 2, Room 224 (Applied Mathematics Lecture)',
        dateLost: '2026-10-27',
        description: 'Black body with white keys and silver trim. Has a faded white handwritten initials sticker "A.S." on the rear battery slide cover.',
        contactEmail: 'demo-student@mait.ac.in',
        status: 'Open',
        claimRequests: [],
        createdAt: '2026-10-27T14:30:00.000Z',
      },
      {
        id: 'lost-02',
        title: 'Dell USB-C 65W Laptop Charger',
        category: 'Electronics',
        reportedByStudentId: 'usr-std-002',
        reportedByName: 'Neha Rawat',
        locationLost: 'Central Library, 1st Floor Study Carrels',
        dateLost: '2026-10-29',
        description: 'Standard black Dell barrel USB-C power brick with wrap-around rubber cord clip and yellow electrical tape near base.',
        contactEmail: 'neha.rawat@mait.ac.in',
        status: 'Claim Requested',
        claimRequests: [
          {
            id: 'clm-01',
            studentId: 'usr-student-01',
            studentName: 'Aarav Sharma',
            studentEmail: 'demo-student@mait.ac.in',
            enrollmentNumber: '02114802722',
            proofDescription: 'Yellow insulation tape mark and Dell Part #HA65NM190 matching my laptop bag serial.',
            identifyingMark: 'Yellow electrical tape wrap on cable joint',
            status: 'Pending Verification',
            requestedAt: '2026-10-29T16:00:00.000Z',
          },
        ],
        createdAt: '2026-10-29T11:20:00.000Z',
      },
      {
        id: 'lost-03',
        title: 'Blue Spiral Notebook: Design & Analysis of Algorithms',
        category: 'Books',
        reportedByStudentId: 'usr-std-003',
        reportedByName: 'Karan Singhal',
        locationLost: 'Central Fountain benches near Main Gate',
        dateLost: '2026-10-28',
        description: 'Classmate pulse blue cover with handwritten unit 1-4 notes, contains DAA syllabus copy inside cover.',
        contactEmail: 'karan.singhal@mait.ac.in',
        status: 'Open',
        claimRequests: [],
        createdAt: '2026-10-28T09:15:00.000Z',
      },
    ];

    // 11. PHASE 6: Found Items (deposited at security / proctor office)
    const found_items: FoundItemRecord[] = [
      {
        id: 'found-01',
        title: 'Brown Leather Cardholder with Delhi Metro Smart Card',
        category: 'Documents',
        foundByStudentId: 'usr-std-99',
        foundByName: 'Campus Security Post #1',
        locationFound: 'Central Fountain steps near Main Entrance',
        dateFound: '2026-10-29',
        heldAtOffice: 'Chief Proctor Office, Block 1 Room 104',
        description: 'Dark brown bi-fold cardholder containing Airtel Payments Bank card and Delhi Metro Smart Card ending in ...9182.',
        status: 'Unclaimed',
        claimRequests: [],
        createdAt: '2026-10-29T11:00:00.000Z',
      },
      {
        id: 'found-02',
        title: 'Scientific Calculator (Casio fx-991EX)',
        category: 'Electronics',
        foundByStudentId: 'usr-std-88',
        foundByName: 'Sanitation Staff (Block 2)',
        locationFound: 'Block 2, Second Floor Corridor near Room 224',
        dateFound: '2026-10-27',
        heldAtOffice: 'Department of Computer Science Office, Block 2 Room 201',
        description: 'Black Casio scientific calculator with rear battery cover sticker. Deposited after afternoon class.',
        status: 'Unclaimed',
        claimRequests: [],
        createdAt: '2026-10-27T16:00:00.000Z',
      },
      {
        id: 'found-03',
        title: 'Boat Rockerz 255 Pro+ Bluetooth Neckband (Teal Green)',
        category: 'Electronics',
        foundByStudentId: 'usr-std-77',
        foundByName: 'Library Circulation Attendant',
        locationFound: 'Central Library, Reference Periodical Rack',
        dateFound: '2026-10-28',
        heldAtOffice: 'Chief Librarian Office, Block 3 Ground Floor',
        description: 'Teal color in working condition with silicone ear tips intact. Found on reading table #14.',
        status: 'Unclaimed',
        claimRequests: [],
        createdAt: '2026-10-28T14:40:00.000Z',
      },
    ];

    // 12. PHASE 6: Campus Complaint Tracker (with History Timeline & Duplicate check)
    const complaints: ComplaintRecord[] = [
      {
        id: 'comp-01',
        trackingId: 'CMP-2026-1142',
        studentId: 'usr-student-01',
        studentName: 'Aarav Sharma',
        studentEmail: 'demo-student@mait.ac.in',
        enrollmentNumber: '02114802722',
        category: 'Classroom Equipment',
        subject: 'Air Conditioner temperature regulator in Block 1 Room 114',
        description: 'The split AC unit in Room 114 produces a rattling vibration noise during morning DBMS lectures and cannot be set below 27°C.',
        location: 'Block 1, First Floor, Room 114',
        priority: 'Medium',
        status: 'In Progress',
        adminRemarks: 'Assigned to estate maintenance technician (Ticket EST-442). Replacement fan motor dispatched.',
        history: [
          { status: 'Pending', timestamp: '2026-10-26T11:15:00.000Z', remarks: 'Ticket lodged by student Aarav Sharma', updatedBy: 'System' },
          { status: 'Under Review', timestamp: '2026-10-26T14:30:00.000Z', remarks: 'Reviewed by Proctorial Maintenance Coordinator', updatedBy: 'Prof. Administrative Officer' },
          { status: 'In Progress', timestamp: '2026-10-27T10:00:00.000Z', remarks: 'Field technician inspected unit; spare capacitor requested.', updatedBy: 'Estate Supervisor' },
        ],
        isFlaggedDuplicate: false,
        createdAt: '2026-10-26T11:15:00.000Z',
        updatedAt: now,
      },
      {
        id: 'comp-02',
        trackingId: 'CMP-2026-0984',
        studentId: 'usr-student-01',
        studentName: 'Aarav Sharma',
        studentEmail: 'demo-student@mait.ac.in',
        enrollmentNumber: '02114802722',
        category: 'Library Facility',
        subject: 'Request for additional copies of "Operating System Concepts (Silberschatz 10th Ed)"',
        description: 'All 8 reference copies are currently checked out in Block 3 library. Several 5th semester students need reference copies for upcoming midterms.',
        location: 'Block 3, Central Library, Reference Section',
        priority: 'Low',
        status: 'Resolved',
        adminRemarks: '4 additional volumes procured and placed in the reserve book counter for short 3-day renewals.',
        history: [
          { status: 'Pending', timestamp: '2026-10-20T09:40:00.000Z', remarks: 'Book requisition ticket received', updatedBy: 'System' },
          { status: 'Under Review', timestamp: '2026-10-21T11:00:00.000Z', remarks: 'Referred to Library Acquisition Committee', updatedBy: 'Chief Librarian' },
          { status: 'Resolved', timestamp: '2026-10-28T16:00:00.000Z', remarks: 'Volumes added to accession register #LB-4882', updatedBy: 'Dr. R. K. Gupta' },
        ],
        studentRating: 5,
        studentFeedback: 'Prompt acquisition! Books were available before our midterm revision week.',
        resolvedAt: '2026-10-28T16:00:00.000Z',
        isFlaggedDuplicate: false,
        createdAt: '2026-10-20T09:40:00.000Z',
        updatedAt: now,
      },
      {
        id: 'comp-03',
        trackingId: 'CMP-2026-1205',
        studentId: 'usr-std-004',
        studentName: 'Divya Kohli',
        studentEmail: 'divya.k@mait.ac.in',
        enrollmentNumber: '03414802823',
        category: 'Projector & AV',
        subject: 'HDMI connection flickers and cuts display in Block 2 Room 218',
        description: 'Ceiling projector HDMI input cuts off every 2 minutes when connecting laptops during seminar presentations.',
        location: 'Block 2, Second Floor, Room 218',
        priority: 'High',
        status: 'Under Review',
        adminRemarks: 'AV technician scheduled for cable testing after 4:00 PM.',
        history: [
          { status: 'Pending', timestamp: '2026-10-29T10:00:00.000Z', remarks: 'Reported by Seminar Class Coordinator', updatedBy: 'System' },
          { status: 'Under Review', timestamp: '2026-10-29T12:00:00.000Z', remarks: 'Assigned to IT Support Helpdesk', updatedBy: 'Editorial Office MAIT' },
        ],
        isFlaggedDuplicate: false,
        createdAt: '2026-10-29T10:00:00.000Z',
        updatedAt: now,
      },
    ];

    // 13. PHASE 6: Notes & Previous Year Papers (Branch-wise & Semester-wise)
    const notes_resources: NotesResourceRecord[] = [
      {
        id: 'note-01',
        title: 'Design & Analysis of Algorithms: Dynamic Programming & Greedy Handwritten Notes',
        subjectCode: 'ETCS-301',
        subjectName: 'Design and Analysis of Algorithms',
        department: 'CSE',
        semester: 5,
        resourceType: 'Handwritten',
        authorName: 'Aarav Sharma',
        authorStudentId: 'usr-student-01',
        fileUrl: 'https://mait.ac.in/academic/notes/DAA_Module_3_4_Notes.pdf',
        fileSize: '4.8 MB',
        downloadsCount: 420,
        likesCount: 112,
        ratingAverage: 4.8,
        ratingsCount: 38,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-09-18T10:00:00.000Z',
      },
      {
        id: 'note-02',
        title: 'GGSIPU End-Term 2024 Question Paper Solution: Database Management Systems',
        subjectCode: 'ETCS-303',
        subjectName: 'Database Management Systems',
        department: 'CSE',
        semester: 5,
        resourceType: 'PYQ Paper',
        year: '2024',
        examType: 'End-Term',
        authorName: 'ACM MAIT Academic Wing',
        authorStudentId: 'usr-editor-01',
        fileUrl: 'https://mait.ac.in/academic/pyq/DBMS_GGSIPU_EndTerm_2024_Solved.pdf',
        fileSize: '6.2 MB',
        downloadsCount: 890,
        likesCount: 245,
        ratingAverage: 4.9,
        ratingsCount: 74,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-08-10T10:00:00.000Z',
      },
      {
        id: 'note-03',
        title: 'Operating Systems: CPU Scheduling, Virtual Memory & Concurrency Formula Cheatsheet',
        subjectCode: 'ETCS-305',
        subjectName: 'Operating Systems',
        department: 'IT',
        semester: 5,
        resourceType: 'Formula Sheet',
        authorName: 'Rohan Mehra',
        authorStudentId: 'usr-std-008',
        fileUrl: 'https://mait.ac.in/academic/notes/OS_Quick_Revision_Cheatsheet.pdf',
        fileSize: '2.1 MB',
        downloadsCount: 512,
        likesCount: 140,
        ratingAverage: 4.7,
        ratingsCount: 42,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-09-25T11:00:00.000Z',
      },
      {
        id: 'note-04',
        title: 'GGSIPU End-Term 2023 Solved Paper: Computer Networks (ETIT-307)',
        subjectCode: 'ETIT-307',
        subjectName: 'Computer Networks',
        department: 'IT',
        semester: 5,
        resourceType: 'PYQ Paper',
        year: '2023',
        examType: 'End-Term',
        authorName: 'Shubham Goel',
        authorStudentId: 'usr-std-012',
        fileUrl: 'https://mait.ac.in/academic/pyq/Computer_Networks_EndTerm_2023.pdf',
        fileSize: '5.4 MB',
        downloadsCount: 630,
        likesCount: 165,
        ratingAverage: 4.6,
        ratingsCount: 29,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-07-20T10:00:00.000Z',
      },
      {
        id: 'note-05',
        title: 'Microprocessors and Microcontrollers (8086/8051) Architecture Lecture Slides',
        subjectCode: 'ETEC-204',
        subjectName: 'Microprocessors & Microcontrollers',
        department: 'ECE',
        semester: 4,
        resourceType: 'Lecture Notes',
        authorName: 'Prof. Sunita Deshmukh',
        authorStudentId: 'usr-admin-01',
        fileUrl: 'https://mait.ac.in/academic/notes/MPMC_8086_Complete_Lecture_Slides.pdf',
        fileSize: '12.4 MB',
        downloadsCount: 380,
        likesCount: 98,
        ratingAverage: 4.8,
        ratingsCount: 22,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-06-12T10:00:00.000Z',
      },
      {
        id: 'note-06',
        title: 'GGSIPU 2024 End-Term PYQ: Applied Mathematics-I (ETMA-101)',
        subjectCode: 'ETMA-101',
        subjectName: 'Applied Mathematics-I',
        department: 'General Engineering',
        semester: 1,
        resourceType: 'PYQ Paper',
        year: '2024',
        examType: 'End-Term',
        authorName: 'Applied Sciences Faculty Roster',
        authorStudentId: 'usr-admin-01',
        fileUrl: 'https://mait.ac.in/academic/pyq/Applied_Maths_I_GGSIPU_2024.pdf',
        fileSize: '3.6 MB',
        downloadsCount: 1240,
        likesCount: 310,
        ratingAverage: 4.9,
        ratingsCount: 88,
        verifiedByFaculty: true,
        moderationStatus: 'Approved',
        reportedCount: 0,
        createdAt: '2026-02-15T10:00:00.000Z',
      },
    ];

    // 14. PHASE 6: Opportunities & Hackathon Radar
    const opportunities: OpportunityRecord[] = [
      {
        id: 'opp-01',
        title: 'Google Summer of Code (GSoC 2027) Mentorship Cohort',
        type: 'Internship',
        organizer: 'Google Open Source & ACM MAIT Club',
        eligibility: 'All B.Tech semesters with Git, C++, Python, or TypeScript',
        skillsRequired: ['Git/GitHub', 'Data Structures', 'Open Source Etiquette', 'Linux'],
        stipendOrPrize: '$1,500 – $3,000 USD stipend directly by Google LLC',
        deadline: '2026-11-25',
        applyUrl: 'https://summerofcode.withgoogle.com',
        isVerified: true,
        lastVerifiedDate: '2026-10-25',
        status: 'Active',
        postedBy: 'Editorial Office MAIT',
        createdAt: now,
      },
      {
        id: 'opp-02',
        title: 'Smart India Hackathon 2026 (Internal College Round)',
        type: 'Hackathon',
        organizer: 'Ministry of Education Innovation Cell & MAIT',
        eligibility: 'Teams of 6 students (minimum 1 female member mandatory)',
        skillsRequired: ['Full Stack Web', 'AI/ML', 'IoT Hardware', 'System Architecture'],
        stipendOrPrize: '₹1,00,000 Cash Prize per Problem Statement',
        deadline: '2026-11-10',
        applyUrl: 'https://sih.gov.in',
        isVerified: true,
        lastVerifiedDate: '2026-10-28',
        status: 'Closing Soon',
        postedBy: 'Prof. Administrative Officer',
        createdAt: now,
      },
      {
        id: 'opp-03',
        title: 'Delhi Govt Merit-cum-Means Financial Assistance Scheme 2026-27',
        type: 'Scholarship',
        organizer: 'Higher Education Department, Govt. of NCT of Delhi',
        eligibility: 'Family income < ₹6 Lakhs & 60%+ aggregate marks in previous year',
        skillsRequired: ['Academic Merit', 'GGSIPU Enrollment', 'Domicile of Delhi'],
        stipendOrPrize: 'Up to 100% Tuition Fee Reimbursement (~₹1,40,000)',
        deadline: '2026-12-15',
        applyUrl: 'https://edistrict.delhigovt.nic.in',
        isVerified: true,
        lastVerifiedDate: '2026-10-20',
        status: 'Active',
        postedBy: 'Central Administration',
        createdAt: now,
      },
      {
        id: 'opp-04',
        title: 'Microsoft Engage Mentorship & Fast-Track Engineering 2027',
        type: 'Internship',
        organizer: 'Microsoft India University Recruiting',
        eligibility: 'B.Tech 2nd & 3rd Year Students (2027/2028 Batch)',
        skillsRequired: ['Algorithms', 'Object Oriented Programming', 'Cloud Basics'],
        stipendOrPrize: '₹1,25,000 / month Summer Internship Stipend + PPO opportunity',
        deadline: '2026-12-05',
        applyUrl: 'https://careers.microsoft.com/students',
        isVerified: true,
        lastVerifiedDate: '2026-10-28',
        status: 'Active',
        postedBy: 'T&P Cell MAIT',
        createdAt: now,
      },
    ];

    // Tracked applications
    const tracked_applications: TrackedApplication[] = [
      {
        id: 'track-01',
        studentId: 'usr-student-01',
        opportunityId: 'opp-01',
        opportunityTitle: 'Google Summer of Code (GSoC 2027) Mentorship Cohort',
        companyOrOrganizer: 'Google Open Source',
        status: 'Applied',
        appliedDate: '2026-10-20',
        notes: 'Submitted proposal to Chromium Web Audio team. Waiting for mentor review.',
        updatedAt: now,
      },
      {
        id: 'track-02',
        studentId: 'usr-student-01',
        opportunityId: 'opp-02',
        opportunityTitle: 'Smart India Hackathon 2026 (Internal College Round)',
        companyOrOrganizer: 'Ministry of Education & MAIT',
        status: 'Interviewing',
        appliedDate: '2026-10-18',
        notes: 'Cleared team ideation round. Internal college presentation scheduled for 4 Nov.',
        updatedAt: now,
      },
    ];

    // 15. Event Registrations
    const event_registrations: EventRegistrationRecord[] = [
      {
        id: 'reg-01',
        eventId: 'ev-001',
        eventTitle: 'MAIT InnoHacks 2026: 36-Hour National Hackathon',
        eventDate: '2026-11-14',
        eventVenue: 'Campus Central Auditorium & Main Computing Block',
        studentId: 'usr-student-01',
        studentName: 'Aarav Sharma',
        studentEmail: 'demo-student@mait.ac.in',
        enrollmentNumber: '02114802722',
        department: 'Computer Science & Engineering',
        semester: 6,
        ticketCode: 'MAIT-HACK-8842',
        status: 'Confirmed',
        registeredAt: '2026-10-25T14:20:00.000Z',
      },
    ];

    // 16. Saved Items
    const saved_items: SavedItemRecord[] = [
      {
        id: 'save-01',
        studentId: 'usr-student-01',
        itemType: 'notice',
        itemId: 'not-001',
        itemTitle: 'GGSIPU Odd Semester End-Term Theory & Practical Examination Date Sheet',
        itemCategory: 'Examination',
        savedAt: '2026-10-28T18:00:00.000Z',
      },
      {
        id: 'save-02',
        studentId: 'usr-student-01',
        itemType: 'event',
        itemId: 'ev-001',
        itemTitle: 'MAIT InnoHacks 2026: 36-Hour National Hackathon',
        itemCategory: 'Hackathon',
        savedAt: '2026-10-25T14:20:00.000Z',
      },
      {
        id: 'save-03',
        studentId: 'usr-student-01',
        itemType: 'note',
        itemId: 'note-02',
        itemTitle: 'GGSIPU End-Term 2024 Question Paper Solution: Database Management Systems',
        itemCategory: 'PYQ Paper',
        savedAt: '2026-10-29T10:00:00.000Z',
      },
    ];

    // 17. Notifications
    const notifications: NotificationRecord[] = [
      {
        id: 'notif-01',
        recipientUserId: 'usr-student-01',
        title: 'Registration Confirmed',
        message: 'Your registration for MAIT InnoHacks 2026 is confirmed. Ticket Code: MAIT-HACK-8842.',
        type: 'Event',
        isRead: false,
        linkUrl: '#student-hub',
        createdAt: '2026-10-25T14:21:00.000Z',
      },
      {
        id: 'notif-02',
        recipientUserId: 'usr-student-01',
        title: 'Grievance Update (CMP-2026-1142)',
        message: 'Your ticket regarding "AC in Room 114" is now In Progress. Estate supervisor has dispatched spare motor.',
        type: 'Grievance',
        isRead: false,
        linkUrl: '#student-hub',
        createdAt: '2026-10-27T10:00:00.000Z',
      },
      {
        id: 'notif-03',
        recipientUserId: 'usr-student-01',
        title: 'Potential Match for Lost Item',
        message: 'A Casio scientific calculator matching your description was deposited at Block 2 CSE Office.',
        type: 'LostFound',
        isRead: true,
        linkUrl: '#student-hub',
        createdAt: '2026-10-27T16:15:00.000Z',
      },
    ];

    // 18. AI Documents
    const ai_documents: AiDocumentRecord[] = [
      {
        id: 'ai-doc-01',
        title: 'MAIT Institutional Charter, NBA Accreditation & NAAC Grade A Accreditations',
        category: 'Affiliation',
        sourceUrl: 'https://mait.ac.in/index.php/about-us/accreditations',
        contentSummary: 'Established in 1999 by Maharaja Agrasen Technical Education Society (MATES). Approved by AICTE, affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), accredited by NBA for eligible engineering disciplines.',
        tokenCount: 4200,
        lastVerifiedDate: '2026-10-15',
        isApprovedForGrounding: true,
        updatedAt: now,
      },
      {
        id: 'ai-doc-02',
        title: 'GGSIPU Ordinance 11: Examination Grading System & Attendance Criteria',
        category: 'Ordinance',
        sourceUrl: 'https://ipu.ac.in/ordinance/ord11_grading.pdf',
        contentSummary: 'Mandatory 75% attendance rule for appearing in End-Term examinations. 10-point cumulative grade point average (CGPA) system. Credit requirements for promotion to subsequent academic years.',
        tokenCount: 8900,
        lastVerifiedDate: '2026-09-01',
        isApprovedForGrounding: true,
        updatedAt: now,
      },
    ];

    // 19. PHASE 6: Campus Queue Tracker (Crowdsourced crowd estimates)
    const queue_locations: QueueLocationStatus[] = [
      {
        key: 'canteen',
        name: 'Central Boys & Girls Cafeteria',
        block: 'Between Block 4 & 5',
        currentCrowdLevel: 'Moderate',
        estimatedWaitMinutes: 12,
        lastReportedTime: '12 mins ago',
        historicalPeakTimes: '12:30 PM – 02:00 PM (Lunch Break)',
        recentReports: [
          {
            id: 'qr-01',
            studentId: 'usr-std-009',
            studentName: 'Siddharth M.',
            locationKey: 'canteen',
            crowdLevel: 'Moderate',
            estimatedWaitMinutes: 12,
            comment: 'South Indian counter moving fast; Thali counter has moderate line.',
            reportedAt: '2026-10-30T07:15:00.000Z',
          },
        ],
      },
      {
        key: 'nescafe',
        name: 'Nescafe Coffee & Snack Kiosk',
        block: 'Central Quadrangle / Main Gate Garden',
        currentCrowdLevel: 'Low',
        estimatedWaitMinutes: 4,
        lastReportedTime: '25 mins ago',
        historicalPeakTimes: '10:45 AM – 11:15 AM & 03:15 PM – 03:45 PM',
        recentReports: [
          {
            id: 'qr-02',
            studentId: 'usr-student-01',
            studentName: 'Aarav Sharma',
            locationKey: 'nescafe',
            crowdLevel: 'Low',
            estimatedWaitMinutes: 4,
            comment: 'Cold coffee & patties ready. Only 3 people in line.',
            reportedAt: '2026-10-30T07:00:00.000Z',
          },
        ],
      },
      {
        key: 'admin-fee-counter',
        name: 'Accounts & Academic Fee Counter',
        block: 'Block 1, Ground Floor',
        currentCrowdLevel: 'High',
        estimatedWaitMinutes: 22,
        lastReportedTime: '8 mins ago',
        historicalPeakTimes: '10:00 AM – 12:00 PM (Exam Fee Weeks)',
        recentReports: [
          {
            id: 'qr-03',
            studentId: 'usr-std-014',
            studentName: 'Pooja Verma',
            locationKey: 'admin-fee-counter',
            crowdLevel: 'High',
            estimatedWaitMinutes: 22,
            comment: 'Challan verification ongoing for odd semester reappear exams.',
            reportedAt: '2026-10-30T07:20:00.000Z',
          },
        ],
      },
      {
        key: 'library-desk',
        name: 'Central Library Circulation & Help Desk',
        block: 'Block 3, Ground Floor',
        currentCrowdLevel: 'Low',
        estimatedWaitMinutes: 3,
        lastReportedTime: '40 mins ago',
        historicalPeakTimes: '03:45 PM – 05:00 PM (Return Rush)',
        recentReports: [
          {
            id: 'qr-04',
            studentId: 'usr-student-01',
            studentName: 'Aarav Sharma',
            locationKey: 'library-desk',
            crowdLevel: 'Low',
            estimatedWaitMinutes: 3,
            comment: 'Book issue scanner free. Reading hall at ~40% seating capacity.',
            reportedAt: '2026-10-30T06:45:00.000Z',
          },
        ],
      },
      {
        key: 'exam-cell',
        name: 'Examination Cell Dispatch Counter',
        block: 'Block 1, First Floor Room 102',
        currentCrowdLevel: 'Moderate',
        estimatedWaitMinutes: 14,
        lastReportedTime: '15 mins ago',
        historicalPeakTimes: '11:00 AM – 01:30 PM',
        recentReports: [
          {
            id: 'qr-05',
            studentId: 'usr-std-022',
            studentName: 'Gaurav Jain',
            locationKey: 'exam-cell',
            crowdLevel: 'Moderate',
            estimatedWaitMinutes: 14,
            comment: 'Admit card correction counter open; token queue moving steadily.',
            reportedAt: '2026-10-30T07:10:00.000Z',
          },
        ],
      },
      {
        key: 'stationery-shop',
        name: 'Campus Stationery, Print & Binding Center',
        block: 'Adjacent to Block 2',
        currentCrowdLevel: 'Low',
        estimatedWaitMinutes: 5,
        lastReportedTime: '30 mins ago',
        historicalPeakTimes: '08:45 AM – 09:30 AM & 01:00 PM – 01:45 PM',
        recentReports: [],
      },
    ];

    const queue_reports: CrowdReport[] = [
      {
        id: 'qr-01',
        studentId: 'usr-std-009',
        studentName: 'Siddharth M.',
        locationKey: 'canteen',
        crowdLevel: 'Moderate',
        estimatedWaitMinutes: 12,
        comment: 'South Indian counter moving fast; Thali counter has moderate line.',
        reportedAt: '2026-10-30T07:15:00.000Z',
      },
      {
        id: 'qr-02',
        studentId: 'usr-student-01',
        studentName: 'Aarav Sharma',
        locationKey: 'nescafe',
        crowdLevel: 'Low',
        estimatedWaitMinutes: 4,
        comment: 'Cold coffee & patties ready. Only 3 people in line.',
        reportedAt: '2026-10-30T07:00:00.000Z',
      },
    ];

    // 20. PHASE 6: Academic Planner (Tasks & Personal Attendance calculation)
    const planner_tasks: PlannerTask[] = [
      {
        id: 'task-01',
        studentId: 'usr-student-01',
        subject: 'Compiler Design (ETCS-302)',
        title: 'Complete Lexical Analyzer using Lex/Flex in Linux Lab',
        type: 'Lab Record',
        dueDate: '2026-11-04',
        priority: 'High',
        isCompleted: false,
        createdAt: '2026-10-25T10:00:00.000Z',
      },
      {
        id: 'task-02',
        studentId: 'usr-student-01',
        subject: 'Artificial Intelligence (ETCS-304)',
        title: 'A* Search & Alpha-Beta Minimax Python Implementation Notebook',
        type: 'Assignment',
        dueDate: '2026-11-08',
        priority: 'Medium',
        isCompleted: true,
        createdAt: '2026-10-24T10:00:00.000Z',
      },
      {
        id: 'task-03',
        studentId: 'usr-student-01',
        subject: 'Software Engineering (ETCS-306)',
        title: 'UML Class Diagram & Sequence Diagram Case Study on E-Commerce',
        type: 'Assignment',
        dueDate: '2026-11-12',
        priority: 'Low',
        isCompleted: false,
        createdAt: '2026-10-27T10:00:00.000Z',
      },
      {
        id: 'task-04',
        studentId: 'usr-student-01',
        subject: 'Computer Networks (ETIT-307)',
        title: 'Subnetting & CIDR Calculation Practice for Midterms',
        type: 'Revision',
        dueDate: '2026-11-15',
        priority: 'High',
        isCompleted: false,
        createdAt: '2026-10-28T10:00:00.000Z',
      },
    ];

    const subject_attendance: SubjectAttendanceRecord[] = [
      {
        id: 'att-01',
        studentId: 'usr-student-01',
        subjectCode: 'ETCS-302',
        subjectName: 'Compiler Design',
        classesAttended: 24,
        totalClassesHeld: 28, // 85.7%
      },
      {
        id: 'att-02',
        studentId: 'usr-student-01',
        subjectCode: 'ETCS-304',
        subjectName: 'Artificial Intelligence',
        classesAttended: 22,
        totalClassesHeld: 30, // 73.3% -> needs 2 more classes to hit 75%
      },
      {
        id: 'att-03',
        studentId: 'usr-student-01',
        subjectCode: 'ETCS-306',
        subjectName: 'Software Engineering',
        classesAttended: 26,
        totalClassesHeld: 30, // 86.6%
      },
      {
        id: 'att-04',
        studentId: 'usr-student-01',
        subjectCode: 'ETIT-307',
        subjectName: 'Computer Networks',
        classesAttended: 27,
        totalClassesHeld: 32, // 84.3%
      },
      {
        id: 'att-05',
        studentId: 'usr-student-01',
        subjectCode: 'ETCS-352',
        subjectName: 'Compiler Design Lab',
        classesAttended: 12,
        totalClassesHeld: 14, // 85.7%
      },
      {
        id: 'att-06',
        studentId: 'usr-student-01',
        subjectCode: 'ETCS-354',
        subjectName: 'AI & Data Science Lab',
        classesAttended: 13,
        totalClassesHeld: 14, // 92.8%
      },
    ];

    // 21. PHASE 6: Campus & Classroom Finder (Buildings & Rooms Directory)
    const campus_rooms: CampusRoomRecord[] = [
      {
        id: 'room-101',
        roomNumber: 'Room 101',
        name: 'Dean Academic & Registrar Secretarial Suite',
        blockId: 'block-1',
        blockName: 'Block 1 — Administrative & Postgraduate Complex',
        floor: 'Ground Floor',
        category: 'Faculty Cabin',
        nearbyAmenities: ['Main Entrance Lobby', 'Central Drinking Water RO Station', 'Accessible Restrooms'],
        timetableSummary: 'Open for student counter queries 10:00 AM – 01:00 PM & 02:00 PM – 04:00 PM.',
      },
      {
        id: 'room-112',
        roomNumber: 'Room 112',
        name: 'Financial Modeling & Stock Market Simulation Lab',
        blockId: 'block-1',
        blockName: 'Block 1 — Administrative & Postgraduate Complex',
        floor: '1st Floor',
        category: 'Computing Lab',
        capacity: 60,
        equipment: ['60 Dell OptiPlex Core i7 Systems', 'Real-Time Stock Ticker Displays', 'CMIE Prowess Database'],
        nearbyAmenities: ['North Staircase', 'Restrooms', 'Elevator Shaft A'],
        timetableSummary: 'MBA Finance Sem 3 Practical: Mon, Wed, Fri (11:00 AM – 01:00 PM).',
      },
      {
        id: 'room-114',
        roomNumber: 'Room 114',
        name: 'Smart Lecture Theatre — MBA & PG Hall',
        blockId: 'block-1',
        blockName: 'Block 1 — Administrative & Postgraduate Complex',
        floor: '1st Floor',
        category: 'Classroom',
        capacity: 90,
        equipment: ['Dual Laser Projector', 'Motorized Smart Podium', 'Split Air Conditioning'],
        nearbyAmenities: ['Water Cooler RO Station', 'Elevator Shaft A'],
        timetableSummary: 'B.Tech/MBA Combined Elective: 09:30 AM – 11:30 AM.',
      },
      {
        id: 'room-201',
        roomNumber: 'Room 201',
        name: 'Department of Computer Science & Engineering HOD Office',
        blockId: 'block-2',
        blockName: 'Block 2 — Aryabhatta Academic Complex (CSE & IT)',
        floor: 'Ground Floor',
        category: 'Faculty Cabin',
        nearbyAmenities: ['CSE Notice Board', 'Department Examination Desk', 'Water Cooler'],
        timetableSummary: 'HOD Interaction Hours: 02:30 PM – 04:00 PM on working days.',
      },
      {
        id: 'room-214',
        roomNumber: 'Room 214',
        name: 'NVIDIA GPU Accelerated Computing & Deep Learning Lab',
        blockId: 'block-2',
        blockName: 'Block 2 — Aryabhatta Academic Complex (CSE & IT)',
        floor: '2nd Floor',
        category: 'Computing Lab',
        capacity: 45,
        equipment: ['30x NVIDIA RTX A6000 Workstations', 'Isolated High-Speed Switch', 'CUDA Dev Suite'],
        nearbyAmenities: ['East Staircase', 'Water Station', 'Faculty Cabins 215-217'],
        timetableSummary: 'AI&ML Sem 7 Capstone Lab: Tue & Thu (01:30 PM – 04:30 PM).',
      },
      {
        id: 'room-218',
        roomNumber: 'Room 218',
        name: 'Cloud Infrastructure & Virtualization Sandbox',
        blockId: 'block-2',
        blockName: 'Block 2 — Aryabhatta Academic Complex (CSE & IT)',
        floor: '2nd Floor',
        category: 'Computing Lab',
        capacity: 50,
        equipment: ['Blade Server Testing Rack', 'Docker/Kubernetes Local Cluster', 'Interactive Whiteboard'],
        nearbyAmenities: ['Restrooms', 'Elevator Shaft B'],
        timetableSummary: 'IT Sem 5 Cloud Computing Lab: Mon & Wed (09:00 AM – 11:00 AM).',
      },
      {
        id: 'room-224',
        roomNumber: 'Room 224',
        name: 'Interactive Tiered Lecture Hall (CSE Shift-1)',
        blockId: 'block-2',
        blockName: 'Block 2 — Aryabhatta Academic Complex (CSE & IT)',
        floor: '2nd Floor',
        category: 'Classroom',
        capacity: 80,
        equipment: ['Acoustic Paneling', 'BenQ Ceiling Projector', 'Mic System'],
        nearbyAmenities: ['Central Corridor Water Cooler', 'Washrooms'],
        timetableSummary: 'CSE 5A: DAA (09:00 AM), OS (10:00 AM), DBMS (11:15 AM).',
      },
      {
        id: 'room-301',
        roomNumber: 'Central Library',
        name: 'Maharaja Agrasen Digital Library & Periodical Section',
        blockId: 'block-3',
        blockName: 'Block 3 — Central Library & Research Complex',
        floor: 'Ground Floor',
        category: 'Amenity',
        capacity: 250,
        equipment: ['120,000+ Bound Volumes', 'IEEE Xplore Terminals', '250 Reading Carrels'],
        nearbyAmenities: ['Photocopy Kiosk', 'Water RO Station', 'Restrooms'],
        timetableSummary: 'Open 08:00 AM – 08:00 PM (Monday through Saturday).',
      },
      {
        id: 'room-401',
        roomNumber: 'Room 401',
        name: 'VLSI Design & Embedded Systems Laboratory',
        blockId: 'block-4',
        blockName: 'Block 4 — Electronics & Electrical Engineering Complex',
        floor: 'Ground Floor',
        category: 'Hardware Lab',
        capacity: 40,
        equipment: ['Cadence Virtuoso EDA Suite', 'Xilinx FPGA Artix-7 Trainer Kits', 'Digital Storage Oscilloscopes'],
        nearbyAmenities: ['ECE HOD Office', 'Water Cooler', 'ECE Seminar Hall'],
        timetableSummary: 'ECE Sem 6 VLSI Lab: Mon & Thu (01:30 PM – 04:30 PM).',
      },
      {
        id: 'room-601',
        roomNumber: 'Main Audi',
        name: 'Maharaja Agrasen Central Auditorium',
        blockId: 'block-6',
        blockName: 'Block 6 — Campus Sports Complex & Central Auditorium',
        floor: 'Ground Floor',
        category: 'Auditorium',
        capacity: 850,
        equipment: ['Professional Stage Rigging', 'Surround Line Array Audio', 'Climate Controlled HVAC'],
        nearbyAmenities: ['Green Rooms', 'VIP Lounge', 'Indoor Sports Complex Entry'],
        timetableSummary: 'Booked for Techsurge & Mridang, Hackathons, and Convocation ceremonies.',
      },
    ];

    // Audit Logs
    const audit_logs: AuditLogRecord[] = [
      {
        id: 'audit-001',
        userId: 'usr-admin-01',
        userName: 'Prof. Administrative Officer',
        userRole: 'Administrator',
        action: 'PUBLISH',
        entityType: 'notice',
        entityId: 'not-001',
        details: 'Published official circular MAIT/EXAM/2026/112 regarding GGSIPU Odd Semester End-Term Examinations.',
        timestamp: '2026-10-28T09:00:00.000Z',
      },
      {
        id: 'audit-002',
        userId: 'usr-editor-01',
        userName: 'Editorial Office MAIT',
        userRole: 'Content Editor',
        action: 'CREATE',
        entityType: 'event',
        entityId: 'ev-001',
        details: 'Scheduled event "MAIT InnoHacks 2026" with 400 participant capacity and registration portal links.',
        timestamp: '2026-10-01T10:00:00.000Z',
      },
    ];

    return {
      users,
      roles,
      departments,
      notices,
      events,
      placements,
      recruiters,
      academic_resources,
      facilities,
      lost_items,
      found_items,
      complaints,
      notes_resources,
      opportunities,
      tracked_applications,
      event_registrations,
      saved_items,
      notifications,
      ai_documents,
      queue_locations,
      queue_reports,
      planner_tasks,
      subject_attendance,
      campus_rooms,
      audit_logs,
    };
  }

  // ==========================================
  // AUDIT LOG HELPER
  // ==========================================
  public logAudit(
    userId: string,
    action: AuditLogRecord['action'],
    entityType: AuditLogRecord['entityType'],
    entityId: string,
    details: string,
    ipAddress?: string
  ) {
    const user = this.getUserById(userId);
    const log: AuditLogRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user ? user.id : userId,
      userName: user ? user.name : 'Unknown User',
      userRole: user ? user.role : 'Student',
      action,
      entityType,
      entityId,
      details,
      ipAddress: ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    this.state.audit_logs.unshift(log);
    if (this.state.audit_logs.length > 500) {
      this.state.audit_logs = this.state.audit_logs.slice(0, 500);
    }
    this.persist();
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { role: 'Student' }): User {
    const newUser: User = {
      ...user,
      id: `usr-std-${Date.now()}`,
      role: 'Student',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.persist();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.state.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.state.users[idx] = {
      ...this.state.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.state.users[idx];
  }

  public getAllUsers(): User[] {
    return this.state.users.map((u) => {
      const { passwordHash, ...safeUser } = u;
      return safeUser as User;
    });
  }

  // ==========================================
  // NOTICES
  // ==========================================
  public getNotices(filter?: { category?: string; department?: string; search?: string; status?: string }): NoticeRecord[] {
    let list = [...this.state.notices];

    if (filter?.category && filter.category !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.department && filter.department !== 'All') {
      list = list.filter((n) => n.department.toLowerCase().includes(filter.department!.toLowerCase()));
    }
    if (filter?.status === 'published') {
      list = list.filter((n) => !n.isDraft && !n.isArchived);
    } else if (filter?.status === 'draft') {
      list = list.filter((n) => n.isDraft);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.refNo.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.department.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  }

  public getNoticeById(id: string): NoticeRecord | undefined {
    return this.state.notices.find((n) => n.id === id);
  }

  public createNotice(noticeData: Omit<NoticeRecord, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>, creatorId: string): NoticeRecord {
    const newNotice: NoticeRecord = {
      ...noticeData,
      id: `not-${Date.now()}`,
      viewCount: 0,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.notices.unshift(newNotice);
    this.logAudit(creatorId, 'CREATE', 'notice', newNotice.id, `Created notice: "${newNotice.title}" [${newNotice.refNo}]`);
    this.persist();
    return newNotice;
  }

  public updateNotice(id: string, updates: Partial<NoticeRecord>, editorId: string): NoticeRecord | null {
    const idx = this.state.notices.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    this.state.notices[idx] = {
      ...this.state.notices[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAudit(editorId, 'UPDATE', 'notice', id, `Updated notice: "${this.state.notices[idx].title}"`);
    this.persist();
    return this.state.notices[idx];
  }

  public deleteNotice(id: string, editorId: string): boolean {
    const idx = this.state.notices.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    const title = this.state.notices[idx].title;
    this.state.notices.splice(idx, 1);
    this.logAudit(editorId, 'DELETE', 'notice', id, `Deleted notice: "${title}"`);
    this.persist();
    return true;
  }

  // ==========================================
  // EVENTS & REGISTRATIONS
  // ==========================================
  public getEvents(filter?: { category?: string; status?: string; search?: string }): EventRecord[] {
    let list = [...this.state.events];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter((e) => e.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public getEventById(id: string): EventRecord | undefined {
    return this.state.events.find((e) => e.id === id);
  }

  public createEvent(data: Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>, creatorId: string): EventRecord {
    const newEvent: EventRecord = {
      ...data,
      id: `ev-${Date.now()}`,
      registeredCount: 0,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.events.unshift(newEvent);
    this.logAudit(creatorId, 'CREATE', 'event', newEvent.id, `Created event: "${newEvent.title}" on ${newEvent.date}`);
    this.persist();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventRecord>, editorId: string): EventRecord | null {
    const idx = this.state.events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.state.events[idx] = {
      ...this.state.events[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAudit(editorId, 'UPDATE', 'event', id, `Updated event: "${this.state.events[idx].title}"`);
    this.persist();
    return this.state.events[idx];
  }

  public deleteEvent(id: string, editorId: string): boolean {
    const idx = this.state.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    const title = this.state.events[idx].title;
    this.state.events.splice(idx, 1);
    this.logAudit(editorId, 'DELETE', 'event', id, `Deleted event: "${title}"`);
    this.persist();
    return true;
  }

  public registerForEvent(
    eventId: string,
    student: { id: string; name: string; email: string; enrollmentNumber: string; department: string; semester: number }
  ): { success: boolean; registration?: EventRegistrationRecord; message: string } {
    const event = this.getEventById(eventId);
    if (!event) return { success: false, message: 'Event not found' };

    const existing = this.state.event_registrations.find(
      (r) => r.eventId === eventId && (r.studentId === student.id || r.studentEmail === student.email) && r.status !== 'Cancelled'
    );
    if (existing) {
      return { success: true, registration: existing, message: 'Already registered for this event' };
    }

    if (event.registeredCount >= event.maxCapacity) {
      return { success: false, message: 'Event registration is at full capacity' };
    }

    const reg: EventRegistrationRecord = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.displayDate,
      eventVenue: event.venue,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      enrollmentNumber: student.enrollmentNumber || 'N/A',
      department: student.department || 'MAIT',
      semester: student.semester || 1,
      ticketCode: `MAIT-${Math.floor(1000 + Math.random() * 9000)}-${event.id.replace('ev-', '')}`,
      status: 'Confirmed',
      registeredAt: new Date().toISOString(),
    };

    this.state.event_registrations.unshift(reg);
    event.registeredCount += 1;

    this.addNotification({
      recipientUserId: student.id,
      title: 'Registration Confirmed',
      message: `You are confirmed for "${event.title}". Ticket: ${reg.ticketCode}.`,
      type: 'Event',
      linkUrl: '#student-hub',
    });

    this.persist();
    return { success: true, registration: reg, message: 'Registration successful!' };
  }

  public getStudentRegistrations(studentId: string): EventRegistrationRecord[] {
    return this.state.event_registrations.filter((r) => r.studentId === studentId && r.status !== 'Cancelled');
  }

  public cancelRegistration(registrationId: string, studentId: string): boolean {
    const reg = this.state.event_registrations.find((r) => r.id === registrationId && r.studentId === studentId);
    if (!reg) return false;
    reg.status = 'Cancelled';
    const event = this.getEventById(reg.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
    }
    this.persist();
    return true;
  }

  // ==========================================
  // PHASE 6: MODULE 1 — LOST & FOUND (SMART MATCHING & CLAIMS)
  // ==========================================
  public getLostItems(filter?: { category?: string; search?: string; status?: string }): LostItemRecord[] {
    let list = [...this.state.lost_items];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((i) => i.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter((i) => i.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.locationLost.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getFoundItems(filter?: { category?: string; search?: string; status?: string }): FoundItemRecord[] {
    let list = [...this.state.found_items];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((i) => i.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter((i) => i.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.locationFound.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public createLostItem(data: Omit<LostItemRecord, 'id' | 'createdAt' | 'status' | 'claimRequests'>): LostItemRecord {
    const item: LostItemRecord = {
      ...data,
      id: `lost-${Date.now()}`,
      status: 'Open',
      claimRequests: [],
      createdAt: new Date().toISOString(),
    };
    this.state.lost_items.unshift(item);
    this.persist();
    return item;
  }

  public createFoundItem(data: Omit<FoundItemRecord, 'id' | 'createdAt' | 'status' | 'claimRequests'>): FoundItemRecord {
    const item: FoundItemRecord = {
      ...data,
      id: `found-${Date.now()}`,
      status: 'Unclaimed',
      claimRequests: [],
      createdAt: new Date().toISOString(),
    };
    this.state.found_items.unshift(item);
    this.persist();
    return item;
  }

  /**
   * Smart matching algorithm comparing category, keywords, date proximity, and location
   */
  public getSmartMatchesForLostItem(lostItemId: string): Array<{ foundItem: FoundItemRecord; matchScore: number; matchReasons: string[] }> {
    const lost = this.state.lost_items.find((l) => l.id === lostItemId);
    if (!lost) return [];

    const matches: Array<{ foundItem: FoundItemRecord; matchScore: number; matchReasons: string[] }> = [];

    const lostWords = `${lost.title} ${lost.description}`.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter((w) => w.length > 2);
    const lostDate = new Date(lost.dateLost).getTime();

    for (const found of this.state.found_items) {
      let score = 0;
      const reasons: string[] = [];

      // Category exact match (+40%)
      if (found.category.toLowerCase() === lost.category.toLowerCase()) {
        score += 40;
        reasons.push(`Category match: ${found.category}`);
      }

      // Keyword similarity (+30%)
      const foundText = `${found.title} ${found.description}`.toLowerCase();
      const matchedKeywords = lostWords.filter((w) => foundText.includes(w));
      if (matchedKeywords.length > 0) {
        const keywordScore = Math.min(30, matchedKeywords.length * 10);
        score += keywordScore;
        reasons.push(`Keyword match: ${matchedKeywords.slice(0, 3).join(', ')}`);
      }

      // Location match (+20%)
      const locMatch = ['block 1', 'block 2', 'block 3', 'block 4', 'library', 'fountain', 'canteen', 'nescafe'].some(
        (key) => lost.locationLost.toLowerCase().includes(key) && found.locationFound.toLowerCase().includes(key)
      );
      if (locMatch) {
        score += 20;
        reasons.push('Location proximity match');
      }

      // Date proximity (+10%) within 4 days
      const foundDate = new Date(found.dateFound).getTime();
      const diffDays = Math.abs(foundDate - lostDate) / (1000 * 60 * 60 * 24);
      if (diffDays <= 4) {
        score += 10;
        reasons.push(`Date match (${Math.round(diffDays)} day gap)`);
      }

      if (score >= 40) {
        matches.push({ foundItem: found, matchScore: score, matchReasons: reasons });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  public submitItemClaim(
    type: 'found' | 'lost',
    itemId: string,
    claim: { studentId: string; studentName: string; studentEmail: string; enrollmentNumber: string; proofDescription: string; identifyingMark: string }
  ): { success: boolean; claim?: ItemClaimRequest; message: string } {
    const claimRequest: ItemClaimRequest = {
      id: `clm-${Date.now()}`,
      studentId: claim.studentId,
      studentName: claim.studentName,
      studentEmail: claim.studentEmail,
      enrollmentNumber: claim.enrollmentNumber,
      proofDescription: claim.proofDescription,
      identifyingMark: claim.identifyingMark,
      status: 'Pending Verification',
      requestedAt: new Date().toISOString(),
    };

    if (type === 'found') {
      const found = this.state.found_items.find((f) => f.id === itemId);
      if (!found) return { success: false, message: 'Item not found' };
      if (found.foundByStudentId === claim.studentId) {
        return { success: false, message: 'You cannot claim an item you reported finding.' };
      }
      if (!found.claimRequests) found.claimRequests = [];
      found.claimRequests.push(claimRequest);
      found.status = 'Claim Requested';
    } else {
      const lost = this.state.lost_items.find((l) => l.id === itemId);
      if (!lost) return { success: false, message: 'Item not found' };
      if (lost.reportedByStudentId === claim.studentId) {
        return { success: false, message: 'You cannot claim an item you reported losing.' };
      }
      if (!lost.claimRequests) lost.claimRequests = [];
      lost.claimRequests.push(claimRequest);
      lost.status = 'Claim Requested';
    }

    this.persist();
    return { success: true, claim: claimRequest, message: 'Claim request submitted for Proctorial verification!' };
  }

  public getStudentLostFoundActivity(studentId: string) {
    const lostItems = this.state.lost_items.filter((item) => item.reportedByStudentId === studentId);
    const foundItems = this.state.found_items.filter((item) => item.foundByStudentId === studentId);
    const claims = [
      ...this.state.lost_items.flatMap((item) =>
        (item.claimRequests || [])
          .filter((claim) => claim.studentId === studentId)
          .map((claim) => ({ type: 'lost' as const, itemId: item.id, itemTitle: item.title, claim }))
      ),
      ...this.state.found_items.flatMap((item) =>
        (item.claimRequests || [])
          .filter((claim) => claim.studentId === studentId)
          .map((claim) => ({ type: 'found' as const, itemId: item.id, itemTitle: item.title, claim }))
      ),
    ];

    return { lostItems, foundItems, claims };
  }

  public reviewItemClaim(
    type: 'lost' | 'found',
    itemId: string,
    claimId: string,
    status: ItemClaimRequest['status'],
    verificationNotes: string,
    reviewerId: string
  ): ItemClaimRequest | null {
    const item = type === 'lost'
      ? this.state.lost_items.find((entry) => entry.id === itemId)
      : this.state.found_items.find((entry) => entry.id === itemId);
    const reviewer = this.getUserById(reviewerId);
    if (!item || !reviewer) return null;

    const ownerId = type === 'lost'
      ? (item as LostItemRecord).reportedByStudentId
      : (item as FoundItemRecord).foundByStudentId;
    if (reviewer.role !== 'Administrator' && ownerId !== reviewerId) return null;

    const claim = item.claimRequests?.find((request) => request.id === claimId);
    if (!claim || claim.status !== 'Pending Verification') return null;
    claim.status = status;
    claim.verificationNotes = verificationNotes;

    if (status === 'Approved for Collection') {
      item.status = type === 'lost' ? 'Claimed' : 'Returned';
      for (const otherClaim of item.claimRequests || []) {
        if (otherClaim.id !== claimId && otherClaim.status === 'Pending Verification') {
          otherClaim.status = 'Rejected';
          otherClaim.verificationNotes = 'Another claim was approved for this item.';
        }
      }
    } else if (!(item.claimRequests || []).some((request) => request.status === 'Pending Verification')) {
      item.status = type === 'lost' ? 'Open' : 'Unclaimed';
    }

    this.persist();
    return claim;
  }

  // ==========================================
  // PHASE 6: MODULE 2 — CAMPUS COMPLAINT TRACKER
  // ==========================================
  public getComplaints(studentId?: string): ComplaintRecord[] {
    if (studentId) {
      return this.state.complaints.filter((c) => c.studentId === studentId);
    }
    return this.state.complaints;
  }

  public checkDuplicateComplaint(category: string, location: string): ComplaintRecord | undefined {
    return this.state.complaints.find(
      (c) =>
        c.status !== 'Resolved' &&
        c.status !== 'Rejected' &&
        c.category.toLowerCase() === category.toLowerCase() &&
        c.location.toLowerCase() === location.toLowerCase()
    );
  }

  public createComplaint(data: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    enrollmentNumber: string;
    category: ComplaintRecord['category'];
    subject: string;
    description: string;
    location: string;
    priority: ComplaintRecord['priority'];
    imageUrl?: string;
  }): ComplaintRecord {
    const existingDuplicate = this.checkDuplicateComplaint(data.category, data.location);

    const trackingId = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newComplaint: ComplaintRecord = {
      id: `comp-${Date.now()}`,
      trackingId,
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      enrollmentNumber: data.enrollmentNumber,
      category: data.category,
      subject: data.subject,
      description: data.description,
      location: data.location,
      priority: data.priority,
      status: 'Pending',
      imageUrl: data.imageUrl,
      history: [
        {
          status: 'Pending',
          timestamp: now,
          remarks: `Grievance ticket submitted by student ${data.studentName}`,
          updatedBy: 'Student Portal',
        },
      ],
      isFlaggedDuplicate: !!existingDuplicate,
      duplicateOfId: existingDuplicate ? existingDuplicate.trackingId : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.state.complaints.unshift(newComplaint);
    this.persist();
    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    status: ComplaintRecord['status'],
    adminRemarks: string,
    adminId: string
  ): ComplaintRecord | null {
    const complaint = this.state.complaints.find((c) => c.id === id || c.trackingId === id);
    if (!complaint) return null;

    const user = this.getUserById(adminId);
    const updaterName = user ? user.name : 'Administrator';
    const now = new Date().toISOString();

    complaint.status = status;
    complaint.adminRemarks = adminRemarks;
    complaint.updatedAt = now;
    complaint.history.push({
      status,
      timestamp: now,
      remarks: adminRemarks || `Status updated to ${status}`,
      updatedBy: updaterName,
    });

    if (status === 'Resolved') {
      complaint.resolvedAt = now;
    }

    this.logAudit(adminId, 'STATUS_CHANGE', 'complaint', complaint.id, `Grievance ${complaint.trackingId} status updated to ${status}`);

    this.addNotification({
      recipientUserId: complaint.studentId,
      title: `Grievance Status: ${status} [${complaint.trackingId}]`,
      message: `Your ticket regarding "${complaint.subject}" is now ${status}. Notes: ${adminRemarks}`,
      type: 'Grievance',
      linkUrl: '#student-hub',
    });

    this.persist();
    return complaint;
  }

  public addComplaintRating(id: string, studentId: string, rating: number, feedbackNotes: string): boolean {
    const complaint = this.state.complaints.find((c) => (c.id === id || c.trackingId === id) && c.studentId === studentId);
    if (!complaint) return false;
    complaint.studentRating = rating;
    complaint.studentFeedback = feedbackNotes;
    this.persist();
    return true;
  }

  // ==========================================
  // PHASE 6: MODULE 3 — NOTES & PREVIOUS YEAR PAPERS (PYQs)
  // ==========================================
  public getNotesResources(filter?: {
    department?: string;
    semester?: number;
    resourceType?: string;
    search?: string;
  }): NotesResourceRecord[] {
    let list = [...this.state.notes_resources];

    if (filter?.department && filter.department !== 'All') {
      list = list.filter((n) => n.department.toLowerCase() === filter.department!.toLowerCase());
    }
    if (filter?.semester && filter.semester > 0) {
      list = list.filter((n) => n.semester === Number(filter.semester));
    }
    if (filter?.resourceType && filter.resourceType !== 'All') {
      list = list.filter((n) => n.resourceType.toLowerCase() === filter.resourceType!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q) ||
          n.subjectCode.toLowerCase().includes(q) ||
          n.authorName.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.likesCount - a.likesCount);
  }

  public createNotesResource(data: Omit<NotesResourceRecord, 'id' | 'downloadsCount' | 'likesCount' | 'ratingAverage' | 'ratingsCount' | 'reportedCount' | 'moderationStatus' | 'createdAt'>): NotesResourceRecord {
    const newNote: NotesResourceRecord = {
      ...data,
      id: `note-${Date.now()}`,
      downloadsCount: 0,
      likesCount: 1,
      ratingAverage: 5.0,
      ratingsCount: 1,
      reportedCount: 0,
      moderationStatus: 'Approved',
      createdAt: new Date().toISOString(),
    };
    this.state.notes_resources.unshift(newNote);
    this.persist();
    return newNote;
  }

  public rateNotesResource(id: string, rating: number): boolean {
    const note = this.state.notes_resources.find((n) => n.id === id);
    if (!note) return false;
    const total = note.ratingAverage * note.ratingsCount + rating;
    note.ratingsCount += 1;
    note.ratingAverage = Number((total / note.ratingsCount).toFixed(1));
    this.persist();
    return true;
  }

  public reportNotesResource(id: string, reason: string): boolean {
    const note = this.state.notes_resources.find((n) => n.id === id);
    if (!note) return false;
    note.reportedCount += 1;
    if (note.reportedCount >= 3) {
      note.moderationStatus = 'Flagged';
    }
    this.persist();
    return true;
  }

  public incrementNoteDownload(id: string): void {
    const note = this.state.notes_resources.find((n) => n.id === id);
    if (note) {
      note.downloadsCount += 1;
      this.persist();
    }
  }

  // ==========================================
  // PHASE 6: MODULE 4 — OPPORTUNITIES & APPLICATION TRACKER
  // ==========================================
  public getOpportunities(filter?: { type?: string; status?: string; search?: string }): OpportunityRecord[] {
    let list = [...this.state.opportunities];
    if (filter?.type && filter.type !== 'All') {
      list = list.filter((o) => o.type.toLowerCase() === filter.type!.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter((o) => o.status.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organizer.toLowerCase().includes(q) ||
          o.skillsRequired.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public createOpportunity(data: Omit<OpportunityRecord, 'id' | 'createdAt'>, userId: string): OpportunityRecord {
    const opp: OpportunityRecord = {
      ...data,
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.opportunities.unshift(opp);
    this.logAudit(userId, 'CREATE', 'opportunity', opp.id, `Created student opportunity: "${opp.title}"`);
    this.persist();
    return opp;
  }

  public deleteOpportunity(id: string, userId: string): boolean {
    const idx = this.state.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    const title = this.state.opportunities[idx].title;
    this.state.opportunities.splice(idx, 1);
    this.logAudit(userId, 'DELETE', 'opportunity', id, `Deleted opportunity: "${title}"`);
    this.persist();
    return true;
  }

  public trackOpportunity(
    studentId: string,
    opportunityId: string,
    status: TrackedApplication['status'],
    notes: string
  ): TrackedApplication {
    const opp = this.state.opportunities.find((o) => o.id === opportunityId);
    const existing = this.state.tracked_applications.find((t) => t.studentId === studentId && t.opportunityId === opportunityId);

    if (existing) {
      existing.status = status;
      existing.notes = notes;
      existing.updatedAt = new Date().toISOString();
      this.persist();
      return existing;
    }

    const newTrack: TrackedApplication = {
      id: `track-${Date.now()}`,
      studentId,
      opportunityId,
      opportunityTitle: opp ? opp.title : 'Opportunity',
      companyOrOrganizer: opp ? opp.organizer : 'External Organization',
      status,
      appliedDate: status === 'Applied' ? new Date().toISOString().split('T')[0] : undefined,
      notes,
      updatedAt: new Date().toISOString(),
    };

    this.state.tracked_applications.unshift(newTrack);
    this.persist();
    return newTrack;
  }

  public getTrackedApplications(studentId: string): TrackedApplication[] {
    return this.state.tracked_applications.filter((t) => t.studentId === studentId);
  }

  public deleteTrackedApplication(id: string, studentId: string): boolean {
    const idx = this.state.tracked_applications.findIndex((t) => t.id === id && t.studentId === studentId);
    if (idx === -1) return false;
    this.state.tracked_applications.splice(idx, 1);
    this.persist();
    return true;
  }

  // ==========================================
  // PHASE 6: MODULE 6 — CAMPUS QUEUE TRACKER (CROWDSOURCED)
  // ==========================================
  public getQueueLocations(): QueueLocationStatus[] {
    return this.state.queue_locations;
  }

  public submitQueueReport(report: {
    studentId: string;
    studentName: string;
    locationKey: QueueLocationStatus['key'];
    crowdLevel: QueueLocationStatus['currentCrowdLevel'];
    estimatedWaitMinutes: number;
    comment?: string;
  }): CrowdReport {
    const newReport: CrowdReport = {
      id: `qr-${Date.now()}`,
      studentId: report.studentId,
      studentName: report.studentName,
      locationKey: report.locationKey,
      crowdLevel: report.crowdLevel,
      estimatedWaitMinutes: report.estimatedWaitMinutes,
      comment: report.comment,
      reportedAt: new Date().toISOString(),
    };

    this.state.queue_reports.unshift(newReport);
    if (this.state.queue_reports.length > 200) {
      this.state.queue_reports = this.state.queue_reports.slice(0, 200);
    }

    const loc = this.state.queue_locations.find((l) => l.key === report.locationKey);
    if (loc) {
      loc.currentCrowdLevel = report.crowdLevel;
      loc.estimatedWaitMinutes = report.estimatedWaitMinutes;
      loc.lastReportedTime = 'Just now';
      loc.recentReports.unshift(newReport);
      if (loc.recentReports.length > 5) {
        loc.recentReports = loc.recentReports.slice(0, 5);
      }
    }

    this.persist();
    return newReport;
  }

  // ==========================================
  // PHASE 6: MODULE 7 — SMART ACADEMIC PLANNER
  // ==========================================
  public getPlannerTasks(studentId: string): PlannerTask[] {
    return this.state.planner_tasks.filter((t) => t.studentId === studentId);
  }

  public createPlannerTask(data: Omit<PlannerTask, 'id' | 'isCompleted' | 'createdAt'>): PlannerTask {
    const task: PlannerTask = {
      ...data,
      id: `task-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    this.state.planner_tasks.unshift(task);
    this.persist();
    return task;
  }

  public togglePlannerTask(taskId: string, studentId: string): PlannerTask | null {
    const task = this.state.planner_tasks.find((t) => t.id === taskId && t.studentId === studentId);
    if (!task) return null;
    task.isCompleted = !task.isCompleted;
    this.persist();
    return task;
  }

  public deletePlannerTask(taskId: string, studentId: string): boolean {
    const idx = this.state.planner_tasks.findIndex((t) => t.id === taskId && t.studentId === studentId);
    if (idx === -1) return false;
    this.state.planner_tasks.splice(idx, 1);
    this.persist();
    return true;
  }

  public getSubjectAttendance(studentId: string): SubjectAttendanceRecord[] {
    return this.state.subject_attendance.filter((a) => a.studentId === studentId);
  }

  public updateSubjectAttendance(
    studentId: string,
    subjectCode: string,
    subjectName: string,
    classesAttended: number,
    totalClassesHeld: number
  ): SubjectAttendanceRecord {
    let rec = this.state.subject_attendance.find((a) => a.studentId === studentId && a.subjectCode === subjectCode);
    if (rec) {
      rec.classesAttended = classesAttended;
      rec.totalClassesHeld = totalClassesHeld;
    } else {
      rec = {
        id: `att-${Date.now()}`,
        studentId,
        subjectCode,
        subjectName,
        classesAttended,
        totalClassesHeld,
      };
      this.state.subject_attendance.push(rec);
    }
    this.persist();
    return rec;
  }

  // ==========================================
  // PHASE 6: MODULE 8 — CAMPUS & CLASSROOM FINDER
  // ==========================================
  public getCampusRooms(filter?: {
    blockId?: string;
    floor?: string;
    category?: string;
    search?: string;
  }): CampusRoomRecord[] {
    let list = [...this.state.campus_rooms];
    if (filter?.blockId && filter.blockId !== 'All') {
      list = list.filter((r) => r.blockId.toLowerCase() === filter.blockId!.toLowerCase());
    }
    if (filter?.floor && filter.floor !== 'All') {
      list = list.filter((r) => r.floor.toLowerCase() === filter.floor!.toLowerCase());
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((r) => r.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.roomNumber.toLowerCase().includes(q) ||
          r.blockName.toLowerCase().includes(q) ||
          (r.equipment && r.equipment.some((e) => e.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  // ==========================================
  // PLACEMENTS & RECRUITERS
  // ==========================================
  public getPlacements(): PlacementRecord[] {
    return this.state.placements;
  }

  public getRecruiters(): RecruiterRecord[] {
    return this.state.recruiters;
  }

  // ==========================================
  // SAVED ITEMS / BOOKMARKS
  // ==========================================
  public getSavedItems(studentId: string): SavedItemRecord[] {
    return this.state.saved_items.filter((s) => s.studentId === studentId);
  }

  public saveItem(item: Omit<SavedItemRecord, 'id' | 'savedAt'>): SavedItemRecord {
    const existing = this.state.saved_items.find(
      (s) => s.studentId === item.studentId && s.itemType === item.itemType && s.itemId === item.itemId
    );
    if (existing) return existing;

    const saved: SavedItemRecord = {
      ...item,
      id: `save-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    this.state.saved_items.unshift(saved);
    this.persist();
    return saved;
  }

  public removeSavedItem(studentId: string, itemType: string, itemId: string): boolean {
    const idx = this.state.saved_items.findIndex(
      (s) => s.studentId === studentId && s.itemType === itemType && s.itemId === itemId
    );
    if (idx === -1) return false;
    this.state.saved_items.splice(idx, 1);
    this.persist();
    return true;
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public getNotifications(userId: string): NotificationRecord[] {
    return this.state.notifications.filter((n) => n.recipientUserId === userId || n.recipientUserId === 'ALL_STUDENTS');
  }

  public addNotification(data: Omit<NotificationRecord, 'id' | 'createdAt' | 'isRead'>): NotificationRecord {
    const notif: NotificationRecord = {
      ...data,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    this.persist();
    return true;
  }

  // ==========================================
  // DEPARTMENTS, FACILITIES & RESOURCES
  // ==========================================
  public getDepartments(): DepartmentRecord[] {
    return this.state.departments;
  }

  public getFacilities(): FacilityRecord[] {
    return this.state.facilities;
  }

  public getAcademicResources(): AcademicResourceRecord[] {
    return this.state.academic_resources;
  }

  // ==========================================
  // AI GROUNDING DOCUMENTS
  // ==========================================
  public getAiDocuments(): AiDocumentRecord[] {
    return this.state.ai_documents;
  }

  public toggleAiDocumentApproval(id: string, approved: boolean, userId: string): AiDocumentRecord | null {
    const doc = this.state.ai_documents.find((d) => d.id === id);
    if (!doc) return null;
    doc.isApprovedForGrounding = approved;
    doc.updatedAt = new Date().toISOString();
    this.logAudit(userId, 'UPDATE', 'resource', id, `Set AI grounding approval to ${approved} for: "${doc.title}"`);
    this.persist();
    return doc;
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  public getAuditLogs(limit = 100): AuditLogRecord[] {
    return this.state.audit_logs.slice(0, limit);
  }

  // ==========================================
  // SYSTEM STATS
  // ==========================================
  public getSystemStats() {
    return {
      totalUsers: this.state.users.length,
      totalStudents: this.state.users.filter((u) => u.role === 'Student').length,
      totalNotices: this.state.notices.length,
      publishedNotices: this.state.notices.filter((n) => !n.isDraft).length,
      totalEvents: this.state.events.length,
      upcomingEvents: this.state.events.filter((e) => e.status === 'Upcoming').length,
      totalRegistrations: this.state.event_registrations.length,
      totalGrievances: this.state.complaints.length,
      pendingGrievances: this.state.complaints.filter((c) => c.status === 'Pending' || c.status === 'Under Review' || c.status === 'In Progress').length,
      totalRecruiters: this.state.recruiters.length,
      totalAuditLogs: this.state.audit_logs.length,
      totalOpportunities: this.state.opportunities.length,
      totalNotes: this.state.notes_resources.length,
      totalLostFound: this.state.lost_items.length + this.state.found_items.length,
    };
  }
}

// Global Singleton
export const db = new DatabaseEngine();
