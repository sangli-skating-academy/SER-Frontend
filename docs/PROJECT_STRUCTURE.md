# 🎨 Frontend Architecture & Developer Guide

**Version:** 2.1  
**Last Updated:** December 28, 2025  
**Project:** Sangli Skating Academy - Event Registration System (Frontend)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Philosophy](#architecture-philosophy)
3. [Folder Structure](#folder-structure)
4. [Core Components](#core-components)
5. [Best Practices](#best-practices)
6. [Getting Started](#getting-started)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This is a **production-grade React frontend** built with modern tools and best practices. The application provides a responsive, user-friendly interface for event registration, user authentication, admin dashboard, and payment processing.

**Tech Stack:**

- **Framework:** React 18 (with Hooks)
- **Build Tool:** Vite 6 (Fast HMR, optimized builds)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS 4 + Custom CSS
- **State Management:** Context API (AuthContext)
- **Form Handling:** React Hook Form + Yup validation
- **HTTP Client:** Fetch API + Axios (for complex requests)
- **UI Components:** Custom components + Radix UI primitives
- **Icons:** Font Awesome + Lucide React
- **Animations:** Framer Motion
- **SEO:** React Helmet Async

---

## 🏛️ Architecture Philosophy

This frontend follows **modern React patterns**:

### 1. **Component-Based Architecture**

- **Atomic Design Pattern:**
  - **Atoms:** Basic UI elements (Button, Input, Badge)
  - **Molecules:** Simple component groups (LoginModal, EventCard)
  - **Organisms:** Complex components (Header, Footer)
  - **Templates:** Page layouts
  - **Pages:** Full page components

### 2. **Separation of Concerns**

Each layer has a **single responsibility**:

- **Components** → UI rendering
- **Pages** → Page-level logic and composition
- **Services** → API communication
- **Context** → Global state management
- **Hooks** → Reusable logic
- **Utils** → Helper functions

### 3. **Modern React Patterns**

- ✅ Functional components only
- ✅ Custom hooks for logic reuse
- ✅ Context API for state management
- ✅ Controlled forms with React Hook Form
- ✅ Code splitting with React.lazy()
- ✅ SEO optimization with React Helmet

### 4. **Performance First**

- Fast builds with Vite
- Lazy loading for routes
- Image optimization
- Minimal re-renders
- Efficient state updates

---

## 📁 Folder Structure

```
client/
├── public/                      # 🌐 Static assets served directly
│   ├── robots.txt               # SEO crawler instructions
│   └── sitemap.xml              # SEO sitemap
│
├── api/                         # 🔌 Vercel serverless functions
│
├── pages/                       # 📄 Next.js style page routing (if used)
│   └── api/                     # API routes for Vercel
│
├── src/                         # 📦 Main source code
│   ├── assets/                  # 🎨 Static resources (images, fonts, icons)
│   │
│   ├── components/              # 🧩 Reusable UI components
│   │   ├── admin/               # Admin-specific components
│   │   │   ├── AdminRoute.jsx   # Protected admin route wrapper
│   │   │   ├── Modals/          # Admin modals
│   │   │   ├── Pages/           # Admin page components
│   │   │   │   ├── AllClassRegistrations.jsx
│   │   │   │   ├── AllContactMessage.jsx
│   │   │   │   ├── AllEvents.jsx
│   │   │   │   ├── AllGallery.jsx
│   │   │   │   └── AllRegistrations.jsx
│   │   │   ├── Tables/          # Admin data tables
│   │   │   ├── layouts/         # Admin layout components
│   │   │   └── services/        # Admin services (ManageEvent, etc.)
│   │   │
│   │   ├── auth/                # Authentication components
│   │   │   ├── LoginModal.jsx   # Login form modal
│   │   │   └── RegisterModal.jsx # Registration form modal
│   │   │
│   │   ├── home/                # Home page sections
│   │   │   ├── ContactSection.jsx
│   │   │   ├── EventSection.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── TimelineSection.jsx
│   │   │   └── curosal.jsx      # Hero carousel
│   │   │
│   │   ├── layouts/             # Layout components
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Footer.jsx       # Page footer
│   │   │   └── ScrollToTop.jsx  # Auto-scroll on route change
│   │   │
│   │   ├── payment/             # Payment-related components
│   │   │
│   │   ├── ui/                  # Reusable UI primitives
│   │   │   ├── button.jsx       # Custom button component
│   │   │   ├── card.jsx         # Card container
│   │   │   ├── input.jsx        # Input field
│   │   │   ├── modal.jsx        # Modal dialog
│   │   │   ├── select.jsx       # Dropdown select
│   │   │   ├── badge.jsx        # Status badges
│   │   │   ├── avatar.jsx       # User avatar
│   │   │   ├── dialog.jsx       # Dialog component
│   │   │   ├── tabs.jsx         # Tab navigation
│   │   │   ├── skeleton.jsx     # Loading skeleton
│   │   │   ├── seperator.jsx    # Visual separator
│   │   │   └── EventCard.jsx    # Event display card
│   │   │
│   │   └── user/                # User-specific components
│   │
│   ├── context/                 # 🌍 React Context providers
│   │   └── AuthContext.jsx      # Authentication state management
│   │
│   ├── hooks/                   # 🎣 Custom React hooks
│   │   ├── useAuth.jsx          # Hook to access auth context
│   │   └── use-toasts.jsx       # Toast notification hook
│   │
│   ├── pages/                   # 📄 Page components
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── Events.jsx           # Events listing page
│   │   ├── EventDetailPage.jsx  # Single event details
│   │   ├── RegistrationPage.jsx # Event registration form
│   │   ├── DashboardPage.jsx    # User dashboard
│   │   ├── AdminDasboardPage.jsx # Admin dashboard
│   │   ├── GalleryPage.jsx      # Photo gallery
│   │   ├── ContactPage.jsx      # Contact form
│   │   ├── AboutPage.jsx        # About us page
│   │   ├── ClubForm.jsx         # Class membership form
│   │   └── NotFound.jsx         # 404 error page
│   │
│   ├── services/                # 🔧 API communication layer
│   │   ├── api.jsx              # Central API fetch wrapper
│   │   ├── eventApi.jsx         # Event-related API calls
│   │   └── contactApi.jsx       # Contact form API calls
│   │
│   ├── lib/                     # 📚 Third-party library utilities
│   │   └── utils.jsx            # Utility functions (cn, etc.)
│   │
│   ├── utils/                   # 🛠️ Helper functions
│   │   └── formatDate.js        # Date formatting utilities
│   │
│   ├── styles/                  # 💅 Global styles
│   │   └── theme.css            # Theme variables and custom styles
│   │
│   ├── App.jsx                  # 🚀 Main app component & routing
│   ├── main.jsx                 # 📌 Application entry point
│   └── index.css                # 🎨 Global CSS imports
│
├── docs/                        # 📚 Documentation
│   └── PROJECT_STRUCTURE.md     # This file
│
├── index.html                   # 📄 HTML template
├── package.json                 # 📦 Dependencies & scripts
├── vite.config.js               # ⚙️ Vite configuration
├── eslint.config.js             # 🔍 ESLint rules
├── vercel.json                  # 🚀 Vercel deployment config
├── .env                         # 🔐 Environment variables (local)
├── .env.production.template     # 📋 Production env template
├── .gitignore                   # 🚫 Git ignore rules
└── node_modules/                # 📚 Installed packages

```

---

## 🔧 Core Components

### 1. **main.jsx** - Application Entry Point

**Purpose:** Bootstrap the React application with providers

```jsx
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HelmetProvider>
);
```

**Key Features:**

- ✅ Wraps app with context providers
- ✅ Configures SEO with HelmetProvider
- ✅ Manages authentication state globally
- ✅ Imports global styles

**Best Practices:**

- Keep providers in order (outermost to innermost)
- Only include essential global providers here
- Avoid heavy computations at root level

---

### 2. **App.jsx** - Main Application & Routing

**Purpose:** Defines application routes and structure

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layouts/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

**Route Categories:**

**Public Routes** (No Authentication):

- `/` - Home page
- `/events` - Event listing
- `/events/:id` - Event details
- `/gallery` - Photo gallery
- `/contact` - Contact form
- `/about` - About page
- `/joinacademy` - Class membership

**Protected Routes** (Requires Login):

- `/dashboard` - User dashboard
- `/register/:id` - Event registration

**Admin Routes** (Requires Admin Role):

- `/admin` - Admin dashboard
- `/admin/events` - Manage events
- `/admin/registrations` - View registrations
- `/admin/gallery` - Manage gallery
- `/admin/allcontactmessages` - View messages
- `/admin/class-registrations` - View memberships

**Best Practices:**

- ✅ Group routes by access level
- ✅ Use route parameters for dynamic pages
- ✅ Include ScrollToTop for better UX
- ✅ Always have a 404 catch-all route
- ✅ Lazy load heavy pages with React.lazy()

---

### 3. **context/AuthContext.jsx** - Authentication State

**Purpose:** Global authentication state management

```jsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    // Fetch user on mount
    fetch(`${API_URL}/api/users/me`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAuth({ user: data?.user || null, loading: false }))
      .catch(() => setAuth({ user: null, loading: false }));
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("auth_token");
    setAuth({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Features:**

- ✅ Persists user session across page reloads
- ✅ Supports both cookies and localStorage tokens
- ✅ Loading state prevents flash of wrong content
- ✅ Centralized logout logic

**Usage in Components:**

```jsx
import useAuth from "../hooks/useAuth";

function MyComponent() {
  const { auth, logout } = useAuth();

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {auth.user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Best Practices:**

- ✅ Always check loading state
- ✅ Use httpOnly cookies when possible
- ✅ Clear tokens on logout
- ✅ Handle network errors gracefully

---

### 4. **hooks/** - Custom React Hooks

#### **useAuth.jsx**

**Purpose:** Convenient access to auth context

```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useContext(AuthContext);
}
```

**Usage:**

```jsx
const { auth, logout, setAuth } = useAuth();
```

**Best Practices:**

- ✅ Create custom hooks for all contexts
- ✅ Keep hooks focused on single concern
- ✅ Return object for extensibility
- ✅ Add type safety with TypeScript (future)

---

### 5. **services/** - API Communication Layer

#### **api.jsx** - Central API Handler

**Purpose:** Unified API request wrapper

```jsx
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("auth_token");

  const opts = {
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData correctly
  if (opts.body instanceof FormData) {
    delete opts.headers["Content-Type"];
  }

  const res = await fetch(`${baseUrl}${endpoint}`, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

**Key Features:**

- ✅ Centralized base URL configuration
- ✅ Automatic token injection
- ✅ Credential handling (cookies)
- ✅ FormData support
- ✅ Error handling

---

#### **eventApi.jsx** - Event-Specific APIs

**Purpose:** Event-related API calls

```jsx
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchEvents({ ageGroup, featured, includePast } = {}) {
  let url = `${API_URL}/api/events`;
  const params = [];
  if (featured) params.push(`featured=true`);
  if (ageGroup) params.push(`ageGroup=${encodeURIComponent(ageGroup)}`);
  if (includePast) params.push(`includePast=true`);
  if (params.length) url += `?${params.join("&")}`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchEventById(id) {
  const url = `${API_URL}/api/events/${id}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

**Best Practices:**

- ✅ One file per resource/domain
- ✅ Export named functions
- ✅ Use query parameters for filtering
- ✅ Handle errors appropriately
- ✅ Use environment variables for URLs

---

### 6. **components/** - UI Components

#### **Component Categories:**

**1. Layout Components** (`components/layouts/`)

- **Header.jsx** - Navigation bar with auth state
- **Footer.jsx** - Site footer
- **ScrollToTop.jsx** - Auto-scroll on route change

**2. UI Primitives** (`components/ui/`)

- **button.jsx** - Reusable button with variants
- **input.jsx** - Form input fields
- **card.jsx** - Content containers
- **modal.jsx** - Dialog boxes
- **badge.jsx** - Status indicators
- **tabs.jsx** - Tabbed navigation
- **skeleton.jsx** - Loading placeholders

**3. Feature Components** (`components/home/`, `components/auth/`)

- **Hero.jsx** - Landing hero section
- **EventSection.jsx** - Featured events display
- **LoginModal.jsx** - Login form
- **RegisterModal.jsx** - Registration form

**4. Admin Components** (`components/admin/`)

- **AdminRoute.jsx** - Protected route wrapper
- **AllEvents.jsx** - Admin event management
- **AllRegistrations.jsx** - Registration overview
- **ManageEvent.jsx** - Event CRUD operations

---

#### **Component Pattern Example:**

```jsx
// components/ui/button.jsx
import { cn } from "../../lib/utils";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Best Practices:**

- ✅ Use composition over inheritance
- ✅ Accept className for extensibility
- ✅ Spread remaining props (...props)
- ✅ Use cn() utility for class merging
- ✅ Define variants for reusability
- ✅ Keep components focused and small

---

### 7. **pages/** - Page Components

**Purpose:** Full page components that compose smaller components

**Pattern:**

```jsx
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const HomePage = () => {
  useEffect(() => {
    document.title = "Sangli Skating";
  }, []);

  return (
    <>
      <Helmet>
        <title>Sangli Skating</title>
        <meta name="description" content="..." />
        <meta property="og:title" content="Sangli Skating" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{/* Page content */}</main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
```

**Key Pages:**

- **HomePage** - Landing page with hero, events, timeline
- **Events** - Event listing with filters
- **EventDetailPage** - Single event details
- **RegistrationPage** - Event registration form
- **DashboardPage** - User dashboard with registrations
- **AdminDashboardPage** - Admin control panel
- **GalleryPage** - Photo gallery
- **ContactPage** - Contact form

**Best Practices:**

- ✅ Use React Helmet for SEO
- ✅ Set page title on mount
- ✅ Include Open Graph meta tags
- ✅ Use semantic HTML
- ✅ Ensure responsive design
- ✅ Add loading states

---

### 8. **lib/utils.jsx** - Utility Functions

**Purpose:** Helper functions for common tasks

```jsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes intelligently
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**Usage:**

```jsx
<div className={cn(
  "base-class",
  isActive && "active-class",
  props.className
)}>
```

**Best Practices:**

- ✅ Use for class name merging
- ✅ Prevents Tailwind class conflicts
- ✅ Supports conditional classes
- ✅ Maintains class precedence

---

### 9. **utils/** - Helper Functions ✨ UPDATED

#### **apiConfig.js** - Centralized API Configuration ✨ NEW

**Purpose:** Single source of truth for API base URL and common fetch options

```javascript
// Get API base URL from environment
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Default fetch options with credentials
export const defaultFetchOptions = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper to build full API URLs
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

// Helper to create fetch options with auth token
export const getFetchOptions = (options = {}) => {
  const token = localStorage.getItem("auth_token");

  const mergedOptions = {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (token) {
    mergedOptions.headers.Authorization = `Bearer ${token}`;
  }

  return mergedOptions;
};
```

**Usage in Services:**

```javascript
import { getApiUrl, getFetchOptions } from "../utils/apiConfig.js";

// Simple GET request
const response = await fetch(getApiUrl("/api/events"), getFetchOptions());

// POST request with body
const response = await fetch(
  getApiUrl("/api/registrations"),
  getFetchOptions({
    method: "POST",
    body: JSON.stringify(data),
  })
);

// FormData upload (no Content-Type header)
const formData = new FormData();
const response = await fetch(
  getApiUrl("/api/upload"),
  getFetchOptions({
    method: "POST",
    body: formData,
    headers: {}, // Clear headers for FormData
  })
);
```

**Benefits:**

- ✅ No more hardcoded URLs across 18+ files
- ✅ Automatic token injection
- ✅ Consistent credential handling
- ✅ Easy to switch environments
- ✅ Centralized header management

**Before (duplicated in every file):**

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("auth_token");

fetch(`${API_URL}/api/events`, {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

**After (centralized):**

```javascript
import { getApiUrl, getFetchOptions } from "../utils/apiConfig.js";

fetch(getApiUrl("/api/events"), getFetchOptions());
```

---

#### **authHelpers.js** - Authentication Utilities ✨ NEW

**Purpose:** Centralized authentication token management

```javascript
// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("auth_token", token);
  }
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get Authorization header value
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
};
```

**Usage:**

```javascript
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from "../utils/authHelpers.js";

// On login success
setAuthToken(response.token);

// On logout
removeAuthToken();

// Check authentication
if (!isAuthenticated()) {
  navigate("/login");
}

// Get token for API calls
const token = getAuthToken();
```

**Benefits:**

- ✅ No more duplicate `localStorage.getItem("auth_token")` calls
- ✅ Consistent token key across app
- ✅ Easy to switch storage mechanism (cookies, sessionStorage)
- ✅ Centralized token management

**Files Updated to Use Centralized Helpers:**

1. `src/context/AuthContext.jsx`
2. `src/components/auth/LoginModal.jsx`
3. `src/components/auth/RegisterModal.jsx`
4. `src/pages/RegistrationPage.jsx`
5. `src/pages/DashboardPage.jsx`
6. `src/pages/ClubForm.jsx`
7. `src/components/admin/AdminRoute.jsx`
8. `src/components/admin/Pages/AllEvents.jsx`
9. `src/components/admin/Pages/AllGallery.jsx`
10. `src/components/admin/Pages/AllRegistrations.jsx`
11. `src/components/admin/Pages/AllContactMessage.jsx`
12. `src/components/admin/Pages/AllClassRegistrations.jsx`
13. `src/components/admin/services/ManageEvent.jsx`
14. `src/services/api.jsx`
15. `src/services/eventApi.jsx`
16. `src/services/contactApi.jsx`
17. And more...

---

#### **formatDate.js**

**Purpose:** Date formatting utilities

```javascript
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN");
};
```

---

### 10. **components/admin/AdminRoute.jsx** - Protected Routes

**Purpose:** Restrict access to admin-only pages

```jsx
export default function AdminRoute({ children }) {
  const { auth } = useAuth();
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (!auth.loading && (!auth.user || auth.user.role !== "admin")) ||
      !token
    ) {
      navigate("/", { replace: true });
    }
  }, [auth, token, navigate]);

  if (auth.loading) {
    return <div>Checking admin access...</div>;
  }

  if (!auth.user || auth.user.role !== "admin") {
    return null;
  }

  return children;
}
```

**Features:**

- ✅ Checks authentication state
- ✅ Verifies admin role
- ✅ Redirects unauthorized users
- ✅ Shows loading state

**Usage:**

```jsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

---

## 🎯 Best Practices

### 1. **Component Design**

```jsx
// ✅ DO: Functional components with hooks
function MyComponent({ title, onAction }) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click</button>
    </div>
  );
}

// ❌ DON'T: Class components
class MyComponent extends React.Component {
  // Outdated pattern
}

// ✅ DO: Destructure props
function Button({ label, onClick, variant = "primary" }) {}

// ❌ DON'T: Access props object
function Button(props) {
  return <button>{props.label}</button>;
}
```

---

### 2. **State Management**

```jsx
// ✅ DO: Use Context for global state
const { auth } = useAuth();

// ✅ DO: Use useState for local state
const [isOpen, setIsOpen] = useState(false);

// ❌ DON'T: Prop drilling through many layers
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />
  </Child>
</Parent>;

// ✅ DO: Lift state to nearest common ancestor
function Parent() {
  const [value, setValue] = useState("");
  return (
    <>
      <ComponentA value={value} onChange={setValue} />
      <ComponentB value={value} />
    </>
  );
}
```

---

### 3. **API Calls**

```jsx
// ✅ DO: Handle loading and error states
function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => setEvents(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (error) return <Error message={error} />;
  return <EventGrid events={events} />;
}

// ❌ DON'T: Ignore error states
function EventList() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);
  return <EventGrid events={events} />;
}
```

---

### 4. **Performance**

```jsx
// ✅ DO: Memoize expensive computations
const sortedEvents = useMemo(() => {
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}, [events]);

// ✅ DO: Use callback memoization
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// ✅ DO: Lazy load heavy components
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// ❌ DON'T: Create functions in render
function Component() {
  return <button onClick={() => console.log("clicked")}>Click</button>;
}
```

---

### 5. **Forms**

```jsx
// ✅ DO: Use React Hook Form for complex forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

### 6. **Styling**

```jsx
// ✅ DO: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ✅ DO: Use cn() utility for conditional classes
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-600 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// ✅ DO: Extract repeated styles to components
<Button variant="primary" size="lg">Click Me</Button>

// ❌ DON'T: Use inline styles excessively
<div style={{ padding: "16px", margin: "8px" }}>
```

---

### 7. **SEO Optimization**

```jsx
// ✅ DO: Use React Helmet for meta tags
import { Helmet } from "react-helmet-async";

function EventPage({ event }) {
  return (
    <>
      <Helmet>
        <title>{event.title} | Sangli Skating</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={event.title} />
        <meta property="og:image" content={event.image} />
      </Helmet>
      {/* Page content */}
    </>
  );
}

// ✅ DO: Use semantic HTML
<header>, <main>, <nav>, <article>, <section>, <footer>

// ✅ DO: Add alt text to images
<img src={src} alt="Skating event at Mumbai" />
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

1. **Navigate to Client**

```bash
cd client
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**
   Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://your-backend-api.com
```

4. **Start Development Server**

```bash
npm run dev
```

Server runs at: `http://localhost:5173`

5. **Build for Production**

```bash
npm run build
```

Output: `dist/` folder

6. **Preview Production Build**

```bash
npm run preview
```

---

## 🔍 Common Patterns

### Adding a New Page

**Example: Add "Certificates" page**

1. **Create Page Component** (`src/pages/CertificatesPage.jsx`)

```jsx
import { Helmet } from "react-helmet-async";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

export default function CertificatesPage() {
  return (
    <>
      <Helmet>
        <title>Certificates | Sangli Skating</title>
        <meta name="description" content="Download your skating certificates" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1>My Certificates</h1>
          {/* Content */}
        </main>
        <Footer />
      </div>
    </>
  );
}
```

2. **Add Route** (`src/App.jsx`)

```jsx
import CertificatesPage from "./pages/CertificatesPage";

// In Routes
<Route path="/certificates" element={<CertificatesPage />} />;
```

3. **Add Navigation Link** (`src/components/layouts/Header.jsx`)

```jsx
<Link to="/certificates">Certificates</Link>
```

---

### Creating a Reusable Component

**Example: Create "Alert" component**

1. **Create Component** (`src/components/ui/alert.jsx`)

```jsx
import { cn } from "../../lib/utils";

export default function Alert({ children, variant = "info", className }) {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={cn("p-4 rounded border", variants[variant], className)}>
      {children}
    </div>
  );
}
```

2. **Use Component**

```jsx
import Alert from "./components/ui/alert";

<Alert variant="success">Registration successful!</Alert>;
```

---

### Making API Calls

**Example: Fetch user registrations**

1. **Create Service Function** (`src/services/registrationApi.jsx`)

```jsx
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUserRegistrations() {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_URL}/api/registrations`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch registrations");
  return res.json();
}
```

2. **Use in Component**

```jsx
import { useState, useEffect } from "react";
import { fetchUserRegistrations } from "../services/registrationApi";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRegistrations()
      .then((data) => setRegistrations(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {registrations.map((reg) => (
        <div key={reg.id}>{reg.event_name}</div>
      ))}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**

```
Access to fetch has been blocked by CORS policy
```

**Solution:**

- Backend must include your frontend URL in CORS whitelist
- Use `credentials: "include"` in fetch calls
- Check backend CORS configuration

**2. Environment Variables Not Working**

```
VITE_API_URL is undefined
```

**Solution:**

- Prefix with `VITE_` (required by Vite)
- Restart dev server after changing .env
- Use `import.meta.env.VITE_API_URL` (not process.env)

**3. Routes Not Working After Refresh**

```
Cannot GET /events
```

**Solution:**

- Configure server to serve index.html for all routes
- Vercel: Use `vercel.json` with rewrites
- Nginx: Configure try_files

**4. Tailwind Classes Not Applied**

```
Classes not working in production
```

**Solution:**

- Check `content` paths in tailwind.config.js
- Ensure all component files are included
- Avoid dynamic class names (use cn() utility)

**5. Build Fails**

```
Module not found or syntax error
```

**Solution:**

- Check import paths (case-sensitive)
- Verify all dependencies are installed
- Clear node_modules and reinstall
- Check for TypeScript errors

---

## 📦 Key Dependencies

**Core:**

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing

**Styling:**

- `tailwindcss` - Utility-first CSS
- `@tailwindcss/vite` - Tailwind Vite plugin
- `clsx` - Class name utility
- `tailwind-merge` - Merge Tailwind classes

**Forms:**

- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation
- `yup` - Schema validation

**HTTP:**

- `axios` - HTTP client

**Icons:**

- `@fortawesome/react-fontawesome` - Font Awesome icons
- `lucide-react` - Lucide icons

**Animations:**

- `framer-motion` - Animation library

**SEO:**

- `react-helmet-async` - Document head manager

**Utilities:**

- `jwt-decode` - JWT token decoding
- `file-saver` - File download utility
- `js-cookie` - Cookie management

---

## 📞 Support & Contributing

**Documentation:**

- Frontend Structure: `docs/PROJECT_STRUCTURE.md` (this file)
- Backend Structure: `server/docs/PROJECT_STRUCTURE.md`
- Database Schema: `server/docs/DB_SCHEMA.md`

**Contributing:**

1. Create feature branch
2. Follow React best practices
3. Use Tailwind for styling
4. Test responsiveness
5. Update documentation
6. Submit pull request

---

## 🎉 Recent Improvements (v2.1)

**December 28, 2025:**

### 🔧 API Configuration Centralization

- ✅ Created `utils/apiConfig.js` - Single source of truth for API URLs
- ✅ Eliminated 10+ hardcoded API URL instances
- ✅ Centralized fetch options with credentials
- ✅ Automatic Authorization header injection
- ✅ Helpers: `getApiUrl()`, `getFetchOptions()`

### 🔑 Authentication Helpers

- ✅ Created `utils/authHelpers.js` - Centralized token management
- ✅ Eliminated 8+ duplicate `localStorage.getItem("auth_token")` calls
- ✅ Functions: `getAuthToken()`, `setAuthToken()`, `removeAuthToken()`, `isAuthenticated()`, `getAuthHeader()`
- ✅ Consistent token handling across entire app

### 📝 Files Updated (18+ files)

- ✅ `src/context/AuthContext.jsx`
- ✅ `src/components/auth/LoginModal.jsx`
- ✅ `src/components/auth/RegisterModal.jsx`
- ✅ `src/pages/RegistrationPage.jsx`
- ✅ `src/pages/DashboardPage.jsx`
- ✅ `src/pages/ClubForm.jsx`
- ✅ `src/components/admin/AdminRoute.jsx`
- ✅ All admin page components (AllEvents, AllGallery, AllRegistrations, etc.)
- ✅ All service files (api.jsx, eventApi.jsx, contactApi.jsx)
- ✅ Admin service components (ManageEvent, etc.)

### 🚀 Benefits

- ✅ **Maintainability**: Change API URL in one place
- ✅ **Consistency**: All API calls follow same pattern
- ✅ **Security**: Centralized token management
- ✅ **Developer Experience**: Simpler, cleaner code
- ✅ **Production Ready**: Easy environment switching

### 📊 Code Quality

- ✅ Reduced code duplication by ~200 lines
- ✅ Improved code maintainability
- ✅ Better separation of concerns
- ✅ Consistent error handling

### 🔄 Migration Pattern

**Before:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("auth_token");

fetch(`${API_URL}/api/events`, {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

**After:**

```javascript
import { getApiUrl, getFetchOptions } from "../utils/apiConfig.js";

fetch(getApiUrl("/api/events"), getFetchOptions());
```

---

**Document Version:** 2.1  
**Last Updated:** December 28, 2025  
**Maintained by:** Development Team
