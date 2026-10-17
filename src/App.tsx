// src/App.tsx
import React from 'react';
import { OpenWorldScene } from './canvas/OpenWorldScene';
import { LandoTelemetryHud } from './components/LandoTelemetryHud';
import { InstagramStoryBar } from './components/InstagramStoryBar';
import { BrawlRedditDrawer } from './components/BrawlRedditDrawer';
import { RecruiterFastDrawer } from './components/RecruiterFastDrawer';
import { ResearchArchiveModal } from './components/ResearchArchiveModal';
import { WardrobeCustomizerModal } from './components/WardrobeCustomizerModal';
import { useGitHubSync } from './hooks/useGitHubSync';

export const App: React.FC = () => {
  // Sync live GitHub metadata for Shashank's repositories
  useGitHubSync('Shashankinfernape');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070B09] select-none font-mono">
      {/* 3D Playable Open-World Game Scene */}
      <OpenWorldScene />

      {/* Instagram Stories Top Warp Bar */}
      <InstagramStoryBar />

      {/* Lando Norris F1 Speedometer & Telemetry HUD */}
      <LandoTelemetryHud />

      {/* Brawl Stars Brawler Loadout & Reddit r/ShashankBuilds Drawer */}
      <BrawlRedditDrawer />

      {/* 60-Second Recruiter Field Notebook Drawer */}
      <RecruiterFastDrawer />

      {/* 17 Reverse-Engineering Studies Museum Archive */}
      <ResearchArchiveModal />

      {/* Messenger by Abeto 3D Wardrobe Customizer Modal */}
      <WardrobeCustomizerModal />
    </div>
  );
};

export default App;
