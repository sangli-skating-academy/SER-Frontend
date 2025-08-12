import Button from "../components/ui/button";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CheckCircle } from "lucide-react";

import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

const team = [
  {
    id: 1,
    name: "Suraj Ashok Shinde",
    role: "International Coach",
    bio: "",
    image: "/placeholder.svg",
  },
];

const achievements = [
  {
    year: "2024",
    title: "Record-breaking National Event",
    description:
      "Hosted the largest skating event in India with 800+ participants from 25 states.",
  },
  {
    year: "2023",
    title: "Digital Transformation",
    description:
      "Launched a fully online registration and scoring platform, reducing paperwork by 90%.",
  },
  {
    year: "2022",
    title: "Youth Outreach",
    description:
      "Started a program for underprivileged youth, supporting 300+ new skaters.",
  },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <Helmet>
        <title>Sangli Skating | About Us</title>
        <meta name="description" content="About Us" />
        <meta property="og:title" content="Sangli Skating About Us" />
        <meta property="og:description" content="Sangli Skating | About Us" />
        <meta property="og:type" content="About Us" />
      </Helmet>

      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto"
      >
        {/* Title & Intro */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            About Sangli Miraj Kupwad Roller Skating Association
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-gray-600">
            Empowering the skating community with seamless event registration,
            transparent results, and a vibrant network for athletes, coaches,
            and organizers across India.
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img
              src="/logo-header.png"
              alt="Sangli Miraj Kupwad Roller Skating Association"
              className="rounded-xl shadow-lg w-full max-w-md lg:max-w-lg object-cover border border-blue-100"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              The Website is created to make sports event management effortless
              and accessible. We believe every skater deserves a fair, fun, and
              memorable competition experience.
            </p>
            <p className="text-gray-700 mb-4">
              Our platform is built for the community, by the community —
              constantly evolving with your feedback and needs.
            </p>
            <p className="text-gray-700">
              Join us as we continue to innovate, inspire, and grow the sport of
              skating together.
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="team" className="mb-16">
          <TabsList className="grid grid-cols-2 w-full mb-8 bg-blue-100/70">
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden h-full bg-white shadow-md border border-gray-100">
                    <div className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-3">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold text-blue-700">
                        {member.name}
                      </h3>
                      <p className="text-blue-500 mb-2">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Our Achievements
            </h2>
            <div className="max-w-3xl mx-auto">
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-8 relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-600"
                >
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-600 -translate-x-1/2 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {a.year}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {a.title}
                    </h3>
                    <p className="text-gray-600">{a.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Footer />
    </>
  );
}
