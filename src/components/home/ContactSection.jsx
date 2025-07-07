import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
  faClock,
  faUser,
  faTag,
  faPaperPlane,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { toast } from "../../hooks/use-toasts";
import Button from "../ui/button";
import Input from "../ui/input";
import Skeleton from "../ui/skeleton";
import { sendContactMessage } from "../../services/contactApi";

const ContactSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  const [error, setError] = useState("");

  // Simple client-side validation
  const validate = (data) => {
    if (!data.name || data.name.length < 2)
      return "Name must be at least 2 characters.";
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
      return "Please enter a valid email address.";
    if (!data.subject || data.subject.length < 3)
      return "Subject must be at least 3 characters.";
    if (!data.message || data.message.length < 10)
      return "Message must be at least 10 characters.";
    return null;
  };

  const onSubmit = async (data) => {
    setError("");
    const validationError = validate(data);
    if (validationError) {
      setError(validationError);
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await sendContactMessage({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
      toast({
        title: "Message Sent!",
        description:
          "Thank you for your message. We will get back to you soon.",
        variant: "success",
      });
      form.reset();
    } catch (e) {
      toast({
        title: "Error",
        description:
          (e && (e.message || e.toString())) ||
          "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white relative overflow-hidden">
      {/* Decorative Gradient Circles */}
      {/* <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-blue-400/80 to-pink-300/80 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-pink-400/80 to-blue-200/60 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-blue-200/90 to-pink-200/60 rounded-full blur-2xl animate-pulse z-0 -translate-x-1/2 -translate-y-1/2" /> */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl z-0 border border-white/30 shadow-2xl" />
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-300 to-blue-200 opacity-60 animate-gradient-x" />
      <div className="container mx-auto px-4 relative z-10">
        <div
          className="mb-12 text-center animate-fade-in-up"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-3 bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-xl">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in">
            We would love to hear from you! Whether you have a question about
            events, registration, or anything else, our team is ready to answer
            all your questions.
          </p>
        </div>
        <div
          className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in-up"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* Contact Information */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-8 flex-1 border border-blue-100 animate-fade-in backdrop-blur-md">
            <h3 className="text-xl font-bold font-montserrat mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Contact Information
            </h3>
            <div className="space-y-5">
              <div className="flex items-start animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-500 mr-4 shadow-lg ">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Address</h4>
                  <p className="text-gray-600">
                    Chatrapati Shivaji Stadium Skating Rink, Near Ambrai Garden
                    , Sangli 416416{" "}
                  </p>
                </div>
              </div>
              <div className="flex items-start animate-fade-in delay-100">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-500 mr-4 shadow-lg ">
                  <FontAwesomeIcon icon={faPhoneAlt} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <p className="text-gray-600">
                    +91 9595893434 (Suraj A. Shinde)
                  </p>
                  <p className="text-gray-600">+91 1111111111 (XYZ)</p>
                </div>
              </div>
              <div className="flex items-start animate-fade-in delay-200">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-500 mr-4 shadow-lg ">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p className="text-gray-600">
                    {" "}
                    sangliskatingacademy@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start animate-fade-in delay-300">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-500 mr-4 shadow-lg ">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Office Hours</h4>
                  <p className="text-gray-600">
                    Monday-Friday: 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg "
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg  delay-100"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white hover:bg-pink-500 transition-colors shadow-lg  delay-200"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg  delay-300"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-8 flex-1 border border-blue-100 animate-fade-in backdrop-blur-md">
            <h3 className="text-xl font-bold font-montserrat mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Send Us a Message
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative group animate-fade-in">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
                />
                <Input
                  {...form.register("name")}
                  placeholder="Your Name*"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-base"
                  disabled={isLoading}
                />
              </div>
              <div className="relative group animate-fade-in delay-100">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
                />
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Email Address*"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-base"
                  disabled={isLoading}
                />
              </div>
              <div className="relative group animate-fade-in delay-150">
                <FontAwesomeIcon
                  icon={faPhoneAlt}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
                />
                <Input
                  {...form.register("phone")}
                  type="tel"
                  placeholder="Phone (optional)"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-base"
                  disabled={isLoading}
                />
              </div>
              <div className="relative group animate-fade-in delay-200">
                <FontAwesomeIcon
                  icon={faTag}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
                />
                <Input
                  {...form.register("subject")}
                  placeholder="Subject*"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-base"
                  disabled={isLoading}
                />
              </div>
              <div className="relative group animate-fade-in delay-300">
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="absolute left-3 top-4 text-blue-300 group-focus-within:text-blue-600 transition-colors"
                />
                <textarea
                  {...form.register("message")}
                  rows={4}
                  placeholder="Message*"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-base resize-none"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="text-red-600 text-center mb-2 animate-fade-in">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-lg hover:from-pink-500 hover:to-blue-500 font-semibold text-center shadow-lg flex items-center justify-center gap-2 transition-all animate-fade-in text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={isLoading ? "animate-spin" : ""}
                />
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
