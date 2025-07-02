# FaceOff AI - Hockey Analytics Platform

A powerful interactive web application that provides AI-powered insights about NHL hockey using real 2024-25 season roster data.

### Video Demo

## ⚠️ Disclaimer

**This project is not affiliated with the NHL or any hockey organization.** This is an independent, educational project created for entertainment and learning purposes only.

**"NHL" and team names are trademarks of their respective owners.** All trademarks, logos, and team names are the property of their respective owners.

## 🎯 About This Project

This is a **hockey analytics platform** that combines:

- Modern web development technologies
- AI/LLM integration via OpenRouter
- Real NHL roster data
- Interactive user experience

The app allows users to ask natural language questions about NHL teams' 2024-25 roster and get detailed, data-driven responses using Meta's LLaMA 3.3-8B model.

### Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Bootstrap CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: OpenRouter API (Meta LLaMA 3.3-8B)
- **Authentication**: Firebase Auth
- **Data**: Static JSON roster data from NHL API

### Key Features

1. **Roster Display**: Interactive tables showing players, stats, and positions
2. **AI Chat Interface**: Natural language queries about team data
3. **Authentication**: Secure login system with Firebase
4. **Responsive Design**: Mobile-friendly UI with hockey theming
5. **Real-time Data**: Uses actual 2024-25 season statistics

### Data Flow

1. **User Authentication**: Firebase handles user login/logout
2. **Roster Data**: Static JSON file with complete player statistics
3. **AI Queries**:
   - User submits question via frontend
   - Backend receives request and adds complete roster context
   - OpenRouter API processes query with full team data
   - AI response formatted with markdown
   - Frontend renders formatted response

### AI Integration

- Uses OpenRouter's API to access Meta LLaMA 3.3-8B model
- Complete 2024-25 roster data injected into every AI request
- AI prompted to format responses with markdown
- Supports hockey-specific queries about lineups, stats, comparisons

## 📊 Features

- **Interactive Roster Tables**: View forwards, defensemen, and goalies with detailed stats
- **AI-Powered Insights**: Ask questions like:
  - "Who are the top scorers on the team?"
  - "Compare player performances this season"
  - "What's the best line combination?"
  - "How are the goalies performing?"
- **Markdown Formatting**: AI responses include proper formatting with headers, lists, and emphasis
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Future Additions

- Real-time data updates from NHL API
- Multi-team support
- Advanced analytics and visualizations
- Performance comparisons across teams

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd faceoff-app
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend - create backend/.env
OPENROUTER_API_KEY=your_openrouter_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

4. Start development servers:
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

### Build for Production

```bash
npm run build:frontend
npm run build:backend
```

## 🤝 Contributing

This is an educational project! Feel free to:

- Submit bug reports or feature requests
- Fork the project and experiment
- Share your own hockey analytics ideas

## 📝 License

This project is open source and available under the MIT License.

**Note**: This project uses publicly available NHL statistics and is not affiliated with the NHL or any hockey organization.