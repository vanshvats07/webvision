/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — CONTENT ARCHITECTURE SCHEMA
 * Maharaja Agrasen Institute of Technology, Rohini, New Delhi
 * Reference: https://mait.ac.in/
 */

export type VerificationStatus =
  | 'VERIFIED_OFFICIAL'   // Actively confirmed from live mait.ac.in or official university documents
  | 'OFFICIAL_ARCHIVE'    // Valid official record from past academic years/archives
  | 'PENDING_UPDATE'      // Official notice awaiting current academic session circular release
  | 'INACCESSIBLE_SOURCE'; // Protected or offline endpoint (e.g. internal ERP, private webmail)

export interface VerifiedSourceMeta {
  sourceUrl: string;
  documentUrl?: string;
  verifiedDate: string;
  academicYearOrBatch: string;
  verificationStatus: VerificationStatus;
  officialCitation: string;
}

export interface LeadershipRecord {
  id: string;
  name: string;
  designation: string;
  entity: 'MATES' | 'MAIT' | 'Academic Council';
  qualifications: string;
  messageOrBio: string;
  email?: string;
  meta: VerifiedSourceMeta;
}

export interface FacultyRecord {
  id: string;
  name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Head of Department';
  departmentId: string;
  qualification: string;
  specialization: string[];
  email: string;
  cabinOrRoom?: string;
  researchInterests: string[];
  meta: VerifiedSourceMeta;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  blockNumber: number;
  blockName: string;
  established: number;
  hodName: string;
  hodEmail: string;
  description: string;
  vision: string;
  mission: string[];
  intakeTotal: number;
  programsOffered: string[];
  laboratories: { name: string; roomNo?: string; equipmentOverview: string }[];
  meta: VerifiedSourceMeta;
}

export interface AcademicProgramRecord {
  id: string;
  name: string;
  degree: 'B.Tech' | 'B.Tech Lateral Entry' | 'MBA';
  departmentId: string;
  durationYears: number;
  intakeSeats: number;
  shift: 'Shift 1' | 'Shift 2' | 'Combined';
  affiliation: string;
  accreditationStatus: string;
  annualFeeINR: number;
  totalCourseFeeINR: number;
  admissionCriteria: string;
  curriculumSemesterCount: number;
  meta: VerifiedSourceMeta;
}

export interface PlacementStatRecord {
  batchYear: string;
  reportingPeriod: string;
  totalOffers: number;
  highestPackageInternationalLPA?: number;
  highestPackageDomesticLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  companiesVisited: number;
  salarySlabs: {
    slabName: string;
    offerCount: number;
  }[];
  meta: VerifiedSourceMeta;
}

export interface RecruiterRecord {
  id: string;
  companyName: string;
  tier: 'Super Dream (>= 20 LPA)' | 'Dream (12 - 20 LPA)' | 'Core & Mass' | 'Defense & PSU';
  topPackageOfferedLPA?: number;
  rolesOffered: string[];
  sector: 'Software & Cloud' | 'Fintech & Investment' | 'Semiconductor & Hardware' | 'Consulting & Services' | 'Armed Forces';
  meta: VerifiedSourceMeta;
}

export interface NoticeRecord {
  id: string;
  refNo: string;
  title: string;
  description: string;
  category: 'Academic' | 'Examination' | 'Admissions' | 'Placements' | 'Scholarships' | 'General';
  department: string;
  publicationDate: string;
  academicYear: string;
  issuer: string;
  isUrgent: boolean;
  meta: VerifiedSourceMeta;
}

export interface EventRecord {
  id: string;
  title: string;
  eventType: 'Upcoming' | 'Completed';
  category: 'Techno-Cultural Fest' | 'Hackathon' | 'IEEE Symposium' | 'Sports Meet' | 'Orientation';
  startDate: string;
  endDate: string;
  venue: string;
  organizingBody: string;
  description: string;
  footfallOrParticipants: string;
  meta: VerifiedSourceMeta;
}

export interface ScholarshipRecord {
  id: string;
  name: string;
  type: 'Delhi State Government (e-District)' | 'MATES Institutional' | 'National Scholarship Portal (NSP)' | 'Corporate Foundation';
  eligibility: string;
  financialCoverage: string;
  applicationPeriod: string;
  portalUrl: string;
  submissionOffice: string;
  meta: VerifiedSourceMeta;
}

export interface SocietyRecord {
  id: string;
  name: string;
  shortName: string;
  category: 'Technical' | 'Cultural' | 'Research & Racing' | 'Literary & Social';
  tagline: string;
  description: string;
  facultyCoordinator: string;
  keyEvents: string[];
  activeMembersCount: number;
  meta: VerifiedSourceMeta;
}

export interface FacilityRecord {
  id: string;
  name: string;
  blockNumber: number;
  category: 'Academic Library' | 'Auditorium' | 'Computing Facility' | 'Sports Complex' | 'Incubation Centre' | 'Hostel' | 'Cafeteria';
  capacityOrExtent: string;
  specs: string[];
  operationalHours: string;
  meta: VerifiedSourceMeta;
}

export interface AlumniRecord {
  id: string;
  name: string;
  batch: string;
  branch: string;
  currentRole: string;
  organization: string;
  higherEducation?: string;
  category: 'Tech Giants' | 'Academia & Research' | 'Civil & Public Service' | 'Social Entrepreneurship';
  meta: VerifiedSourceMeta;
}

export interface AdmissionCutoffRecord {
  branchCode: string;
  branchName: string;
  academicYear: string;
  homeStateClosingRank: string;
  outsideDelhiClosingRank: string;
  intake: number;
  eligibilitySubjectNorms: string;
  meta: VerifiedSourceMeta;
}

export interface AcademicResourceRecord {
  id: string;
  title: string;
  resourceType: 'Syllabus Scheme' | 'Academic Calendar' | 'Previous Year Question Papers' | 'Digital Library Portal';
  departmentOrScope: string;
  applicableBatch: string;
  documentPdfUrl?: string;
  portalUrl: string;
  meta: VerifiedSourceMeta;
}
