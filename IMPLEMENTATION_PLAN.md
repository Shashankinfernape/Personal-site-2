# Shashank S (@Shashankinfernape) — 3D WebGL Walkthrough Portfolio Implementation Plan

**Target Builder:** Gemini Flash 3.8 / AI Coding Agent  
**Developer Profile:** [Shashank S (@Shashankinfernape)](https://github.com/Shashankinfernape) — B.E. CSE Undergraduate (Anna University, 2023–2027), Full-Stack, Flutter, Node.js, & AI Builder ([Resume PDF](https://drive.google.com/file/d/1ifttPz3eSKj2O3zpUYfwu4tbBQzIwY0V/view?usp=drivesdk))  
**Core Concept:** **"THE REVERSE-ENGINEERED REALM"** — A real-time 3D WebGL spatial walkthrough where visitors fly along a spline rail through a stylized, shader-driven cyber-arctic & LiDAR world. Each of your GitHub repositories exists as an interactive 3D architectural monument encased in procedurally grown crystal/ice that shatters and boots up into an interactive 3D inspection pedestal when approached.

## 1\. Visual & Interaction DNA Matrix (Your 15 Favourite UIs Synthesized)

Every reference you listed contributes a specific, concrete engineering subsystem to this portfolio so the site feels cohesive rather than cluttered:

| Inspiration Source | Core Mechanic Extracted | Where It Lives in Your 3D Portfolio |
| :---- | :---- | :---- |
| [**Igloo Inc.**](https://www.awwwards.com/igloo-inc-case-study.html) ([Live](https://www.igloo.inc/), [WebGPU Breakdown](https://www.webgpu.com/showcase/igloo-inc-procedural-crystals/)) | Procedural ice-crystal growth enclosures, WebGL SDF text scramble/glitch shaders, chromatic aberration scene transitions, and velocity-reactive volume particles | **Project Monoliths & Footer:** Each GitHub repo sits inside a unique procedural crystal enclosure that frost-dissolves on approach; footer particles morph into 3D shapes on link hover |
| [**Lusion**](https://lusion.co/) | Inertia-damped spline camera rail, physical transmission glass (`MeshTransmissionMaterial`), and fluid pointer-reactive distortion fields | **Core Traversal Engine:** Butter-smooth `CatmullRomCurve3` scroll-driven camera flight with mouse-velocity post-processing bloom & lens distortion |
| [**Messenger by Abeto**](https://www.awwwards.com/sites/messenger) | Tiny-planet / stylized world exploration, cel-shaded rim lighting, character/drone guide, and interactive station beacons | **Drone Companion & Beacons:** A floating cyber-inferno drone leads the camera along the spline path, pinging project stations as you arrive |
| [**Self Aware Studio**](https://selfaware.studio/) | Tactile "design engineering" spatial gizmos, retro-futuristic OS window chrome, and rhythmic kinetic typography | **Reverse-Engineering Inspector:** Floating CAD-style measurement lines, bounding-box gizmos, and live shader uniform sliders on hover |
| [**Lando Norris**](https://landonorris.com/) ([Awwwards](https://www.awwwards.com/sites/lando-norris), [Case Study](https://www.itsoffbrand.com/our-work/lando-norris)) | High-speed F1 telemetry HUD, papaya/acid-lime high-contrast accents, sector split markers, and scroll-velocity gauges | **Telemetry HUD Overlay:** Fixed viewport corners showing live `FPS`, `SCROLL VELOCITY (km/h)`, `SPLINE COORDS (X,Y,Z)`, and `SECTOR 01–08` markers |
| [**Into The Amazon**](https://www.awwwards.com/sites/into-the-amazon) | Point-cloud **LiDAR Fly-Through** aesthetic (`#FFD800` on `#111111`) and **Dynamic 3D Map Menu** | **Terrain & Minimap:** The surrounding landscape is rendered as a glowing GPU LiDAR point cloud (`uPointSize` \+ elevation wave shader) with a live radar minimap |
| [**The Drop Store for the UN**](https://www.awwwards.com/sites/the-drop-store-for-the-un) | Stark `#000000` / `#FFFFFF` monochrome specimen pedestal inspection mode | **Project Focus Mode:** Clicking any 3D monument dims the world to pitch black and spotlights the project artifact on a rotating museum pedestal |
| [**Pixelflakes**](https://www.awwwards.com/sites/pixelflakes) | Architectural wireframe-to-rendered "sketch approach" preloader & 360° gallery transitions | **Boot Sequence Preloader:** Site boots as an architectural blueprint sketch that extrudes into 3D geometry as assets reach 100% |
| [**Display Studio**](https://www.awwwards.com/sites/display-studio) | Accessible, high-WPO horizontal drawer transitions and warm coral-to-amber (`#FF667D` → `#FF9776`) accent gradients | **Keyboard/A11y Fast-Nav Drawer:** Press `Tab` or open the horizontal project dock for zero-motion-sickness instant navigation |
| [**Don't Board Me**](https://www.awwwards.com/sites/dont-board-me) | Playful physics-enabled Easter-egg props and interactive 404/off-rail zone | **Off-Rail Sandbox:** Drag-and-throw physics debris floating near nodes \+ a playable 404 mini-zone if a user flies off the spline |
| [**The Other Side of Truth**](https://www.awwwards.com/websites/sites_of_the_year/) | Dual-perspective narrative flip (surface presentation vs. underlying truth) | **"X-Ray / Reverse-Engineer Mode" (`R` Key):** Global shader toggle that strips textures to reveal raw wireframes, UV normals, and your reverse-engineered UI breakdowns |
| [**Clash of Clans**](https://supercell.com/en/games/clashofclans/) | Isometric village/base overview where every structure has upgrade levels, resource collectors, and tap-to-inspect popups | **Isometric Base View (`M` Key):** Zooms camera out to an isometric orthographic overview where your repos appear as upgradable tech buildings (`LVL 9 AI FORGE`, `LVL 8 FLUTTER CITADEL`) |
| [**Brawl Stars**](https://supercell.com/en/games/brawlstars/) | Skewed neo-brutalist "Brawler Select" cards, rarity badges (`LEGENDARY`, `MYTHIC`), punchy 3D model spin, and stat bars | **Project Loadout Card:** Each project modal uses skewed Brawl-style stat bars (`Architecture`, `Scale`, `AI Power`), rarity tier badges, and spring-physics 3D rotation |
| [**Instagram**](https://about.instagram.com/) | Top "Stories Ring" quick-switcher with gradient ring indicators and vertical "Reels" preview cards | **Top HUD Story Nodes:** Circular gradient rings at the top of the HUD let recruiters jump straight to any project or watch a 5-second shader preview |
| [**Reddit**](https://redditinc.com/) | Collapsible nested comment trees, upvote counters, flair tags, and `TL;DR` engineering post-mortems | **Dev-Log Thread Panel:** Inside each project modal, engineering deep-dives are structured like a nested `r/ShashankBuilds` thread with collapsible architecture branches |

## 2\. Curated 3D World Zones (Mapped to Your Real GitHub Projects)

Based on your [GitHub profile](https://github.com/Shashankinfernape), [Resume PDF](https://drive.google.com/file/d/1ifttPz3eSKj2O3zpUYfwu4tbBQzIwY0V/view?usp=drivesdk), [Slidepaper `bundles.json`](https://drive.google.com/file/d/18ej2uuMT0ih_18W6IpaKUNXPGqzLhi0g/view?usp=drivesdk), and [Franky Colab Voice Server](https://colab.research.google.com/drive/1uvPHHSQK9PoqkqAAXXA2DfvNGpd9Sz8w?ouid=116642293753202632982), the 3D spline is divided into **9 Spatial Sectors**:

| Sector | Project / Zone Name | Tech Stack & Flairs | 3D Monument & Shader Mechanic |
| :---- | :---- | :---- | :---- |
| **00 — Spawn** | **The Infernape Core (Intro & Preloader)** | `Three.js` · `GLSL` · `GSAP` · `R3F` | [Pixelflakes](https://www.awwwards.com/sites/pixelflakes) blueprint wireframe extrudes into a glowing obsidian monolith; [Igloo Inc.](https://www.igloo.inc/) SDF scramble text boots your bio \&Anna University CSE stats |
| **01 — Sector A** | [**Handesk**](https://github.com/Shashankinfernape) *(Kinetic Gesture & Desktop Lab)* | `Python` · `Computer Vision` · `MediaPipe` · `UI Control` | A floating 3D articulated cyber-hand surrounded by spatial holographic desktop windows that tilt and snap toward the user's cursor in real time |
| **02 — Sector B** | [**Slidepaper / Slidepapers**](https://github.com/Shashankinfernape/Slidepaper) *(Wallpaper Community Hub)* | `Flutter` · `Dart` · `Firebase` · `MongoDB` · `Render` | A prism-refracting gallery vortex displaying floating `16:9` and `21:9 Ultrawide` curved glass portals (seeded from your real `bundles.json` schema with live views/likes/downloads counters) |
| **03 — Sector C** | [**Examinar**](https://github.com/Shashankinfernape/Examinar) *(Anna University Syllabus & PYQ Engine)* | `Flutter` · `Isar NoSQL` · `Riverpod` · `Firebase Auth` | A crystalline neural archive where glowing syllabus nodes and 3D exam-paper shards orbit an Isar local-database core, with interactive unit-progress rings |
| **04 — Sector D** | [**Franky**](https://colab.research.google.com/drive/1uvPHHSQK9PoqkqAAXXA2DfvNGpd9Sz8w?ouid=116642293753202632982) *(Qwen 2.5-7B \+ F5-TTS Voice AI Server)* | `Python` · `FastAPI` · `Qwen 2.5-7B` · `F5-TTS` · `PyTorch` · `Vercel` | An audio-reactive ferrofluid sphere ([Lusion](https://lusion.co/) style) that spikes and ripples to synthesized voice frequencies, showcasing your 250-epoch McQueen F5-TTS \+ Qwen GPU tunnel architecture |
| **05 — Sector E** | [**Territory**](https://github.com/Shashankinfernape/Territory) *(Geospatial Real-Estate Marketplace)* | `Flutter` · `Firebase` · `Google Maps API` · `MongoDB Atlas` | An [Into The Amazon](https://www.awwwards.com/sites/into-the-amazon) LiDAR topographic city block with glowing 3D property beacons, radius-filter shockwaves, and live price-tag holograms |
| **06 — Sector F** | [**SSTRAESS**](https://github.com/Shashankinfernape/SSTRAESS) & [**JWT Auth System**](https://github.com/Shashankinfernape/JWT-Token-Refresh-and-Expiry-SSTRAESS) | `Node.js` · `Express` · `MongoDB Atlas` · `JWT` · `Render` · `Vercel` | A cyber-security vault fortress with rotating concentric cryptographic rings representing JWT access/refresh token rotation, RBAC shields, and uptime telemetry |
| **07 — Sector G** | **Bonus Builds Pod: Chatflix, Fake News NLP & St. Joseph Portal** | `Node.js` · `WhatsApp API` · `TMDB` · `Python NLP` · `React` | A triad of orbital mini-satellites: a WhatsApp cinema reel (**Chatflix**), a TF-IDF/BERT truth-classifier prism (**Fake News Detection**), and a clean architectural campus node (**St. Joseph Website**) |
| **08 — Sector H** | **Reverse-Engineered UI Vault & Particle Footer** | `Reddit` · `Instagram` · `Clash of Clans` · `Brawl Stars` | Interactive showcase of your UI teardowns \+ [Igloo Inc.](https://www.awwwards.com/igloo-inc-case-study.html) volume-particle footer that morphs between GitHub, LinkedIn, and Email 3D SDF shapes on hover |

## 3\. Recommended Tech Stack & Directory Architecture (For Flash 3.8)

To guarantee **60 FPS on mid-range laptops and mobile** while delivering Awwwards SOTY visuals, use the modern React Three Fiber ecosystem with demand-driven post-processing:

\# Scaffold command for Flash 3.8

npm create vite@latest shashank-3d-portfolio \-- \--template react-ts

cd shashank-3d-portfolio

npm install three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing gsap lenis zustand lucide-react tailwindcss

### Target Repository Structure

shashank-3d-portfolio/

├── public/

│   ├── draco/                        \# Draco geometry decoder binaries

│   ├── models/                       \# Low-poly .glb meshes & baked SDF point clouds

│   └── audio/                        \# Subtle UI hover ticks & ambient synth loop

├── src/

│   ├── config/

│   │   └── projects.config.ts        \# Ground-truth config of Shashank's repos \+ 3D coords

│   ├── store/

│   │   └── useWorldStore.ts          \# Zustand store: camera mode, active sector, X-Ray mode, FPS

│   ├── hooks/

│   │   └── useGitHubSync.ts          \# Fetches live stars/forks/updatedAt from GitHub REST API

│   ├── canvas/

│   │   ├── Experience.tsx            \# Master R3F \<Canvas\> \+ lighting \+ post-processing

│   │   ├── CameraRig.tsx             \# Spline fly-through \+ Clash Isometric Mode \+ Drop Store Pedestal

│   │   ├── LidarTerrain.tsx          \# Into The Amazon GPU point-cloud landscape

│   │   ├── ProjectMonolith.tsx       \# Igloo Inc. procedural crystal enclosure \+ 3D project artifact

│   │   ├── ParticleFooter.tsx        \# Velocity-reactive morphing volume particles

│   │   └── shaders/

│   │       ├── IceCrystalShader.ts   \# Custom GLSL Voronoi crystal \+ chromatic aberration \+ frost dissolve

│   │       └── LidarPointShader.ts   \# Custom GLSL elevation \+ scanline pulse shader

│   ├── components/

│   │   ├── Preloader.tsx             \# Pixelflakes architectural wireframe-to-solid boot screen

│   │   ├── TelemetryHud.tsx          \# Lando Norris F1 HUD \+ Instagram Stories ring bar \+ Minimap

│   │   ├── BrawlProjectModal.tsx     \# Brawl Stars stat card \+ Reddit nested Dev-Log thread

│   │   └── ReverseEngineerDock.tsx   \# Interactive UI teardown switcher (Reddit/IG/CoC/Brawl)

│   ├── App.tsx

│   └── main.tsx

## 4\. Production Code Samples for Flash 3.8

### 4.1 Ground-Truth Project Registry & Live GitHub Sync (`src/config/projects.config.ts`)

This file encodes your real projects, stacks, and 3D spline positions so Flash 3.8 has zero guesswork and automatically merges live metadata from `https://api.github.com/users/Shashankinfernape/repos`.

// src/config/projects.config.ts

export type RarityTier \= 'LEGENDARY' | 'MYTHIC' | 'EPIC' | 'SUPER RARE';

export interface DevLogComment {

  id: string;

  author: string;

  flair: string;

  upvotes: number;

  title: string;

  body: string;

  children?: DevLogComment\[\];

}

export interface PortfolioProject {

  id: string;

  sectorCode: string;

  title: string;

  repoName: string; // Matches GitHub repo slug under Shashankinfernape

  repoUrl: string;

  liveUrl?: string;

  tagline: string;

  rarity: RarityTier;

  buildingTitle: string; // Clash of Clans Isometric Base label

  buildingLevel: number;

  stack: string\[\];

  position: \[number, number, number\]; // 3D world coordinates along spline

  accentColor: string;

  crystalSeed: number;

  stats: {

    architecture: number; // 0-100 Brawl Stars style stat bar

    complexity: number;

    aiIntegration: number;

    uxPolish: number;

  };

  devLogThread: DevLogComment\[\];

}

export const SHASHANK\_PROFILE \= {

  name: 'Shashank S',

  handle: '@Shashankinfernape',

  role: 'Full-Stack, Flutter & AI Systems Builder',

  education: 'B.E. CSE · Priyadarshini Engineering College (Anna University, 2023–2027)',

  email: 'infernapeshashank@gmail.com',

  github: 'https\://github.com/Shashankinfernape',

  linkedin: 'https\://linkedin.com/in/shashankinfernape',

  certifications: \[

    'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',

    'Google Cloud Skills Boost — Multiple Cloud & Data Analytics Badges',

    'Code4EdTech Hackathon (Innomatics Research Labs)',

  \],

};

export const PORTFOLIO\_PROJECTS: PortfolioProject\[\] \= \[

  {

    id: 'handesk',

    sectorCode: 'SEC-01',

    title: 'Handesk',

    repoName: 'Handesk',

    repoUrl: 'https\://github.com/Shashankinfernape/Handesk',

    tagline: 'Spatial gesture & touchless desktop control engine translating hand landmarks into low-latency OS actions.',

    rarity: 'LEGENDARY',

    buildingTitle: 'KINETIC GESTURE LAB',

    buildingLevel: 9,

    stack: \['Python', 'MediaPipe', 'OpenCV', 'OS Input API', 'Spatial UI'\],

    position: \[0, 2, \-25\],

    accentColor: '\#00F5D4',

    crystalSeed: 1.42,

    stats: { architecture: 92, complexity: 95, aiIntegration: 96, uxPolish: 90 },

    devLogThread: \[

      {

        id: 'hd-1',

        author: 'Shashankinfernape',

        flair: 'OP · Systems Architect',

        upvotes: 428,

        title: 'How I eliminated cursor jitter in real-time webcam hand tracking',

        body: 'Raw MediaPipe 21-point hand landmarks fluctuate at 30-60 FPS. I implemented an adaptive One-Euro / exponential smoothing filter coupled with pinch-distance hysteresis so clicks never misfire during cursor movement.',

        children: \[

          {

            id: 'hd-1-1',

            author: 'ReverseEngBot',

            flair: 'UI Teardown',

            upvotes: 112,

            title: ' Inspired by Self Aware & Lusion spatial cursors',

            body: 'Mapped the 21 hand landmarks directly to a Three.js skeletal rig so the 3D portfolio hand mirrors the exact gesture pipeline.',

          },

        \],

      },

    \],

  },

  {

    id: 'slidepaper',

    sectorCode: 'SEC-02',

    title: 'Slidepaper (Slidepapers)',

    repoName: 'Slidepaper',

    repoUrl: 'https\://github.com/Shashankinfernape/Slidepaper',

    liveUrl: 'https\://slidepapers.onrender.com',

    tagline: 'Community-driven ultra-HD wallpaper hub supporting multi-ratio packs (Original, 16:9 4K, 21:9 Ultrawide) & creator telemetry.',

    rarity: 'LEGENDARY',

    buildingTitle: 'PRISM GALLERY CITADEL',

    buildingLevel: 10,

    stack: \['Flutter', 'Dart', 'Node.js', 'Firebase', 'MongoDB Atlas', 'Google Drive CDN'\],

    position: \[18, 4, \-55\],

    accentColor: '\#FF2A85',

    crystalSeed: 2.71,

    stats: { architecture: 94, complexity: 90, aiIntegration: 78, uxPolish: 98 },

    devLogThread: \[

      {

        id: 'sp-1',

        author: 'Shashankinfernape',

        flair: 'OP · Full-Stack Builder',

        upvotes: 519,

        title: 'Designing the multi-ratio bundle pipeline & moderation state machine',

        body: 'Instead of serving single static images, Slidepaper structures packs into multi-aspect-ratio bundles (Original, 3840x2160 16:9, and 5120x2160 21:9 Ultrawide ZIPs) with real-time views, likes, downloads, subscriber counts, and pending\_review moderation queues.',

      },

    \],

  },

  {

    id: 'examinar',

    sectorCode: 'SEC-03',

    title: 'Examinar',

    repoName: 'Examinar',

    repoUrl: 'https\://github.com/Shashankinfernape/Examinar',

    liveUrl: 'https\://examinar-ad566.firebaseapp.com',

    tagline: 'Offline-first exam preparation platform tailored to Anna University CSE syllabus, PYQ banks, and unit progress tracking.',

    rarity: 'MYTHIC',

    buildingTitle: 'ISAR SYLLABUS ARCHIVE',

    buildingLevel: 9,

    stack: \['Flutter', 'Dart', 'Isar NoSQL', 'Riverpod', 'Firebase Auth'\],

    position: \[-16, 1, \-85\],

    accentColor: '\#FFD800',

    crystalSeed: 3.14,

    stats: { architecture: 95, complexity: 88, aiIntegration: 82, uxPolish: 94 },

    devLogThread: \[

      {

        id: 'ex-1',

        author: 'Shashankinfernape',

        flair: 'OP · Mobile Lead',

        upvotes: 384,

        title: 'Why I chose Isar NoSQL \+ Riverpod for zero-latency syllabus & PYQ queries',

        body: 'Students in exam halls or low-signal hostels need instant access to Anna University Part-A/Part-B/Part-C question banks. Isar provides sub-millisecond local indexing while Riverpod keeps unit-completion progress reactive across screens.',

      },

    \],

  },

  {

    id: 'franky',

    sectorCode: 'SEC-04',

    title: 'Franky (Qwen 8B \+ F5-TTS Voice AI)',

    repoName: 'franky',

    repoUrl: 'https\://github.com/Shashankinfernape',

    tagline: 'Unified GPU voice & chat server pairing Qwen2.5-7B-Instruct with a custom 250-epoch fine-tuned F5-TTS voice model.',

    rarity: 'LEGENDARY',

    buildingTitle: 'NEURAL VOICE FORGE',

    buildingLevel: 10,

    stack: \['Python', 'FastAPI', 'Qwen2.5-7B-Instruct', 'F5-TTS', 'PyTorch FP16', 'ngrok', 'Vercel'\],

    position: \[14, \-2, \-115\],

    accentColor: '\#FF5500',

    crystalSeed: 4.88,

    stats: { architecture: 96, complexity: 98, aiIntegration: 100, uxPolish: 91 },

    devLogThread: \[

      {

        id: 'fr-1',

        author: 'Shashankinfernape',

        flair: 'OP · AI Engineer',

        upvotes: 612,

        title: 'Training a 250-epoch F5-TTS character voice model and serving it alongside Qwen 2.5-7B on a single GPU',

        body: 'Built a unified FastAPI \+ Uvicorn inference server (/v1/chat/completions) running Qwen2.5-7B-Instruct in float16 with device\_map="auto" and F5-TTS voice synthesis, exposed via an ngrok tunnel to a Vercel web client.',

      },

    \],

  },

  {

    id: 'territory',

    sectorCode: 'SEC-05',

    title: 'Territory',

    repoName: 'Territory',

    repoUrl: 'https\://github.com/Shashankinfernape/Territory',

    tagline: 'OLX-style geospatial real-estate marketplace for buying, selling, and renting properties with interactive map filtering.',

    rarity: 'MYTHIC',

    buildingTitle: 'GEOSPATIAL RADAR TOWER',

    buildingLevel: 8,

    stack: \['Flutter', 'Firebase', 'Google Maps API', 'MongoDB Atlas', 'GCP'\],

    position: \[-14, 3, \-145\],

    accentColor: '\#38BDF8',

    crystalSeed: 5.65,

    stats: { architecture: 91, complexity: 92, aiIntegration: 75, uxPolish: 93 },

    devLogThread: \[

      {

        id: 'tr-1',

        author: 'Shashankinfernape',

        flair: 'OP · Geo-Systems',

        upvotes: 340,

        title: 'Combining Google Maps viewport bounds with MongoDB Atlas geospatial queries',

        body: 'Designed location-aware property discovery so panning the map dynamically filters listings by price tier, property type, and buy/rent status.',

      },

    \],

  },

  {

    id: 'sstraess',

    sectorCode: 'SEC-06',

    title: 'SSTRAESS & JWT Auth Engine',

    repoName: 'SSTRAESS',

    repoUrl: 'https\://github.com/Shashankinfernape/SSTRAESS',

    tagline: 'Full-stack platform & zero-trust JWT authentication architecture with refresh token rotation, expiry guards, and RBAC.',

    rarity: 'EPIC',

    buildingTitle: 'CRYPTOGRAPHIC VAULT',

    buildingLevel: 9,

    stack: \['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Render', 'Vercel'\],

    position: \[10, 0, \-175\],

    accentColor: '\#A855F7',

    crystalSeed: 6.33,

    stats: { architecture: 97, complexity: 90, aiIntegration: 74, uxPolish: 88 },

    devLogThread: \[

      {

        id: 'ss-1',

        author: 'Shashankinfernape',

        flair: 'OP · Backend Security',

        upvotes: 295,

        title: 'Implementing seamless JWT token refresh & role-based route protection across Vercel \+ Render',

        body: 'Separated short-lived access tokens from rotating refresh tokens stored against MongoDB Atlas (auth-cluster), ensuring zero downtime during session renewal.',

      },

    \],

  },

  {

    id: 'chatflix-nlp',

    sectorCode: 'SEC-07',

    title: 'Chatflix & Fake News NLP Pipeline',

    repoName: 'Chatflix',

    repoUrl: 'https\://github.com/Shashankinfernape',

    tagline: 'WhatsApp-native movie recommender powered by TMDB API \+ an NLP Fake News classification pipeline using TF-IDF & Transformers.',

    rarity: 'EPIC',

    buildingTitle: 'OMNI-BOT & NLP RELAY',

    buildingLevel: 8,

    stack: \['Node.js', 'WhatsApp API', 'TMDB API', 'Python', 'Scikit-Learn', 'NLTK / BERT'\],

    position: \[0, 4, \-205\],

    accentColor: '\#22C55E',

    crystalSeed: 7.91,

    stats: { architecture: 89, complexity: 87, aiIntegration: 94, uxPolish: 89 },

    devLogThread: \[

      {

        id: 'cf-1',

        author: 'Shashankinfernape',

        flair: 'OP · AI & APIs',

        upvotes: 310,

        title: 'Meeting users where they already are: Movie discovery inside WhatsApp threads',

        body: 'Instead of forcing users to download another movie app, Chatflix hooks into the WhatsApp API and queries TMDB in real time to return rich movie cards directly in chat.',

      },

    \],

  },

\];

### 4.2 Global World State Store (`src/store/useWorldStore.ts`)

Manages the 4 camera & shader paradigms (**Spline Fly-Through**, **Clash of Clans Isometric Base Mode**, **Drop Store Specimen Pedestal**, and **The Other Side of Truth X-Ray Wireframe Mode**):

// src/store/useWorldStore.ts

import { create } from 'zustand';

import { PORTFOLIO\_PROJECTS, PortfolioProject } from '../config/projects.config';

export type CameraMode \= 'SPLINE\_WALKTHROUGH' | 'CLASH\_ISOMETRIC\_BASE' | 'DROP\_STORE\_PEDESTAL';

interface WorldState {

  cameraMode: CameraMode;

  scrollProgress: number;       // Normalized 0.0 \-\> 1.0 along CatmullRomCurve3

  scrollVelocity: number;       // Used for Lando Norris km/h HUD & chromatic aberration

  activeSectorIndex: number;

  selectedProject: PortfolioProject | null;

  isXRayReverseMode: boolean;   // "The Other Side of Truth" wireframe/shader debug toggle

  isLidarMode: boolean;         // "Into the Amazon" point-cloud terrain toggle

  setCameraMode: (mode: CameraMode) \=\> void;

  setScrollData: (progress: number, velocity: number) \=\> void;

  selectProject: (project: PortfolioProject | null) \=\> void;

  jumpToSector: (index: number) \=\> void;

  toggleXRayMode: () \=\> void;

  toggleLidarMode: () \=\> void;

}

export const useWorldStore \= create\<WorldState\>((set) \=\> ({

  cameraMode: 'SPLINE\_WALKTHROUGH',

  scrollProgress: 0,

  scrollVelocity: 0,

  activeSectorIndex: 0,

  selectedProject: null,

  isXRayReverseMode: false,

  isLidarMode: true,

  setCameraMode: (cameraMode) \=\>

    set((state) \=\> ({

      cameraMode,

      selectedProject: cameraMode \=== 'DROP\_STORE\_PEDESTAL' ? state.selectedProject : null,

    })),

  setScrollData: (scrollProgress, scrollVelocity) \=\> {

    const total \= PORTFOLIO\_PROJECTS.length;

    const activeSectorIndex \= Math.min(total \- 1, Math.floor(scrollProgress \* total));

    set({ scrollProgress, scrollVelocity, activeSectorIndex });

  },

  selectProject: (project) \=\>

    set({

      selectedProject: project,

      cameraMode: project ? 'DROP\_STORE\_PEDESTAL' : 'SPLINE\_WALKTHROUGH',

    }),

  jumpToSector: (index) \=\> {

    const progress \= index / Math.max(1, PORTFOLIO\_PROJECTS.length \- 1);

    set({

      activeSectorIndex: index,

      scrollProgress: progress,

      cameraMode: 'SPLINE\_WALKTHROUGH',

      selectedProject: null,

    });

  },

  toggleXRayMode: () \=\> set((s) \=\> ({ isXRayReverseMode: \!s.isXRayReverseMode })),

  toggleLidarMode: () \=\> set((s) \=\> ({ isLidarMode: \!s.isLidarMode })),

}));

### 4.3 Multi-Mode 3D Camera Rig (`src/canvas/CameraRig.tsx`)

Implements:

1. [**Lusion**](https://lusion.co/) **\+ [Messenger by Abeto](https://www.awwwards.com/sites/messenger)** spline camera flight with damped mouse parallax and a guide drone that flies ahead of the camera.  
2. [**Clash of Clans**](https://supercell.com/en/games/clashofclans/) high-altitude isometric overview when `cameraMode === 'CLASH_ISOMETRIC_BASE'`.  
3. [**The Drop Store for the UN**](https://www.awwwards.com/sites/the-drop-store-for-the-un) close-up orbital lock when inspecting a repository monument.

// src/canvas/CameraRig.tsx

import React, { useMemo, useRef, useEffect } from 'react';

import \* as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { PORTFOLIO\_PROJECTS } from '../config/projects.config';

import { useWorldStore } from '../store/useWorldStore';

export const CameraRig: React.FC \= () \=\> {

  const droneRef \= useRef\<THREE.Group\>(null);

  const {

    cameraMode,

    scrollProgress,

    selectedProject,

    setScrollData,

  } \= useWorldStore();

  // Build a smooth Catmull-Rom spline passing near every project monument

  const cameraSpline \= useMemo(() \=\> {

    const waypoints: THREE.Vector3\[\] \= \[

      new THREE.Vector3(0, 3, 12), // Spawn point

      ...PORTFOLIO\_PROJECTS.map(

        (p) \=\> new THREE.Vector3(p.position\[0\] \* 0.65, p.position\[1\] \+ 1.5, p.position\[2\] \+ 10\)

      ),

      new THREE.Vector3(0, 2, \-235), // Particle footer destination

    \];

    return new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5);

  }, \[\]);

  // Track virtual scroll with inertia damping

  const targetScroll \= useRef(0);

  const currentScroll \= useRef(0);

  useEffect(() \=\> {

    const onWheel \= (e: WheelEvent) \=\> {

      if (useWorldStore.getState().cameraMode \!== 'SPLINE\_WALKTHROUGH') return;

      targetScroll.current \= THREE.MathUtils.clamp(

        targetScroll.current \+ e.deltaY \* 0.00025,

        0,

        1

      );

    };

    window.addEventListener('wheel', onWheel, { passive: true });

    return () \=\> window.removeEventListener('wheel', onWheel);

  }, \[\]);

  // Sync external sector jumps (e.g. from Instagram Stories ring or Minimap)

  useEffect(() \=\> {

    targetScroll.current \= scrollProgress;

  }, \[scrollProgress\]);

  const dummyTarget \= useMemo(() \=\> new THREE.Vector3(), \[\]);

  const dummyLookAt \= useMemo(() \=\> new THREE.Vector3(), \[\]);

  useFrame((state, delta) \=\> {

    const dt \= Math.min(delta, 0.1);

    if (cameraMode \=== 'SPLINE\_WALKTHROUGH') {

      // Smooth damping toward target scroll

      const prev \= currentScroll.current;

      currentScroll.current \= THREE.MathUtils.lerp(prev, targetScroll.current, dt \* 4.5);

      const velocity \= Math.abs(currentScroll.current \- prev) / dt;

      setScrollData(currentScroll.current, velocity \* 1200); // Scale to F1 km/h

      // Position camera on spline \+ subtle pointer parallax

      cameraSpline.getPointAt(currentScroll.current, dummyTarget);

      dummyTarget.x \+= state.pointer.x \* 2.2;

      dummyTarget.y \+= state.pointer.y \* 1.4;

      state.camera.position.lerp(dummyTarget, dt \* 6);

      // Look slightly ahead along the spline

      const lookAheadT \= Math.min(1, currentScroll.current \+ 0.045);

      cameraSpline.getPointAt(lookAheadT, dummyLookAt);

      state.camera.lookAt(dummyLookAt);

      // Update Messenger-style guide drone ahead of camera

      if (droneRef.current) {

        const droneT \= Math.min(1, currentScroll.current \+ 0.022);

        const dronePos \= cameraSpline.getPointAt(droneT);

        dronePos.y \+= Math.sin(state.clock.elapsedTime \* 3.5) \* 0.35 \- 0.4;

        droneRef.current.position.lerp(dronePos, dt \* 8);

        droneRef.current.rotation.z \= \-state.pointer.x \* 0.45;

        droneRef.current.rotation.x \= state.pointer.y \* 0.25;

      }

    } else if (cameraMode \=== 'CLASH\_ISOMETRIC\_BASE') {

      // Clash of Clans high-angle isometric overview of all sectors

      dummyTarget.set(65, 78, \-40);

      dummyLookAt.set(0, 0, \-110);

      state.camera.position.lerp(dummyTarget, dt \* 4);

      state.camera.lookAt(dummyLookAt);

    } else if (cameraMode \=== 'DROP\_STORE\_PEDESTAL' && selectedProject) {

      // The Drop Store for the UN close-up specimen inspection

      const \[px, py, pz\] \= selectedProject.position;

      const orbitAngle \= state.clock.elapsedTime \* 0.35 \+ state.pointer.x \* 1.2;

      dummyTarget.set(

        px \+ Math.sin(orbitAngle) \* 6.5,

        py \+ 1.2 \+ state.pointer.y \* 1.5,

        pz \+ Math.cos(orbitAngle) \* 6.5

      );

      dummyLookAt.set(px, py, pz);

      state.camera.position.lerp(dummyTarget, dt \* 5);

      state.camera.lookAt(dummyLookAt);

    }

  });

  return (

    \<group ref={droneRef}\>

      {/\* Messenger by Abeto / Infernape Cyber-Drone Guide \*/}

      \<mesh castShadow\>

        \<octahedronGeometry args={\[0.35, 1\]} /\>

        \<meshStandardMaterial

          color="\#FF5500"

          emissive="\#FF2A00"

          emissiveIntensity={2.4}

          wireframe={useWorldStore((s) \=\> s.isXRayReverseMode)}

        /\>

      \</mesh\>

      \<pointLight color="\#FF5500" intensity={3} distance={8} /\>

    \</group\>

  );

};

### 4.4 Custom GLSL Procedural Ice-Crystal & Chromatic Aberration Shader (`src/canvas/shaders/IceCrystalShader.ts`)

Inspired directly by [Igloo Inc.](https://www.awwwards.com/igloo-inc-case-study.html) and [Lusion](https://lusion.co/): each project monolith sits inside a custom shader material that computes 3D Voronoi crystal facets, RGB Fresnel chromatic dispersion, and a proximity-triggered frost dissolve when the camera approaches:

// src/canvas/shaders/IceCrystalShader.ts

import \* as THREE from 'three';

import { shaderMaterial } from '@react-three/drei';

export const IceCrystalMaterial \= shaderMaterial(

  {

    uTime: 0,

    uCrystalSeed: 1.0,

    uAccentColor: new THREE.Color('\#00F5D4'),

    uProximityMelt: 0.0, // 0.0 \= frozen in ice, 1.0 \= crystal melted/shattered open

    uScrollVelocity: 0.0,

    uXRayMode: 0.0,

  },

  // VERTEX SHADER

  /\* glsl \*/ \`

    uniform float uTime;

    uniform float uCrystalSeed;

    uniform float uProximityMelt;

    varying vec3 vNormal;

    varying vec3 vWorldPos;

    varying vec2 vUv;

    varying float vFacetNoise;

    // 3D hash for procedural crystal growth displacement

    float hash31(vec3 p) {

      p \= fract(p \* 0.1031);

      p \+= dot(p, p.yzx \+ 33.33);

      return fract((p.x \+ p.y) \* p.z);

    }

    void main() {

      vUv \= uv;

      // Quantize normal angles to create sharp procedural crystal facets (Igloo Inc. technique)

      vec3 facetedPos \= position;

      float crystalFacet \= hash31(floor(position \* 3.5 \+ uCrystalSeed));

      vFacetNoise \= crystalFacet;

      // Expand and displace shards outward as camera approaches (uProximityMelt \-\> 1.0)

      float growth \= (crystalFacet \- 0.5) \* 0.35 \* (1.0 \- uProximityMelt \* 0.7);

      facetedPos \+= normal \* (growth \+ uProximityMelt \* 0.15 \* sin(uTime \* 3.0 \+ crystalFacet \* 6.28));

      vec4 worldPosition \= modelMatrix \* vec4(facetedPos, 1.0);

      vWorldPos \= worldPosition.xyz;

      vNormal \= normalize(normalMatrix \* normal);

      gl\_Position \= projectionMatrix \* viewMatrix \* worldPosition;

    }

  \`,

  // FRAGMENT SHADER

  /\* glsl \*/ \`

    uniform float uTime;

    uniform vec3 uAccentColor;

    uniform float uProximityMelt;

    uniform float uScrollVelocity;

    uniform float uXRayMode;

    varying vec3 vNormal;

    varying vec3 vWorldPos;

    varying vec2 vUv;

    varying float vFacetNoise;

    void main() {

      vec3 viewDir \= normalize(cameraPosition \- vWorldPos);

      // Fresnel rim reflection

      float fresnel \= pow(1.0 \- max(dot(viewDir, vNormal), 0.0), 2.6);

      // Chromatic aberration shift driven by scroll velocity & crystal facet

      float chromaShift \= 0.04 \+ uScrollVelocity \* 0.0005;

      vec3 iceBase \= vec3(0.08, 0.14, 0.22);

      vec3 colR \= mix(iceBase, uAccentColor, fresnel \+ chromaShift);

      vec3 colG \= mix(iceBase, uAccentColor, fresnel);

      vec3 colB \= mix(iceBase, vec3(0.6, 0.9, 1.0), fresnel \- chromaShift);

      vec3 finalColor \= vec3(colR.r, colG.g, colB.b);

      // Frost crystal internal vein lines

      float veins \= smoothstep(0.45, 0.5, abs(fract(vFacetNoise \* 7.0 \+ uTime \* 0.15) \- 0.5));

      finalColor \+= uAccentColor \* veins \* 0.65;

      // X-Ray Reverse-Engineering Mode ("The Other Side of Truth" inspect state)

      if (uXRayMode \> 0.5) {

        vec2 grid \= abs(fract(vUv \* 24.0 \- 0.5) \- 0.5) / fwidth(vUv \* 24.0);

        float line \= min(grid.x, grid.y);

        float wire \= 1.0 \- min(line, 1.0);

        finalColor \= mix(vec3(0.02, 0.03, 0.05), uAccentColor \* 1.8, wire);

      }

      float alpha \= mix(0.82, 0.28, uProximityMelt);

      gl\_FragColor \= vec4(finalColor, alpha);

    }

  \`

);

### 4.5 LiDAR Point-Cloud Terrain & Morphing Volume Particles (`src/canvas/LidarTerrain.tsx`)

Combines [**Into The Amazon**](https://www.awwwards.com/sites/into-the-amazon)'s LiDAR fly-through point cloud with [**Igloo Inc.**](https://www.awwwards.com/igloo-inc-case-study.html)'s velocity-reactive particle simulation:

// src/canvas/LidarTerrain.tsx

import React, { useMemo, useRef } from 'react';

import \* as THREE from 'three';

import { useFrame } from '@react-three/fiber';

import { useWorldStore } from '../store/useWorldStore';

export const LidarTerrain: React.FC \= () \=\> {

  const pointsRef \= useRef\<THREE.Points\>(null);

  const isLidarMode \= useWorldStore((s) \=\> s.isLidarMode);

  const { positions, colors } \= useMemo(() \=\> {

    const count \= 28000;

    const pos \= new Float32Array(count \* 3);

    const col \= new Float32Array(count \* 3);

    const colorA \= new THREE.Color('\#FFD800'); // Into the Amazon LiDAR gold

    const colorB \= new THREE.Color('\#00F5D4'); // Cyber cyan

    const tempColor \= new THREE.Color();

    for (let i \= 0; i \< count; i++) {

      const x \= (Math.random() \- 0.5) \* 140;

      const z \= \-Math.random() \* 250 \+ 20;

      // Canyon valley along the central camera spline

      const canyonHeight \= Math.pow(Math.abs(x) \* 0.08, 1.8) \+ Math.sin(z \* 0.08) \* 2.5 \- 4.5;

      const y \= canyonHeight \+ (Math.random() \- 0.5) \* 0.8;

      pos\[i \* 3\] \= x;

      pos\[i \* 3 \+ 1\] \= y;

      pos\[i \* 3 \+ 2\] \= z;

      const mixRatio \= THREE.MathUtils.clamp((y \+ 5\) / 15, 0, 1);

      tempColor.lerpColors(colorB, colorA, mixRatio);

      col\[i \* 3\] \= tempColor.r;

      col\[i \* 3 \+ 1\] \= tempColor.g;

      col\[i \* 3 \+ 2\] \= tempColor.b;

    }

    return { positions: pos, colors: col };

  }, \[\]);

  useFrame(({ clock }) \=\> {

    if (\!pointsRef.current) return;

    const mat \= pointsRef.current.material as THREE.PointsMaterial;

    mat.opacity \= isLidarMode ? 0.65 \+ Math.sin(clock.elapsedTime \* 2.0) \* 0.15 : 0.08;

  });

  return (

    \<points ref={pointsRef}\>

      \<bufferGeometry\>

        \<bufferAttribute

          attach="attributes-position"

          count={positions.length / 3}

          array={positions}

          itemSize={3}

        /\>

        \<bufferAttribute

          attach="attributes-color"

          count={colors.length / 3}

          array={colors}

          itemSize={3}

        /\>

      \</bufferGeometry\>

      \<pointsMaterial

        size={0.18}

        vertexColors

        transparent

        opacity={0.75}

        depthWrite={false}

        blending={THREE.AdditiveBlending}

      /\>

    \</points\>

  );

};

### 4.6 Telemetry HUD \+ Instagram Stories Switcher \+ Brawl Stars / Reddit Inspector (`src/components/TelemetryHud.tsx`)

Synthesizes:

- [**Lando Norris**](https://landonorris.com/): Live speed/scroll telemetry, sector indicator, and neon papaya/lime accents.  
- [**Instagram**](https://about.instagram.com/): Top "Stories Ring" quick-switcher to warp directly to any repo sector.  
- [**Clash of Clans**](https://supercell.com/en/games/clashofclans/): Isometric Base Map toggle button (`[M] BASE OVERVIEW`).  
- [**The Other Side of Truth**](https://www.awwwards.com/websites/sites_of_the_year/): Reverse-Engineer X-Ray Shader toggle (`[R] X-RAY SHADER`).  
- [**Brawl Stars**](https://supercell.com/en/games/brawlstars/) \+ [**Reddit**](https://redditinc.com/): Skewed Brawler loadout card with nested `r/ShashankBuilds` Dev-Log threads when a project is selected.

// src/components/TelemetryHud.tsx

import React, { useEffect } from 'react';

import { PORTFOLIO\_PROJECTS, SHASHANK\_PROFILE } from '../config/projects.config';

import { useWorldStore } from '../store/useWorldStore';

export const TelemetryHud: React.FC \= () \=\> {

  const {

    cameraMode,

    scrollProgress,

    scrollVelocity,

    activeSectorIndex,

    selectedProject,

    isXRayReverseMode,

    isLidarMode,

    setCameraMode,

    selectProject,

    jumpToSector,

    toggleXRayMode,

    toggleLidarMode,

  } \= useWorldStore();

  // Keyboard shortcuts: M \= Clash Isometric Base, R \= X-Ray Wireframe, L \= LiDAR, Esc \= Back to Spline

  useEffect(() \=\> {

    const onKeyDown \= (e: KeyboardEvent) \=\> {

      if (e.key.toLowerCase() \=== 'm') {

        setCameraMode(cameraMode \=== 'CLASH\_ISOMETRIC\_BASE' ? 'SPLINE\_WALKTHROUGH' : 'CLASH\_ISOMETRIC\_BASE');

      } else if (e.key.toLowerCase() \=== 'r') {

        toggleXRayMode();

      } else if (e.key.toLowerCase() \=== 'l') {

        toggleLidarMode();

      } else if (e.key \=== 'Escape') {

        selectProject(null);

        setCameraMode('SPLINE\_WALKTHROUGH');

      }

    };

    window.addEventListener('keydown', onKeyDown);

    return () \=\> window.removeEventListener('keydown', onKeyDown);

  }, \[cameraMode, setCameraMode, selectProject, toggleXRayMode, toggleLidarMode\]);

  const activeProject \= PORTFOLIO\_PROJECTS\[activeSectorIndex\] || PORTFOLIO\_PROJECTS\[0\];

  return (

    \<div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-5 font-mono text-white select-none"\>

      {/\* TOP BAR: Lando Norris Telemetry \+ Instagram Stories Ring Switcher \*/}

      \<header className="flex flex-wrap items-center justify-between gap-4"\>

        {/\* Identity & Telemetry Badge \*/}

        \<div className="pointer-events-auto flex items-center gap-4 border border-white/15 bg-black/75 px-4 py-2.5 backdrop-blur-md"\>

          \<div className="h-3 w-3 animate-pulse rounded-full bg-\[\#CCFF00\]" /\>

          \<div\>

            \<div className="text-xs tracking-widest text-\[\#CCFF00\] uppercase"\>

              {SHASHANK\_PROFILE.handle} // TELEMETRY ONLINE

            \</div\>

            \<div className="text-sm font-bold tracking-tight"\>

              {SHASHANK\_PROFILE.name} — 3D WALKTHROUGH

            \</div\>

          \</div\>

          \<div className="border-l border-white/20 pl-4 text-xs text-zinc-400"\>

            \<div\>VEL: \<span className="text-white"\>{scrollVelocity.toFixed(0)} KM/H\</span\>\</div\>

            \<div\>DEPTH: \<span className="text-\[\#00F5D4\]"\>{(scrollProgress \* 100).toFixed(1)}%\</span\>\</div\>

          \</div\>

        \</div\>

        {/\* Instagram Stories Style Sector Quick-Switcher \*/}

        \<nav className="pointer-events-auto flex items-center gap-3 overflow-x-auto rounded-full border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-md"\>

          {PORTFOLIO\_PROJECTS.map((proj, idx) \=\> {

            const isActive \= idx \=== activeSectorIndex;

            return (

              \<button

                key={proj.id}

                onClick={() \=\> jumpToSector(idx)}

                className="group flex flex-col items-center gap-1 transition-transform hover:scale-110"

                title={\`Jump to \${proj.title}\`}

              \>

                \<div

                  className={\`rounded-full p-\[2px\] \${

                    isActive

                      ? 'bg-gradient-to-tr from-\[\#FFD800\] via-\[\#FF2A85\] to-\[\#00F5D4\]'

                      : 'bg-white/25 group-hover:bg-white/60'

                  }\`}

                \>

                  \<div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-\[10px\] font-bold"\>

                    {proj.sectorCode.replace('SEC-', '')}

                  \</div\>

                \</div\>

                \<span className="max-w-\[64px\] truncate text-\[9px\] text-zinc-300"\>

                  {proj.title.split(' ')\[0\]}

                \</span\>

              \</button\>

            );

          })}

        \</nav\>

        {/\* Mode Toggles (Clash Base View, X-Ray Reverse Mode, LiDAR) \*/}

        \<div className="pointer-events-auto flex items-center gap-2"\>

          \<button

            onClick={() \=\>

              setCameraMode(

                cameraMode \=== 'CLASH\_ISOMETRIC\_BASE' ? 'SPLINE\_WALKTHROUGH' : 'CLASH\_ISOMETRIC\_BASE'

              )

            }

            className={\`border px-3 py-2 text-xs font-bold uppercase transition \${

              cameraMode \=== 'CLASH\_ISOMETRIC\_BASE'

                ? 'border-\[\#FFD800\] bg-\[\#FFD800\] text-black'

                : 'border-white/20 bg-black/75 text-white hover:border-\[\#FFD800\]'

            }\`}

          \>

            \[M\] Clash Base Map

          \</button\>

          \<button

            onClick={toggleXRayMode}

            className={\`border px-3 py-2 text-xs font-bold uppercase transition \${

              isXRayReverseMode

                ? 'border-\[\#00F5D4\] bg-\[\#00F5D4\] text-black'

                : 'border-white/20 bg-black/75 text-white hover:border-\[\#00F5D4\]'

            }\`}

          \>

            \[R\] X-Ray Shader

          \</button\>

          \<button

            onClick={toggleLidarMode}

            className={\`border px-3 py-2 text-xs font-bold uppercase transition \${

              isLidarMode

                ? 'border-\[\#FF2A85\] bg-\[\#FF2A85\]/20 text-\[\#FF2A85\]'

                : 'border-white/20 bg-black/75 text-zinc-400'

            }\`}

          \>

            \[L\] LiDAR Cloud

          \</button\>

        \</div\>

      \</header\>

      {/\* CENTER-RIGHT: Brawl Stars Loadout Card \+ Reddit Dev-Log Drawer when Project Inspected \*/}

      {selectedProject && (

        \<aside className="pointer-events-auto my-auto ml-auto w-full max-w-lg border-2 border-white bg-zinc-950/95 p-6 shadow-\[8px\_8px\_0px\_\#CCFF00\] backdrop-blur-xl"\>

          \<div className="flex items-start justify-between border-b border-white/15 pb-4"\>

            \<div\>

              \<span

                className="inline-block \-skew-x-12 px-2.5 py-0.5 text-\[11px\] font-black text-black uppercase"

                style={{ backgroundColor: selectedProject.accentColor }}

              \>

                {selectedProject.rarity} // LVL {selectedProject.buildingLevel} {selectedProject.buildingTitle}

              \</span\>

              \<h2 className="mt-2 text-2xl font-black tracking-tight uppercase"\>

                {selectedProject.title}

              \</h2\>

              \<p className="mt-1 text-xs text-zinc-300"\>{selectedProject.tagline}\</p\>

            \</div\>

            \<button

              onClick={() \=\> selectProject(null)}

              className="border border-white/30 px-2.5 py-1 text-xs hover:bg-white hover:text-black"

            \>

              ESC ✕

            \</button\>

          \</div\>

          {/\* Brawl Stars Skewed Stat Bars \*/}

          \<div className="mt-4 grid grid-cols-2 gap-3 border-b border-white/15 pb-4 text-xs"\>

            {Object.entries(selectedProject.stats).map((\[statName, val\]) \=\> (

              \<div key={statName}\>

                \<div className="flex justify-between text-\[10px\] text-zinc-400 uppercase"\>

                  \<span\>{statName}\</span\>

                  \<span className="font-bold text-white"\>{val}/100\</span\>

                \</div\>

                \<div className="mt-1 h-2 w-full \-skew-x-12 bg-zinc-800"\>

                  \<div

                    className="h-full transition-all duration-500"

                    style={{ width: \`\${val}%\`, backgroundColor: selectedProject.accentColor }}

                  /\>

                \</div\>

              \</div\>

            ))}

          \</div\>

          {/\* Tech Stack Pills \*/}

          \<div className="mt-3 flex flex-wrap gap-1.5"\>

            {selectedProject.stack.map((tech) \=\> (

              \<span

                key={tech}

                className="border border-white/20 bg-white/5 px-2 py-0.5 text-\[10px\] text-zinc-200"

              \>

                {tech}

              \</span\>

            ))}

          \</div\>

          {/\* Reddit-Style Nested Engineering Thread (r/ShashankBuilds) \*/}

          \<div className="mt-4 max-h-52 overflow-y-auto border border-white/15 bg-black/60 p-3"\>

            \<div className="mb-2 text-\[10px\] font-bold tracking-wider text-\[\#FF5500\] uppercase"\>

              r/ShashankBuilds · Architecture Post-Mortem Thread

            \</div\>

            {selectedProject.devLogThread.map((post) \=\> (

              \<div key={post.id} className="border-l-2 border-zinc-700 pl-3 text-xs"\>

                \<div className="flex items-center gap-2 text-\[10px\] text-zinc-400"\>

                  \<span className="font-bold text-\[\#00F5D4\]"\>▲ {post.upvotes}\</span\>

                  \<span className="text-white"\>u/{post.author}\</span\>

                  \<span className="bg-white/10 px-1.5 py-0.5 text-\[9px\]"\>{post.flair}\</span\>

                \</div\>

                \<div className="mt-1 font-bold text-white"\>{post.title}\</div\>

                \<p className="mt-1 text-\[11px\] leading-relaxed text-zinc-300"\>{post.body}\</p\>

                {post.children?.map((reply) \=\> (

                  \<div key={reply.id} className="mt-2 border-l-2 border-zinc-800 pl-3"\>

                    \<div className="text-\[10px\] text-zinc-400"\>

                      \<span className="text-\[\#CCFF00\]"\>▲ {reply.upvotes}\</span\> · u/{reply.author}

                    \</div\>

                    \<p className="mt-0.5 text-\[11px\] text-zinc-400"\>{reply.body}\</p\>

                  \</div\>

                ))}

              \</div\>

            ))}

          \</div\>

          {/\* Action Links \*/}

          \<div className="mt-4 flex gap-3"\>

            \<a

              href={selectedProject.repoUrl}

              target="\_blank"

              rel="noreferrer"

              className="flex-1 bg-white py-2.5 text-center text-xs font-black text-black uppercase hover:bg-\[\#CCFF00\]"

            \>

              Inspect GitHub Repo →

            \</a\>

            {selectedProject.liveUrl && (

              \<a

                href={selectedProject.liveUrl}

                target="\_blank"

                rel="noreferrer"

                className="border border-white px-4 py-2.5 text-xs font-bold uppercase hover:bg-white/10"

              \>

                Live Deploy ↗

              \</a\>

            )}

          \</div\>

        \</aside\>

      )}

      {/\* BOTTOM BAR: Active Sector Banner & Controls \*/}

      \<footer className="flex flex-wrap items-end justify-between gap-4"\>

        \<div className="pointer-events-auto border border-white/15 bg-black/80 px-5 py-3 backdrop-blur-md"\>

          \<div className="text-\[10px\] tracking-widest text-zinc-400 uppercase"\>

            CURRENT SECTOR // {activeProject.sectorCode} ({activeProject.buildingTitle})

          \</div\>

          \<div className="mt-0.5 flex items-center gap-3"\>

            \<span className="text-lg font-black uppercase"\>{activeProject.title}\</span\>

            \<button

              onClick={() \=\> selectProject(activeProject)}

              className="bg-\[\#CCFF00\] px-2.5 py-1 text-\[10px\] font-black text-black uppercase hover:bg-white"

            \>

              Enter Specimen Mode ↗

            \</button\>

          \</div\>

        \</div\>

        \<div className="text-right text-\[11px\] text-zinc-400"\>

          \<div\>SCROLL TO FLY SPLINE · CLICK CRYSTAL MONOLITH TO SHATTER & INSPECT\</div\>

          \<div\>KEYS: \[M\] CLASH BASE MAP · \[R\] X-RAY WIREFRAME · \[L\] LIDAR TERRAIN\</div\>

        \</div\>

      \</footer\>

    \</div\>

  );

};

### 4.7 Procedural Crystal Monolith & Master Canvas (`src/canvas/ProjectMonolith.tsx` & `src/canvas/Experience.tsx`)

Implements the [Igloo Inc.](https://www.awwwards.com/igloo-inc-case-study.html) crystal enclosure that melts open as the camera approaches within 18 units, plus the master React Three Fiber `<Canvas>` scene:

// src/canvas/ProjectMonolith.tsx

import React, { useRef } from "react";

import \* as THREE from "three";

import { extend, useFrame } from "@react-three/fiber";

import { Text, Float } from "@react-three/drei";

import { PortfolioProject } from "../config/projects.config";

import { useWorldStore } from "../store/useWorldStore";

import { IceCrystalMaterial } from "./shaders/IceCrystalShader";

extend({ IceCrystalMaterial });

export const ProjectMonolith: React.FC\<{ project: PortfolioProject }\> \= ({ project }) \=\> {

  const groupRef \= useRef\<THREE.Group\>(null);

  const crystalMatRef \= useRef\<any\>(null);

  const coreMeshRef \= useRef\<THREE.Mesh\>(null);

  const { selectProject, scrollVelocity, isXRayReverseMode } \= useWorldStore();

  useFrame((state, delta) \=\> {

    if (\!groupRef.current || \!crystalMatRef.current) return;

    const dist \= state.camera.position.distanceTo(groupRef.current.position);

    // Melt crystal enclosure as camera approaches within 22 units

    const targetMelt \= THREE.MathUtils.clamp(1.0 \- (dist \- 8.0) / 14.0, 0, 1);

    crystalMatRef.current.uTime \= state.clock.elapsedTime;

    crystalMatRef.current.uProximityMelt \= THREE.MathUtils.lerp(

      crystalMatRef.current.uProximityMelt,

      targetMelt,

      delta \* 4

    );

    crystalMatRef.current.uScrollVelocity \= scrollVelocity;

    crystalMatRef.current.uXRayMode \= isXRayReverseMode ? 1.0 : 0.0;

    if (coreMeshRef.current) {

      coreMeshRef.current.rotation.y \+= delta \* (0.6 \+ targetMelt \* 1.4);

      coreMeshRef.current.rotation.x \+= delta \* 0.3;

    }

  });

  return (

    \<group

      ref={groupRef}

      position={project.position}

      onClick={(e) \=\> {

        e.stopPropagation();

        selectProject(project);

      }}

    \>

      \<Float speed={2} rotationIntensity={0.25} floatIntensity={0.6}\>

        {/\* Inner Project Artifact Core \*/}

        \<mesh ref={coreMeshRef}\>

          \<torusKnotGeometry args={\[1.1, 0.32, 128, 32\]} /\>

          \<meshStandardMaterial

            color={project.accentColor}

            emissive={project.accentColor}

            emissiveIntensity={1.5}

            metalness={0.85}

            roughness={0.15}

            wireframe={isXRayReverseMode}

          /\>

        \</mesh\>

        {/\* Outer Igloo Inc. Procedural Crystal Enclosure \*/}

        \<mesh scale={2.4}\>

          \<icosahedronGeometry args={\[1, 4\]} /\>

          {/\* @ts-ignore \*/}

          \<iceCrystalMaterial

            ref={crystalMatRef}

            uCrystalSeed={project.crystalSeed}

            uAccentColor={new THREE.Color(project.accentColor)}

            transparent

            depthWrite={false}

          /\>

        \</mesh\>

        {/\* Floating 3D Sector Header \*/}

        \<Text

          position={\[0, 3.4, 0\]}

          fontSize={0.45}

          color="\#FFFFFF"

          anchorX="center"

          anchorY="middle"

        \>

          {\`\${project.sectorCode} // \${project.title.toUpperCase()}\`}

        \</Text\>

      \</Float\>

    \</group\>

  );

};

// src/canvas/Experience.tsx

import React, { Suspense } from "react";

import { Canvas } from "@react-three/fiber";

import { Environment, Stars } from "@react-three/drei";

import { PORTFOLIO\_PROJECTS } from "../config/projects.config";

import { CameraRig } from "./CameraRig";

import { LidarTerrain } from "./LidarTerrain";

import { ProjectMonolith } from "./ProjectMonolith";

export const Experience: React.FC \= () \=\> {

  return (

    \<div className="fixed inset-0 bg-\[\#05060A\]"\>

      \<Canvas

        dpr={\[1, 2\]}

        camera={{ position: \[0, 3, 12\], fov: 50, near: 0.1, far: 350 }}

        gl={{ antialias: true, powerPreference: "high-performance" }}

      \>

        \<color attach="background" args={\["\#05060A"\]} /\>

        \<fog attach="fog" args={\["\#05060A", 18, 95\]} /\>

        \<ambientLight intensity={0.5} /\>

        \<directionalLight position={\[15, 30, 10\]} intensity={1.8} /\>

        \<Suspense fallback={null}\>

          \<Stars radius={120} depth={80} count={4500} factor={3} fade speed={1} /\>

          \<CameraRig /\>

          \<LidarTerrain /\>

          {PORTFOLIO\_PROJECTS.map((project) \=\> (

            \<ProjectMonolith key={project.id} project={project} /\>

          ))}

          \<Environment preset="night" /\>

        \</Suspense\>

      \</Canvas\>

    \</div\>

  );

};

## 5\. Phased Prompts to Feed Directly Into 3,8 Flash

When you open your IDE with **3,8 Flash**, run these **5 sequential prompts** so the model builds the entire project cleanly without truncating files:

| Build Phase | Prompt to Paste into 3,8 Flash | Verification Milestone |
| :---- | :---- | :---- |
| **Phase 1: Core Scaffold & Store** | *"Scaffold the Vite \+ React \+ TypeScript \+ Three.js \+ R3F project using `src/config/projects.config.ts` and `src/store/useWorldStore.ts` from the implementation plan. Add a `useGitHubSync('Shashankinfernape')` hook that fetches live star/fork/updated\_at counts from the GitHub REST API and merges them into `PORTFOLIO_PROJECTS`."* | App compiles, Zustand store logs sector changes, and GitHub API populates repo metadata |
| **Phase 2: Spline Camera & LiDAR World** | *"Implement `src/canvas/Experience.tsx`, `src/canvas/CameraRig.tsx`, and `src/canvas/LidarTerrain.tsx`. Wire up smooth wheel scrolling along the `CatmullRomCurve3` spline, the Messenger-style cyber-drone guide, and the `[M]` Clash of Clans Isometric Base Overview camera transition."* | Scrolling flies smoothly through the 28,000-point LiDAR canyon; pressing `M` zooms out to an isometric village overview |
| **Phase 3: Igloo Crystal Monoliths & Shaders** | *"Implement `src/canvas/shaders/IceCrystalShader.ts` and `src/canvas/ProjectMonolith.tsx`. Place a procedural crystal enclosure at each project's 3D coordinates that melts/shatters open when the camera gets within 18 units, and locks into The Drop Store monochrome pedestal mode when clicked."* | Each of the 7 project sectors displays a distinct glowing crystal monolith with chromatic aberration and proximity melt |
| **Phase 4: Telemetry HUD, Brawl Modal & Reddit Threads** | *"Build `src/components/TelemetryHud.tsx` with the Lando Norris speed/depth HUD, Instagram Stories top sector rings, `[R]` X-Ray Reverse-Engineer wireframe toggle, Brawl Stars skewed stat bars, and collapsible Reddit-style Dev-Log threads."* | Clicking any project or Story ring warps to the sector and opens the Brawl/Reddit drawer |
| **Phase 5: Reverse-Engineered UI Vault & Particle Footer** | *"Add Sector 08 at the end of the spline: an interactive 3D showcase of my reverse-engineered UIs (Reddit, Instagram, Clash of Clans, Brawl Stars) plus an Igloo Inc. velocity-reactive particle footer that morphs between 3D point-cloud icons for GitHub, LinkedIn, and Resume download."* | Reaching 100% scroll triggers the morphing particle footer and interactive UI teardown showcase |

## 6\. Ideas & Easter Eggs You Can Experiment With While Building

1. **Live Handesk Webcam Mode Inside the Portfolio:** Add a `"Try Handesk Live"` toggle in Sector 01 that requests browser webcam permission, loads `@mediapipe/tasks-vision` in a Web Worker, and lets visitors fly through your 3D portfolio using **pinch-and-drag hand gestures** in the air\!  
2. **Franky Voice Tour Guide:** Connect a pre-generated set of your 250-epoch `F5-TTS` voice clips (or your live `Franky` ngrok endpoint when active) so clicking a speaker icon on any sector narrates the architecture breakdown in your custom voice model.  
3. **Slidepaper Live Wallpaper Shader Portal:** Pull the top 3 wallpaper packs from your `bundles.json` (`Anya | Spy x Family`, `Slidpapers Cars`, `Murim`) and render them as parallax depth-map portals inside Sector 02 so visitors can preview `16:9` vs `21:9 Ultrawide` framing in 3D space.