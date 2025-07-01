import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layouts/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/Events";
import EventDetailPage from "./pages/EventDetailPage";
import RegistrationPage from "./pages/RegistrationPage";
import DashboardPage from "./pages/DashboardPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

// Admin Components
import AdminDashboardPage from "./pages/AdminDasboardPage";
import AdminRoute from "./components/admin/AdminRoute";
import AddEvent from "./components/admin/services/ManageEvent";
import AllRegistrations from "./components/admin/Pages/AllRegistrations";
import AllEvents from "./components/admin/Pages/AllEvents";
import AllContactMessage from "./components/admin/Pages/AllContactMessage";
import AllGallery from "./components/admin/Pages/AllGallery";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/register/:id?" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/addevent"
          element={
            <AdminRoute>
              <AddEvent />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/registrations"
          element={
            <AdminRoute>
              <AllRegistrations />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AllEvents />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/allcontactmessages"
          element={
            <AdminRoute>
              <AllContactMessage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminRoute>
              <AllGallery />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
