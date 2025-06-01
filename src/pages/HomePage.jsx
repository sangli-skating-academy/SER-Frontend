import { useEffect } from "react";
import Header from "../components/layouts/Header";
import Hero from "../components/home/Hero";
import EventsSection from "../components/home/EventSection";
import TimelineSection from "../components/home/TimelineSection";
import ContactSection from "../components/home/ContactSection";
import Footer from "../components/layouts/Footer";

const HomePage = () => {
  // Update page title for SEO
  useEffect(() => {
    document.title = "Sai Skating Academy - Join the Skating Community";
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <EventsSection />
        <TimelineSection />
        <ContactSection />
        {/* 
        <GallerySection />
        */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
