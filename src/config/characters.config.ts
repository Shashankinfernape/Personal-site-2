// src/config/characters.config.ts

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  emotion?: 'curious' | 'excited' | 'scholarly' | 'solemn' | 'friendly';
  actionPrompt?: string;
  relatedProjectId?: string;
  relatedResearchId?: string;
}

export interface WorldCharacter {
  id: string;
  name: string;
  title: string;
  districtId: string;
  worldPosition: [number, number, number];
  rotationY: number;
  primaryColor: string;
  secondaryColor: string;
  avatarIcon: string; // SVG / Icon identifier
  personality: string;
  initialDialogue: DialogueNode[];
  detailedStory: string;
  assignedProjectOrTopicId: string;
}

export const WORLD_CHARACTERS: WorldCharacter[] = [
  {
    id: 'kiro',
    name: 'Kiro',
    title: 'The Articulated Mechanist',
    districtId: 'touchless-workshop',
    worldPosition: [12, 0, -8],
    rotationY: -Math.PI / 4,
    primaryColor: '#00F5D4',
    secondaryColor: '#0D3B3A',
    avatarIcon: 'hand',
    personality: 'Precision-obsessed, kinetic hardware inventor who communicates with rhythmic hand gestures.',
    initialDialogue: [
      {
        id: 'kiro-1',
        speaker: 'Kiro',
        emotion: 'excited',
        text: "Greetings, traveler! Step into the Touchless Workshop. Notice anything unusual? I haven't touched a physical mouse in months!",
      },
      {
        id: 'kiro-2',
        speaker: 'Kiro',
        emotion: 'scholarly',
        text: "Shashank engineered Handesk right here. Raw webcam hand landmarks jitter like nervous fireflies. To tame them, he designed an adaptive One-Euro exponential smoothing filter coupled with pinch hysteresis.",
      },
      {
        id: 'kiro-3',
        speaker: 'Kiro',
        emotion: 'friendly',
        text: "The result? Sub-16ms latency OS control without accidental misclicks. Would you like to inspect the schematics?",
        actionPrompt: 'Open Handesk Dossier',
        relatedProjectId: 'handesk',
      },
    ],
    detailedStory:
      'Kiro manages the spatial gesture testing rigs. Built out of brass gimbals and optical sensors, Kiro tests spatial input pipelines under adverse lighting conditions.',
    assignedProjectOrTopicId: 'handesk',
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'The Prism Curator',
    districtId: 'prism-spire',
    worldPosition: [24, 1.2, -26],
    rotationY: -Math.PI / 3,
    primaryColor: '#FF2A85',
    secondaryColor: '#4A0E2B',
    avatarIcon: 'image',
    personality: 'Aesthetic visionary who sees digital spaces as living art galleries.',
    initialDialogue: [
      {
        id: 'lyra-1',
        speaker: 'Lyra',
        emotion: 'friendly',
        text: "Welcome to the Prism Spire! Here, light refracts into thousands of ultra-high-definition horizons.",
      },
      {
        id: 'lyra-2',
        speaker: 'Lyra',
        emotion: 'scholarly',
        text: "Most wallpaper apps serve blurry, single-ratio JPEGs. In Slidepaper, Shashank built a pipeline that bundles Original, 16:9 4K, and 21:9 Ultrawide ZIPs with real-time creator analytics on Render and MongoDB Atlas.",
      },
      {
        id: 'lyra-3',
        speaker: 'Lyra',
        emotion: 'excited',
        text: "It currently powers community wallpaper drops across thousands of screens. Let me show you the live deploy!",
        actionPrompt: 'Open Slidepaper Dossier',
        relatedProjectId: 'slidepaper',
      },
    ],
    detailedStory:
      'Lyra curates visual assets for ultrawide and multi-monitor setups, ensuring no artist wallpaper is degraded by compression.',
    assignedProjectOrTopicId: 'slidepaper',
  },
  {
    id: 'archon',
    name: 'Archon',
    title: 'The Scholar Automaton',
    districtId: 'scholars-cloister',
    worldPosition: [-16, 0.5, -18],
    rotationY: Math.PI / 4,
    primaryColor: '#FFD800',
    secondaryColor: '#4A3E08',
    avatarIcon: 'book',
    personality: 'Calm, methodical archivist devoted to student academic autonomy.',
    initialDialogue: [
      {
        id: 'archon-1',
        speaker: 'Archon',
        emotion: 'scholarly',
        text: "Welcome, seeker. You stand inside the Scholar's Cloister. Here, Anna University's entire B.E. Computer Science syllabus is indexed.",
      },
      {
        id: 'archon-2',
        speaker: 'Archon',
        emotion: 'curious',
        text: "Hostel connectivity in engineering colleges is notoriously fickle. Shashank built Examinar using Flutter, Riverpod, and an Isar local NoSQL engine for instantaneous, zero-latency access to Part-A, B, and C question banks.",
      },
      {
        id: 'archon-3',
        speaker: 'Archon',
        emotion: 'friendly',
        text: "Students can mark completed units and track exam readiness even deep in subterranean library stacks. Take a look at the architecture.",
        actionPrompt: 'Open Examinar Dossier',
        relatedProjectId: 'examinar',
      },
    ],
    detailedStory:
      'Archon safeguards academic knowledge, keeping syllabus progress synchronized across semester cycles.',
    assignedProjectOrTopicId: 'examinar',
  },
  {
    id: 'echo',
    name: 'Echo',
    title: 'The Resonance Synthesizer',
    districtId: 'resonance-caldera',
    worldPosition: [16, -0.5, -45],
    rotationY: -Math.PI / 2,
    primaryColor: '#FF5500',
    secondaryColor: '#4A1C05',
    avatarIcon: 'mic',
    personality: 'Vibrant, acoustic entity whose core pulses in harmony with synthesized human frequencies.',
    initialDialogue: [
      {
        id: 'echo-1',
        speaker: 'Echo',
        emotion: 'excited',
        text: "Listen closely! Can you hear the harmonics? That isn't a recorded voice—it's being generated right now by neural diffusion!",
      },
      {
        id: 'echo-2',
        speaker: 'Echo',
        emotion: 'scholarly',
        text: "Franky pairs Qwen2.5-7B-Instruct with a custom F5-TTS voice model fine-tuned across 250 epochs. Shashank unified them into a single GPU FastAPI worker, streaming voice tokens through an ngrok tunnel to web clients.",
      },
      {
        id: 'echo-3',
        speaker: 'Echo',
        emotion: 'friendly',
        text: "It bridges conversational intelligence with emotional human vocal nuance. Shall we inspect the Colab server blueprints?",
        actionPrompt: 'Open Franky Dossier',
        relatedProjectId: 'franky',
      },
    ],
    detailedStory:
      'Echo modulates audio waveforms, balancing VRAM memory constraints with real-time text-to-speech inference speed.',
    assignedProjectOrTopicId: 'franky',
  },
  {
    id: 'vance',
    name: 'Vance',
    title: 'The Geospatial Cartographer',
    districtId: 'radar-lookout',
    worldPosition: [-22, 1.8, -48],
    rotationY: Math.PI / 3,
    primaryColor: '#38BDF8',
    secondaryColor: '#0C354F',
    avatarIcon: 'map-pin',
    personality: 'Observant mapmaker who visualizes cities as interconnected coordinate graphs.',
    initialDialogue: [
      {
        id: 'vance-1',
        speaker: 'Vance',
        emotion: 'curious',
        text: "Ah, another wanderer! Look out over the valley. Every coordinate tells a story of shelter and territory.",
      },
      {
        id: 'vance-2',
        speaker: 'Vance',
        emotion: 'scholarly',
        text: "In Territory, Shashank coupled Google Maps viewport boundaries directly to MongoDB Atlas $geoWithin polygon queries, fetching neighborhood properties in under 24ms without lagging mobile viewports.",
      },
      {
        id: 'vance-3',
        speaker: 'Vance',
        emotion: 'friendly',
        text: "From rental filtering to instant seller chat, it simplifies spatial real-estate discovery. Let me show you how it works.",
        actionPrompt: 'Open Territory Dossier',
        relatedProjectId: 'territory',
      },
    ],
    detailedStory:
      'Vance surveys geographic coordinate planes, clustering real-world listings into high-performance map pins.',
    assignedProjectOrTopicId: 'territory',
  },
  {
    id: 'cipher',
    name: 'Cipher',
    title: 'The Sentinel of Keys',
    districtId: 'cryptographic-vault',
    worldPosition: [10, 0, -70],
    rotationY: -Math.PI / 4,
    primaryColor: '#A855F7',
    secondaryColor: '#2C0F4A',
    avatarIcon: 'lock',
    personality: 'Strict, protective guardian of cryptographic secrets and identity boundaries.',
    initialDialogue: [
      {
        id: 'cipher-1',
        speaker: 'Cipher',
        emotion: 'solemn',
        text: "Halt! You approach the Cryptographic Vault. Every threshold beyond this gate is defended by rotating cryptographic tokens.",
      },
      {
        id: 'cipher-2',
        speaker: 'Cipher',
        emotion: 'scholarly',
        text: "For SSTRAESS, Shashank designed a zero-trust JWT authentication engine. Short-lived 15-minute access tokens work alongside rotating refresh token families in MongoDB, with automatic breach detection and session revocation.",
      },
      {
        id: 'cipher-3',
        speaker: 'Cipher',
        emotion: 'friendly',
        text: "No token replay escapes unnoticed. Would you like to review the security architecture and RBAC middleware?",
        actionPrompt: 'Open SSTRAESS Dossier',
        relatedProjectId: 'sstraess',
      },
    ],
    detailedStory:
      'Cipher watches over session state transitions, validating that user claims and refresh signatures remain untampered.',
    assignedProjectOrTopicId: 'sstraess',
  },
  {
    id: 'iris',
    name: 'Iris',
    title: 'The Signal Transceiver',
    districtId: 'signal-relay',
    worldPosition: [-8, 1.0, -82],
    rotationY: Math.PI / 6,
    primaryColor: '#22C55E',
    secondaryColor: '#0A3B18',
    avatarIcon: 'radio',
    personality: 'Quick-witted communications operator who loves bringing bots and NLP classifiers to everyday chat apps.',
    initialDialogue: [
      {
        id: 'iris-1',
        speaker: 'Iris',
        emotion: 'friendly',
        text: "Static on the wire! Can you hear me? I route messages between conversational interfaces and AI truth detectors.",
      },
      {
        id: 'iris-2',
        speaker: 'Iris',
        emotion: 'excited',
        text: "Why make people install another movie app? With Chatflix, Shashank brought TMDB movie discovery directly into WhatsApp threads. Plus, he engineered a TF-IDF and BERT NLP pipeline achieving 93.4% accuracy detecting fake news.",
      },
      {
        id: 'iris-3',
        speaker: 'Iris',
        emotion: 'curious',
        text: "Meeting users where they already communicate—that is true product empathy. Check out the relay logs!",
        actionPrompt: 'Open Chatflix Dossier',
        relatedProjectId: 'chatflix-nlp',
      },
    ],
    detailedStory:
      'Iris translates webhooks and natural language prompts, dispatching requests between TMDB and deep-learning NLP classifiers.',
    assignedProjectOrTopicId: 'chatflix-nlp',
  },
  {
    id: 'thorne',
    name: 'Master Thorne',
    title: 'The Grand Reverse-Engineer',
    districtId: 'grand-archives',
    worldPosition: [0, 2.0, -108],
    rotationY: 0,
    primaryColor: '#CCFF00',
    secondaryColor: '#364000',
    avatarIcon: 'archive',
    personality: 'Venerable, razor-sharp software forensic researcher who deconstructs the world’s most famous games and interfaces.',
    initialDialogue: [
      {
        id: 'thorne-1',
        speaker: 'Master Thorne',
        emotion: 'excited',
        text: "At last! Welcome to the Grand Archives of Reverse-Engineering! Here we do not merely look at software—we take it apart piece by piece.",
      },
      {
        id: 'thorne-2',
        speaker: 'Master Thorne',
        emotion: 'scholarly',
        text: "Shashank has compiled 17 forensic research folders analyzing production codebases. From Brawl Stars' chunky beveled squircles and Clash of Clans' 2.5D isometric matrix, to Lusion's Newtonian gravity physics and Lando Norris's F1 telemetry HUD.",
      },
      {
        id: 'thorne-3',
        speaker: 'Master Thorne',
        emotion: 'friendly',
        text: "Every study contains verified design tokens, motion specs, GLSL shaders, and implementation blueprints. Step into the Research Museum and explore them all!",
        actionPrompt: 'Explore 17 Research Studies',
        relatedResearchId: 'ALL',
      },
    ],
    detailedStory:
      'Master Thorne curates Shashank’s entire forensic research library, archiving decompiled APKs, WebGL shaders, and motion choreography graphs.',
    assignedProjectOrTopicId: 'reverse-engineering-library',
  },
  {
    id: 'shashank',
    name: 'Shashank S',
    title: 'The Architect & Explorer',
    districtId: 'hearth-summit',
    worldPosition: [0, 0.5, -135],
    rotationY: 0,
    primaryColor: '#FFFFFF',
    secondaryColor: '#1A202C',
    avatarIcon: 'user',
    personality: 'Warm, thoughtful, builder at heart. Passionate about software craftsmanship, AI systems, and game mechanics.',
    initialDialogue: [
      {
        id: 'shashank-1',
        speaker: 'Shashank',
        emotion: 'friendly',
        text: "Hey there! I'm Shashank S. Thank you for walking through my realm and meeting the characters.",
      },
      {
        id: 'shashank-2',
        speaker: 'Shashank',
        emotion: 'scholarly',
        text: "I'm a B.E. Computer Science undergraduate (Anna University, 2023–2027) building full-stack Flutter applications, GPU voice AI pipelines, and reverse-engineering complex software systems.",
      },
      {
        id: 'shashank-3',
        speaker: 'Shashank',
        emotion: 'excited',
        text: "Whether you're looking for an engineer who builds resilient systems or deep-dives into UI physics, I'd love to connect. Grab a copy of my resume or reach out directly!",
        actionPrompt: 'Get In Touch / Resume',
        relatedProjectId: 'about',
      },
    ],
    detailedStory:
      'Shashank S (@Shashankinfernape) — Developer, Reverse-Engineer, and Creative Technologist.',
    assignedProjectOrTopicId: 'about',
  },
];
