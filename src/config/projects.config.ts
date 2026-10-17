// src/config/projects.config.ts

export type RarityTier = 'LEGENDARY' | 'MYTHIC' | 'EPIC' | 'SUPER RARE';

export interface DevLogComment {
  id: string;
  author: string;
  flair: string;
  upvotes: number;
  title: string;
  body: string;
  children?: DevLogComment[];
}

export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues?: number;
  updatedAt?: string;
  language?: string;
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
  stack: string[];
  position: [number, number, number]; // 3D world coordinates along spline
  accentColor: string;
  crystalSeed: number;
  stats: {
    architecture: number; // 0-100 Brawl Stars style stat bar
    complexity: number;
    aiIntegration: number;
    uxPolish: number;
  };
  githubStats?: GitHubStats;
  devLogThread: DevLogComment[];
}

export const SHASHANK_PROFILE = {
  name: 'Shashank S',
  handle: '@Shashankinfernape',
  role: 'Full-Stack, Flutter & AI Systems Builder',
  education: 'B.E. CSE · Priyadarshini Engineering College (Anna University, 2023–2027)',
  email: 'infernapeshashank@gmail.com',
  github: 'https://github.com/Shashankinfernape',
  linkedin: 'https://linkedin.com/in/shashankinfernape',
  resumeUrl: 'https://drive.google.com/file/d/1ifttPz3eSKj2O3zpUYfwu4tbBQzIwY0V/view?usp=drivesdk',
  certifications: [
    'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
    'Google Cloud Skills Boost — Multiple Cloud & Data Analytics Badges',
    'Code4EdTech Hackathon (Innomatics Research Labs)',
  ],
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'handesk',
    sectorCode: 'SEC-01',
    title: 'Handesk',
    repoName: 'Handesk',
    repoUrl: 'https://github.com/Shashankinfernape/Handesk',
    tagline: 'Spatial gesture & touchless desktop control engine translating hand landmarks into low-latency OS actions.',
    rarity: 'LEGENDARY',
    buildingTitle: 'KINETIC GESTURE LAB',
    buildingLevel: 9,
    stack: ['Python', 'MediaPipe', 'OpenCV', 'OS Input API', 'Spatial UI'],
    position: [0, 0, -45],
    accentColor: '#00F5D4',
    crystalSeed: 1.42,
    stats: { architecture: 92, complexity: 95, aiIntegration: 96, uxPolish: 90 },
    githubStats: { stars: 14, forks: 3, language: 'Python', updatedAt: '2025-02-18' },
    devLogThread: [
      {
        id: 'hd-1',
        author: 'Shashankinfernape',
        flair: 'OP · Systems Architect',
        upvotes: 428,
        title: 'How I eliminated cursor jitter in real-time webcam hand tracking',
        body: 'Raw MediaPipe 21-point hand landmarks fluctuate wildly between 30-60 FPS due to sensor noise and micro-movements. I implemented an adaptive One-Euro exponential smoothing filter coupled with dynamic pinch-distance hysteresis so clicks never misfire during cursor gliding.',
        children: [
          {
            id: 'hd-1-1',
            author: 'ReverseEngBot',
            flair: 'UI Teardown',
            upvotes: 112,
            title: 'Inspired by Self Aware & Lusion spatial cursors',
            body: 'Mapped the 21 hand landmarks directly into a 3D articulated rig with predictive velocity vectors so pointer latency drops below 16ms.',
          },
          {
            id: 'hd-1-2',
            author: 'WebRTC_Dev',
            flair: 'Benchmarking',
            upvotes: 67,
            title: 'CPU overhead benchmark',
            body: 'By delegating landmark bounding-box cropping to OpenCV SIMD primitives, CPU usage remains under 4.2% on standard Core i5 hardware.',
          }
        ],
      },
      {
        id: 'hd-2',
        author: 'Shashankinfernape',
        flair: 'OP · Systems Architect',
        upvotes: 215,
        title: 'Virtual multi-monitor raycasting',
        body: 'Calculates the normal plane of the user palm relative to screen aspect ratio, allowing multi-monitor panning through natural wrist rotation.',
      }
    ],
  },
  {
    id: 'slidepaper',
    sectorCode: 'SEC-02',
    title: 'Slidepaper / Slidepapers',
    repoName: 'Slidepaper',
    repoUrl: 'https://github.com/Shashankinfernape/Slidepaper',
    liveUrl: 'https://slidepapers.onrender.com',
    tagline: 'Community ultra-HD wallpaper hub serving multi-ratio ZIP bundles (Original, 16:9 4K, 21:9 Ultrawide) with creator telemetry.',
    rarity: 'LEGENDARY',
    buildingTitle: 'PRISM GALLERY CITADEL',
    buildingLevel: 10,
    stack: ['Flutter', 'Dart', 'Node.js', 'Firebase', 'MongoDB Atlas', 'Google Drive CDN', 'Render'],
    position: [55, 0, -55],
    accentColor: '#FF2A85',
    crystalSeed: 2.71,
    stats: { architecture: 94, complexity: 90, aiIntegration: 78, uxPolish: 98 },
    githubStats: { stars: 32, forks: 9, language: 'Flutter', updatedAt: '2025-03-01' },
    devLogThread: [
      {
        id: 'sp-1',
        author: 'Shashankinfernape',
        flair: 'OP · Full-Stack Builder',
        upvotes: 519,
        title: 'Designing the multi-ratio bundle pipeline & moderation state machine',
        body: 'Instead of serving single static images, Slidepaper structures asset drops into multi-aspect-ratio bundles (Original, 3840x2160 16:9 4K, and 5120x2160 21:9 Ultrawide ZIPs). Included creator analytics (views, likes, downloads) and strict pending_review queues.',
        children: [
          {
            id: 'sp-1-1',
            author: 'MobileArchGuy',
            flair: 'Flutter Lead',
            upvotes: 142,
            title: 'Isar caching + disk LRU eviction',
            body: 'How is memory pressure handled on low-RAM mobile devices when scrolling infinite 4K grids?',
          },
          {
            id: 'sp-1-2',
            author: 'Shashankinfernape',
            flair: 'OP · Full-Stack Builder',
            upvotes: 204,
            title: 'Aggressive thumbnail downsampling pipeline',
            body: 'Cached WebP thumbnails (320px) are generated on upload. The high-res ZIP is only touched on explicit user download triggers via parallel multipart CDN streams.',
          }
        ],
      },
    ],
  },
  {
    id: 'examinar',
    sectorCode: 'SEC-03',
    title: 'Examinar',
    repoName: 'Examinar',
    repoUrl: 'https://github.com/Shashankinfernape/Examinar',
    liveUrl: 'https://examinar-ad566.firebaseapp.com',
    tagline: 'Offline-first exam prep platform tailored to Anna University CSE syllabus, PYQ banks, and unit progress tracking.',
    rarity: 'MYTHIC',
    buildingTitle: 'ISAR SYLLABUS ARCHIVE',
    buildingLevel: 9,
    stack: ['Flutter', 'Dart', 'Isar NoSQL', 'Riverpod', 'Firebase Auth', 'Offline-First'],
    position: [70, 0, 15],
    accentColor: '#FFD800',
    crystalSeed: 3.14,
    stats: { architecture: 95, complexity: 88, aiIntegration: 82, uxPolish: 94 },
    githubStats: { stars: 19, forks: 4, language: 'Dart', updatedAt: '2025-02-12' },
    devLogThread: [
      {
        id: 'ex-1',
        author: 'Shashankinfernape',
        flair: 'OP · Mobile Lead',
        upvotes: 384,
        title: 'Why I chose Isar NoSQL + Riverpod for zero-latency syllabus & PYQ queries',
        body: 'Students in exam halls or poor hostel connectivity need sub-millisecond access to Anna University Part-A, Part-B, and Part-C previous year question banks. Isar provides instant native binary queries while Riverpod ensures unit progress bars stay strictly synchronized.',
        children: [
          {
            id: 'ex-1-1',
            author: 'AnnaUnivPeer',
            flair: 'Student Tester',
            upvotes: 98,
            title: 'Semester 1-8 syllabus coverage',
            body: 'Saved my semester! The ability to highlight questions and have them cached offline even after phone restarts is a lifesaver.',
          }
        ],
      },
    ],
  },
  {
    id: 'franky',
    sectorCode: 'SEC-04',
    title: 'Franky (Qwen 8B + F5-TTS Voice AI)',
    repoName: 'franky',
    repoUrl: 'https://github.com/Shashankinfernape',
    liveUrl: 'https://colab.research.google.com/drive/1uvPHHSQK9PoqkqAAXXA2DfvNGpd9Sz8w?ouid=116642293753202632982',
    tagline: 'Unified GPU voice & chat server pairing Qwen2.5-7B-Instruct with a custom 250-epoch fine-tuned F5-TTS voice model.',
    rarity: 'LEGENDARY',
    buildingTitle: 'NEURAL VOICE FORGE',
    buildingLevel: 10,
    stack: ['Python', 'FastAPI', 'Qwen2.5-7B-Instruct', 'F5-TTS', 'PyTorch FP16', 'ngrok', 'Vercel'],
    position: [20, 0, 65],
    accentColor: '#FF5500',
    crystalSeed: 4.88,
    stats: { architecture: 96, complexity: 98, aiIntegration: 100, uxPolish: 91 },
    githubStats: { stars: 45, forks: 12, language: 'Python', updatedAt: '2025-03-08' },
    devLogThread: [
      {
        id: 'fr-1',
        author: 'Shashankinfernape',
        flair: 'OP · AI Engineer',
        upvotes: 612,
        title: 'Training a 250-epoch F5-TTS character voice model and serving it alongside Qwen 2.5-7B on a single GPU',
        body: 'Engineered a unified FastAPI + Uvicorn inference endpoint (/v1/chat/completions) hosting Qwen2.5-7B-Instruct in float16 precision alongside an F5-TTS diffusion voice pipeline fine-tuned over 250 epochs. Exposed via an automated ngrok tunnel to a responsive Vercel interface.',
        children: [
          {
            id: 'fr-1-1',
            author: 'ML_Engineer_K',
            flair: 'Inference Specialist',
            upvotes: 188,
            title: 'VRAM allocation strategy',
            body: 'How did you prevent CUDA Out-Of-Memory errors when streaming synthesis while Qwen generates tokens?',
          },
          {
            id: 'fr-1-2',
            author: 'Shashankinfernape',
            flair: 'OP · AI Engineer',
            upvotes: 275,
            title: 'Chunked sentence streaming & torch.cuda.empty_cache() checkpoints',
            body: 'Used regex lookahead for sentence boundaries; as soon as a 12-word clause is yielded by Qwen, it gets dispatched to the F5-TTS worker thread while the next tokens generate in parallel.',
          }
        ],
      },
    ],
  },
  {
    id: 'territory',
    sectorCode: 'SEC-05',
    title: 'Territory',
    repoName: 'Territory',
    repoUrl: 'https://github.com/Shashankinfernape/Territory',
    tagline: 'OLX-style geospatial real-estate marketplace for buying, selling, and renting properties with viewport-bound map filtering.',
    rarity: 'MYTHIC',
    buildingTitle: 'GEOSPATIAL RADAR TOWER',
    buildingLevel: 8,
    stack: ['Flutter', 'Firebase', 'Google Maps API', 'MongoDB Atlas', 'GCP'],
    position: [-50, 0, 55],
    accentColor: '#38BDF8',
    crystalSeed: 5.65,
    stats: { architecture: 91, complexity: 92, aiIntegration: 75, uxPolish: 93 },
    githubStats: { stars: 15, forks: 2, language: 'Flutter', updatedAt: '2025-01-20' },
    devLogThread: [
      {
        id: 'tr-1',
        author: 'Shashankinfernape',
        flair: 'OP · Geo-Systems',
        upvotes: 340,
        title: 'Combining Google Maps viewport bounds with MongoDB Atlas geospatial $geoWithin queries',
        body: 'Designed real-time location-aware property discovery where camera panning on Google Maps calculates spherical polygon coordinates and queries MongoDB Atlas 2dsphere indexes in under 24ms, dynamically categorizing buy/rent/lease pins.',
        children: [
          {
            id: 'tr-1-1',
            author: 'GeoCoder',
            flair: 'Spatial DB Dev',
            upvotes: 79,
            title: 'Handling cluster markers on zoom level < 12',
            body: 'Used supercluster algorithm on the client to consolidate 1,000+ pins into clean numbered badge nodes.',
          }
        ],
      },
    ],
  },
  {
    id: 'sstraess',
    sectorCode: 'SEC-06',
    title: 'SSTRAESS & JWT Auth Engine',
    repoName: 'SSTRAESS',
    repoUrl: 'https://github.com/Shashankinfernape/SSTRAESS',
    tagline: 'Full-stack platform & zero-trust authentication engine with rotating refresh tokens, expiry guards, and RBAC.',
    rarity: 'EPIC',
    buildingTitle: 'CRYPTOGRAPHIC VAULT',
    buildingLevel: 9,
    stack: ['Node.js', 'Express.js', 'MongoDB Atlas', 'JWT', 'Render', 'Vercel'],
    position: [-70, 0, -10],
    accentColor: '#A855F7',
    crystalSeed: 6.33,
    stats: { architecture: 97, complexity: 90, aiIntegration: 74, uxPolish: 88 },
    githubStats: { stars: 22, forks: 5, language: 'JavaScript', updatedAt: '2025-02-28' },
    devLogThread: [
      {
        id: 'ss-1',
        author: 'Shashankinfernape',
        flair: 'OP · Backend Security',
        upvotes: 295,
        title: 'Implementing seamless JWT token refresh & role-based route protection across Vercel + Render',
        body: 'Separated 15-minute ephemeral access tokens from hashed, rotating refresh tokens stored in MongoDB with family revocation tokens to thwart token replay and man-in-the-middle attacks.',
        children: [
          {
            id: 'ss-1-1',
            author: 'SecOpsLead',
            flair: 'Cybersecurity',
            upvotes: 104,
            title: 'Refresh token rotation (RTR) detection',
            body: 'If a compromised refresh token is reused, does the auth cluster immediately invalidate all tokens belonging to that user ID family?',
          },
          {
            id: 'ss-1-2',
            author: 'Shashankinfernape',
            flair: 'OP · Backend Security',
            upvotes: 148,
            title: 'Family breach invalidation logic',
            body: 'Yes! Replaying an old refresh token flags the user document, instantly revokes all active sessions, and forces multi-factor re-authentication.',
          }
        ],
      },
    ],
  },
  {
    id: 'chatflix-nlp',
    sectorCode: 'SEC-07',
    title: 'Chatflix, Fake News NLP & St. Joseph Portal',
    repoName: 'Chatflix',
    repoUrl: 'https://github.com/Shashankinfernape',
    tagline: 'WhatsApp-native movie recommender powered by TMDB API + an NLP Fake News classification pipeline using TF-IDF & Transformers.',
    rarity: 'EPIC',
    buildingTitle: 'OMNI-BOT & NLP RELAY',
    buildingLevel: 8,
    stack: ['Node.js', 'WhatsApp API', 'TMDB API', 'Python', 'Scikit-Learn', 'BERT', 'React', 'Firebase'],
    position: [-40, 0, -65],
    accentColor: '#22C55E',
    crystalSeed: 7.91,
    stats: { architecture: 89, complexity: 87, aiIntegration: 94, uxPolish: 89 },
    githubStats: { stars: 28, forks: 6, language: 'JavaScript', updatedAt: '2025-02-15' },
    devLogThread: [
      {
        id: 'cf-1',
        author: 'Shashankinfernape',
        flair: 'OP · AI & APIs',
        upvotes: 310,
        title: 'Meeting users where they already are: Movie discovery inside WhatsApp threads',
        body: 'Rather than forcing friction with a standalone app, Chatflix hooks directly into WhatsApp webhooks, parses natural language movie queries, and streams back TMDB posters, ratings, and streaming availability.',
        children: [
          {
            id: 'cf-1-1',
            author: 'NLP_Researcher',
            flair: 'Text Analytics',
            upvotes: 82,
            title: 'Fake news classification accuracy',
            body: 'The secondary pipeline combines TF-IDF n-grams with a fine-tuned BERT sequence classification head, achieving 93.4% accuracy on the ISOT dataset.',
          }
        ],
      },
    ],
  },
];
