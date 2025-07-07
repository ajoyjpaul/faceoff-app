# FaceOff - Hockey Player Comparison Tool

A Vue.js application for comparing NHL player statistics with interactive visualizations.

## Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Bootstrap
- **Backend**: Node.js + Express + TypeScript  
- **Authentication**: Firebase Auth
- **Testing**: Vitest + Vue Test Utils
- **Data**: Real NHL player statistics (JSON)

## Features

- **Player Comparison**: Select multiple players and compare their stats
- **Interactive Cards**: Player cards with season stats and highlights
- **Comparison Table**: Side-by-side statistical comparison
- **Best Stats Highlighting**: Automatically highlights top performers
- **Responsive Design**: Works on desktop and mobile

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
# Create backend/.env with Firebase config

# Start development servers
# Terminal 1 - Frontend (http://localhost:5173)
cd frontend && npm run dev

# Terminal 2 - Backend (http://localhost:3000) 
cd backend && npm run local
```

## Testing

The project includes a comprehensive test suite covering:

- **API Testing**: Player service and data fetching
- **Component Testing**: PlayerCard and ComparisonTable rendering
- **Integration Testing**: Full page functionality
- **Real Data Testing**: Uses actual player statistics

```bash
# Run tests
cd frontend && npm test

# Run tests with UI
npm run test:ui
```

### Test Coverage
- 9 focused tests covering key functionality
- API integration with error handling
- Component rendering and props
- User interaction flows
- Real data validation

## Project Structure

```
faceoff-app/
├── frontend/           # Vue.js application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── views/      # Page components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript definitions
│   └── tests/          # Test suite
├── backend/            # Express.js API
└── shared/
    └── data/          # Player statistics (JSON)
```

## Key Components

- **PlayerComparison**: Main page for selecting and comparing players
- **PlayerCard**: Individual player stat cards with highlighting
- **ComparisonTable**: Side-by-side statistical comparison table
- **PlayerSelector**: Dropdown for choosing players by season

## License

MIT License - Educational project using publicly available NHL statistics.
