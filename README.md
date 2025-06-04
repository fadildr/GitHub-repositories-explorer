# GitHub Repositories Explorer

A modern React application that allows users to search for GitHub users and explore their repositories. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Search**: Search for up to 5 GitHub users with usernames similar to your query
- **Repository Explorer**: View all repositories for any selected user
- **Responsive Design**: Fully responsive interface that works on desktop and mobile
- **Loading States**: Smooth loading indicators for better user experience
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Modern UI**: Clean, modern interface with dark mode support
- **Comprehensive Tests**: Unit and integration tests for all components

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **GitHub API** - Official GitHub REST API
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## 📋 Requirements Met

✅ React with TypeScript  
✅ GitHub API integration  
✅ Search up to 5 users  
✅ Proper error handling  
✅ Loading states and UX best practices  
✅ Keyboard event handling  
✅ Mobile responsive design  
✅ English language only  
✅ Clean, maintainable code structure  
✅ Unit and integration tests

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/github-explorer.git
   cd github-explorer
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

# or

yarn install
\`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

# or

yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing

The project includes comprehensive unit and integration tests:

\`\`\`bash

# Run all tests

npm test

# Run tests in watch mode

npm run test:watch

# Generate test coverage report

npm run test:coverage
\`\`\`

## 🏗️ Project Structure

\`\`\`
├── app/
│ ├── globals.css
│ ├── layout.tsx
│ ├── loading.tsx
│ └── page.tsx
├── components/
│ ├── activity/
│ │ ├── contribution-graph.tsx
│ │ └── recent-activity.tsx
│ ├── profile/
│ │ ├── contact-info.tsx
│ │ ├── social-links.tsx
│ │ └── user-profile.tsx
│ ├── repository/
│ │ ├── language-stats.tsx
│ │ ├── pinned-repositories.tsx
│ │ ├── popular-repositories.tsx
│ │ ├── repository-card.tsx
│ │ └── repository-list.tsx
│ ├── search/
│ │ ├── search-input.tsx
│ │ ├── search-view.tsx
│ │ └── user-list.tsx
│ └── ui/ # shadcn/ui components
│ ├── accordion.tsx
│ ├── alert-dialog.tsx
│ ├── ... (many UI components)
├── hooks/
│ ├── use-debounce.ts
│ ├── use-mobile.tsx
│ ├── use-toast.ts
│ ├── use-user-repositories.ts
│ └── use-user-search.ts
├── lib/
│ ├── constants.ts
│ ├── formatting.ts
│ ├── github-api.ts
│ └── utils.ts
├── types/
│ └── github.ts
├── tests /
│ ├── integration/
│ │ ├── keyboard-navigation.test.tsx
│ │ ├── mobile-responsiveness.test.tsx
│ │ └── search-to-repos-flow.test.tsx
│ ├── mocks/
│ │ └── github-api.ts
│ ├── page.test.tsx
│ ├── repository-list.test.tsx
│ ├── search-input.test.tsx
│ ├── setup.ts
│ └── user-list.test.tsx
├── public/
│ ├── placeholder-logo.png
│ ├── placeholder-logo.svg
│ ├── placeholder-user.jpg
│ ├── placeholder.jpg
│ └── placeholder.svg
├── styles/
│ └── globals.css
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## 🎯 Usage

1. **Search Users**: Enter a GitHub username in the search box
2. **Select User**: Click on any user from the search results (up to 5 shown)
3. **Browse Repositories**: View all repositories for the selected user
4. **Repository Details**: See stars, forks, language, topics, and last update
5. **External Links**: Click repository names or user profiles to open on GitHub

## 🔧 API Integration

The application uses the GitHub REST API v3:

- **User Search**: \`GET /search/users?q={query}&per_page=5\`
- **User Repositories**: \`GET /users/{username}/repos?sort=updated&per_page=100\`

No authentication required for public data access.

## 🎨 Design Features

- **Clean Interface**: Minimalist design focusing on content
- **Responsive Layout**: Works seamlessly on all device sizes
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Boundaries**: Graceful error handling with retry options
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🧪 Testing Strategy

The application includes comprehensive testing:

- **Unit Tests**: Individual component testing
- **Integration Tests**: Testing component interactions
- **API Mocking**: Using MSW to mock GitHub API responses
- **User Flows**: Complete user journey testing
- **Keyboard Navigation**: Testing accessibility via keyboard
- **Mobile Responsiveness**: Testing different viewport sizes
- **Error Handling**: Testing error states and recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit changes: \`git commit -m 'Add amazing feature'\`
4. Push to branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

---

**Live Demo**: [Your deployed URL here]  
**Repository**: [Your GitHub repository URL here]
\`\`\`
