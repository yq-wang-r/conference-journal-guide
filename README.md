# 🎓 Conferences & Journals Guide for Graduate Students

## 🌐 **[Visit the Live Website](https://infocomguide-vctbpqpx.manus.space)**

### **https://infocomguide-vctbpqpx.manus.space**

---

## 📋 Overview

**Conferences & Journals Guide** is a comprehensive web application designed to help graduate students in Information and Communication Technology (ICT) fields discover, compare, and track academic conferences and journals for paper submission.

The platform aggregates **40 conferences** and **53 journals** across four major research areas:
- **Traditional Communications** (IEEE ICC, WCNC, GLOBECOM, etc.)
- **AI & Communications** (ICML, NeurIPS, ICLR, CVPR, etc.)
- **AI & Embodied Intelligence** (ICRA, IROS, RSS, HRI, etc.)
- **Additional Engineering Fields** (Optoelectronics, Aerospace, etc.)

---

## ✨ Key Features

### 🔍 **Smart Search & Filtering**
- Search by conference/journal name, keywords, or topics
- Filter by research category, difficulty level, and indexing status
- Sort by deadline (ascending/descending), popularity, or name

### 📊 **Comprehensive Indexing Information**
- **EI Indexed** (Engineering Index) - marked with green badge
- **Scopus Indexed** - marked with blue badge
- **SCI Indexed** (Science Citation Index) - marked with purple badge
- Visual legend explaining each indexing type

### ⏱️ **Real-time Countdown Timer**
- Precise deadline tracking with live countdown (days, hours, minutes, seconds)
- Automatically updates every second
- Shows "已截止" (Expired) for past deadlines
- Based on current date: January 19, 2026

### 📌 **Detailed Conference/Journal Information**
- **Official Call for Papers Links**: Direct access to official submission pages
- **Paper Topics**: Specific research topics and areas accepted by each venue
- **Difficulty Level**: Low, Medium, Medium-High, High, Very High
- **Target Audience**: Master students, PhD students, Researchers
- **Submission Deadline**: Precise deadline dates with countdown
- **Average Publication Time**: Expected time from submission to publication
- **Popularity Score**: Community popularity rating (0-100)

### ❤️ **Favorite Management**
- Add/remove conferences and journals to/from favorites
- "My Submission List" feature to track your target venues
- Persistent storage of favorites

### 📈 **Analytics Dashboard**
- Track visitor statistics (17 visitors, 2 interactions)
- View engagement metrics

### 🎨 **Responsive Design**
- Mobile-friendly interface
- Smooth animations and transitions
- Collapsible filter panel when scrolling down
- "Back to Top" floating button for easy navigation

### 📤 **Data Export**
- Export filtered results as CSV
- Calendar view of upcoming deadlines

---

## 🏗️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Wouter** - Lightweight routing
- **Lucide React** - Icon library

### Backend
- **Express.js 4** - REST API framework
- **tRPC 11** - End-to-end type-safe APIs
- **Node.js** - JavaScript runtime

### Database
- **MySQL/TiDB** - Relational database
- **Drizzle ORM** - Type-safe database access

### Authentication
- **Manus OAuth** - Secure user authentication
- **JWT** - Session management

### Development Tools
- **Vite** - Fast build tool
- **Vitest** - Unit testing framework
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📊 Data Coverage

### Conferences (40 total)
- **Traditional Communications**: IEEE ICC, WCNC, GLOBECOM, ICCT, CTW, SECON, CCNC, ISAC, LC-IoT, WiMob, OGC, ICMAE, CISCE, ICASSE, EICE, INFOCOM
- **AI & Communications**: ICMLCN, EuCNC & 6G Summit
- **AI**: ICML, NeurIPS, ICLR, CVPR, ICCV, ECCV, AAAI, IJCAI, ACL, ECML-PKDD
- **Embodied Intelligence**: ICRA, IROS, RSS, HRI, CoRL, IROS, ISRR, WAFR, Humanoids, ICAPS

### Journals (53 total)
- **Traditional Communications**: IEEE TCOM, IEEE TNET, IEEE TWC, IEEE JSAC, IEEE WCML, IEEE Networking Letters, IEEE OJ-COMS, IEEE TCCN, IEEE TGCN, IEEE TMBMC, IEEE TNSE, IEEE TVT, Signal Processing, Wireless Networks, npj Wireless Technology, IEEE Access, IEEE Communications Letters, IEEE Communications Surveys & Tutorials, Journal of Optical Communications and Networking, IEEE Internet of Things Journal
- **AI & Communications**: IEEE TMLCN, Nature Communications AI & Computing
- **AI**: JMLR, Artificial Intelligence, IEEE TPAMI, ACM TOCS, Journal of Machine Learning Research, Pattern Recognition, IEEE TNNLS, ACM Computing Surveys, Nature Machine Intelligence
- **Embodied Intelligence**: Science Robotics, IEEE Transactions on Robotics, IEEE RA-L, IJRR, Autonomous Robots, IEEE TASE, Journal of Intelligent & Robotic Systems, Robotica, IEEE Robotics and Automation Letters

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- npm or pnpm package manager
- MySQL/TiDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/yq-wang-r/conference-journal-guide.git
cd conference-journal-guide

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and OAuth credentials

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📖 Usage Guide

### 1. **Browsing Conferences & Journals**
- Visit the homepage to see all available conferences and journals
- Use the search bar to find specific venues
- Browse by category or difficulty level

### 2. **Filtering & Sorting**
- **Category Filter**: Select research area (Traditional Communications, AI & Communications, etc.)
- **Difficulty Filter**: Choose appropriate difficulty level for your research
- **Sort Options**:
  - Deadline (Soon First) - default
  - Deadline (Later First)
  - Name (A-Z)
  - Popularity (Most Popular First)
  - Hide Expired - toggle to show/hide past deadlines

### 3. **Viewing Details**
- Click on any conference/journal card to expand details
- View specific paper topics and research areas
- Check EI/Scopus/SCI indexing status
- See average publication time

### 4. **Accessing Official Pages**
- Click "Visit Website" button to go to official conference/journal page
- Click "Call for Papers" button to access official submission page
- All links open in new tabs

### 5. **Managing Your Submission List**
- Click the heart icon to add to favorites
- Access "My Submission List (X)" to view saved venues
- Track your target conferences and journals

### 6. **Tracking Deadlines**
- Real-time countdown shows time remaining until submission deadline
- Format: "X days X hours" or "X hours X minutes" or "X minutes X seconds"
- Expired deadlines show "已截止" (Expired)

### 7. **Exporting Data**
- Use CSV export feature to download filtered results
- Useful for creating your own submission tracking spreadsheet

---

## 🔐 Authentication

The application uses **Manus OAuth** for secure authentication. Users can:
- Sign in with their Manus account
- View personalized submission list
- Save favorite conferences and journals
- Track submission progress

---

## 📝 Data Sources

All conference and journal information is curated from:
- **Official IEEE/ACM websites** - For IEEE and ACM conferences/journals
- **EI Compendex Database** - For EI indexing status verification
- **Web of Science** - For SCI indexing status verification
- **Scopus** - For Scopus indexing status verification
- **Official conference/journal websites** - For submission topics and deadlines

Data is current as of **January 19, 2026**.

---

## 🛠️ Development

### Project Structure

```
conference-journal-guide/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── package.json           # Dependencies and scripts
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build for production

# Testing
pnpm test             # Run vitest unit tests

# Database
pnpm db:push          # Push schema changes and run migrations

# Code Quality
pnpm format           # Format code with Prettier
pnpm lint             # Run ESLint (if configured)
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/auth.logout.test.ts
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- Tests pass (`pnpm test`)
- Code is formatted (`pnpm format`)

---

## 📋 Roadmap

### Planned Features
- [ ] **Advanced Filtering**: Filter by impact factor, publication time range, etc.
- [ ] **Submission Tracking**: Track paper submission status (draft, submitted, under review, accepted/rejected)
- [ ] **Smart Recommendations**: AI-powered venue recommendations based on research topics
- [ ] **Email Notifications**: Deadline reminders and new venue alerts
- [ ] **Collaboration Features**: Share submission lists with collaborators
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **API Access**: Public API for third-party integrations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **yq wang** - Initial development and project lead

---

## 📞 Support & Feedback

For questions, bug reports, or feature requests:
- Open an [Issue](https://github.com/yq-wang-r/conference-journal-guide/issues)
- Contact: wyq89895@gmail.com

---

## 🙏 Acknowledgments

- IEEE Communications Society for conference information
- Web of Science and Scopus for indexing data
- All conference and journal organizers for maintaining up-to-date submission information
- The open-source community for excellent tools and libraries

---

## 📊 Statistics

- **Total Conferences**: 40
- **Total Journals**: 53
- **Research Areas**: 4
- **Supported Languages**: Chinese, English
- **Last Updated**: January 19, 2026

---

**Made with ❤️ for graduate students in ICT fields**

**[Visit the Live Website Now](https://infocomguide-vctbpqpx.manus.space)** 🚀
