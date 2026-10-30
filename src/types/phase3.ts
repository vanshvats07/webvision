/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT CONNECT 2.0 — PHASE 3 DATA SCHEMAS
 * Smart Notice Board, Campus Events Platform, and Placement Insights Portal
 */

import { VerifiedSourceMeta } from './contentArchitecture';

export type NoticeCategory =
  | 'All'
  | 'Examination'
  | 'Admissions'
  | 'Academic'
  | 'Registration'
  | 'Scholarships'
  | 'Administration'
  | 'Events'
  | 'Placements'
  | 'Circulars';

export interface SmartNoticeItem {
  id: string;
  refNo: string;
  title: string;
  summary: string;
  fullContent: string[];
  category: NoticeCategory;
  department: string;
  semesterApplicable?: string; // e.g. "All Semesters", "Sem 1 & 2", "Sem 5 & 7"
  academicYear: string; // e.g. "2025-2026", "2024-2025"
  publicationDate: string; // e.g. "2026-10-28"
  displayDate: string; // e.g. "28 Oct 2026"
  issuer: string;
  issuerDesignation: string;
  isImportant: boolean;
  isUrgent: boolean;
  hasAttachment: boolean;
  attachmentFileName?: string;
  attachmentFileType?: 'PDF' | 'DOCX' | 'XLSX';
  attachmentSize?: string;
  documentDownloadUrl: string;
  officialSourceUrl: string;
  meta: VerifiedSourceMeta;
}

export type EventCategory =
  | 'All'
  | 'Technical'
  | 'Cultural'
  | 'Workshops'
  | 'Seminars'
  | 'Competitions'
  | 'Club Activities'
  | 'Hackathon';

export interface CampusEventItem {
  id: string;
  title: string;
  shortTagline: string;
  description: string;
  category: EventCategory;
  status: 'Upcoming' | 'Past';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  displayDate: string;
  time: string;
  venue: string;
  organizer: string;
  organizingBodyType: 'Department' | 'Student Society' | 'Incubator (MAIIF)' | 'Central Administration';
  eligibility: string;
  registrationDeadline: string;
  registrationUrl: string; // Preserves real external registration form (e.g. Unstop / Google Forms)
  registrationStatus: 'Open' | 'Closing Soon' | 'Closed' | 'On-Spot';
  officialSourceUrl: string;
  expectedAttendance: string;
  prizesOrCertificates?: string;
  facultyCoordinator: string;
  studentCoordinators: string[];
  posterBadgeText?: string;
  meta: VerifiedSourceMeta;
}

export interface DepartmentPlacementStat {
  departmentCode: string;
  departmentName: string;
  studentsRegistered: number;
  studentsPlaced: number;
  placementPercentage: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  topRecruiters: string[];
}

export interface SalarySlabDetail {
  slabRange: string;
  offerCount: number;
  percentageOfTotal: number;
  description: string;
  sampleCompanies: string[];
}

export interface BatchPlacementInsight {
  batchId: string;
  batchAcademicYear: string; // "2024-2025", "2023-2024", "2022-2023"
  reportingPeriod: string;
  totalOffers: number;
  uniqueStudentsPlaced: number;
  highestPackageInternationalLPA?: number;
  highestPackageDomesticLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  companiesVisited: number;
  topDomesticCompany: string;
  topInternationalCompany?: string;
  defenseRecruitmentOffers: number; // e.g. Indian Army / Navy UES
  salarySlabs: SalarySlabDetail[];
  departmentStats: DepartmentPlacementStat[];
  officialReportPdfUrl: string;
  officialReportPdfName: string;
  officialReportSize: string;
  meta: VerifiedSourceMeta;
}

export interface RecruiterDirectoryItem {
  id: string;
  companyName: string;
  sector: 'Software & Cloud' | 'Fintech & Quant' | 'Semiconductor & Hardware' | 'Consulting & Analytics' | 'Armed Forces' | 'Automotive & Core Engineering' | 'E-Commerce';
  tier: 'Super Dream (>= 20 LPA)' | 'Dream Tier (10 - 20 LPA)' | 'Core & Mass (5 - 10 LPA)' | 'Defense & PSU';
  topPackageOfferedLPA: number;
  rolesOffered: string[];
  selectionMode: 'On-Campus Drive' | 'Pool Campus' | 'University Entry Scheme (UES)' | 'Hackathon Hiring';
  hiringBatches: string[];
  description: string;
  meta: VerifiedSourceMeta;
}
