# ∞ Bhavesh Sharma — Portfolio

An animation-driven personal portfolio built around a single idea: **infinity**. A live
Three.js particle lemniscate powers the hero, backed by scroll-choreographed sections,
a custom cursor, magnetic buttons, and smooth inertia scrolling.

Built with **React + Vite**, **Three.js**, **GSAP (ScrollTrigger)**, **Framer Motion**,
and **Lenis**.

---

## Quick start

You need [Node.js](https://nodejs.org) 18 or newer (20+ recommended).

```bash
# 1. install dependencies
npm install

# 2. start the dev server (http://localhost:5173)
npm run dev

# 3. build for production
npm run build

# 4. preview the production build locally
npm run preview
```

That's it. Open the printed local URL in your browser.

---

## Deploy

The site is a static bundle (`dist/`) and deploys anywhere.

**Vercel (recommended — you already use it):**
1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → *New Project* → import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
4. Deploy.

**Netlify:** drag-and-drop the `dist/` folder, or connect the repo with the same
build settings.

**GitHub Pages:** run `npm run build` and publish the `dist/` folder. `vite.config.js`
already uses a relative `base: './'`, so it works from a subpath.

---

## Editing your content

**Everything you'd want to change lives in one file:**

```
src/data/content.js
```

Name, roles, bio, stats, skills, experience, education, projects, certifications,
and social links are all plain JavaScript objects there. Update the text and the whole
site updates — no component edits needed.

A few common tweaks:

| I want to…                     | Where                                                        |
| ------------------------------ | ----------------------------------------------------------- |
| Change any text / links        | `src/data/content.js`                                       |
| Add / remove a project         | `projects` array in `content.js`                            |
| Change the colors              | `:root` variables in `src/index.css` (`--violet`, `--cyan`) |
| Change fonts                   | `<link>` in `index.html` + `--font-*` in `src/index.css`    |
| Tune the 3D infinity animation | `src/components/InfinityScene.jsx`                          |

---

## Project structure

```
bhavesh-portfolio/
├─ index.html                 # HTML shell, fonts, meta tags, favicon (∞)
├─ package.json               # dependencies + scripts
├─ vite.config.js             # Vite + React config
├─ src/
│  ├─ main.jsx                # React entry
│  ├─ App.jsx                 # composition + preloader/scroll orchestration
│  ├─ index.css               # design tokens, reset, atmosphere, utilities
│  ├─ data/
│  │  └─ content.js           # ← all site content (edit here)
│  ├─ hooks/
│  │  ├─ useReducedMotion.js  # respects prefers-reduced-motion
│  │  └─ useSmoothScroll.js   # Lenis + GSAP ticker wiring
│  └─ components/
│     ├─ Preloader.jsx        # animated infinity intro + counter
│     ├─ Cursor.jsx           # custom dual cursor (desktop only)
│     ├─ Navbar.jsx           # sticky nav, scroll progress, mobile menu
│     ├─ Hero.jsx             # headline + Three.js scene mount
│     ├─ InfinityScene.jsx    # Three.js particle lemniscate
│     ├─ About.jsx            # bio + animated stat counters
│     ├─ Skills.jsx           # skill groups + infinite tech marquee
│     ├─ Journey.jsx          # experience/education timeline (GSAP scrub)
│     ├─ Projects.jsx         # 3D-tilt project cards
│     ├─ Certifications.jsx   # credentials list
│     ├─ Contact.jsx          # contact + footer
│     ├─ Reveal.jsx           # scroll-reveal wrapper
│     ├─ Magnetic.jsx         # magnetic hover effect
│     └─ Marquee.jsx          # seamless infinite marquee
```

---

## Accessibility & performance notes

- **Reduced motion:** if the OS has *reduce motion* enabled, the preloader is skipped,
  smooth-scroll falls back to native, the 3D scene renders a single static frame, and
  marquees/animations stop. Respected throughout.
- **Keyboard:** visible focus rings, real `<button>`/`<a>` elements, semantic sections.
- **The custom cursor** only activates on fine-pointer (mouse) devices; touch devices
  keep native behaviour.
- **The 3D scene** pauses when the tab is hidden and cleans up WebGL resources on unmount.
  If WebGL is unavailable, it fails silently and the CSS atmosphere remains.

---

Made with care by Bhavesh Sharma. ∞
