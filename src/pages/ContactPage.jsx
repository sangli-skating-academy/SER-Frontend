import { Helmet } from "react-helmet-async";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import ContactSection from "../components/home/ContactSection";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Sai Skating Academy</title>
        <meta
          name="description"
          content="Contact Sai Skating Academy for event information, registration, and general inquiries."
        />
        <meta property="og:title" content="Contact Us | Sai Skating Academy" />
        <meta
          property="og:description"
          content="Contact Sai Skating Academy for event information, registration, and general inquiries."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4">
            {/* Contact Section (Form + Info) */}
            <ContactSection />
            {/* Map Section */}
            <div
              className="mt-16 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <iframe
                title="Shivaji Stadium Skating Rink, Near Ambrai Garden , Sangli 416416  Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.4060193512306!2d74.5645!3d16.8524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc11e6e2e2e2e2e%3A0x2e2e2e2e2e2e2e2e!2sSangli%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[350px] border-0"
              ></iframe>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
