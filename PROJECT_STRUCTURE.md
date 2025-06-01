# Production-Ready Client Folder Structure

Below is a recommended structure for your React (Vite) client, with explanations for each folder and suggestions for additional folders/files to make your frontend scalable and maintainable.

```
client/
  public/                # Static assets (favicon, manifest, robots.txt, etc.)
  src/
    assets/              # Images, fonts, and other static resources
    components/          # Reusable UI components
      admin/             # Admin-specific components
      auth/              # Auth modals, forms, etc.
      home/              # Home page-specific components
      layouts/           # Layout components (Header, Footer, etc.)
      payment/           # Payment-related components
      ui/                # Generic UI elements (Button, Modal, etc.)
    context/             # React context providers (AuthContext, ThemeContext, etc.)
    hooks/               # Custom React hooks (useAuth, useFetch, etc.)
    pages/               # Page components (HomePage, EventsPage, etc.)
    routes/              # Route definitions and helpers (optional, for route configs)
    services/            # API calls and business logic (api.js, eventService.js, etc.)
    utils/               # Utility/helper functions (formatters, validators, etc.)
    styles/              # Global and modular CSS/SCSS files (index.css, theme.css, etc.)
    App.jsx              # Main app component
    main.jsx             # Entry point
    index.css            # Global styles
  package.json           # Project dependencies and scripts
  vite.config.js         # Vite configuration
  eslint.config.js       # Linting rules
  .env                  # Environment variables (never commit to git)
```

## Why These Folders?

- **hooks/**: For reusable custom hooks, keeps logic DRY and organized.
- **services/**: Centralizes API calls and business logic, makes code easier to maintain and test.
- **utils/**: For helper functions used across the app.
- **styles/**: For global and modular CSS, helps manage styles at scale.
- **routes/** (optional): For advanced routing setups or route configs.

## Example Files to Create

- `src/hooks/useAuth.js` — custom hook for authentication logic.
- `src/services/api.js` — central API request handler (e.g., using axios or fetch).
- `src/utils/formatDate.js` — utility to format dates.
- `src/styles/theme.css` — for theme variables or custom styles.

This structure will help you scale, maintain, and secure your frontend for production.
