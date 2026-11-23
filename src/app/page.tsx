'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChristmasProvider, useChristmas } from '../context/ChristmasContext';
const Snowfall = dynamic(
  () => import('../components/Snowfall').then((m) => ({ default: m.Snowfall })),
  { ssr: false }
);
import { FestiveSidebar } from '../components/FestiveSidebar';
import { TopBarHeader } from '../components/TopBarHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { InstallPwaPrompt } from '../components/InstallPwaPrompt';
import { AuthModal } from '../components/auth/AuthModal';
import { CompleteProfileModal } from '../components/auth/CompleteProfileModal';

// Modules
import { DashboardModule } from '../components/modules/DashboardModule';
import { ActivitiesModule } from '../components/modules/ActivitiesModule';
import { FinancesModule } from '../components/modules/FinancesModule';
import { SecretSantaModule } from '../components/modules/SecretSantaModule';
import { NovenaModule } from '../components/modules/NovenaModule';
import { PollsModule } from '../components/modules/PollsModule';
import { AdventModule } from '../components/modules/AdventModule';
import { GamesModule } from '../components/modules/GamesModule';
import { MemoriesModule } from '../components/modules/MemoriesModule';
import { SantaAIModule } from '../components/modules/SantaAIModule';
import { CommunitySettingsModule } from '../components/modules/CommunitySettingsModule';

function MainAppShell() {
  const { activeTab, community, currentUser, members, login, showCompleteProfileModal } = useChristmas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'activities':
        return <ActivitiesModule />;
      case 'finances':
        return <FinancesModule />;
      case 'secretsanta':
        return <SecretSantaModule />;
      case 'novena':
        return <NovenaModule />;
      case 'polls':
        return <PollsModule />;
      case 'advent':
        return <AdventModule />;
      case 'games':
        return <GamesModule />;
      case 'memories':
        return <MemoriesModule />;
      case 'santa-ai':
        return <SantaAIModule />;
      case 'settings':
        return <CommunitySettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen flex relative selection:bg-amber-400 selection:text-pine-950">
      {/* 1. Snowfall Particles */}
      <Snowfall />

      {/* 2. Left Gorgeous Festive Sidebar (Desktop + Mobile Drawer) */}
      <FestiveSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with title, mobile hamburger & invite */}
        <TopBarHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Viewport for Active Module */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-6">
          {renderActiveModule()}
        </main>

        {/* Festive Footer */}
        <footer className="py-6 border-t border-amber-500/15 bg-pine-950/40 text-center text-xs text-emerald-300/70 mb-16 lg:mb-0">
          <p suppressHydrationWarning className="font-cinzel text-amber-300 font-bold tracking-wider">
            {community.name} · Navidad {community.year}
          </p>
          <p suppressHydrationWarning className="text-[11px] text-emerald-200/60 mt-0.5">
            {community.slogan} · Next.js & Supabase PWA
          </p>
        </footer>
      </div>

      {/* 4. Mobile Bottom Navigation for PWA */}
      <BottomNavigation onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* 5. Smart Install PWA Prompt */}
      <InstallPwaPrompt />

      {/* 6. Auth Modal if no user logged in or user opens modal */}
      {(!currentUser || showAuthModal) && (
        <AuthModal
          onLogin={(user) => {
            login(user);
            setShowAuthModal(false);
          }}
          existingUsers={members}
          masterPin={community.masterPin || '2026'}
        />
      )}

      {/* 7. Complete Profile Modal for new Google users */}
      {showCompleteProfileModal && currentUser && <CompleteProfileModal />}
    </div>
  );
}

export default function Home() {
  return (
    <ChristmasProvider>
      <MainAppShell />
    </ChristmasProvider>
  );
}
