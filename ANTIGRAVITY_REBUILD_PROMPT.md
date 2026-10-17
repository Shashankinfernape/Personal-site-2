# Antigravity prompt: rebuild my portfolio as a playable character-led world

You are working inside my existing portfolio repository. The current site and the two implementation plans (`IMPLEMENTATION_PLAN.md` and `Shashank_3D_Portfolio_Implementation_Plan.md`) represent an old direction that I do not want. Replace that direction and rebuild the website around the creative brief below. Do not merely polish the current design or keep its visual concept.

## The brief

Make a striking, polished portfolio that feels like stepping into a playable, illustrated world. The visitor is the player and protagonist. They move through the world, discover places, meet original characters, and those characters explain my projects and reverse-engineering work in their own voices. The emotional reference is the playful, character-led exploration of [Messenger by Abeto](https://messenger.abeto.co/): a tiny, memorable world with a guide and things to discover. Use it as inspiration for the feeling and interaction, not as a layout to copy.

This should feel like a designed experience made by an art director and a game team—not a generic developer landing page, a dashboard, a neon HUD, or a row of cards. “Real graphics” means intentional, cohesive art direction and richly rendered, expressive scenes and characters. Use strong illustration, 2.5D/3D, lighting, materials, depth, parallax, camera staging, and animation where they improve the experience. The world should look finished and authored, even when assets are built procedurally. Avoid bare primitive shapes presented as final art.

## Verified Messenger reference package

Use the actual reverse-engineering source, not a generic impression of the URL. The verified reference package is at `C:\Users\user\Desktop\El projecto\Git-repos\abeto-messenger-engineering-template`. Read `UI-REFERENCE.md`, `SITE-OVERVIEW.md`, `GAMEPLAY-SPECIFICATION.md`, `DESIGN-SYSTEM.md`, and `3D-PIPELINE.md`; inspect `screenshots/initial-viewport.png`, `screenshots/gameplay-view.png`, `screenshots/mobile-viewport.png`, and `screenshots/in-game-final.png`. The defining experience is a full-screen, cel-shaded tiny planet: an interactive title scene and yellow BEGIN action, a camera dive into play, a player navigating a spherical village, quirky NPCs explaining the story through speech bubbles, and a notebook HUD tracking deliveries. Its visual language uses warm flat shading, charcoal ink edges, handmade UI, and readable color-coded characters. Recreate these experience principles with original art and writing. Do not produce a static editorial portfolio with a guide beside a hero headline, and do not copy Messenger’s characters, assets, dialogue, exact title treatment, or world.

## My work and the research library

A major part of my identity is that I have reverse-engineered a broad set of apps and websites and documented their design systems, interaction patterns, architecture, motion, and implementation approaches. This body of work is currently missing from the portfolio concept. It is not a footnote, an Easter egg, or just four example apps. Give it a prominent, easy-to-understand place in the experience and make it feel like an explorable collection of field studies / worlds / exhibits.

The folder inventory I provided is:

### Game and major app engineering templates
- `brawl-stars-analysis/` — forensic report, implementation plan, prompts
- `clash-of-clans-analysis/` — forensic report, implementation plan, prompts
- `reddit-engineering-template/` (paired with `reddit/`)
- `instagram-engineering-template/` (paired with `instagram/`)

### Interactive and web engineering templates
- `abeto-messenger-engineering-template/`
- `display-studio-engineering-template/`
- `dont-board-me-engineering-template/`
- `into-the-amazon-engineering-template/`
- `landonorris-engineering-template/`
- `lusion-engineering-template/`
- `pixelflakes-engineering-template/`
- `why-zero-university-engineering-template/`

### Web architecture and experience analysis
- `igloo-inc-analysis/`
- `other-side-of-truth-analysis/`
- `self-aware-analysis/`

There are 17 folders in that inventory because some references have separate base, template, and analysis folders. Do not interpret that as 17 separate portfolio projects, merge duplicates destructively, or omit items to force the count to match. Explore the workspace and any available project files for the actual reports, screenshots, blueprints, and prompts. Use those materials as evidence and content. The folder names and list above are an inventory, not permission to invent findings. If a named folder or source file is unavailable, note that in your final handoff and build the interface so the missing item can be populated later.

Also keep my own software projects distinct from the reverse-engineering studies. The current `src/config/projects.config.ts` contains project material such as Handesk, Slidepaper, Examinar, Franky, Territory, SSTRAESS, and Chatflix. Inspect the repository and preserve accurate project information and working links. The portfolio should tell both stories: things I built, and the systems I studied and reconstructed.

## Experience direction

Create one coherent journey, not a collection of unrelated effects. A visitor should understand immediately that they can explore and that the characters will tell them about the work.

Suggested structure (adapt it if the repo content supports a stronger story):
1. **Arrival / title scene:** a beautiful, legible opening tableau; introduce me and the premise in a few words. Give the visitor a clear “Start exploring” action and an equally clear way to browse projects directly.
2. **Player-led exploration:** place the visitor in a compact, memorable world with a strong sense of place. The visitor should feel like the protagonist—through a visible player avatar, a guided camera perspective, or another deliberate game-like point of view. The player avatar is male and should carry a confident red-haired pirate-captain energy: long dark coat, visible scar detail, sword at the hip, relaxed self-assurance. This is a style direction inspired by the user's One Piece Shanks reference; create an original design and do not reproduce Shanks or use One Piece logos, exact costume details, or character likeness. Do not default to a female avatar. Explain movement plainly; support keyboard and pointer/touch. Do not trap the visitor in a long forced intro.
3. **Characters as storytellers:** give important projects or clusters of research an original character guide. Characters should have distinct silhouettes, expressions, poses, and concise dialogue. They explain what was studied or built, what was technically interesting, and link to a readable detail view. Original characters only; do not use copyrighted game mascots or imply an endorsement by the referenced brands.
4. **Exhibits / project details:** make it easy to inspect a project without losing the world. Use a well-designed dialogue panel, journal, or exhibit view. Include the actual problem, what I did, notable engineering/design decisions, technologies, and source links when supported by available material. Provide a fast “back to world” action.
5. **Research archive:** present all available reverse-engineering studies in a browsable, filterable collection. Group related base/template/analysis folders under the relevant subject where that prevents duplication, but preserve links or provenance to each source. Each study should have its own visual identity drawn from the research, while the overall portfolio remains cohesive.
6. **About / contact:** include concise background, GitHub, LinkedIn, email, and resume links if present in the existing source. End the journey with a clear contact invitation.

Think of the world as an interactive storybook / small adventure rather than a literal platform game. Exploration should be delightful, but recruiters must also be able to understand my work in under a minute. Provide a “Skip exploration / Browse all work” path, direct navigation, visible progress or location, and a usable reduced-motion/low-performance mode.

## Art direction

Develop a distinctive visual system before building: palette, typography, illustration/rendering style, environmental motifs, character language, UI shapes, and animation principles. The user wants a bold, colorful pirate-adventure anime direction (One Piece energy): expressive manga faces, thick ink outlines, dramatic silhouettes, hand-drawn environmental art, dynamic perspective, vivid sea blues, reds, golds, and green islands, with clear cel shading. Keep every character and world original; use the anime as a visual-language reference, not a character or asset source. Avoid photorealistic character renders, generic toy-like 3D, and soft storybook-fox art. Keep the experience high-contrast enough to read and personal to a software engineer who reverse-engineers interfaces.

Do not copy Messenger’s exact world, character designs, wording, or scene composition. Do not combine every visual reference from the old plan into a feature checklist. The references are source material, not a mandate to add a HUD, LiDAR, crystal shader, isometric village, Reddit comments, Instagram rings, rarity badges, X-ray mode, etc. Choose only details that serve the new story. Do not make the core experience look like the existing cyber-arctic crystal monolith concept.

Use rendered or illustrated assets with a consistent style. Prefer assets already in the repository or create suitable original assets/components. If external assets are needed, use assets with clear usage rights and keep the experience robust if they fail to load. Make characters feel alive with readable gestures, idle motion, reactions, and well-paced dialogue; avoid talking-head panels that are just text pasted over a scene.

## Implementation requirements

- First inspect the entire existing app, configs, available local assets, and the research folders. Treat `IMPLEMENTATION_PLAN.md` and `Shashank_3D_Portfolio_Implementation_Plan.md` as obsolete direction, not requirements. Do not spend the task revising those plans instead of rebuilding the website.
- Work in the existing React + TypeScript + Vite project. Reuse the current dependency stack where it helps; avoid adding heavy dependencies without a concrete need.
- Replace the current presentation and interaction model substantially. Keep useful factual content and metadata, but remove the old crystal-monolith / telemetry-HUD direction from the actual experience.
- Build a responsive experience that works on desktop and mobile. Provide understandable controls, keyboard access, visible focus, semantic text, adequate contrast, and a reduced-motion option. Make touch navigation intentional.
- Keep an attractive static/fallback experience if WebGL is unavailable or performance is limited. Do not make a blank screen the failure state.
- Avoid fake loading bars, fake live counters, invented benchmark numbers, unsupported claims, dead controls, placeholder copy, and “coming soon” blocks. Make every visible control work. Do not fabricate details absent from the project sources.
- Structure content as data where practical so project and character dialogue can be updated without rebuilding the scene architecture. Keep code readable and maintainable.
- Do not delete the research source folders, reports, or useful project data. The old site implementation can be replaced, but the underlying evidence and accurate portfolio content must be preserved.

## Quality bar and delivery

The finished result should be visually compelling in the first viewport and remain clear and usable throughout the journey. A visitor should quickly know who I am, how to explore, what I built, and that I have a substantial reverse-engineering library. Each character and exhibit should contribute real information rather than decoration.

Implement the experience in the repository, not just a mockup or another plan. Start by mapping the available content to scenes and characters, then build the complete site and refine the visual hierarchy and interactions. When finished, summarize what you changed, the key controls, how the experience behaves on mobile / without WebGL, and any source folders or assets you could not find. Do not claim the inventory is fully represented if you could not verify it.
