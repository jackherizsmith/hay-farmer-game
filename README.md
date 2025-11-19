# 🌾 Hay Farmer Game

A time-based farming game where players must strategically make and cover hay while responding to changing weather conditions. Built with Next.js, TypeScript, and Prisma.

## Game Overview

Make hay while the sun shines! You have 60 seconds (representing 18 hours from 5am to 11pm) to make as much hay as possible and protect it from the weather.

### Game Mechanics

- **☀️ Sunny:** Make hay (+1 per click), no loss
- **☁️ Cloudy:** Cannot make hay, no loss
- **💨 Windy:** Cannot make hay, lose 0.5 hay/second
- **🌧️ Rainy:** Cannot make hay, lose 1 hay/second
- **❄️ Snowing:** Cannot make hay, lose 2 hay/second (fastest loss!)
- **🛡️ Cover Hay:** Protect your hay to score points (time increases with hay count)

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Database:** PostgreSQL with Prisma ORM
- **Caching:** Redis (optional)
- **Deployment:** Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker Compose)
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hay-farmer-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**

   ```bash
   # Start PostgreSQL (or use Docker Compose)
   docker-compose up -d postgres

   # Run migrations
   npx prisma migrate dev

   # Generate Prisma client
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

### Using Docker Compose (Recommended)

Run the entire application stack with Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

This will start:

- PostgreSQL on port 5432
- Redis on port 6379
- Next.js app on port 3000

## Project Structure

```
hay-farmer-game/
├── src/
│   ├── app/              # Next.js app router pages and API routes
│   │   ├── api/          # API endpoints
│   │   │   ├── scores/   # Score submission
│   │   │   └── leaderboard/ # Leaderboard
│   │   ├── layout.tsx
│   │   └── page.tsx      # Main game page
│   ├── components/       # React components
│   │   ├── game/         # Game-specific components
│   │   │   ├── GameCanvas.tsx
│   │   │   ├── WeatherSystem.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ActionButtons.tsx
│   │   └── ui/           # UI components
│   │       ├── Header.tsx
│   │       ├── StatsDisplay.tsx
│   │       └── GameOver.tsx
│   ├── stores/           # Zustand state management
│   │   └── gameStore.ts  # Main game state
│   ├── hooks/            # Custom React hooks
│   │   └── useGameLoop.ts
│   ├── lib/              # Utility functions
│   │   ├── prisma.ts     # Prisma client
│   │   └── utils.ts      # Game utilities
│   └── types/            # TypeScript definitions
│       └── game.ts       # Game types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── docker/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Game Constants

Configurable via environment variables:

- `NEXT_PUBLIC_GAME_DURATION` - Game duration in seconds (default: 60)
- `NEXT_PUBLIC_BASE_COVER_TIME` - Base time to cover hay (default: 2)
- `NEXT_PUBLIC_COVER_SCALING_FACTOR` - Time scaling per hay unit (default: 0.1)

## API Routes

### POST /api/scores

Submit a game score

```json
{
  "playerName": "John",
  "score": 42,
  "coveredHay": 42,
  "gameplayData": {},
  "weatherHistory": [],
  "actions": [],
  "duration": 60
}
```

### GET /api/leaderboard

Get top scores
Query params:

- `limit` - Number of scores to return (default: 10, max: 100)
- `offset` - Pagination offset (default: 0)

## Database Schema

### GameScore

- Stores individual game scores
- Indexed by score (descending) and creation time

### GameSession

- Stores detailed gameplay session data
- Includes weather history and player actions
- Useful for analytics and debugging

## Development

### Running Tests

```bash
# Unit tests
npm test

# E2E tests with Cypress
npm run cypress:open
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## Deployment

### Docker Production Build

```bash
# Build the Docker image
docker build -t hay-farmer-game .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  hay-farmer-game
```

### Environment Variables for Production

Required:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

Optional:

- `REDIS_URL` - Redis connection string
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics ID

## Performance Optimisations

- Game loop runs at 100ms intervals (10 ticks/second)
- Prisma Client caching for database queries
- Next.js Image optimisation for assets
- Standalone output for smaller Docker images
- Redis caching for leaderboard (optional)

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast colour schemes
- Respects `prefers-reduced-motion`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Acknowledgements

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for hosting and deployment tools
