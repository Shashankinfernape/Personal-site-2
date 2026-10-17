// src/config/world.config.ts

export interface WorldDistrict {
  id: string;
  name: string;
  theme: string;
  center: [number, number, number];
  color: string;
  ambientLightColor: string;
  landmarkTitle: string;
  description: string;
  characterId: string;
}

export const WORLD_DISTRICTS: WorldDistrict[] = [
  {
    id: 'arrival-courtyard',
    name: 'The Haven Courtyard',
    theme: 'Arrival & Gathering',
    center: [0, 0, 5],
    color: '#00F5D4',
    ambientLightColor: '#D4F6EB',
    landmarkTitle: 'Wayfinder Spire & Lantern',
    description: 'A welcoming sunlit courtyard where travelers begin their journey across the realm.',
    characterId: 'kiro', // Nearby guide
  },
  {
    id: 'touchless-workshop',
    name: 'The Touchless Workshop',
    theme: 'Spatial Computer Vision & Input',
    center: [12, 0, -8],
    color: '#00F5D4',
    ambientLightColor: '#00F5D4',
    landmarkTitle: 'Kinetic Gesture Gimbal',
    description: 'An open-air inventor workshop equipped with optical sensors and floating spatial cursors.',
    characterId: 'kiro',
  },
  {
    id: 'prism-spire',
    name: 'The Prism Spire',
    theme: 'Ultra-HD Wallpaper Gallery',
    center: [24, 1.2, -26],
    color: '#FF2A85',
    ambientLightColor: '#FF667D',
    landmarkTitle: 'Refractive Multi-Ratio Frame',
    description: 'A radiant crystalline tower showcasing ultra-wide and 4K wallpaper bundles.',
    characterId: 'lyra',
  },
  {
    id: 'scholars-cloister',
    name: "The Scholar's Cloister",
    theme: 'Offline-First Academic Database',
    center: [-16, 0.5, -18],
    color: '#FFD800',
    ambientLightColor: '#FFFABC',
    landmarkTitle: 'Isar NoSQL Archive Core',
    description: 'A stone library courtyard housing Anna University CSE syllabi and indexed question banks.',
    characterId: 'archon',
  },
  {
    id: 'resonance-caldera',
    name: 'The Resonance Caldera',
    theme: 'Neural Voice & Conversational AI',
    center: [16, -0.5, -45],
    color: '#FF5500',
    ambientLightColor: '#FF8C1A',
    landmarkTitle: 'Harmonic Ferrofluid Caldera',
    description: 'An acoustic sanctuary pulsing with 250-epoch fine-tuned diffusion voice synthesis.',
    characterId: 'echo',
  },
  {
    id: 'radar-lookout',
    name: 'The Radar Lookout',
    theme: 'Geospatial Real-Estate Navigation',
    center: [-22, 1.8, -48],
    color: '#38BDF8',
    ambientLightColor: '#20FBFF',
    landmarkTitle: 'Topographic Spatial Tower',
    description: 'A cliffside observation post surveying geospatial property coordinates in real-time.',
    characterId: 'vance',
  },
  {
    id: 'cryptographic-vault',
    name: 'The Cryptographic Vault',
    theme: 'Zero-Trust Authentication Engine',
    center: [10, 0, -70],
    color: '#A855F7',
    ambientLightColor: '#D12EFF',
    landmarkTitle: 'Concentric Ring Fortress',
    description: 'A fortified bastion safeguarding rotating JWT refresh tokens and RBAC boundaries.',
    characterId: 'cipher',
  },
  {
    id: 'signal-relay',
    name: 'The Signal Relay',
    theme: 'Chat Messaging & NLP Pipelines',
    center: [-8, 1.0, -82],
    color: '#22C55E',
    ambientLightColor: '#68E524',
    landmarkTitle: 'Orbital Reel Satellite',
    description: 'A communication antenna bringing cinema recommendations to WhatsApp threads.',
    characterId: 'iris',
  },
  {
    id: 'grand-archives',
    name: 'The Grand Archives of Reverse-Engineering',
    theme: 'The 17 Forensic System Studies',
    center: [0, 2.0, -108],
    color: '#CCFF00',
    ambientLightColor: '#FEE75C',
    landmarkTitle: 'The Museum of Deconstructed Worlds',
    description: 'A monumental archive detailing the extracted blueprints and motion physics of 17 major apps.',
    characterId: 'thorne',
  },
  {
    id: 'hearth-summit',
    name: "The Wayfarer's Hearth",
    theme: 'Creator & Contact Summit',
    center: [0, 0.5, -135],
    color: '#FFFFFF',
    ambientLightColor: '#FFF5DE',
    landmarkTitle: 'Campfire & Starry Lookout',
    description: 'A quiet campfire under the cosmos where Shashank welcomes visitors, recruiters, and collaborators.',
    characterId: 'shashank',
  },
];
