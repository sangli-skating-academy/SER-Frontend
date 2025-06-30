import AdminPanel from "../Modals/AdminPanel";

export default function AdminLayout({ children }) {
  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
      <AdminPanel />
      <main
        className="flex-1 min-h-screen transition-all duration-300 px-2 md:px-6 py-4 md:py-8 ml-2 md:ml-44"
        style={{ minHeight: "100vh" }}
      >
        {children}
      </main>
    </div>
  );
}
