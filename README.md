# TaskDefender - Your Last Line of Defense Against Procrastination

## 🛡️ Overview

TaskDefender is your AI-powered productivity companion that helps you combat procrastination through smart task management, honesty guardrails, and motivational tools. It features a unique "sarcastic AI" that provides motivational nudges, extensive work pattern analysis, and privacy-first design.

## ✨ Key Features

### Core Functionality
- **Quick Task Capture** - Add tasks with voice or text in 2 taps with smart suggestions
- **Smart Scheduler** - Drag-and-drop time blocks with automatic prioritization
- **Focus Mode** - Pomodoro-style focus sessions with distraction tracking
- **Task Progress Tracker** - Visual Kanban boards and progress indicators
- **Daily Summary & Review** - Productivity insights and completion analytics

### Anti-Procrastination & Honesty Guardrails
- **Honesty Checkpoints** - Soft nudges prompting self-reflection before marking tasks done
- **Integrity Score** - Visible score showing consistency and honesty
- **Procrastination Alerts** - AI-powered motivational reminders
- **Sarcastic AI Engine** - Multiple personalities for motivation (Drill Sergeant, Disappointed Parent, Sarcastic Friend, Motivational Coach)
- **Voice Call Interventions** - Simulated motivational calls from different characters

### User Experience
- **Interactive Onboarding** - Step-by-step walkthrough with progress tracking
- **Gamification** - Badges, achievements, and streak tracking
- **Voice & Gesture Support** - Speech-to-text for hands-free operation
- **Dark/Light Mode** - Theme switching with system preference detection
- **Privacy-First Design** - Local storage with export/import capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES2020 support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/taskdefender.git
cd taskdefender
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 🎯 Core Features Implementation

### ✅ MVP Features Implemented:

#### **Quick Task Capture**
- Voice and text input in 2 taps
- Smart suggestions from common tasks
- Auto-detection of priority and due dates from natural language

#### **Smart Scheduler** 
- Calendar view with drag-and-drop time blocks
- Automatic prioritization based on deadlines
- Visual task scheduling interface

#### **Task Progress Tracker**
- Kanban board view (To-Do, In Progress, Completed)
- Visual progress indicators
- Status management with quick actions

#### **Focus Mode / Deep Work Timer**
- Pomodoro technique integration (25/5/15 minute cycles)
- Deep work sessions
- Real-time distraction tracking and alerts
- Session history and analytics

#### **Daily Summary & Review**
- Dashboard with productivity insights
- Task completion rates and focus time tracking
- Streak and integrity score monitoring

### ✅ Anti-Procrastination Features:

#### **Honesty Checkpoints**
- Modal prompts before marking tasks complete
- Self-reflection questions and integrity scoring
- Impact feedback on honesty choices

#### **Integrity Score**
- Visible score that increases with honest completion
- Tracks consistency and accountability

#### **Procrastination Alerts**
- Sarcastic AI prompts with multiple personalities
- Idle task detection and motivational reminders

#### **Voice Call Interventions**
- Simulated calls from different characters (Boss, Parent, Coach, etc.)
- Scripted motivational interventions
- Answer/decline/end call functionality

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/           # React components
│   ├── common/          # Shared components (Header, etc.)
│   ├── tasks/           # Task management components
│   ├── focus/           # Focus mode and timer components
│   ├── calendar/        # Calendar and scheduling
│   ├── voice/           # Voice call system
│   ├── notifications/   # Notification center
│   ├── settings/        # Settings and privacy
│   └── onboarding/      # User onboarding flow
├── contexts/            # React contexts (AppContext)
├── hooks/               # Custom React hooks
├── services/            # Business logic services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

### Key Services
- **SarcasticPromptEngine** - AI-powered motivational system
- **StorageService** - Local data persistence and export/import
- **AppContext** - Global state management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Development
VITE_APP_NAME=TaskDefender
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
The app uses a custom Tailwind configuration with:
- Custom color palette (orange/green theme)
- Dark mode support
- Responsive breakpoints
- Custom animations and gradients

## 📱 Features Breakdown

### 🎯 Sarcastic AI System
- **Multiple Personalities**: Drill Sergeant, Disappointed Parent, Sarcastic Friend, Motivational Coach
- **Context-Aware Prompts**: Triggers based on user behavior (procrastination, distraction, achievement)
- **Intensity Levels**: 1-5 scale for motivation intensity
- **Customizable**: Users can switch personalities and adjust frequency

### 🏅 Gamification Elements
- **Integrity Score**: Tracks honesty and consistency
- **Streak Tracking**: Daily productivity streaks
- **Achievement System**: Badges for various accomplishments
- **Progress Visualization**: Charts and progress bars

### 🔒 Privacy & Security
- **Local Storage**: All data stored on user's device
- **Export/Import**: Full data portability
- **No Tracking**: Privacy-first approach
- **Transparent**: Clear data usage policies

## 🧪 Testing

### Unit Testing
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Testing Strategy
- Component unit tests
- Hook testing
- Service layer testing
- Integration testing for user flows

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

### Documentation
- Component documentation in code
- Type definitions for all interfaces
- Comprehensive README

### Community
- GitHub Issues for bug reports
- Discussions for feature requests

---

**TaskDefender** - Your Last Line of Defense Against Procrastination! 🛡️

Built with React, TypeScript, Tailwind CSS, and a lot of motivational sarcasm.