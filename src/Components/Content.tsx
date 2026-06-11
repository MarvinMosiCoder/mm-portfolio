import React, { useEffect, useState } from 'react';
import Experience from './Experience';
import { Element } from 'react-scroll';
import Projects from './Projects';
import MainView from './MainView';
import Contact from './Contact';
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from './Navbar';
import LiquidEther from './Reactbits/LiquidEther';

const Content: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Load saved theme from localStorage or system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const liquidEtherColors = darkMode
    ? ['#14b8a6', '#67e8f9', '#f0abfc']
    : ['#0f766e', '#0891b2', '#c026d3'];

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1200,
      offset: 100,
      once: false,
    });
  }, []);

  // Apply theme to <html> and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* Background and text switch automatically with Tailwind dark classes */}
      <div
        className={`portfolio-shell relative min-h-screen overflow-hidden transition-colors duration-500 
        ${darkMode ? "text-white" : "text-neutral-900"} 
        antialiased selection:bg-neutral-800/80 selection:text-white `}
      >
        <div className="portfolio-liquid-background" aria-hidden="true">
          <LiquidEther
            colors={liquidEtherColors}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.45}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        
        {/* Pass theme controls to Navbar so it can toggle */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="pb-8 lg:pb-12">
             <Element name="about" data-section="about">
              <MainView darkMode={darkMode} setDarkMode={setDarkMode} />  
             </Element>
          </div>
          <div className="py-8 lg:py-12">
            <Element name="experience" data-section="experience">
              <Experience darkMode={darkMode}/>
            </Element>
          </div>
          <div className="py-8 lg:py-10">
            <Element name="projects" data-section="projects">
              <Projects darkMode={darkMode}/>
            </Element>
          </div>
          <div className="py-8 lg:pb-16" data-aos="fade-down">
            <Element name="contact" data-section="contact">
              <Contact darkMode={darkMode}/>
            </Element>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
