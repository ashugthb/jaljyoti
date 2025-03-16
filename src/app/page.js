"use client";
import { useState, useEffect, useRef } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import WaterUsage from "../components/WaterUsage";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  // Use noSsr option to avoid mismatches during hydration.
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"), { noSsr: true });

  // Define refs for each section
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const waterUsageRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  const [activeTab, setActiveTab] = useState("HOME");

  // Navigation items with associated refs and labels
  const navItems = [
    { id: "home", label: "HOME", ref: homeRef },
    { id: "about", label: "ABOUT", ref: aboutRef },
    { id: "water-usage", label: "WATER USAGE", ref: waterUsageRef },
    { id: "team", label: "TEAM", ref: teamRef },
    { id: "contact", label: "CONTACT", ref: contactRef }
  ];

  // Update the active tab based on scroll position
  const handleScroll = () => {
    const offset = 90; // Adjust based on header height
    const homePos = homeRef.current ? homeRef.current.getBoundingClientRect().top - offset : Infinity;
    const aboutPos = aboutRef.current ? aboutRef.current.getBoundingClientRect().top - offset : Infinity;
    const waterUsagePos = waterUsageRef.current ? waterUsageRef.current.getBoundingClientRect().top - offset : Infinity;
    const teamPos = teamRef.current ? teamRef.current.getBoundingClientRect().top - offset : Infinity;
    const contactPos = contactRef.current ? contactRef.current.getBoundingClientRect().top - offset : Infinity;

    if (homePos <= 0 && aboutPos > 0) {
      setActiveTab("HOME");
    } else if (aboutPos <= 0 && waterUsagePos > 0) {
      setActiveTab("ABOUT");
    } else if (waterUsagePos <= 0 && teamPos > 0) {
      setActiveTab("WATER USAGE");
    } else if (teamPos <= 0 && contactPos > 0) {
      setActiveTab("TEAM");
    } else if (contactPos <= 0) {
      setActiveTab("CONTACT");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function with offset
  const scrollToSection = (ref, tabName) => {
    if (ref.current) {
      const offset = 80; // Adjust this value based on the fixed header height
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      setActiveTab(tabName);
    }
  };

  return (
    <Box>
      <Header
        isMobile={isMobile}
        activeTab={activeTab}
        navItems={navItems}
        scrollToSection={scrollToSection}
      />
      <section id="home" ref={homeRef}>
        <Hero isMobile={isMobile} />
      </section>
      <section id="about" ref={aboutRef}>
        <About />
      </section>
      <section id="water-usage" ref={waterUsageRef}>
        <WaterUsage />
      </section>
      <section id="team" ref={teamRef}>
        <Team isMobile={isMobile} />
      </section>
      <section id="contact" ref={contactRef}>
        <Contact />
      </section>
      <Footer />
    </Box>
  );
}
