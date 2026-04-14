# 🎬 Movie & Anime Hub for GitHub Pages

A comprehensive streaming site for movies, TV shows, and anime that works on GitHub Pages. Browse trending content, search across multiple databases, and enjoy a unified streaming experience.

## 🌟 Features

- **Dual Content Support**: Movies, TV shows, and anime in one platform
- **Multiple APIs**: TMDB, Jikan, HiAnime, and more
- **Trending Content**: Stay updated with trending movies and anime
- **Advanced Search**: Search across all content types simultaneously
- **Responsive Design**: Works great on desktop, tablet, and mobile
- **GitHub Pages Ready**: Deploy directly to GitHub Pages with zero backend
- **PWA Support**: Install as an app on your device
- **Dark UI**: Beautiful dark theme optimized for streaming

## 📋 Prerequisites

- Node.js 18+ and pnpm
- TMDB API key (free from https://www.themoviedb.org/settings/api)
- GitHub account for deployment

## 🚀 Quick Start

### 1. Setup Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo

# Install pnpm if you don't have it
npm install -g pnpm@9

# Install dependencies
pnpm install

# Copy example env file
cp example.env .env.local

# Add your TMDB API key to .env.local
# Get it from: https://www.themoviedb.org/settings/api
```

### 2. Configure Environment Variables

Edit `.env.local`:

```env
# Required: Get from https://www.themoviedb.org/settings/api
VITE_TMDB_READ_API_KEY=your_api_key_here

# Development
VITE_APP_DOMAIN=http://localhost:5173
VITE_BASE_URL=/

# Disable features for GitHub Pages
VITE_NORMAL_ROUTER=false
VITE_OPENSEARCH_ENABLED=false
```

### 3. Run Development Server

```bash
pnpm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
pnpm run build
```

This creates an optimized build in the `dist/` folder.

## 🌐 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configure GitHub Repository Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_TMDB_READ_API_KEY` with your TMDB API key
   - Optionally add `VITE_CORS_PROXY_URL` if needed

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically build and deploy

4. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/repository-name`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build the project
pnpm run build

# Deploy the dist folder to GitHub Pages
# Using gh-pages package (if installed)
pnpm run deploy

# Or manually push dist/ to gh-pages branch
```

## 📁 Project Structure

```
src/
├── backend/
│   └── metadata/
│       ├── anime.ts          # Anime API integration
│       ├── movies.ts         # Movie/TV API integration
│       └── tmdb.ts           # TMDB utilities
├── components/
│   ├── media/
│   │   ├── MediaCard.tsx     # Movie/TV card component
│   │   ├── AnimeCard.tsx     # Anime card component
│   │   └── ContentCarousel.tsx # Scrollable content row
│   └── layout/
├── pages/
│   ├── UnifiedHomePage.tsx   # Main landing page with trending content
│   ├── UnifiedSearchPage.tsx # Advanced search page
│   └── PlayerView.tsx        # Video player (existing)
└── setup/
    └── App.tsx               # Route definitions
```

## 🔑 API Keys & Configuration

### TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Sign up for a free account if needed
3. Request an API key
4. Add it to your environment variables

### CORS Proxy (Optional)

For accessing external APIs without CORS issues:

```env
VITE_CORS_PROXY_URL=https://cors-proxy.fringe.zone
```

Popular free CORS proxies:
- https://cors-proxy.fringe.zone
- https://api.allorigins.win
- https://cors.bridged.cc

## 🎨 Customization

### Change Base URL

For different domain structures:

```env
# GitHub Pages subdomain
VITE_BASE_URL=/repository-name/

# Custom domain
VITE_BASE_URL=/
VITE_APP_DOMAIN=https://yourdomain.com
```

### Enable PWA

```env
VITE_PWA_ENABLED=true
```

This allows users to install the app:

```bash
pnpm run build:pwa
```

## 📊 Content APIs Used

| API | Type | Source |
|-----|------|--------|
| **TMDB** | Movies, TV Shows | https://www.themoviedb.org/ |
| **Jikan** | Anime Metadata | https://jikan.moe/ |
| **HiAnime** | Anime Episodes | https://hianime.to/ |
| **Movie Providers** | Scraping | Built-in providers |

## 🛠️ Development

### Available Scripts

```bash
# Development server
pnpm run dev

# Production build
pnpm run build

# Build with PWA
pnpm run build:pwa

# Preview production build
pnpm run preview

# Run tests
pnpm run test

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix
```

### Adding New Features

1. **New Search Source**: Add to `src/backend/metadata/`
2. **New Components**: Add to `src/components/`
3. **New Pages**: Add to `src/pages/` and update `src/setup/App.tsx`

## ⚖️ Legal & Compliance

- Respect copyright laws
- Follow API terms of service
- Include proper licensing
- Add DMCA page if needed (uncomment in config)

## 🐛 Troubleshooting

### Build fails with CORS errors

1. Install a CORS proxy
2. Add to `.env`:
   ```env
   VITE_CORS_PROXY_URL=https://cors-proxy.fringe.zone
   ```

### API returns 401 (Unauthorized)

- Check TMDB API key is valid
- Ensure key is added to GitHub secrets
- Verify key has read permissions

### Pages not loading (404)

Ensure `VITE_NORMAL_ROUTER=false` for GitHub Pages hash routing.

### Anime content not loading

- HiAnime API may be blocked in your region
- Try using CORS proxy
- Check anime.ts for API status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is provided as-is. See LICENSE file for details.

## 🔗 Related Projects

- Original: https://github.com/sussy-code/smov
- Movie Providers: https://github.com/movie-web/providers
- Jikan API: https://jikan.moe/
- HiAnime Logic: https://github.com/consumet/

## 💬 Support

For issues and questions:
1. Check this README
2. Search existing issues
3. Create a new issue with details

## 📝 Notes

- Free APIs may have rate limits
- Some content sources may be geo-restricted
- Consider adding a rate limiter for production
- Always respect API terms of service

---

**Enjoy your streaming! 🍿**
