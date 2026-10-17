// src/config/research.config.ts

export interface ResearchStudy {
  id: string;
  folderName: string;
  category: 'GAME_APP' | 'INTERACTIVE_WEB' | 'WEB_ARCHITECTURE';
  title: string;
  targetAppOrSite: string;
  subjectDomain: string;
  evidenceSource: string;
  summary: string;
  coreInsights: string[];
  extractedTokens: Record<string, string>;
  motionSpecs: {
    engine: string;
    easings: string[];
    fps: number;
    physicsRule?: string;
  };
  shaderSpecs?: {
    type: string;
    technique: string;
  };
  blueprintChecklist: string[];
  samplePrompt: string;
}

export const RESEARCH_STUDIES: ResearchStudy[] = [
  // 1. GAME & MAJOR APP STUDIES
  {
    id: 'brawl-stars-analysis',
    folderName: 'brawl-stars-analysis',
    category: 'GAME_APP',
    title: 'Brawl Stars Client Architecture',
    targetAppOrSite: 'Brawl Stars (Supercell, v69.414)',
    subjectDomain: 'Game UI & Tactile Micro-Interactions',
    evidenceSource: 'assets/csv_client/color_gradients.csv, client_globals.csv',
    summary: 'Deconstruction of Supercell’s iconic tactile mobile design system: 14-18px beveled squircles, Lilita One 4-stroke black outlines with downward solid drop-shadows, and multi-stop gradient matrices.',
    coreInsights: [
      'Button geometry features a 4-8px darker bottom lip bevel (#D69B00) that collapses (translateY: 4px) upon pointer down for zero-latency tactile feedback.',
      'Extracted verified gradient arrays: FreeOffer (#9FFF72->#68E524->#E0FFA0), Golden (#FFFABC->#FFD12E->#F29928), and Hypercharge Purple (#FABCFF->#D12EFF->#9928F2).',
      'Minimum touch targets are rigorously pegged to 54x54dp to eliminate mis-taps on high-DPI smartphone displays.',
    ],
    extractedTokens: {
      'Primary Yellow': '#FFD12E',
      'Yellow Shadow': '#D69B00',
      'Gem Green': '#00C74B',
      'Power Pink': '#F931A3',
      'Coin Gold': '#F29928',
      'Ranked Cyan': '#20FBFF',
    },
    motionSpecs: {
      engine: 'Stage3D Native Sprite Engine',
      easings: ['cubic-bezier(0.18, 0.89, 0.32, 1.28)', 'spring-pop-down(4px)'],
      fps: 60,
      physicsRule: 'Active press down collapses bottom bevel by 4px before triggering touchup event.',
    },
    blueprintChecklist: [
      'Brawler loadout card with -skew-x-12 angles and solid high-contrast drop-shadows.',
      'Rarity tier grading matrix (LEGENDARY, MYTHIC, EPIC, SUPER RARE) matching Supercell palette.',
      'Progress fill interpolation with gloss reflection overlay.',
    ],
    samplePrompt: 'Implement skewed Brawl Stars loadout card with -skew-x-12 angle and lilita text-shadow outline.',
  },
  {
    id: 'clash-of-clans-analysis',
    folderName: 'clash-of-clans-analysis',
    category: 'GAME_APP',
    title: 'Clash of Clans Base Architecture',
    targetAppOrSite: 'Clash of Clans (Supercell)',
    subjectDomain: '2.5D Isometric Engine & Resource State Machines',
    evidenceSource: 'assets/ui/ui_component_library/common_text_styles.json & common_buttons.json',
    summary: 'Reverse-engineering of Supercell’s 2.5D isometric Cartesian-to-screen matrix math, Town Hall building level state machines, and authentic dialog component libraries.',
    coreInsights: [
      'Transformed 3D Cartesian world coordinates into 30°/60° isometric screen-space coordinates with depth sorting.',
      'Button geometry requires 3px #5B2B04 outer borders, 2px #FFF799 top bevel highlights, and Supercell-Magic 25px headings with continuous black outlines.',
      'Resource economy palette differentiates standard Elixir Magenta (#D728A3) from Dark Elixir Black-Violet (#251C33 / #7642A8) and Modern Ores (Shiny #3AA4EB, Glowy #DC4DF0, Starry #F7C434).',
    ],
    extractedTokens: {
      'Clash Gold': '#FEE75C',
      'Elixir Magenta': '#D728A3',
      'Dark Elixir': '#7642A8',
      'Wood Brown': '#422616',
      'Parchment': '#FFF5DE',
      'Starry Ore': '#F7C434',
    },
    motionSpecs: {
      engine: 'Supercell TimelineManager & Isometric Camera Slerp',
      easings: ['ease-out-back', 'cubic-bezier(0.25, 1, 0.5, 1)'],
      fps: 60,
      physicsRule: 'High-altitude isometric slerp interpolation to coordinates [75, 88, -45].',
    },
    blueprintChecklist: [
      'Town Hall upgrade level hierarchy governing platform scale, trim materials, and emissive intensity.',
      'Resource progress bar with glossy white gradient reflection at y: [5, 9].',
    ],
    samplePrompt: 'Switch camera to high-angle 30°/60° isometric village overview with smooth slerp vector lerping.',
  },
  {
    id: 'reddit-engineering-template',
    folderName: 'reddit-engineering-template',
    category: 'GAME_APP',
    title: 'Reddit Engineering Architecture',
    targetAppOrSite: 'Reddit Client & Apollo Cache',
    subjectDomain: 'Recursive Virtualization & Optimistic Karma State',
    evidenceSource: 'com.reddit.frontpage_2026.41.0 decompiled APK & Apollo GraphQL Cache',
    summary: 'Analysis of infinite nested comment tree virtualization, optimistic score locks with rollback on network timeout, and flair tag inheritance across Android viewports.',
    coreInsights: [
      'Recursive self-referential JSON comment nodes with memoized subtrees preventing re-renders beyond active branch.',
      'Optimistic vote update cache coupled with hysteresis dampening eliminates vote-thrashing on erratic network links.',
      'CSS vertical border indent lines dynamically calculate depth contrast for nested child conversations.',
    ],
    extractedTokens: {
      'Reddit Orange': '#FF4500',
      'Upvote Orange': '#FF5500',
      'Downvote Periwinkle': '#7193FF',
      'Dark Surface': '#0E1113',
      'Card Surface': '#1A1A1B',
    },
    motionSpecs: {
      engine: 'React Virtualized / Optimistic Cache State Machine',
      easings: ['cubic-bezier(0.2, 0, 0, 1)'],
      fps: 60,
    },
    blueprintChecklist: [
      'Self-referential recursive comment tree with author flair chips.',
      'Instant optimistic score toggle with local state persistence.',
    ],
    samplePrompt: 'Structure engineering post-mortems with nested comment components, upvotes, and flair tags.',
  },
  {
    id: 'reddit-base',
    folderName: 'reddit',
    category: 'GAME_APP',
    title: 'Reddit Decompiled Base',
    targetAppOrSite: 'Reddit Android APK (base.apk)',
    subjectDomain: 'Native Android Layouts & Memory Profiles',
    evidenceSource: 'analysis-report.md, ARCHITECTURE.md, DecompileRedditMain.java',
    summary: 'Raw decompiled reference analyzing Android RecyclerView layout managers, background sync workers, and image downsampling pipelines.',
    coreInsights: [
      'RecyclerView item recycling and view-holder pool caching for smooth scrolling across 1,000+ thread posts.',
      'Volley/OkHttp disk LRU eviction preventing OOM errors during infinite media scroll.',
    ],
    extractedTokens: {
      'Brand Red': '#FF4500',
      'Feed Scrim': '#121212',
    },
    motionSpecs: {
      engine: 'Android RecyclerView LayoutManager',
      easings: ['decelerate'],
      fps: 60,
    },
    blueprintChecklist: ['Memory recycling patterns for infinite list rendering.'],
    samplePrompt: 'Implement memory-efficient nested post-mortem logs.',
  },
  {
    id: 'instagram-engineering-template',
    folderName: 'instagram-engineering-template',
    category: 'GAME_APP',
    title: 'Instagram Stories & Reels Architecture',
    targetAppOrSite: 'Instagram Android Client',
    subjectDomain: 'Gradient Stroke Interpolation & Video Snap Physics',
    evidenceSource: 'com.instagram.android_449.0.0 decompiled APK & Video Feed Pipeline',
    summary: 'Deconstruction of SVG gradient stroke-dasharray animations on active story rings, viewport intersection snap physics, and zero-layout-shift preview cards.',
    coreInsights: [
      'Circular SVG conic gradient rings (#FCAF45 -> #FF2A85 -> #833AB4) pulse with cubic-bezier ease on active sector warp.',
      'IntersectionObserver thresholding triggers pre-buffering of next slide before the user reaches boundary.',
    ],
    extractedTokens: {
      'Story Yellow': '#FCAF45',
      'Story Pink': '#FF2A85',
      'Story Purple': '#833AB4',
      'Story Cyan': '#00F5D4',
    },
    motionSpecs: {
      engine: 'CSS Keyframes & SVG Stroke Dashoffset Interpolation',
      easings: ['cubic-bezier(0.19, 1, 0.22, 1)'],
      fps: 60,
    },
    blueprintChecklist: ['Circular multi-stop gradient border ring highlighting active 3D sector.'],
    samplePrompt: 'Connect Instagram Stories top ring bar to direct sector teleportation in world store.',
  },
  {
    id: 'instagram-base',
    folderName: 'instagram',
    category: 'GAME_APP',
    title: 'Instagram Decompiled Base',
    targetAppOrSite: 'Instagram APK (base.apk)',
    subjectDomain: 'Native Android Media Framework & BlurHash',
    evidenceSource: 'LauncherActivity_decompiled.java, UI-REFERENCE.md, info.json',
    summary: 'Raw decompiled reference analyzing Instagram Android media pipeline, BlurHash placeholder decoding, and native touch gesture handling.',
    coreInsights: [
      'BlurHash / Low-Quality Image Placeholder (LQIP) pipeline preventing jarring layout shifts during high-res image loads.',
    ],
    extractedTokens: {
      'Pure Black': '#000000',
      'Pure White': '#FFFFFF',
    },
    motionSpecs: {
      engine: 'Android MediaCodec / TextureView',
      easings: ['linear'],
      fps: 60,
    },
    blueprintChecklist: ['Blurhash prefetching and instant image carousel buffering.'],
    samplePrompt: 'Implement instant image thumbnail preloading for portfolio screenshots.',
  },

  // 2. INTERACTIVE & WEB ENGINEERING TEMPLATES
  {
    id: 'abeto-messenger-template',
    folderName: 'abeto-messenger-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Messenger by Abeto',
    targetAppOrSite: 'messenger.abeto.co (Awwwards SOTD)',
    subjectDomain: 'Character-Led Exploration & Companion Drones',
    evidenceSource: 'evidence/npcs.json, evidence/quests.json, GAMEPLAY-SPECIFICATION.md',
    summary: 'Playful character-led exploration pipeline featuring a floating autonomous companion drone that navigates along spline rails with banking and roll physics.',
    coreInsights: [
      'Autonomous guide companion flies ahead of camera with dynamic roll banking (rotZ = -pointer.x * 0.5, rotX = pointer.y * 0.3).',
      'Proximity triggers detect player radius < 4 units to pop up interactive speech bubble talk prompts.',
      'Expressive NPC dialogues with distinct personalities, sound bleeps, and mission log tracking.',
    ],
    extractedTokens: {
      'Abeto Orange': '#FF5500',
      'Abeto Glow': '#FF2A00',
      'Abeto Cyan': '#00F5D4',
      'Abeto Dark': '#0A0C14',
    },
    motionSpecs: {
      engine: 'Three.js useFrame / Catmull-Rom Spline Tracker',
      easings: ['lerp(prev, target, dt * 8)'],
      fps: 60,
      physicsRule: 'Drone follows lookAhead t+0.024 with sin(time*3.8)*0.35 vertical hover bob.',
    },
    blueprintChecklist: [
      'Octahedron drone core with concentric dual gimbal rings spinning on Y and Z axes.',
      'Dynamic point light with distance 10.0 illuminating terrain path.',
    ],
    samplePrompt: 'Render floating guide companion ahead of player with pointer banking in CameraRig.',
  },
  {
    id: 'display-studio-template',
    folderName: 'display-studio-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Display Studio Interface',
    targetAppOrSite: 'display-studio.com (Awwwards SOTD)',
    subjectDomain: 'Fluid Viewport Typography & Coral Gradients',
    evidenceSource: 'DESIGN-SYSTEM.md, ANIMATION-AND-MOTION.md',
    summary: 'Accessible, high-WPO interface featuring fluid VW scaling mathematics, warm coral-to-amber accents (#FF667D -> #FF9776), and keyboard fast navigation.',
    coreInsights: [
      'Fluid typography scaling formula: (targetPixels / 1440) * 100vw ensuring proportional hierarchy across ultrawide and mobile.',
      'High-contrast 19.8:1 WCAG AAA text contrast standards with warm cream canvases (#F9F5ED).',
    ],
    extractedTokens: {
      'Cream Canvas': '#F9F5ED',
      'Dark Charcoal': '#353941',
      'Coral Brand': '#FF667D',
      'Orange Accent': '#FF9776',
      'Accessible Teal': '#00BEA9',
    },
    motionSpecs: {
      engine: 'GSAP 3.12 Flip & CSS Transitions',
      easings: ['cubic-bezier(0.25, 1, 0.5, 1)'],
      fps: 60,
    },
    blueprintChecklist: ['Fluid drawer expand-and-wipe navigation with keyboard Tab accessibility.'],
    samplePrompt: 'Apply warm coral/amber highlights to secondary UI pills and drawer headers.',
  },
  {
    id: 'dont-board-me-template',
    folderName: 'dont-board-me-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: "Don't Board Me Motion Systems",
    targetAppOrSite: 'dont-board-me.com (Awwwards SOTD)',
    subjectDomain: 'Playful Physics Props & Signature Easing',
    evidenceSource: 'ANIMATION-AND-MOTION.md, DESIGN-SYSTEM.md',
    summary: 'Playful physics props, SplitText rotational line swing reveals, and signature cubic-bezier(0.25, 1, 0.5, 1) aggressive deceleration curves.',
    coreInsights: [
      'Custom easing curve --my-ease: cubic-bezier(0.25, 1, 0.5, 1) provides organic tactile deceleration on modals and sliders.',
      'Two-tier masked SplitText heading reveals with rotational settling (+30deg to 0deg).',
    ],
    extractedTokens: {
      'Vibrant Yellow': '#FFE600',
      'Dark Carbon': '#1C1C1E',
      'Positive Green': '#34C759',
    },
    motionSpecs: {
      engine: 'GSAP 3.12 SplitText & Lenis Smooth Scroll',
      easings: ['cubic-bezier(0.25, 1, 0.5, 1)', 'bounce.out'],
      fps: 60,
      physicsRule: 'Bouncy tennis ball impact physics and rotational headline swing (+30deg to 0deg).',
    },
    blueprintChecklist: ['Custom ease token --my-ease for smooth modal transitions.'],
    samplePrompt: 'Implement signature cubic-bezier(0.25, 1, 0.5, 1) on all HUD drawers and modal transitions.',
  },
  {
    id: 'into-the-amazon-template',
    folderName: 'into-the-amazon-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Into The Amazon LiDAR Pipeline',
    targetAppOrSite: 'Into The Amazon (Awwwards SOTY Nominee)',
    subjectDomain: '28,000 GPU Point-Cloud LiDAR Canyon',
    evidenceSource: 'ANIMATION-AND-STORYTELLING.md, DESIGN-SYSTEM.md',
    summary: 'Photogrammetric GPU LiDAR point cloud fly-through with gold-to-cyan elevation ramps, elevation wave math, and continuous narrative scroll choreography.',
    coreInsights: [
      '28,000 points additive GPU buffer geometry mapped along canyon valley using elevation formula pow(abs(x)*0.075, 1.8) + sin(z*0.08)*2.5 - 5.0.',
      'Two-tone color lerp from cyber cyan (#00F5D4) to Amazon gold (#FFD800) based on point altitude.',
      'Sweeping radar beam traveling along Z-axis in sync with elapsed time and user scroll depth.',
    ],
    extractedTokens: {
      'LiDAR Gold': '#FFD800',
      'Cyber Cyan': '#00F5D4',
      'Emerald Mist': '#00C853',
      'Clay Ochre': '#D87D4A',
    },
    motionSpecs: {
      engine: 'Direct 1:1 Scroll Coupling with Three.js Points Material',
      easings: ['linear scrub with lerp(0.1)'],
      fps: 60,
      physicsRule: 'Perspective attenuation (80.0 / -mvPosition.z) with circular soft disc alpha falloff.',
    },
    shaderSpecs: {
      type: 'Points Shader Material',
      technique: 'Point coord circular soft falloff (smoothstep(0.5, 0.05, dist)) + radar beam sweep pulse.',
    },
    blueprintChecklist: ['28,000 points additive GPU buffer geometry with elevation color ramps.'],
    samplePrompt: 'Implement LidarPointMaterial with elevation wave and scanline pulse in LidarTerrain.tsx.',
  },
  {
    id: 'landonorris-template',
    folderName: 'landonorris-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Lando Norris Racing Telemetry',
    targetAppOrSite: 'landonorris.com (Awwwards SOTM)',
    subjectDomain: 'F1 Telemetry HUD & Lenis Lerp 0.1',
    evidenceSource: 'DESIGN-SYSTEM.md, ANIMATION-SPECIFICATION.md',
    summary: 'High-speed F1 telemetry HUD featuring real-time scroll velocity calculations in KM/H, Studio Freight Lenis lerp 0.1 damping, and acid-lime accents.',
    coreInsights: [
      'Fixed viewport corner telemetry blocks displaying VELOCITY (KM/H), DEPTH (%), FPS, and sector coordinates.',
      'High-contrast palette pairing deep racing dark-green (#282c20) with neon lime (#d2ff00) and McLaren papaya (#ff6b00).',
    ],
    extractedTokens: {
      'Dark Green': '#282c20',
      'Neon Lime': '#d2ff00',
      'McLaren Papaya': '#ff6b00',
      'Warm White': '#f4f4ed',
      'Carbon Black': '#111112',
    },
    motionSpecs: {
      engine: 'Studio Freight Lenis (lerp: 0.1, smoothWheel: true) + GSAP SplitText',
      easings: ['cubic-bezier(0.19, 1, 0.22, 1)'],
      fps: 60,
      physicsRule: 'Velocity scalar: abs(currentScroll - prev) / dt * 1250 (KM/H).',
    },
    blueprintChecklist: ['F1 telemetry HUD with real-time velocity in KM/H and depth percentage.'],
    samplePrompt: 'Build TelemetryHud.tsx with live KM/H velocity calculation and fixed viewport racing chrome.',
  },
  {
    id: 'lusion-template',
    folderName: 'lusion-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Lusion Graphics & Physics Pipeline',
    targetAppOrSite: 'lusion.co (Awwwards Studio of the Year)',
    subjectDomain: 'Newtonian Gravity & MeshTransmission Refraction',
    evidenceSource: '3D-PIPELINE.md, main.js decompile',
    summary: 'Analytical Newtonian mechanics simulation with central harmonic gravity pull (-40 * p), exponential velocity drag (0.2^dt), and fluid pointer raycasting force fields.',
    coreInsights: [
      'Harmonic gravity field F_grav = -40 * p constrains objects around origin.',
      'Exponential drag damping v *= 0.2^dt creates organic, heavy fluid deceleration.',
      'Pointer unprojected world raycast imparts localized deflection vectors to floating geometry.',
    ],
    extractedTokens: {
      'Lusion Ice Blue': '#8BC34A',
      'Lusion Violet': '#9C27B0',
      'Lusion Dark': '#0B0D13',
    },
    motionSpecs: {
      engine: 'Analytical Newtonian Integration (F / m * (1 + friction))',
      easings: ['Exponential Drag: v *= 0.2^dt'],
      fps: 60,
      physicsRule: 'F_grav = -40 * p; a = F / (m * (1 + mu)); v += a * dt; p += v * dt.',
    },
    blueprintChecklist: ['Inertia-damped CatmullRomCurve3 spline traversal with pointer parallax.'],
    samplePrompt: 'Implement Lusion harmonic gravity and exponential drag equations in CameraRig traversal.',
  },
  {
    id: 'pixelflakes-template',
    folderName: 'pixelflakes-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Pixelflakes Blueprint Architecture',
    targetAppOrSite: 'pixelflakes.com (Awwwards SOTD)',
    subjectDomain: 'Architectural Blueprint Wireframe Extrusion',
    evidenceSource: 'COMPONENT-INVENTORY.md, DESIGN-SYSTEM.md',
    summary: 'Architectural blueprint sketch boot sequence where CAD crosshairs and wireframe lines extrude into solid shaded 3D geometry as assets reach 100%.',
    coreInsights: [
      'Blueprint sketch grid background with technical CAD crosshair markers in viewport corners.',
      'Dynamic terminal boot log reporting diagnostic pipeline compiler progress from 0% to 100%.',
    ],
    extractedTokens: {
      'Blueprint Blue': '#0055FF',
      'CAD Amber': '#FFD800',
      'CAD White': '#FFFFFF',
    },
    motionSpecs: {
      engine: 'GSAP 3.12 SVG Path Stroke-Dashoffset & Three.js Morph Targets',
      easings: ['power2.inOut'],
      fps: 60,
    },
    blueprintChecklist: ['Preloader boot screen with architectural viewport crosshairs and pipeline diagnostics.'],
    samplePrompt: 'Build Preloader.tsx with Pixelflakes architectural blueprint grid and dynamic boot logs.',
  },
  {
    id: 'why-zero-university-template',
    folderName: 'why-zero-university-engineering-template',
    category: 'INTERACTIVE_WEB',
    title: 'Why Zero University Systems',
    targetAppOrSite: 'why.zero.university (Zero University & BUNQ LABS)',
    subjectDomain: 'Primordial Mint Gradient & Timeline Rulers',
    evidenceSource: 'evidence/main.css, evidence/main.js, DESIGN-SYSTEM.md',
    summary: 'Luminous mint atmospheric gradient (#D4F6EB to #1C4839), calibrated horizontal timeline rulers (-100 BZ to 0 BZ), and tactical sci-fi minimalism.',
    coreInsights: [
      'Primordial mint radial gradient (#bg-gradient) mathematically matched behind WebGL canvas preventing white pre-paint flash.',
      'Tactical horizontal timeline ruler measuring spline depth and chronometry from -100 BZ to 0 BZ.',
    ],
    extractedTokens: {
      'Luminous Mint': '#D4F6EB',
      'Mint Mist': '#B3DED1',
      'Celadon Frost': '#91C7B7',
      'Deep Spruce': '#356F5E',
      'Obsidian Pine': '#1C4839',
    },
    motionSpecs: {
      engine: 'Custom WebGL Fragment bgPass & Smooth Scroll Ticker',
      easings: ['cubic-bezier(0.16, 1, 0.3, 1)'],
      fps: 60,
    },
    blueprintChecklist: ['Primordial mint radial gradient preventing white pre-paint flash.'],
    samplePrompt: 'Integrate Why Zero University mint gradient into preloader and background shader passes.',
  },

  // 3. WEB ARCHITECTURE & EXPERIENCE ANALYSIS PACKAGES
  {
    id: 'igloo-inc-analysis',
    folderName: 'igloo-inc-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'Igloo Inc. Shader Engine',
    targetAppOrSite: 'igloo.inc (Awwwards Site of the Year)',
    subjectDomain: '5-Iteration Chromatic Aberration & Ice Refraction',
    evidenceSource: 'evidence/App3D-d68cb154.js block [52], ANIMATION-AND-3D.md',
    summary: 'Offscreen multi-FBO compositing, 5-iteration chromatic aberration blending shader, IOR 1.18 pure ice refraction, and blue noise dithering.',
    coreInsights: [
      '5-Iteration chromatic aberration dispersion loop (#define CA_ITERATIONS 5) creates realistic spectral edge fringing.',
      'IOR 1.18 pure ice refractive index with Fresnel rim falloff pow(1.0 - dot(V, N), 2.85).',
      'Velocity slope displacement shifts vertex normals proportional to scroll acceleration.',
    ],
    extractedTokens: {
      'Ice Base': '#08121C',
      'Facet Cyan': '#00F5D4',
      'Vein Blue': '#64B5F6',
      'Glint Sparkle': '#FFFFFF',
    },
    motionSpecs: {
      engine: 'Navier-Stokes GPU Fluid Physics & Scroll Velocity Disp',
      easings: ['linear with slopeDisp = (scrollTex.b * 2.0 - 1.0) * 0.4'],
      fps: 60,
      physicsRule: 'Proximity melt formula: clamp(1.0 - (dist - 8.0) / 14.0, 0, 1).',
    },
    shaderSpecs: {
      type: 'GLSL Procedural Crystal + Chromatic Aberration Shader',
      technique: 'hash31 facet quantization + 5-iteration spectral dispersion + blue noise dithering.',
    },
    blueprintChecklist: ['IceCrystalShader with 3D hash facet growth and proximity melt outward shatter.'],
    samplePrompt: 'Implement IceCrystalShader.ts matching Igloo Inc block [52] chromatic dispersion and facet math.',
  },
  {
    id: 'other-side-of-truth-analysis',
    folderName: 'other-side-of-truth-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'The Other Side of Truth Engine',
    targetAppOrSite: 'The Other Side of Truth (Awwwards SOTY)',
    subjectDomain: 'Dual Perspective X-Ray Flip & WebGL Noise Grain',
    evidenceSource: 'evidence/51256c7.js, ANIMATION-AND-MOTION.md',
    summary: 'Dual narrative perspective flip driven by a custom WebGL noise grain shader, transitioning between surface representation and underlying wireframe reality.',
    coreInsights: [
      'Global [R] key toggle flips all 3D monoliths into raw UV wireframe and shader debug grids using screen-space fwidth(vUv * 24.0) derivatives.',
      'Procedural noise grain shader (rand(vUv + uSeed) - 0.5) * uNoise adds tactile photographic texture.',
    ],
    extractedTokens: {
      'Truth Yellow': '#ECD06F',
      'Truth Red': '#DA1111',
      'Wireframe Cyan': '#00F5D4',
      'X-Ray Dark': '#05060A',
    },
    motionSpecs: {
      engine: 'GSAP 3.15 ScrollTrigger Slit-Scan Parallax & Shader Uniform Toggles',
      easings: ['power2.inOut'],
      fps: 60,
    },
    shaderSpecs: {
      type: 'Noise Grain & UV Wireframe Grid Shader',
      technique: 'fwidth(vUv * 24.0) screen-space derivative grid line calculation.',
    },
    blueprintChecklist: ['Global X-Ray mode stripping textures to reveal underlying CAD wireframes.'],
    samplePrompt: 'Implement [R] X-Ray mode in useWorldStore and inject fwidth wireframe shader branch.',
  },
  {
    id: 'self-aware-analysis',
    folderName: 'self-aware-analysis',
    category: 'WEB_ARCHITECTURE',
    title: 'Self Aware Studio Systems',
    targetAppOrSite: 'selfaware.studio (Awwwards SOTD)',
    subjectDomain: 'Spatial CAD Bounding Boxes & Tri-Color Sequencer',
    evidenceSource: 'technical-measurements.json, DESIGN-SYSTEM.md, ANIMATION-AND-3D.md',
    summary: 'Tactile design engineering spatial gizmos, tri-color sequence array (#EB2CD1 magenta, #00B4FF cyan, #FF5403 orange), and kinetic typography.',
    coreInsights: [
      'Rotating wireframe bounding-box gizmos (boxGeometry args={[4.8, 4.8, 4.8]}) frame interactive monuments.',
      'Tri-color sequence palette cycles magenta, cyan, and tangerine orange accents across metadata tags.',
    ],
    extractedTokens: {
      'Neon Magenta': '#EB2CD1',
      'Vivid Cyan': '#00B4FF',
      'Tangerine Orange': '#FF5403',
      'Crimson Red': '#E43939',
      'Antique Gold': '#B68F42',
      'Cobalt Blue': '#267FEB',
    },
    motionSpecs: {
      engine: 'Three.js Spatial Raycast Gizmos & Normalized Mouse Tilt',
      easings: ['linear lerp(0.08)'],
      fps: 60,
      physicsRule: 'Rotational 3D tilt (rotX: +-6deg, rotY: +-8deg) matching unprojected cursor ray.',
    },
    blueprintChecklist: ['Reverse-Engineering spatial gizmos surrounding 3D project monoliths.'],
    samplePrompt: 'Embed CAD measurement crosshairs and bounding boxes in ProjectMonolith and HUD.',
  },
];
