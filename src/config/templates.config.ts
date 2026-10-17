// src/config/templates.config.ts

export interface MotionSpec {
  engine: string;
  easings: string[];
  fpsTarget: number;
  physicsModel?: string;
  keyChoreography: string;
}

export interface ShaderSpec {
  type: string;
  precision: string;
  uniforms: string[];
  technique: string;
}

export interface DesignTokenSpec {
  palette: Record<string, string>;
  typography: {
    heading: string;
    body: string;
    effects?: string;
  };
  geometry: {
    borderRadius?: string;
    borderWidth?: string;
    dropShadow?: string;
    bevel?: string;
  };
}

export interface EngineeringTemplate {
  id: string;
  folderName: string;
  category: 'GAME_APP' | 'INTERACTIVE_WEB' | 'WEB_ARCHITECTURE';
  title: string;
  subtitle: string;
  versionOrSource: string;
  description: string;
  tokens: DesignTokenSpec;
  motion: MotionSpec;
  shaders?: ShaderSpec;
  blueprintSummary: string[];
  prompts: string[];
}

export const REVERSE_ENGINEERED_TEMPLATES: EngineeringTemplate[] = [
  // 1. GAME & MAJOR APP ENGINEERING TEMPLATES
  {
    id: 'brawl-stars',
    folderName: 'brawl-stars-analysis',
    category: 'GAME_APP',
    title: 'Brawl Stars Client',
    subtitle: 'Chunky Beveled UI, Supercell-Magic Font & Multi-Stop Gradients',
    versionOrSource: 'v69.414 · assets/csv_client/color_gradients.csv',
    description: 'Decompiled Supercell client architecture featuring tactile beveled squircles, Lilita One 4px stroke drop-shadows, and dynamic brawler loadout stat matrices.',
    tokens: {
      palette: {
        'primary-yellow': '#FFD12E',
        'primary-yellow-dark': '#D69B00',
        'gem-green': '#00C74B',
        'free-lime': '#68E524',
        'power-pink': '#F931A3',
        'coin-gold': '#F29928',
        'trophy-orange': '#EC8444',
        'ranked-cyan': '#20FBFF',
        'alert-red': '#FF2A2A',
        'panel-dark': '#10131F',
        'panel-card': '#23273D',
        'panel-border': '#353B5A',
      },
      typography: {
        heading: 'Lilita One / Supercell-Magic, 900 Weight',
        body: 'Supercell-Magic / Rounded Sans, 700 Weight',
        effects: 'text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0px 4px 0 #000',
      },
      geometry: {
        borderRadius: '14px',
        bevel: '4px bottom lip (#D69B00 / #000)',
        dropShadow: '8px 8px 0px #CCFF00',
      },
    },
    motion: {
      engine: 'Custom Stage3D / Native Sprite Animation',
      easings: ['cubic-bezier(0.18, 0.89, 0.32, 1.28)', 'spring-pop-down(4px)'],
      fpsTarget: 60,
      physicsModel: 'Tactile press-down: translateY(4px) collapsing bottom bevel',
      keyChoreography: 'Chunky tactile button press down state, skewed -skew-x-12 loadout card transition, and power point bar fill interpolation.',
    },
    blueprintSummary: [
      'Extracted verified gradient stops: FreeOffer (#9FFF72->#68E524->#E0FFA0), Golden (#FFFABC->#FFD12E->#F29928), Hypercharge (#FABCFF->#D12EFF->#9928F2).',
      'Tactile button geometry with 54x54dp minimum touch target and asymmetrical bottom lip bevel.',
      'Rarity tier grading matrix: LEGENDARY (Gold-Red), MYTHIC (Pink-Purple), EPIC (Purple-Cyan), SUPER RARE (Blue).',
    ],
    prompts: [
      'Implement skewed Brawl Stars loadout card with -skew-x-12 angle and lilita text-shadow outline.',
      'Wire animated stat bars using spring-damped fill physics and color_gradients.csv color stops.',
    ],
  },
  {
    id: 'clash-of-clans',
    folderName: 'clash-of-clans-analysis',
    category: 'GAME_APP',
    title: 'Clash of Clans Base',
    subtitle: 'Isometric 2.5D Projection & Supercell-Magic Component Library',
    versionOrSource: 'assets/ui/ui_component_library/ & common_text_styles.json',
    description: 'Reverse-engineered isometric Cartesian-to-screen projection, Town Hall upgrade state machines, and authentic Clash resource palettes.',
    tokens: {
      palette: {
        'clash-gold-primary': '#FEE75C',
        'clash-gold-gradient': 'linear-gradient(180deg, #FFE866 0%, #E6A717 60%, #B87805 100%)',
        'clash-elixir-magenta': '#D728A3',
        'clash-dark-elixir': '#251C33',
        'clash-dark-accent': '#7642A8',
        'clash-gem-emerald': '#33C539',
        'clash-wood-brown': '#422616',
        'clash-parchment': '#FFF5DE',
        'clash-stone-gray': '#78828A',
        'shiny-ore': '#3AA4EB',
        'glowy-ore': '#DC4DF0',
        'starry-ore': '#F7C434',
      },
      typography: {
        heading: 'Supercell-Magic 25px / 19px, White with #000000 2px outline',
        body: 'Supercell-Magic 12px, #2C2E3B (Dark Slate)',
        effects: 'text_cost_deficit: #FF4C4C with 1.5px black outline',
      },
      geometry: {
        borderRadius: '8px dialog corners',
        borderWidth: '3px #5B2B04 outer border + 2px #FFF799 top bevel',
        dropShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
      },
    },
    motion: {
      engine: 'TimelineManager / 2.5D Isometric Transform',
      easings: ['ease-out-back', 'cubic-bezier(0.25, 1, 0.5, 1)'],
      fpsTarget: 60,
      physicsModel: '30°/60° Isometric orthographic camera tilt matrix',
      keyChoreography: 'Camera zoom from linear spline flight into high-altitude village citadel overview at [75, 88, -45].',
    },
    blueprintSummary: [
      'Town Hall upgrade level hierarchy governing monolith scale, crystal seed, and emissive beacon intensity.',
      'Resource progress bars with glassy white reflection highlight at y: [5, 9] and dark inset drop shadow.',
      'Ore economy color accents (Shiny, Glowy, Starry) integrated into sector milestone tags.',
    ],
    prompts: [
      'Switch CameraRig to [M] Clash Isometric Base View with smooth slerp vector lerping.',
      'Render 3D project pedestals as Clash building platforms with level badge rims and pulse waves.',
    ],
  },
  {
    id: 'reddit-template',
    folderName: 'reddit-engineering-template',
    category: 'GAME_APP',
    title: 'Reddit Engineering Architecture',
    subtitle: 'Recursive Comment Trees & Hysteresis Karma Engine',
    versionOrSource: 'com.reddit.frontpage_2026.41.0 · Apollo Cache Architecture',
    description: 'Reverse-engineered nested comment virtualization, optimistic upvote state caching with rollback, and flair tag inheritance.',
    tokens: {
      palette: {
        'reddit-orange': '#FF4500',
        'reddit-upvote': '#FF5500',
        'reddit-downvote': '#7193FF',
        'reddit-dark': '#0E1113',
        'reddit-card': '#1A1A1B',
        'reddit-border': '#343536',
      },
      typography: {
        heading: 'IBMPlexSans / Mono, 700 Weight',
        body: 'System Sans, 11px / 1.5 Line-Height',
      },
      geometry: {
        borderRadius: '4px',
        borderWidth: '2px solid indent thread lines',
      },
    },
    motion: {
      engine: 'React Virtualized / Optimistic Cache State Machine',
      easings: ['cubic-bezier(0.2, 0, 0, 1)'],
      fpsTarget: 60,
      keyChoreography: 'Branch collapse / expansion accordion animation with memoized subtrees.',
    },
    blueprintSummary: [
      'Optimistic vote update cache with local hysteresis counter preventing vote bouncing.',
      'Recursive JSON comment hierarchy supporting infinite nesting with OP flair tags and timestamp stamps.',
    ],
    prompts: [
      'Structure r/ShashankBuilds dev-log threads with nested comment components, upvotes, and flair tags.',
    ],
  },
  {
    id: 'reddit-base',
    folderName: 'reddit',
    category: 'GAME_APP',
    title: 'Reddit Decompiled Base',
    subtitle: 'Cross-Platform Feed Layout & Telemetry Specs',
    versionOrSource: 'Decompiled APK source & cross-platform report',
    description: 'Raw decompiled Android client reference for feed pagination, memory thresholds, and thread virtualization.',
    tokens: {
      palette: {
        'reddit-brand': '#FF4500',
        'reddit-surface': '#121212',
      },
      typography: {
        heading: 'IBMPlexSans-Bold',
        body: 'IBMPlexSans-Regular',
      },
      geometry: {},
    },
    motion: {
      engine: 'Android RecyclerView LayoutManager',
      easings: ['decelerate'],
      fpsTarget: 60,
      keyChoreography: 'Feed pull-to-refresh spring and thread hierarchy snap.',
    },
    blueprintSummary: [
      'Memory recycling for infinite post-mortem dev-log scrolling.',
    ],
    prompts: ['Implement memory-efficient nested post-mortem logs.'],
  },
  {
    id: 'instagram-template',
    folderName: 'instagram-engineering-template',
    category: 'GAME_APP',
    title: 'Instagram Stories & Reels Architecture',
    subtitle: 'Gradient Ring Interpolation & Viewport Snap Physics',
    versionOrSource: 'com.instagram.android_449.0.0 · Video Feed Pipeline',
    description: 'Reverse-engineered SVG stroke gradient ring switcher, viewport intersection triggers, and zero-layout-shift preview cards.',
    tokens: {
      palette: {
        'story-gradient-yellow': '#FCAF45',
        'story-gradient-pink': '#FF2A85',
        'story-gradient-purple': '#833AB4',
        'story-gradient-cyan': '#00F5D4',
      },
      typography: {
        heading: 'Instagram Sans / Inter, 700 Weight',
        body: 'Inter, 12px Regular',
      },
      geometry: {
        borderRadius: '9999px (circular story rings)',
      },
    },
    motion: {
      engine: 'CSS Keyframes & SVG Stroke Dashoffset Interpolation',
      easings: ['cubic-bezier(0.19, 1, 0.22, 1)'],
      fpsTarget: 60,
      keyChoreography: 'Top Stories gradient ring pulse on active sector warp; 1.08x scale on hover.',
    },
    blueprintSummary: [
      'Multi-stop gradient border ring highlighting active 3D sector.',
      'Instant sector warp on click with Catmull-Rom spline camera navigation.',
    ],
    prompts: ['Connect Instagram Stories top ring bar to jumpToSector in useWorldStore.'],
  },
  {
    id: 'instagram-base',
    folderName: 'instagram',
    category: 'GAME_APP',
    title: 'Instagram Decompiled Base',
    subtitle: 'Decompiled Media Feed & UI References',
    versionOrSource: 'LauncherActivity_decompiled.java & base.apk',
    description: 'Raw decompiled reference for Instagram Android media pipeline, blurhash decoders, and gesture recognizers.',
    tokens: {
      palette: {
        'ig-black': '#000000',
        'ig-white': '#FFFFFF',
      },
      typography: {
        heading: 'Instagram Sans',
        body: 'System Sans',
      },
      geometry: {},
    },
    motion: {
      engine: 'Android MediaCodec / TextureView',
      easings: ['linear'],
      fpsTarget: 60,
      keyChoreography: 'Reels snap physics with zero frame drop during swipe.',
    },
    blueprintSummary: ['Blurhash prefetching and instant image carousel buffering.'],
    prompts: ['Implement instant image thumbnail preloading for portfolio screenshots.'],
  },

  // 2. INTERACTIVE & WEB ENGINEERING TEMPLATES
  {
    id: 'abeto-messenger',
    folderName: 'abeto-messenger-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Messenger by Abeto',
    subtitle: '3D Cyber-Drone Guide & Cel-Shaded Station Beacons',
    versionOrSource: 'Awwwards SOTD · 3D-PIPELINE.md & DESIGN-SYSTEM.md',
    description: 'Stylized 3D exploration pipeline featuring an autonomous companion cyber-drone navigating ahead of the camera along the spline rail with banking and thrust physics.',
    tokens: {
      palette: {
        'abeto-orange': '#FF5500',
        'abeto-glow': '#FF2A00',
        'abeto-cyan': '#00F5D4',
        'abeto-dark': '#0A0C14',
      },
      typography: {
        heading: 'Space Grotesk / Mono, 700 Weight',
        body: 'JetBrains Mono, 12px',
      },
      geometry: {
        borderRadius: '2px',
        borderWidth: '1px solid rgba(255,85,0,0.4)',
      },
    },
    motion: {
      engine: 'Three.js useFrame / Catmull-Rom Spline Tracker',
      easings: ['lerp(prev, target, dt * 8)'],
      fpsTarget: 60,
      physicsModel: 'Bank-into-turn roll (rotZ = -pointer.x * 0.45, rotX = pointer.y * 0.25)',
      keyChoreography: 'Cyber-drone flies at lookAhead t+0.022 along spline, bobbing rhythmically with thruster light intensity.',
    },
    blueprintSummary: [
      'Octahedron drone core with concentric dual gimbal rings spinning on Y and Z axes.',
      'Dynamic point light with distance 9.0 illuminating the LiDAR terrain.',
    ],
    prompts: ['Render floating guide cyber-drone ahead of camera with pointer banking in CameraRig.'],
  },
  {
    id: 'display-studio',
    folderName: 'display-studio-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Display Studio',
    subtitle: 'Fluid Viewport Typography & Coral-to-Amber Gradients',
    versionOrSource: 'Awwwards Site of the Day · DESIGN-SYSTEM.md',
    description: 'Accessible high-WPO interface featuring fluid VW scaling mathematics, warm coral-to-amber accents (#FF667D -> #FF9776), and zero-motion-sickness fast navigation.',
    tokens: {
      palette: {
        'ds-yellow': '#F9F5ED',
        'ds-dark': '#353941',
        'ds-coral': '#FF667D',
        'ds-orange': '#FF9776',
        'ds-teal': '#00BEA9',
        'ds-purple': '#645577',
      },
      typography: {
        heading: 'Giselle Serif / Display Serif, Fluid VW formula',
        body: 'Grotesk Sans, 14px',
      },
      geometry: {
        borderRadius: '9999px pill buttons',
        borderWidth: '1px solid #DBDBDB',
      },
    },
    motion: {
      engine: 'GSAP 3.12 Flip & CSS Transitions',
      easings: ['cubic-bezier(0.25, 1, 0.5, 1)'],
      fpsTarget: 60,
      keyChoreography: 'Fluid drawer expand-and-wipe navigation with keyboard Tab accessibility.',
    },
    blueprintSummary: [
      'Fluid VW typography scaling formula: (targetPixels / 1440) * 100vw.',
      'High-contrast 19.8:1 WCAG AAA text contrast standards.',
    ],
    prompts: ['Apply warm coral/amber highlights to secondary UI pills and drawer headers.'],
  },
  {
    id: 'dont-board-me',
    folderName: 'dont-board-me-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: "Don't Board Me",
    subtitle: 'Bouncy Physics Props & Signature Custom Easing',
    versionOrSource: 'Awwwards SOTD · ANIMATION-AND-MOTION.md',
    description: 'Playful interactive physics props, SplitText rotational line swing reveals, and signature cubic-bezier(0.25, 1, 0.5, 1) deceleration curves.',
    tokens: {
      palette: {
        'dbm-yellow': '#FFE600',
        'dbm-dark': '#1C1C1E',
        'dbm-green': '#34C759',
      },
      typography: {
        heading: 'Chunky Display Serif, SplitText Line Wrap',
        body: 'Modernist Sans, 13px',
      },
      geometry: {
        borderRadius: '16px',
        dropShadow: '0 8px 30px rgba(0,0,0,0.12)',
      },
    },
    motion: {
      engine: 'GSAP 3.12 SplitText & Lenis Smooth Scroll',
      easings: ['cubic-bezier(0.25, 1, 0.5, 1)', 'bounce.out'],
      fpsTarget: 60,
      physicsModel: 'Bouncy tennis ball impact physics and rotational headline swing (+30deg to 0deg)',
      keyChoreography: 'Masked two-tier line overflow reveal with staggered rotational settling.',
    },
    blueprintSummary: [
      'Custom ease token --my-ease: cubic-bezier(0.25, 1, 0.5, 1) for all interactive UI triggers.',
      'Off-rail easter egg sandbox with throwable 3D debris.',
    ],
    prompts: ['Implement signature cubic-bezier(0.25, 1, 0.5, 1) on all HUD drawers and modal transitions.'],
  },
  {
    id: 'into-the-amazon',
    folderName: 'into-the-amazon-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Into The Amazon',
    subtitle: '28,000 GPU Point-Cloud LiDAR Canyon & Narrative Movements',
    versionOrSource: 'Awwwards Site of the Year Nominee · ANIMATION-AND-STORYTELLING.md',
    description: 'Photogrammetric GPU LiDAR point cloud fly-through with gold-to-cyan elevation ramps, elevation wave math, and continuous narrative scroll movements.',
    tokens: {
      palette: {
        'amazon-gold': '#FFD800',
        'amazon-cyan': '#00F5D4',
        'amazon-emerald': '#00C853',
        'amazon-dark': '#05060A',
        'sediment-clay': '#D87D4A',
      },
      typography: {
        heading: 'Cinematic Serif / Editorial Roman',
        body: 'Technical Monospace, 10px Elevation Readouts',
      },
      geometry: {
        borderRadius: '0px (stark scientific CAD frame)',
      },
    },
    motion: {
      engine: 'Direct 1:1 Scroll Coupling with Three.js Points Material',
      easings: ['linear scrub with lerp(0.1)'],
      fpsTarget: 60,
      physicsModel: 'Elevation wave formula: pow(abs(x) * 0.075, 1.8) + sin(z * 0.08) * 2.5 - 5.0',
      keyChoreography: '6 continuous vertical movements from Frigid Summit to Lowlands and Atlantic Plume with sweeping radar beam.',
    },
    shaders: {
      type: 'Points Shader Material',
      precision: 'highp float',
      uniforms: ['uTime', 'uPointSize', 'uScanlineZ', 'uLidarMode', 'uColorA', 'uColorB'],
      technique: 'Perspective attenuation (80.0 / -mvPosition.z) with circular soft disc alpha falloff and radar scanline pulse.',
    },
    blueprintSummary: [
      '28,000 points additive GPU buffer geometry mapped along the central canyon valley.',
      'Sweeping radar beam traveling along Z-axis in sync with elapsed time and user scroll depth.',
    ],
    prompts: ['Implement LidarPointMaterial with elevation wave and scanline pulse in LidarTerrain.tsx.'],
  },
  {
    id: 'landonorris',
    folderName: 'landonorris-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Lando Norris Official (landonorris.com)',
    subtitle: 'F1 Telemetry HUD, Papaya/Acid Lime Accents & Lenis Lerp 0.1',
    versionOrSource: 'Awwwards Site of the Month · DESIGN-SYSTEM.md & ANIMATION-SPECIFICATION.md',
    description: 'High-speed F1 telemetry HUD featuring real-time scroll velocity calculations in KM/H, Studio Freight Lenis lerp 0.1 damping, and high-contrast acid-lime accents.',
    tokens: {
      palette: {
        'f1-dark-green': '#282c20',
        'f1-white': '#f4f4ed',
        'f1-black': '#111112',
        'f1-lime': '#d2ff00',
        'f1-lime-off': '#b2c73a',
        'f1-papaya': '#ff6b00',
        'f1-tint-1': '#3b3c38',
      },
      typography: {
        heading: 'Brier Bold Display Serif & Mona Sans Variable (wdth: 75-100, wght: 200-900)',
        body: 'Mona Sans Technical Sans-Serif, Uppercase Telemetry',
      },
      geometry: {
        borderRadius: '0px sharp racing HUD corners',
        borderWidth: '1px solid rgba(255,255,255,0.15)',
        dropShadow: '0 0 20px rgba(0,0,0,0.85)',
      },
    },
    motion: {
      engine: 'Studio Freight Lenis (lerp: 0.1, smoothWheel: true) + GSAP SplitText',
      easings: ['cubic-bezier(0.19, 1, 0.22, 1)', 'gsap.ticker sync'],
      fpsTarget: 60,
      physicsModel: 'Inertia velocity scaler: velocity = abs(currentScroll - prev) / dt * 1200 (KM/H)',
      keyChoreography: 'Digital velocity gauge and depth percentage updating in real-time with neon lime pulse dot.',
    },
    blueprintSummary: [
      'Fixed viewport corner telemetry blocks displaying VEL (KM/H), DEPTH (%), FPS, and SECTOR COORDS.',
      'High-contrast acid-lime (#D2FF00) and McLaren papaya (#FF6B00) accent hierarchy.',
    ],
    prompts: ['Build TelemetryHud.tsx with live KM/H velocity calculation and fixed viewport racing chrome.'],
  },
  {
    id: 'lusion',
    folderName: 'lusion-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Lusion (lusion.co)',
    subtitle: 'Newtonian Harmonic Gravity & MeshTransmission Refraction',
    versionOrSource: 'Awwwards Studio of the Year · 3D-PIPELINE.md',
    description: 'Analytical Newtonian mechanics simulation with central harmonic gravity pull (-40 * p), exponential velocity drag (0.2^dt), and fluid pointer raycasting force fields.',
    tokens: {
      palette: {
        'lusion-ice-blue': '#8BC34A',
        'lusion-violet': '#9C27B0',
        'lusion-dark': '#0B0D13',
        'lusion-white': '#FFFFFF',
      },
      typography: {
        heading: 'Söhne Breit / Clean Geometric Grotesk',
        body: 'Söhne Mono, 11px',
      },
      geometry: {
        borderRadius: '9999px',
      },
    },
    motion: {
      engine: 'Analytical Newtonian Integration (F / m * (1 + friction))',
      easings: ['Exponential Drag: v *= 0.2^dt'],
      fpsTarget: 60,
      physicsModel: 'F_grav = -40 * p; a = F / (m * (1 + mu)); v += a * dt; p += v * dt',
      keyChoreography: 'Fluid mouse raycast force field deflecting floating geometry and camera trajectory with organic inertia.',
    },
    shaders: {
      type: 'Physical Specular Transmission',
      precision: 'highp float',
      uniforms: ['uMouseRay', 'uFluidVorticity', 'uTransmission', 'uRoughness'],
      technique: 'Analytical screen-space transmission glass with fluid vorticity ripples.',
    },
    blueprintSummary: [
      'Inertia-damped CatmullRomCurve3 spline traversal with pointer parallax.',
      'Audio-reactive ferrofluid sphere for Franky AI Voice Forge.',
    ],
    prompts: ['Implement Lusion harmonic gravity and exponential drag equations in CameraRig traversal.'],
  },
  {
    id: 'pixelflakes',
    folderName: 'pixelflakes-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Pixelflakes',
    subtitle: 'Architectural Blueprint Wireframe-to-Solid Boot Extrusion',
    versionOrSource: 'Awwwards SOTD · COMPONENT-INVENTORY.md & DESIGN-SYSTEM.md',
    description: 'Architectural blueprint sketch boot sequence where CAD crosshairs and wireframe lines extrude into solid shaded 3D geometry as assets reach 100%.',
    tokens: {
      palette: {
        'blueprint-blue': '#0055FF',
        'blueprint-grid': 'rgba(0, 245, 212, 0.25)',
        'cad-amber': '#FFD800',
        'cad-white': '#FFFFFF',
      },
      typography: {
        heading: 'Technical Architectural Sans / JetBrains Mono',
        body: 'CAD Monospace, 10px Coordinates',
      },
      geometry: {
        borderWidth: '2px solid rgba(255,255,255,0.2)',
        dropShadow: '0 0 50px rgba(0,245,212,0.15)',
      },
    },
    motion: {
      engine: 'GSAP 3.12 SVG Path Stroke-Dashoffset & Three.js Morph Targets',
      easings: ['power2.inOut', 'steps(12)'],
      fpsTarget: 60,
      keyChoreography: 'Blueprint grid extrudes outward; terminal boot messages log compiler stages from 0% to 100%.',
    },
    blueprintSummary: [
      'Preloader boot screen with architectural viewport crosshairs and live pipeline diagnostics.',
      'Smooth clip-path and opacity wipe into 3D WebGL realm upon reaching 100%.',
    ],
    prompts: ['Build Preloader.tsx with Pixelflakes architectural blueprint grid and dynamic boot logs.'],
  },
  {
    id: 'why-zero-university',
    folderName: 'why-zero-university-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Why Zero University (why.zero.university)',
    subtitle: 'Primordial Mint Radial Gradient & Stage Timeline Rulers',
    versionOrSource: 'Zero University & BUNQ LABS · DESIGN-SYSTEM.md',
    description: 'Luminous mint atmospheric gradient (#D4F6EB to #1C4839), calibrated horizontal timeline rulers (-100 BZ to 0 BZ), and tactical sci-fi minimalism.',
    tokens: {
      palette: {
        'mint-luminous': '#D4F6EB',
        'mint-mist': '#B3DED1',
        'celadon-frost': '#91C7B7',
        'sage-teal': '#70AF9C',
        'forest-patina': '#4E9782',
        'deep-spruce': '#356F5E',
        'obsidian-pine': '#1C4839',
      },
      typography: {
        heading: 'Editorial Precision Sans & Monospace Tickers',
        body: 'Mono 10px Calibrated Coordinates',
      },
      geometry: {
        borderRadius: '0px',
        borderWidth: '1px solid rgba(212, 246, 235, 0.2)',
      },
    },
    motion: {
      engine: 'Custom WebGL Fragment bgPass & Smooth Scroll Ticker',
      easings: ['cubic-bezier(0.16, 1, 0.3, 1)'],
      fpsTarget: 60,
      keyChoreography: 'Stage timeline ruler scrub with stage-specific ambient gradient transitions.',
    },
    blueprintSummary: [
      'Primordial mint radial gradient preventing white pre-paint flash behind WebGL canvas.',
      'Tactical horizontal timeline ruler measuring spline depth and chronometry.',
    ],
    prompts: ['Integrate Why Zero University mint gradient into preloader and background shader passes.'],
  },

  // 3. WEB ARCHITECTURE & EXPERIENCE ANALYSIS PACKAGES
  {
    id: 'igloo-inc',
    folderName: 'igloo-inc-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'Igloo Inc. (igloo.inc)',
    subtitle: '5-Iteration Chromatic Aberration & IOR 1.18 Ice Refraction',
    versionOrSource: 'Awwwards Site of the Year · ANIMATION-AND-3D.md',
    description: 'Offscreen multi-FBO compositing, 5-iteration chromatic aberration blending shader block [52], IOR 1.18 pure ice refraction, and blue noise dithering.',
    tokens: {
      palette: {
        'ice-base': '#08121C',
        'ice-facet-cyan': '#00F5D4',
        'ice-vein-blue': '#64B5F6',
        'ice-glint': '#FFFFFF',
      },
      typography: {
        heading: 'SDF Scramble Mono & Geometric Display',
        body: 'Technical Monospace, 11px',
      },
      geometry: {
        borderRadius: '0px (sharp procedural facets)',
      },
    },
    motion: {
      engine: 'Navier-Stokes GPU Fluid Physics & Scroll Velocity Disp',
      easings: ['linear with slopeDisp = (scrollTex.b * 2.0 - 1.0) * 0.4'],
      fpsTarget: 60,
      physicsModel: 'Proximity melt formula: clamp(1.0 - (dist - 8.0) / 14.0, 0, 1)',
      keyChoreography: 'Procedural Voronoi crystal facets displace and shatter open as camera approaches within 18 units.',
    },
    shaders: {
      type: 'GLSL Procedural Crystal + Chromatic Aberration Shader',
      precision: 'highp float',
      uniforms: ['uTime', 'uCrystalSeed', 'uAccentColor', 'uProximityMelt', 'uScrollVelocity', 'uXRayMode'],
      technique: 'hash31 facet coordinate quantization + Fresnel rim reflection (pow(1.0-dot(V,N), 2.8)) + blue noise dithering.',
    },
    blueprintSummary: [
      'Custom IceCrystalShader with 3D hash facet growth and shatter explode displacement.',
      'Velocity-reactive chromatic dispersion shifting R and B channels proportional to scroll speed.',
    ],
    prompts: ['Implement IceCrystalShader.ts matching Igloo Inc block [52] chromatic dispersion and facet math.'],
  },
  {
    id: 'other-side-of-truth',
    folderName: 'other-side-of-truth-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'The Other Side of Truth',
    subtitle: 'Dual Perspective X-Ray Flip & WebGL Noise Grain Shader',
    versionOrSource: 'Awwwards SOTY · ANIMATION-AND-MOTION.md',
    description: 'Dual narrative perspective flip driven by a custom WebGL noise grain shader, transitioning between surface representation and underlying wireframe reality.',
    tokens: {
      palette: {
        'truth-yellow': '#ECD06F',
        'truth-red': '#DA1111',
        'wireframe-cyan': '#00F5D4',
        'xray-dark': '#05060A',
      },
      typography: {
        heading: 'Kinetic Serif Wordmark',
        body: 'Mono Debug Metrics',
      },
      geometry: {},
    },
    motion: {
      engine: 'GSAP 3.15 ScrollTrigger Slit-Scan Parallax & Shader Uniform Toggles',
      easings: ['none', 'power2.inOut'],
      fpsTarget: 60,
      keyChoreography: 'Global [R] key toggle flipping all 3D monoliths into raw UV wireframe and shader debug grids.',
    },
    shaders: {
      type: 'Noise Grain & UV Wireframe Grid Shader',
      precision: 'highp float',
      uniforms: ['uNoise', 'uSeed', 'uXRayMode'],
      technique: 'fwidth(vUv * 24.0) screen-space derivative grid line calculation.',
    },
    blueprintSummary: [
      'Global X-Ray Reverse-Engineer Mode stripping textures to reveal underlying CAD wireframes.',
      'Noise grain procedural overlay enhancing realism and retro-futuristic fidelity.',
    ],
    prompts: ['Implement [R] X-Ray mode in useWorldStore and inject fwidth wireframe shader branch in IceCrystalShader.'],
  },
  {
    id: 'self-aware',
    folderName: 'self-aware-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'Self Aware Studio',
    subtitle: 'Spatial CAD Bounding Boxes & Tri-Color Identity Sequencer',
    versionOrSource: 'Awwwards SOTD · DESIGN-SYSTEM.md & ANIMATION-AND-3D.md',
    description: 'Tactile design engineering spatial gizmos, tri-color sequence array (#EB2CD1 magenta, #00B4FF cyan, #FF5403 orange), and kinetic typography.',
    tokens: {
      palette: {
        'sa-magenta': '#EB2CD1',
        'sa-cyan': '#00B4FF',
        'sa-orange': '#FF5403',
        'sa-crimson': '#E43939',
        'sa-gold': '#B68F42',
        'sa-cobalt': '#267FEB',
      },
      typography: {
        heading: 'TeX Gyre Schola Serif + TeX Gyre Heros Grotesk',
        body: 'Technical CAD Monospace with CLS override metrics',
      },
      geometry: {
        borderWidth: '1px solid #000000',
      },
    },
    motion: {
      engine: 'Three.js Spatial Raycast Gizmos & Normalized Mouse Tilt',
      easings: ['linear lerp(0.08)'],
      fpsTarget: 60,
      physicsModel: 'Rotational 3D tilt (rotX: +-6deg, rotY: +-8deg) matching unprojected cursor ray',
      keyChoreography: 'Floating CAD measurement ticks, dimension bounding boxes, and kinetic typography.',
    },
    blueprintSummary: [
      'Reverse-Engineering spatial gizmos surrounding 3D project monoliths.',
      'Tri-color sequence palette cycling through magenta, cyan, and high-saturation orange.',
    ],
    prompts: ['Embed CAD measurement crosshairs and bounding boxes in ProjectMonolith and HUD.'],
  },
];
