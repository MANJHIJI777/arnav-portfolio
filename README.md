# ARNAV KUMAR — Video Editor & Motion Designer Portfolio

A premium, editorial, minimal portfolio website built for a high-end freelance **video editor and motion designer**.

Designed with quiet confidence, editorial typography, generous whitespace, and restrained motion. It treats video as a first-class citizen and lets the work speak with authority.

---

## 🎨 Core Design System

* **Primary Background:** `#F7F7F5` (warm editorial canvas)
* **Primary Text:** `#111111` (deep neutral black)
* **Secondary Text:** `#6B6B6B` (refined muted gray)
* **Borders & Dividers:** `#E3E3E0` (crisp 1px hairlines)
* **Dark Section:** `#111111` (high-contrast Contact section)
* **Visual Ratio:** ~90% neutral / 10% visual emphasis
* **Typography:** Inter / Geist grotesk font system with JetBrains Mono for timecodes and technical telemetry
* **Motion Pacing:** Micro-interactions (150–250ms), UI transitions (350ms), editorial reveals (700ms) with `cubic-bezier(0.16, 1, 0.3, 1)` easing.

---

## 📁 Project Structure

```
.
├── index.html                   # Homepage (Hero, Showreel, Work, Services, Process, About, Testimonials, Contact)
├── projects/
│   ├── jaaan.html               # Case Study 01: JAAAN (jaaan.mp4) - Vertical Narrative Reel
│   ├── fourth.html              # Case Study 02: FOURTH (Fourth.mp4) - Commercial Trailer
│   ├── hello2.html              # Case Study 03: HELLO 2 (Hello2.mp4) - Motion Design
│   ├── craftsmans-silence.html  # Case Study 04: Creator / Long-form Kyoto Documentary
│   ├── i75-cpa-review.html      # Flagship Brand / Education Commercial Trailer
│   ├── kinetic-echo.html        # Automotive Launch Film & Sound Design
│   └── synapse-os.html          # Spatial Hardware & UI Motion Design
├── css/
│   ├── main.css                 # Core design tokens, layout grid, typography, cursor, modals
│   └── case-study.css           # Case study layout, Before/After slider, sound design stems
├── js/
│   ├── main.js                  # Cursor physics, scroll reveals, category filter, showreel modal, email copy
│   ├── case-study.js            # Interactive Before/After split slider, sound stem toggles, video controls
│   └── cinema-canvas.js         # 60fps cinema playback engine, 35mm film grain, anamorphic flare, timecode
├── assets/                      # Real user videos and high-resolution 16:9 cinematic stills
│   ├── jaaan.mp4                # User Video 01 (Vertical 9:16 Narrative Edit)
│   ├── Fourth.mp4               # User Video 02 (Commercial Trailer)
│   ├── Hello2.mp4               # User Video 03 (Motion & Rhythm)
│   ├── showreel_poster.jpg
│   ├── project_cpa_review.jpg
│   ├── project_kinetic_echo.jpg
│   ├── project_craftsman.jpg
│   ├── project_synapse.jpg
│   ├── editor_portrait.jpg
│   ├── log_raw_footage.jpg
│   └── graded_final_cut.jpg
├── server.rb                    # Zero-dependency local preview server
└── README.md
```

---

## ⚡ Key Features

1. **Editorial Hero & Micro-Details**:
   * Headline: *"I EDIT STORIES THAT HOLD ATTENTION."*
   * Location indicator: *"BASED IN INDIA — AVAILABLE WORLDWIDE"*
   * Status pill: *"AVAILABLE FOR WORK"*

2. **Featured Showreel (Centerpiece)**:
   * 16:9 aspect ratio with subtle 6px corner radius and hairline border.
   * Minimal circular play button with 24 FPS and 4K badges.
   * Hover scale (1.02x) and smooth transition into full cinematic modal with play/pause, timecode counter (`00:00:00:00`), and interactive scrubber.

3. **Selected Work (Two-Column Grid)**:
   * Editorial typography cards with project index, category, title, description, and year.
   * Interactive hover state: 1.03x thumbnail zoom, darkened overlay, and `"VIEW CASE STUDY →"` badge.
   * Category filter pills: `ALL (04)`, `COMMERCIAL`, `BRAND & MOTION`, `DOCUMENTARY`.

4. **Deep Editorial Case Studies**:
   * **The Project**: Strategic challenge and context.
   * **My Role**: Tags (Video Editing, Motion Graphics, Sound Design, Color Grading, Storytelling).
   * **The Approach**: 2–3 editorial paragraphs explaining cut rhythm, narrative arc, and audio pacing.
   * **Interactive Before / After Slider**: Draggable comparison between raw camera log (ARRI Log C / S-Log3) and final master film emulsion (Kodak 2383).
   * **Motion Graphics & Kinetic Systems**: Vector HUD specs, easing curves, and lower-third typography metrics.
   * **Color Science**: DaVinci Resolve CST node graph, highlight shoulder knee at 85 IRE, and hex swatches.
   * **Sound Design Multi-Track Stems**: Individual interactive Mute / Solo toggles and live audio waveforms for Dialogue, Foley/Impacts, Atmosphere, and Score.
   * **Next Project Banner**: Seamless editorial navigation to the next case study.

5. **Services ("WHAT I DO")**:
   * Clean vertical list format with subtle hover state and animated arrows.
   * Short-form, Long-form, Commercial, Motion Design, Color & Sound.

6. **Process ("FROM RAW FOOTAGE TO FINAL CUT")**:
   * Four-step typographic progression: Understand → Structure → Refine → Deliver.

7. **About ("A LITTLE ABOUT ME")**:
   * Professional black & white studio portrait at DaVinci Resolve console.
   * Thoughtful, confident statement on editing as musical arrangement.
   * Software suite proficiency tags.

8. **Contact (Dark Contrast Section `#111111`)**:
   * Deep neutral black background with white typography.
   * `"START A PROJECT →"` inquiry modal with project category and budget tier selectors.
   * Interactive one-click email copy button with toast notification (`workwitharnav.creative@gmail.com`).
   * Live local timecode in Indian Standard Time (`IST / UTC+05:30`).

9. **Custom Cursor**:
   * Fluid desktop cursor that reveals `"VIEW →"` or `"PLAY REEL"` near media elements, auto-disabled on touch devices.

---

## 🚀 How to Run Locally

You can run the portfolio in any of the following ways:

### Option A: Double-Click
Simply double-click `index.html` in your file browser (Finder) to open it directly in Safari, Chrome, Firefox, or Edge.

### Option B: Local Ruby Server
Run the included lightweight zero-dependency server:
```bash
ruby server.rb
```
Then visit: `http://localhost:3000`

---

## 🎬 How to Add Real Video Files (.mp4 / .webm)

The codebase is built video-first:
* Place your `.mp4` or `.webm` files inside the `assets/` folder (e.g., `assets/showreel.mp4`, `assets/cpa_review.mp4`).
* In `index.html` or the case studies, simply add the `src` attribute to the `<video>` or `modalShowreelVideo` element:
  ```html
  <video src="assets/showreel.mp4" poster="assets/showreel_poster.jpg" playsinline muted loop></video>
  ```
* When no video file is specified, the built-in **CinemaCanvasEngine** automatically generates 60fps cinematic playback with real-time 35mm film grain, anamorphic light shifts, and frame-accurate timecode scrubbing.
