# CampusOS — Connect. Learn. Exchange. Grow.

> **Team**: FirstByte  
> **Hackathon**: Syrus 7.0  
> **Problem Statement**: PS-04 (Student Campus Ecosystem & Academic Exchange)  
> **Repository**: [CampusOS on GitHub](https://github.com/FirstByte/CampusOS)

---

## 🎯 Executive Summary & Problem Solved

College campuses suffer from fractured student communication:
* Academic notes and university PYQs (Previous Year Questions) get lost in fleeting WhatsApp group threads and expired Drive links.
* Expensive textbooks, lab coats, and scientific calculators sit idle in dorms instead of circulating to juniors who need them.
* Peer mentoring is hard to organize, forcing students to pay for generic third-party courses instead of swapping knowledge with talented batchmates.
* Campus hackathons, research lab assistantships, and club meetups suffer from low discoverability.

**CampusOS** unifies the student experience into a single, cohesive, modern platform:
$$\textbf{Connect} \longrightarrow \textbf{Learn} \longrightarrow \textbf{Exchange} \longrightarrow \textbf{Grow}$$

---

## 🚀 Key Features & Modules

### 1. 🔍 Campus Connect (`students.html`)
* Search and filter student profiles by branch, graduation year, technical skills, and research interests.
* Dynamic connection lifecycle: `Connect` $\rightarrow$ `Requested` $\rightarrow$ `Connected` with real state persistence.
* Student profile inspection modal with instant direct-note simulation.

### 2. 📚 Academic Repository (`learn.html`)
* Curated student repository for Handwritten Notes, Solved PYQs, Formula Cheatsheets, and Code Boilerplates.
* Instant educational preview modal with one-click `.txt`/`.pdf` sample file downloads.
* "Upload Resource" modal persisting new study materials and triggering campus-wide notifications.
* Community upvoting with real-time score calculation.

### 3. 🔄 Campus Exchange Marketplace (`exchange.html`)
* Student-to-student marketplace for textbooks, scientific calculators, Arduino starter kits, drafting boards, and lab gear.
* Filter by category, item condition, and deal structure (*For Sale*, *Direct Exchange / Swap*, *Free Giveaway*).
* Direct inquiry workflow notifying owners with meet-up coordinates.

### 4. ⚡ Peer Skill Exchange (`skills.html`)
* Knowledge barter system: offer your skills (e.g., Python backend APIs) in exchange for skills you want to learn (e.g., Figma UI design, DSA recursion).
* Propose 1-on-1 swaps with meeting schedule and reciprocal skill commitments.
* Community skill listing form for student mentors.

### 5. 🏆 Events & Hackathons (`events.html`)
* Campus activities feed featuring Syrus 7.0 Hackathon, AI workshops, competitive programming mock interviews, and robotics demos.
* Live seat reservation counter: toggling registration immediately claims/releases seats and updates notifications.
* Event publishing modal for student clubs and chapters.

### 6. 💼 Opportunities (`opportunities.html`)
* Curated opportunities board for tech internships, campus research assistantships, hackathon tracks, and merit scholarships.
* Detailed eligibility matrices, stipend/grant amounts, and deadline trackers.
* Integrated application modal with pitch statement and portfolio verification.

### 7. 💬 Campus Feed (`feed.html`)
* Constructive discussion feed supporting Discussions, Academic Questions, Resource Releases, and Student Achievements.
* Interactive post actions: likes, real-time nested comments drawer, bookmarks, and clipboard link sharing.

### 8. 👤 Student Profile & Preferences (`profile.html`)
* Student bio, credentials, skill badges, and research interests.
* Live tally of shared materials, registered events, and network connections.
* Profile editing modal with immediate synchronization across directory cards.

### 9. ⌘K Universal Search & Notification Center
* Global fuzzy search across all 5 campus entities (students, resources, events, opportunities, listings).
* Slide-over notifications with unread badge counter, mark as read, and clear features.
* Functional Dark / Light theme toggle stored in `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, Modern CSS, Tailwind CSS v4, Modular Vanilla ES6+ JavaScript |
| **Bundler & Dev Server** | Vite 8, `@tailwindcss/vite` |
| **Persistence MVP** | Browser `localStorage` with automated schema initialization and reset controls |
| **Deployment** | GitHub Pages via automated GitHub Actions CI/CD (`.github/workflows/deploy.yml`) |
| **Design Standard** | Universal Frontend Design Constitution (anti-AI slop, zero-pill discipline, WCAG AA compliance) |

---

## 📂 Project Architecture

```
CampusOS/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── css/
│   └── style.css               # Core CSS & Tailwind v4 theme definitions
├── data/
│   ├── students.js             # Initial verified student profiles
│   ├── resources.js            # Academic notes & PYQs dataset
│   ├── events.js               # Campus hackathons & workshops dataset
│   ├── opportunities.js        # Internships & fellowships dataset
│   ├── listings.js             # Marketplace items dataset
│   ├── skills.js               # Peer skill swaps dataset
│   └── posts.js                # Campus feed activity dataset
├── js/
│   ├── services/
│   │   ├── storage.js          # LocalStorage persistence & factory reset service
│   │   ├── auth.js             # Client-side session & demo switcher
│   │   ├── notifications.js    # Unread counter & activity dispatch
│   │   ├── search.js           # Multi-category fuzzy search engine
│   │   └── theme.js            # Dark/light mode manager
│   ├── utils/
│   │   └── ui.js               # Toast notifications & SVG avatar generator
│   ├── components/
│   │   ├── navbar.js           # Top Bar Contract, ⌘K search, notif dropdown
│   │   └── footer.js           # Hackathon credentials & demo reset
│   ├── app.js                  # Global application lifecycle
│   ├── dashboard.js            # Student dashboard controller
│   ├── students.js             # Campus Connect controller
│   ├── learn.js                # Resource sharing controller
│   ├── exchange.js             # Marketplace controller
│   ├── skills.js               # Skill barter controller
│   ├── events.js               # Event reservation controller
│   ├── opportunities.js        # Career board controller
│   ├── feed.js                 # Campus feed controller
│   └── profile.js              # Student profile controller
├── index.html                  # Landing page
├── login.html                  # Login with one-click demo switcher
├── signup.html                 # Student registration
├── dashboard.html              # Personalized dashboard
├── students.html               # Student discovery
├── learn.html                  # Academic repository
├── exchange.html               # Student exchange marketplace
├── skills.html                 # Peer skill exchange
├── events.html                 # Campus events
├── opportunities.html          # Career opportunities
├── feed.html                   # Social campus feed
├── profile.html                # Student profile
├── vite.config.ts              # Multi-page Vite configuration with base: './'
└── package.json                # Project dependencies and build scripts
```

---

## ⚡ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FirstByte/CampusOS.git
   cd CampusOS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build production bundle**:
   ```bash
   npm run build
   ```
   Generates a standalone static output in `dist/` with relative asset links ready for deployment.

---

## 🌐 Deploying to GitHub Pages

CampusOS is built from the ground up for zero-friction GitHub Pages deployment:

1. Push your changes to the `main` branch.
2. In your GitHub repository:
   * Go to **Settings** $\rightarrow$ **Pages**.
   * Under **Build and deployment** $\rightarrow$ **Source**, choose **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically trigger, build the static bundle using `npm run build`, and publish to:
   ```
   https://<USERNAME>.github.io/<REPOSITORY>/
   ```
4. Asset paths are configured with `base: './'` so all scripts, stylesheets, and pages resolve without root domain path conflicts.

---

## 🔑 Demo Credentials for Hackathon Judges

To evaluate the application instantly without manual registration:

* **Demo Account 1**:
  * Email: `aarav.sharma@campus.edu`
  * Password: `password123`
  * Role: 2nd Year Computer Engineering Student
* **Demo Account 2**:
  * Email: `ananya.patel@campus.edu`
  * Password: `password123`
  * Role: 3rd Year Design & Interaction Tech Student
* **One-Click Sign-In**: Click "👤 Aarav Sharma" or "👤 Ananya Patel" on `login.html` to enter immediately!
* **Reset Demo Data**: Click **↺ Reset Demo Data** in the footer of any page to restore initial seed data at any time.

---

## 🔮 Future Backend Architecture Roadmap

While this MVP operates purely client-side using modular services and `localStorage` to guarantee 100% serverless GitHub Pages compatibility, the data abstraction layer is decoupled:

```
[UI Components] ───► [Service Facades (auth.js, storage.js)]
                             │
          ┌──────────────────┴──────────────────┐
          ▼                                     ▼
   [Current MVP]                         [Future Production]
  Browser LocalStorage               Firebase / Supabase / PostgreSQL
```

Replacing `localStorage` with Firebase Firestore, Supabase, or a Go/Node REST backend requires modifying only the internal methods in `/js/services/` without rewriting any page UI markup or view controllers.

---

**Built with passion by Team FirstByte for Syrus 7.0 (Problem Statement PS-04).**
