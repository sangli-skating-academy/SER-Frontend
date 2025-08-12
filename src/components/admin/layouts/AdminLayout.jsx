import AdminPanel from "../Modals/AdminPanel";

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
      {/* Main Content */}
      <main className="flex-1 w-full px-0 md:px-0 py-6 md:py-10 transition-all duration-300">
        {children}
      </main>

      {/* Bottom Navigation */}
      <AdminPanel />
    </div>
  );
}
