# GitHub Explorer

A modern, feature-rich React application for exploring GitHub users and their repositories. Search for any GitHub user and dive deep into their profile, social connections, achievements, and repository portfolio with an intuitive, GitHub-like interface.

## ✨ Features

### 🔍 **Smart User Search**

- Real-time search with debouncing
- Up to 5 user results per search
- Keyboard shortcuts (Ctrl+K or /) for quick access
- Auto-focus and smooth UX

### 👤 **Comprehensive User Profiles**

- **Dynamic Social Links** - Auto-detect Twitter, LinkedIn, YouTube, Instagram from bio
- **Smart Achievements** - Gamified profile badges based on real GitHub stats
- **Contact Information** - Location, company, join date, activity levels
- **Real Organizations** - Live organization memberships
- **Activity Tracking** - Account age, hireable status, professional type detection

### 📊 **Advanced Repository Analytics**

- **Pinned Repositories** - Smart algorithm to simulate GitHub's pinned repos
- **Language Statistics** - Dynamic breakdown with progress bars and percentages
- **Repository Insights** - Stars, forks, topics, last updated, homepage links
- **Enhanced Cards** - Rich repository information with color-coded languages

### 📈 **GitHub-Style Activity Visualization**

- **Contribution Graph** - Realistic contribution calendar with hover tooltips
- **Recent Activity** - Live user events from GitHub API
- **Streak Calculations** - Current and longest contribution streaks
- **Activity Timeline** - Commits, PRs, issues, releases with descriptions

### 📱 **Modern User Experience**

- **Fully Responsive** - Perfect on desktop, tablet, and mobile
- **Dark Mode Support** - Seamless light/dark theme switching
- **Loading States** - Skeleton screens and smooth transitions
- **Error Boundaries** - Graceful error handling with retry options
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API**: GitHub REST API v3
- **State Management**: React Hooks
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/fadildr/GitHub-repositories-explorer.git
cd GitHub-repositories-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Feature-based component organization
│   ├── ui/                      # 🎨 Base UI Components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── error-message.tsx
│   │   ├── loading-spinner.tsx
│   │   └── page-header.tsx
│   │
│   ├── search/                  # 🔍 Search & Discovery
│   │   ├── search-input.tsx
│   │   ├── search-view.tsx
│   │   └── user-list.tsx
│   │
│   ├── profile/                 # 👤 User Profile
│   │   ├── user-profile.tsx
│   │   ├── contact-info.tsx
│   │   ├── social-links.tsx
│   │   └── user-readme.tsx
│   │
│   ├── repository/              # 📁 Repository Management
│   │   ├── repository-list.tsx
│   │   ├── repository-card.tsx
│   │   ├── pinned-repositories.tsx
│   │   ├── popular-repositories.tsx
│   │   └── language-stats.tsx
│   │
│   └── activity/                # 📊 Activity & Analytics
│       ├── contribution-graph.tsx
│       └── recent-activity.tsx
│
├── hooks/                       # Custom React Hooks
│   ├── use-debounce.ts
│   ├── use-search-focus.ts
│   ├── use-user-search.ts
│   └── use-user-repositories.ts
│
├── lib/                         # Utilities & Services
│   ├── github-api.ts           # All-in-one GitHub API service
│   ├── formatting.ts           # Date, number, URL formatters
│   ├── constants.ts            # App constants
│   └── utils.ts                # Utility functions
│
├── types/                       # TypeScript Definitions
│   ├── github.ts               # GitHub API types
│   └── github-extended.ts      # Extended types for features
│
└── __tests__/                   # Test Suite
    ├── components/
    ├── hooks/
    ├── integration/
    └── mocks/
```

## 🔧 API Integration

### GitHub REST API v3

- **Search Users**: `GET /search/users?q={query}&per_page=5`
- **User Details**: `GET /users/{username}`
- **User Repositories**: `GET /users/{username}/repos?sort=updated&per_page=100`
- **User Organizations**: `GET /users/{username}/orgs`
- **User Events**: `GET /users/{username}/events/public?per_page=100`
- **User README**: `GET /repos/{username}/{username}/contents/README.md`

### Features Powered by API

- ✅ **Real-time data** from GitHub
- ✅ **Rate limit handling** with graceful fallbacks
- ✅ **Error boundaries** for API failures
- ✅ **Mock data generation** when API limits are reached

## 🎨 Key Components

### 🔍 **Smart Search System**

```typescript
// Advanced search with debouncing and focus management
const { users, isSearching, searchError, searchUsers } = useUserSearch();
```

### 👤 **Dynamic User Profiles**

```typescript
// Real GitHub data with smart social link detection
<UserProfile user={selectedUser} />
<ContactInfo user={selectedUser} />
<SocialLinks user={selectedUser} />
```

### 📊 **Activity Visualization**

```typescript
// GitHub-style contribution graph with real data
<ContributionGraph username={user.login} />
<RecentActivity username={user.login} />
```

## 🧪 Testing Strategy

### Test Coverage

- ✅ **Unit Tests** - Individual component testing
- ✅ **Integration Tests** - Component interaction testing
- ✅ **API Mocking** - MSW for GitHub API simulation
- ✅ **User Flows** - Complete journey testing
- ✅ **Accessibility** - Keyboard navigation and screen readers
- ✅ **Responsive Design** - Multiple viewport testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🎯 Usage Guide

### 1. **Search for Users**

- Type any GitHub username
- Use keyboard shortcuts (Ctrl+K or /)
- Select from up to 5 results

### 2. **Explore User Profiles**

- View comprehensive user information
- Check social media connections
- See professional achievements
- Browse organization memberships

### 3. **Analyze Repositories**

- Browse pinned and popular repositories
- View language distribution
- Check repository statistics
- Access external links

### 4. **Track Activity**

- Visualize contribution patterns
- See recent GitHub activity
- Monitor contribution streaks
- Analyze activity trends

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build and deploy
npm run build
# Upload dist folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎨 Customization

### Theme Configuration

```typescript
// tailwind.config.ts - Customize colors, fonts, spacing
export default {
  theme: {
    extend: {
      colors: {
        github: {
          primary: "#0969da",
          secondary: "#656d76",
        },
      },
    },
  },
};
```

### API Configuration

```typescript
// lib/constants.ts - Adjust API limits and settings
export const API_CONFIG = {
  SEARCH_RESULTS_LIMIT: 5,
  REPOS_LIMIT: 100,
  DEBOUNCE_DELAY: 300,
};
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure accessibility compliance
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🔗 Links:**

- **Live Demo**: [https://git-hub-repositories-explorer-fadildrs-projects.vercel.app/](https://git-hub-repositories-explorer-fadildrs-projects.vercel.app/)
- **Repository**: [https://github.com/fadildr/GitHub-repositories-explorer](https://github.com/fadildr/GitHub-repositories-explorer)
- **Issues**: [Report bugs or request features](https://github.com/fadildr/GitHub-repositories-explorer/issues)

---

Built with ❤️ using React, Next.js, and TypeScript
