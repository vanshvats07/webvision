/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT — Beyond Boundaries
 * Bright, Premium, Sophisticated Light Theme Experience
 * Featuring original photographs on homepage: mait-main-gate.jpeg & mait-aerial-campus.jpeg
 * Phase 5 Integration: Full-Stack Express Server, Auth & RBAC, Admin CMS, Student Hub
 */

import React, { useState, useEffect } from 'react';
import { TopNav, NavPage } from './components/TopNav';
import { OperationalRibbon } from './components/OperationalRibbon';
import { HeroSection } from './components/HeroSection';
import { HomepagePhotoCarousel } from './components/HomepagePhotoCarousel';
import { Campus3DSection } from './components/Campus3DSection';
import { CampusAerialStorytelling } from './components/CampusAerialStorytelling';
import { AcademicProgramsSection } from './components/AcademicProgramsSection';
import { PlacementShowcase } from './components/PlacementShowcase';
import { EventsPreviewSection } from './components/EventsPreviewSection';
import { NoticesBulletin } from './components/NoticesBulletin';
import { ResearchInnovationSection } from './components/ResearchInnovationSection';
import { StudentLifeSection } from './components/StudentLifeSection';
import { SiteFooter } from './components/SiteFooter';
import { AdmissionsEstimatorModal } from './components/AdmissionsEstimatorModal';
import { CommandPalette } from './components/CommandPalette';
import { NoticeBoardPage } from './components/NoticeBoardPage';
import { EventsPlatformPage } from './components/EventsPlatformPage';
import { PlacementPortalPage } from './components/PlacementPortalPage';
import { DepartmentsPage } from './components/DepartmentsPage';
import { AcademicsPage } from './components/AcademicsPage';
import { AdmissionsPage } from './components/AdmissionsPage';
import { CampusLifePage } from './components/CampusLifePage';
import { AboutPage } from './components/AboutPage';
import { EventDetailModal } from './components/EventDetailModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { StudentHubPage } from './components/StudentHubPage';
import { MaitAiAssistant } from './components/MaitAiAssistant';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampusBlock, OfficialNotice } from './data/maitData';
import { CampusEventItem } from './types/phase3';

function MainAppContent() {
  const { user, isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    const hash = window.location.hash.replace('#', '') as NavPage;
    const validPages: NavPage[] = [
      'home',
      'about',
      'academics',
      'departments',
      'admissions',
      'campus-life',
      'notices',
      'events',
      'placements',
      'admin',
      'student-hub',
    ];
    if (validPages.includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<OfficialNotice | null>(null);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEventItem | null>(null);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mait_event_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Handle browser back/forward and hash links
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const validPages: NavPage[] = [
        'home',
        'about',
        'academics',
        'departments',
        'admissions',
        'campus-life',
        'notices',
        'events',
        'placements',
        'admin',
        'student-hub',
      ];
      if (validPages.includes(rawHash as NavPage)) {
        setCurrentPage(rawHash as NavPage);
      } else if (rawHash === '' || rawHash.startsWith('campus-')) {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for Cmd+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToPage = (page: NavPage) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCampus3D = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('campus-3d');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('campus-3d');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAcademics = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('academics');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('academics');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectNotice = (notice: OfficialNotice) => {
    setSelectedNoticeForModal(notice);
  };

  const handleSelectBlockFromSearch = (block: CampusBlock) => {
    scrollToCampus3D();
  };

  const toggleEventBookmark = (id: string) => {
    setBookmarkedEventIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('mait_event_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save event bookmark', e);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#203044] flex flex-col font-sans selection:bg-[#873A2B] selection:text-white">
      {/* 1. Global Navigation Bar with All Section Tabs & Auth Profile */}
      <TopNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        activePage={currentPage}
        onNavigate={navigateToPage}
      />

      {/* 2. Operational Utility Ribbon */}
      <OperationalRibbon onSelectNotice={handleSelectNotice} />

      <main className="flex-1">
        {/* HOMEPAGE VIEW: Approved 3D Digital Twin, Original Hero Gate & Aerial Storytelling */}
        {currentPage === 'home' && (
          <>
            {/* 3. Hero Section (Original Entrance Photo mait-main-gate.jpeg) */}
            <HeroSection
              onExplore3D={scrollToCampus3D}
              onOpenAdmissions={() => setIsAdmissionsOpen(true)}
              onViewPrograms={scrollToAcademics}
            />

            {/* Campus photos supplied by the institute */}
            <HomepagePhotoCarousel />

            {/* 4. Interactive 3D Architectural Campus Model in Daylight */}
            <Campus3DSection />

            {/* 5. Campus Aerial Storytelling (Original Photo mait-aerial-campus.jpeg) */}
            <CampusAerialStorytelling />

            {/* 6. Academic Programs & Engineering Departments */}
            <AcademicProgramsSection
              onOpenDepartments={() => navigateToPage('departments')}
              onOpenAcademics={() => navigateToPage('academics')}
            />

            {/* 7. Training & Placement Cell Showcase */}
            <PlacementShowcase
              onOpenFullPlacementPortal={() => navigateToPage('placements')}
            />

            {/* 8. Campus Events Preview */}
            <EventsPreviewSection
              onExploreAllEvents={() => navigateToPage('events')}
              onSelectEvent={(evt) => setSelectedEventForModal(evt)}
            />

            {/* 9. Official Notices & Circulars Bulletin */}
            <NoticesBulletin
              selectedNotice={selectedNoticeForModal}
              onClearSelectedNotice={() => setSelectedNoticeForModal(null)}
              onOpenFullNoticeBoard={() => navigateToPage('notices')}
            />

            {/* 10. Research, Patents & Dr. Nand Kishore Garg Central Library */}
            <ResearchInnovationSection />

            {/* 11. Student Life, Societies & Annual Techno-Cultural Fest */}
            <StudentLifeSection />
          </>
        )}

        {/* PAGE 1: ABOUT MAIT */}
        {currentPage === 'about' && (
          <AboutPage
            onBackToHome={() => navigateToPage('home')}
            onNavigateToDepartments={() => navigateToPage('departments')}
            onNavigateToAdmissions={() => navigateToPage('admissions')}
          />
        )}

        {/* PAGE 2: ACADEMIC RESOURCE CENTRE */}
        {currentPage === 'academics' && (
          <AcademicsPage
            onBackToHome={() => navigateToPage('home')}
            onNavigateToDepartments={() => navigateToPage('departments')}
          />
        )}

        {/* PAGE 3: DEPARTMENT DIRECTORY & PROFILES */}
        {currentPage === 'departments' && (
          <DepartmentsPage
            onBackToHome={() => navigateToPage('home')}
            onNavigateToAcademics={() => navigateToPage('academics')}
          />
        )}

        {/* PAGE 4: ADMISSIONS CENTRE 2026-27 */}
        {currentPage === 'admissions' && (
          <AdmissionsPage
            onBackToHome={() => navigateToPage('home')}
            onOpenCutoffEstimator={() => setIsAdmissionsOpen(true)}
          />
        )}

        {/* PAGE 5: CAMPUS LIFE EXPERIENCE */}
        {currentPage === 'campus-life' && (
          <CampusLifePage
            onBackToHome={() => navigateToPage('home')}
            onNavigateToEvents={() => navigateToPage('events')}
          />
        )}

        {/* PAGE 6: SMART NOTICE BOARD */}
        {currentPage === 'notices' && (
          <NoticeBoardPage onBackToHome={() => navigateToPage('home')} />
        )}

        {/* PAGE 7: CAMPUS EVENTS PLATFORM */}
        {currentPage === 'events' && (
          <EventsPlatformPage onBackToHome={() => navigateToPage('home')} />
        )}

        {/* PAGE 8: PLACEMENT INSIGHTS PORTAL */}
        {currentPage === 'placements' && (
          <PlacementPortalPage onBackToHome={() => navigateToPage('home')} />
        )}

        {/* PAGE 9: ADMIN CMS & AUDIT PORTAL (PHASE 5) */}
        {currentPage === 'admin' && (
          <AdminDashboardPage
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {/* PAGE 10: STUDENT DIGITAL HUB (PHASE 5) */}
        {currentPage === 'student-hub' && (
          <StudentHubPage
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigate={navigateToPage}
          />
        )}
      </main>

      {/* Institutional Compliance Site Footer */}
      <SiteFooter />

      {/* Modal: Admissions 2026 Cutoff Estimator & Counseling Guide */}
      <AdmissionsEstimatorModal
        isOpen={isAdmissionsOpen}
        onClose={() => setIsAdmissionsOpen(false)}
      />

      {/* Modal: Command Palette / Instant Search (Cmd+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBlock={handleSelectBlockFromSearch}
        onSelectNotice={handleSelectNotice}
      />

      <MaitAiAssistant />

      {/* Modal: Event Detail Modal */}
      <EventDetailModal
        event={selectedEventForModal}
        isOpen={!!selectedEventForModal}
        onClose={() => setSelectedEventForModal(null)}
        isBookmarked={selectedEventForModal ? bookmarkedEventIds.includes(selectedEventForModal.id) : false}
        onToggleBookmark={toggleEventBookmark}
      />

      {/* Modal: Authentication & Demo Profile Switcher */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(role) => {
          if (role === 'admin' || role === 'editor') {
            navigateToPage('admin');
          } else {
            navigateToPage('student-hub');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
