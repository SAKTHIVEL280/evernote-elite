

# PMNT — Personal Markdown Note Taker

## Design Direction
- **Palette**: Warm cream (#f5f0e8) backgrounds, deep ink (#1c1c28) text, muted navy (#3d5a80) accents, gold (#c4a35a) highlights
- **Typography**: Inter for UI, serif (Playfair Display) for headings — editorial, premium feel
- **Style**: Apple-like — massive whitespace, cinematic hero, smooth scroll animations, no clutter

---

## Pages

### 1. Landing Page (`/`)
- **Hero**: Full-viewport with large serif headline ("Your thoughts, beautifully organized."), subtle fade-in animation, single CTA button
- **Feature showcase**: 4-5 features presented one at a time with scroll-triggered reveals — each with icon, headline, short description
- **Social proof section**: Minimal testimonial cards
- **Pricing section**: 3-tier cards (Free / Pro / Team) with gold accent on recommended tier
- **Footer**: Clean links, copyright

### 2. Tutorial Page (`/tutorial`)
- Step-by-step interactive guide with markdown syntax examples
- Live preview panel showing rendered output alongside raw markdown
- Keyboard shortcuts reference card
- Tips & tricks section with collapsible items

### 3. Editor Page (`/editor`)
Power-user markdown editor with:
- **Split pane**: Raw markdown left, live preview right (resizable)
- **Toolbar**: Bold, italic, headings, lists, code blocks, links, images, tables
- **Note sidebar**: List of saved notes with search, create, delete (localStorage)
- **Keyboard shortcuts**: Ctrl+B, Ctrl+I, etc.
- **Word/character count** in status bar
- **Export**: Download as `.md` file
- **Multiple notes** management with folders/tags
- **Dark/light mode toggle** within editor
- **Auto-save** to localStorage
- **Fullscreen zen mode** for distraction-free writing

### 4. About Us Page (`/about`)
- Company mission statement with large serif typography
- Team section with avatar cards
- Timeline of product milestones
- Contact/feedback section

### 5. Global Navigation
- Sticky minimal navbar with PMNT logo, page links, dark mode toggle
- Smooth page transitions
- Mobile-responsive hamburger menu

---

## Key Details
- All data stored in **localStorage** (no backend needed)
- Markdown parsing via `react-markdown` + syntax highlighting
- Scroll animations via CSS/Framer-like transitions
- Fully responsive across all breakpoints

