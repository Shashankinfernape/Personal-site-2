# Shashank's 3D Playable Open-World Game Portfolio — Master Prompt & Blueprint for Antigravity

## How to Use This in Antigravity

1. Open your `Desktop/El proyecto/Git-repos` workspace in **Antigravity** (so the agent has file-system access to all 17 of your reverse-engineered folders).  
2. Copy and paste the **Master Prompt** below directly into Antigravity.

You are a Principal WebGL Game Director and Creative Technologist building a 3D Playable Open-World Portfolio Game for \*\*Shashank S (@Shashankinfernape — https\://github.com/Shashankinfernape)\*\*.

\#\#\# 1\. LOCAL REVERSE-ENGINEERED ASSET HARVESTING (CRITICAL FIRST STEP)

Before writing code, inspect my local directory \`Desktop/El proyecto/Git-repos/\` which contains \*\*17 reverse-engineered engineering templates and forensic analysis packages\*\* generated via \`rea\`:

\- \*\*Core World & Movement Engine:\*\* \`abeto-messenger-engineering-template/\` (cel-shaded tiny-planet/open-world traversal, \`three-mesh-bvh\` collision, character & vehicle controller, stylized beach/grass shaders, emoji/dialogue bubbles)

\- \*\*WebGL Shaders & Transitions:\*\* \`igloo-inc-analysis/\` (procedural Voronoi crystal shaders, SDF text scramble, velocity particles), \`lusion-engineering-template/\` (spring physics, fluid distortion, transmission materials), \`into-the-amazon-engineering-template/\` (LiDAR point clouds & 3D minimap), \`pixelflakes-engineering-template/\` (blueprint wireframe-to-solid preloader), \`why-zero-university-engineering-template/\` (spatial campus/theatre layout)

\- \*\*Playful Physics & Telemetry:\*\* \`dont-board-me-engineering-template/\` (throwable/destructible fun art props), \`landonorris-engineering-template/\` (high-contrast F1 speed/drift telemetry HUD), \`display-studio-engineering-template/\` (accessible fast-travel drawer), \`other-side-of-truth-analysis/\` (X-Ray wireframe debug toggle), \`self-aware-analysis/\` (spatial CAD gizmos)

\- \*\*Game & Social UI Overlays:\*\* \`brawl-stars-analysis/\` (\`IMPLEMENTATION-PLAN.md\` & \`PROMPTS.md\` — skewed neo-brutalist Brawler loadout cards & rarity badges), \`clash-of-clans-analysis/\` (\`IMPLEMENTATION-PLAN.md\` & \`PROMPTS.md\` — isometric village map zoom-out & building level badges), \`reddit-engineering-template/\` (nested engineering Dev-Log comment trees), \`instagram-engineering-template/\` (top Stories ring quick-warp & vertical Reels preview cards).

Harvest the best shaders, design tokens, camera curves, and UI patterns from those 17 folders to build a single cohesive 3D playable game.

\#\#\# 2\. CORE GAMEPLAY LOOP: "THE PLAYER, THE GUIDE (SHASHANK), VEHICLES & OPEN-AIR THEATRES"

Instead of a passive scroll site, this is a real-time 3D playable open world inspired by \*\*Messenger by Abeto (https\://messenger.abeto.co/)\*\*:

1\. \*\*The Visitor is the Player (\`PlayerController.tsx\`):\*\*

   \- Can walk/run on foot (\`WASD\` / Arrow keys / virtual joystick), hop onto a \*\*Playable Bicycle\*\* (cruising paths, ringing bell with \`\[B\]\`, bunny-hopping ramps with \`\[Space\]\`), or jump into a \*\*Playable Arcade Drift Car\*\* (spring suspension, tire smoke particles, turbo boost with \`\[Shift\]\`, headlights \`\[H\]\`).

   \- Switch vehicles anytime with \`\[1\] On Foot\`, \`\[2\] Bicycle\`, \`\[3\] Drift Car\`.

2\. \*\*Shashank is the In-Game NPC Guide (\`ShashankGuideNPC.tsx\`):\*\*

   \- A stylized 3D character of me (\*\*Shashank\*\*) spawns at the central plaza, waves to the player, and acts as their personal tour guide.

   \- \*\*Two Exploration Modes:\*\*

     \- \*\*Guided Tour Mode (\`\[G\]\` Key or "Follow Shashank" UI Button):\*\* My NPC walks/bikes ahead of the player from one Open-Air Theatre to the next. When we arrive at a theatre, my NPC walks onto the stage, faces the giant 3D screen, and explains the project through animated speech bubbles (and optional audio hooks for my \`Franky\` F5-TTS voice model).

     \- \*\*Free Roam Mode:\*\* The player drives/bikes freely around the world, hitting jump ramps, knocking over interactive 3D pop-art sculptures, and pulling into any Drive-In Open Theatre at their own pace—while my Guide NPC skates/bikes over to meet them whenever they park at a theatre.

3\. \*\*Open-Air Drive-In 3D Theatres (\`OpenAirTheatre.tsx\`):\*\*

   \- Each of my GitHub repositories is represented as an architectural \*\*Open-Air Amphitheatre / Drive-In Cinema Pavilion\*\* set in the open world.

   \- When the player \+ Shashank enter a theatre's proximity ring (within 14 meters):

     \- The ambient world lighting dims slightly around the stage (\`The Drop Store\` spotlight effect).

     \- The giant curved 3D holographic theatre screen boots up (with \`Igloo Inc.\` frost-dissolve \+ SDF scramble text) and streams a live interactive visual preview of that project.

     \- Shashank (Guide NPC) delivers a 3-step interactive walkthrough of why and how I built it, with buttons to \`\[Open Brawl/Reddit Deep-Dive\]\`, \`\[View Live App\]\`, or \`\[Lead Me to Next Theatre \-\>\]\`.

\#\#\# 3\. WORLD ZONES & OPEN-AIR THEATRES (MY REAL GITHUB PROJECTS)

Arrange these 7 Open-Air Theatres \+ 1 Reverse-Engineering Art Plaza in a scenic, loopable open world connected by bike trails, drift tracks, bridges, and fun 3D art installations:

\- \*\*THEATRE 01 — Handesk Amphitheatre (\`KINETIC GESTURE PAVILION\`, \`\#00F5D4\`, pos \`\[0, 0, \-35\]\`):\*\*

  \- \*Project:\* Python \+ MediaPipe \+ OpenCV touchless desktop gesture engine using a One-Euro smoothing filter \+ pinch hysteresis.

  \- \*3D Theatre Art:\* Giant articulated 3D cyber-hand sculpture behind the screen that mimics cursor movements; interactive floating keycaps the car can drift through.

\- \*\*THEATRE 02 — Slidepaper Drive-In Cinema (\`PRISM WALLPAPER ARENA\`, \`\#FF2A85\`, pos \`\[45, 0, \-50\]\`):\*\*

  \- \*Project:\* Flutter \+ Dart \+ Node.js \+ Firebase \+ MongoDB Atlas community wallpaper hub (\`https\://github.com/Shashankinfernape/Slidepaper\`, live on \`https\://slidepapers.onrender.com\`) serving \`Original\`, \`16:9 4K\`, and \`21:9 Ultrawide\` wallpaper bundles.

  \- \*3D Theatre Art:\* Triple-screen panoramic IMAX drive-in displaying \`16:9\` and \`21:9\` floating glass portals and anime/car wallpaper art from my \`bundles.json\` schema.

\- \*\*THEATRE 03 — Examinar Open Lecture Dome (\`ANNA UNIVERSITY SYLLABUS DOME\`, \`\#FFD800\`, pos \`\[60, 0, 15\]\`):\*\*

  \- \*Project:\* Flutter \+ Isar NoSQL \+ Riverpod \+ Firebase Auth exam-prep platform (\`https\://github.com/Shashankinfernape/Examinar\`, live on \`https\://examinar-ad566.firebaseapp.com\`) built for Anna University CSE syllabi and PYQ banks.

  \- \*3D Theatre Art:\* Inspired by \`why-zero-university-engineering-template/\`—an open-air futuristic campus amphitheatre with floating 3D exam-paper planes and glowing Isar database crystals.

\- \*\*THEATRE 04 — Franky Soundstage & Speedbowl (\`QWEN 8B \+ F5-TTS VOICE ARENA\`, \`\#FF5500\`, pos \`\[15, 0, 55\]\`):\*\*

  \- \*Project:\* Unified GPU FastAPI server pairing \`Qwen/Qwen2.5-7B-Instruct\` (FP16) with my custom 250-epoch fine-tuned \`F5-TTS\` Lightning McQueen voice synthesis model \+ ngrok \+ Vercel.

  \- \*3D Theatre Art:\* An audio-reactive \`Lusion\` ferrofluid soundstage surrounded by a banked race-track bowl with a playable red \#95-inspired drift car ramp.

\- \*\*THEATRE 05 — Territory LiDAR Overlook (\`GEOSPATIAL REAL-ESTATE PAVILION\`, \`\#38BDF8\`, pos \`\[-45, 0, 45\]\`):\*\*

  \- \*Project:\* Flutter \+ Firebase \+ Google Maps API \+ MongoDB Atlas OLX-style real-estate marketplace (\`https\://github.com/Shashankinfernape/Territory\`).

  \- \*3D Theatre Art:\* Built with \`into-the-amazon-engineering-template/\` LiDAR shaders—a glowing 3D miniature city installation that rises out of the ground as the player bikes/drives over map pins.

\- \*\*THEATRE 06 — SSTRAESS Cyber-Vault Stage (\`JWT AUTH & SECURITY FORTRESS\`, \`\#A855F7\`, pos \`\[-60, 0, \-15\]\`):\*\*

  \- \*Project:\* Node.js \+ Express \+ MongoDB Atlas \+ JWT refresh/expiry & RBAC platform (\`https\://github.com/Shashankinfernape/SSTRAESS\` & \`JWT-Token-Refresh-and-Expiry-SSTRAESS\`).

  \- \*3D Theatre Art:\* Rotating concentric cryptographic laser rings that open like a vault door when the player's car or bicycle approaches the theatre screen.

\- \*\*THEATRE 07 — Chatflix & Fake News NLP Outdoor Cinema (\`WHATSAPP CINEMA & AI LAB\`, \`\#22C55E\`, pos \`\[-35, 0, \-60\]\`):\*\*

  \- \*Project:\* Node.js \+ WhatsApp API \+ TMDB conversational movie recommender \+ Python TF-IDF/BERT Fake News Detection pipeline \+ St. Joseph School React portal.

  \- \*3D Theatre Art:\* Retro-futuristic drive-in movie theatre with giant 3D popcorn/clapperboard physics props and a live WhatsApp chat-bubble hologram screen.

\- \*\*PLAZA 08 — The 17-Template Reverse-Engineering Sculpture Park (\`CENTER SPAWN PLAZA\`, pos \`\[0, 0, 0\]\`):\*\*

  \- \*3D Fun Art:\* A central sculpture garden featuring 17 interactive kinetic art totems—one for each folder in \`Desktop/El proyecto/Git-repos\` (Brawl Stars, Clash of Clans, Reddit, Instagram, Messenger, Igloo Inc., Lusion, Lando Norris, etc.)—plus physics bowling pins, bicycle half-pipes, and drift rings.

\#\#\# 4\. TECH STACK & ARCHITECTURE

\- \*\*Framework:\*\* Vite \+ React \+ TypeScript \+ Tailwind CSS

\- \*\*3D & Physics:\*\* \`three\`, \`@react-three/fiber\`, \`@react-three/drei\`, \`@react-three/rapier\` (or \`three-mesh-bvh\` \+ custom spring physics from \`abeto-messenger-engineering-template\`), \`@react-three/postprocessing\`, \`gsap\`, \`zustand\`, \`lucide-react\`

\- \*\*Camera Modes (\`\[C\]\` or HUD Toggle):\*\*

  1\. \`THIRD\_PERSON\_FOLLOW\`: Smooth spring-arm camera following the Player (on foot, bicycle, or drift car) with \`ShashankGuideNPC\` visible in frame.

  2\. \`THEATRE\_CINEMA\_LOCK\`: Smoothly dollies in to frame both the giant Open-Air Theatre screen and Shashank on stage when explaining a project.

  3\. \`CLASH\_ISOMETRIC\_MAP\` (\`\[M\]\` Key): High-altitude orthographic/isometric overview (from \`clash-of-clans-analysis/\`) where all 7 Open-Air Theatres appear as leveled-up village buildings (\`LVL 10 PRISM ARENA\`, \`LVL 10 VOICE FORGE\`) for one-click fast travel.

\#\#\# 5\. PHASED EXECUTION PLAN (NO STUBS OR TODOs)

1\. \*\*Phase 1 (Harvest & World Foundation):\*\* Scan \`Desktop/El proyecto/Git-repos\` to extract color palettes, shader snippets, and UI patterns. Scaffold the Vite React-TS app, \`projects.config.ts\`, \`useGameStore.ts\`, and the stylized cel-shaded terrain with roads, bike trails, and ramps.

2\. \*\*Phase 2 (Player, Bicycle, Drift Car & Physics Art):\*\* Implement \`PlayerController.tsx\` supporting 3 seamless modes (\`ON\_FOOT\`, \`BICYCLE\`, \`DRIFT\_CAR\`) with wheel rotation, drift smoke particles, bike bell/bunny-hop, and interactive physics art props (dominoes, ramps, crystal shards, kinetic sculptures).

3\. \*\*Phase 3 (Shashank NPC Guide & Autonomous Tour Pathing):\*\* Implement \`ShashankGuideNPC.tsx\` with waypoint pathfinding between the 7 Open-Air Theatres, proximity greeting, speech bubble state machine, and \`"Follow Shashank to Next Project"\` autopilot mode.

4\. \*\*Phase 4 (Open-Air Streaming Theatres & Shaders):\*\* Build \`OpenAirTheatre.tsx\` with curved WebGL canvas-texture video/shader screens, \`Igloo Inc.\` crystal stage pillars, and \`Into the Amazon\` LiDAR zone rings.

5\. \*\*Phase 5 (Brawl Stars / Reddit / Lando Norris HUD & Polish):\*\* Build the overlay HUD combining \`landonorris-engineering-template\` speedometer (\`KM/H\` \+ gear \+ drift score), \`instagram-engineering-template\` top Stories fast-travel rings, \`brawl-stars-analysis\` skewed project stat cards, \`reddit-engineering-template\` nested Dev-Log threads, and \`other-side-of-truth-analysis\` \`\[R\]\` X-Ray wireframe mode.

Start now by inspecting the template folders in \`Desktop/El proyecto/Git-repos\`, writing \`GAME\_ARCHITECTURE.md\`, and building \*\*Phase 1\*\* and \*\*Phase 2\*\*.