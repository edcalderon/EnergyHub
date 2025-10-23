# EnergyHub

A modern energy management dashboard built with Next.js, featuring real-time consumption monitoring, tariff analysis, eco-feedback, and outage mapping.

## Features

- 📊 **Energy Consumption Dashboard** - Real-time monitoring and analytics
- 💰 **Tariff Management** - Cost breakdown and alternative plans
- 🌱 **Eco-Feedback System** - Environmental impact tracking
- 🗺️ **Outage Map** - Real-time power outage visualization
- 🔔 **Smart Notifications** - Intelligent alerts and recommendations
- 🌙 **Dark/Light Theme** - Responsive design with theme switching

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for GitHub Pages deployment with static export.

### Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/nextjs.yml`) that automatically builds and deploys to GitHub Pages when you push to the main branch.

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out` directory

3. Deploy the `out` directory to your hosting platform

## Configuration

The project is configured with:
- Static export for GitHub Pages compatibility
- Base path configuration for repository deployment
- Unoptimized images for static hosting
- Trailing slash support

## Repository Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── eco-feedback/       # Eco-feedback page
│   ├── landing/           # Landing page
│   ├── mapa-cortes/       # Outage map page
│   ├── notifications/     # Notifications page
│   ├── profile/          # User profile page
│   └── tarifas/          # Tariffs page
├── components/           # React components
│   ├── dashboard/        # Dashboard components
│   └── ui/              # Reusable UI components
└── lib/                 # Utility functions
```

## License

MIT License
