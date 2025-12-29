# 🎨 Frontend Architecture & Developer Guide

**Version:** 2.1  
**Last Updated:** December 28, 2025  
**Project:** Sangli Skating Academy - Event Registration System (Frontend)

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
├── src/                         # 📦 Main source code
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
│   │   ├── ui/                  # Reusable UI primitives
│   │   │   ├── avatar.jsx       # User avatar
│   │   │   ├── badge.jsx        # Status badges
│   │   │   ├── button.jsx       # Custom button component
│   │   │   ├── card.jsx         # Card container
│   │   │   ├── dialog.jsx       # Dialog component
│   │   │   ├── EventCard.jsx    # Event display card
│   │   │   ├── input.jsx        # Input field
│   │   │   ├── Modal.jsx        # Modal dialog
│   │   │   ├── select.jsx       # Dropdown select
│   │   │   ├── skeleton.jsx     # Loading skeleton
│   │   │   └── tabs.jsx         # Tab navigation
│   │   │
│   │   └── user/                # User-specific components
│   │       ├── MembershipTab.jsx
│   │       ├── MyProfileTab.jsx
│   │       ├── RegistrationsTab.jsx
│   │       ├── Pay/             # Payment components
│   │       └── userDetailModal/ # User detail modal components
│   │
│   ├── context/                 # 🌍 React Context providers
│   │   └── AuthContext.jsx      # Authentication state management
│   │
│   ├── hooks/                   # 🎣 Custom React hooks
│   │   ├── useAuth.jsx          # Hook to access auth context
│   │   └── use-toasts.jsx       # Toast notification hook
│   │
│   ├── pages/                   # 📄 Page components
│   │   ├── AboutPage.jsx        # About us page
│   │   ├── AdminDasboardPage.jsx # Admin dashboard
│   │   ├── ClubForm.jsx         # Class membership form
│   │   ├── ContactPage.jsx      # Contact form
│   │   ├── DashboardPage.jsx    # User dashboard
│   │   ├── EventDetailPage.jsx  # Single event details
│   │   ├── Events.jsx           # Events listing page
│   │   ├── GalleryPage.jsx      # Photo gallery
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── NotFound.jsx         # 404 error page
│   │   └── RegistrationPage.jsx # Event registration form
│   │
│   ├── services/                # 🔧 API communication layer
│   │   ├── api.jsx              # Central API fetch wrapper
│   │   ├── contactApi.jsx       # Contact form API calls
│   │   └── eventApi.jsx         # Event-related API calls
│   │
│   ├── lib/                     # 📚 Third-party library utilities
│   │   └── utils.jsx            # Utility functions (cn, etc.)
│   │
│   ├── utils/                   # 🛠️ Helper functions
│   │   ├── apiConfig.js         # API URL and fetch options config
│   │   ├── authHelpers.js       # Authentication token helpers
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
├── package-lock.json            # 📦 Dependency lock file
├── vite.config.js               # ⚙️ Vite configuration
├── eslint.config.js             # 🔍 ESLint rules
├── vercel.json                  # 🚀 Vercel deployment config
├── .env                         # 🔐 Environment variables (local)
├── .env.production.template     # 📋 Production env template
├── .gitignore                   # 🚫 Git ignore rules
├── .git/                        # 🔧 Git repository data
└── node_modules/                # 📚 Installed packages

```

---

## 🔧 Core Components

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

---

### 1. **context/AuthContext.jsx** - Authentication State

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

---

### 2. **hooks/** - Custom React Hooks

#### **useAuth.jsx**

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

---

### 3. **services/** - API Communication Layer

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

---

### 4. **components/** - UI Components

#### **Component Categories:**

**1. Layout Components** (`components/layouts/`)

- **Header.jsx** - Navigation bar with auth state
- **Footer.jsx** - Site footer
- **ScrollToTop.jsx** - Auto-scroll on route change

**2. UI Primitives** (`components/ui/`)

- **avatar.jsx** - User avatar component
- **badge.jsx** - Status indicators
- **button.jsx** - Reusable button with variants
- **card.jsx** - Content containers
- **dialog.jsx** - Dialog component
- **EventCard.jsx** - Event display card
- **input.jsx** - Form input fields
- **Modal.jsx** - Modal dialog boxes
- **select.jsx** - Dropdown select
- **skeleton.jsx** - Loading placeholders
- **tabs.jsx** - Tabbed navigation

**3. Feature Components** (`components/home/`, `components/auth/`)

- **Hero.jsx** - Landing hero section
- **EventSection.jsx** - Featured events display
- **ContactSection.jsx** - Contact section
- **TimelineSection.jsx** - Timeline display
- **curosal.jsx** - Hero carousel
- **LoginModal.jsx** - Login form
- **RegisterModal.jsx** - Registration form

**4. Admin Components** (`components/admin/`)

- **AdminRoute.jsx** - Protected route wrapper
- **AllEvents.jsx** - Admin event management
- **AllRegistrations.jsx** - Registration overview
- **AllGallery.jsx** - Gallery management
- **AllContactMessage.jsx** - Contact messages management
- **AllClassRegistrations.jsx** - Class registrations management
- **ManageEvent.jsx** - Event CRUD operations (in services/)

**5. User Components** (`components/user/`)

- **MembershipTab.jsx** - User membership tab
- **MyProfileTab.jsx** - User profile tab
- **RegistrationsTab.jsx** - User registrations tab
- **Pay/** - Payment components
- **userDetailModal/** - User detail modal components

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

---

### 5. **lib/utils.jsx** - Utility Functions

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

---

### 6. **utils/** - Helper Functions

#### **apiConfig.js** - Centralized API Configuration

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

---

#### **authHelpers.js** - Authentication Utilities

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

### 7. **components/admin/AdminRoute.jsx** - Protected Routes

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

---

**Document Version:** 2.1  
**Last Updated:** December 28, 2025  
**Maintained by:** Development Team
