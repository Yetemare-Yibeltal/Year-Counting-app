import React from "react";
import { Heart, Github, Linkedin, Mail, ShieldCheck, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 text-gray-300 pt-12 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* TOP SECTION: BRANDING & NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Developer Profile Banner */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="../../src/profile-photo.jpg"
                alt="Metages Yibeltal"
                className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Metages Yibeltal
                </h3>
                <p className="text-xs text-indigo-400 font-medium">
                  Full-Stack Engineer & Software Developer 
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              Engineering robust calendar synchronization, real-time telemetry systems, and full-stack web architectures with modern performance standards.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold uppercase text-gray-200 tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-indigo-400 transition-colors">
                  System Converter
                </a>
              </li>
              <li>
                <a href="/tracking" className="hover:text-indigo-400 transition-colors">
                  Live Telemetry
                </a>
              </li>
              <li>
                <a href="/simulator" className="hover:text-indigo-400 transition-colors">
                  Orbital Dynamics
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Status & Contact */}
          <div className="space-y-3 font-mono text-xs">
          </div>
        </div>

        {/* MIDDLE SECTION: SEPARATOR */}
        <div className="border-t border-gray-800/80" />

        {/* BOTTOM SECTION: ATTRIBUTION & COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          
          {/* Heart Attribution */}
          <div className="flex items-center gap-1.5">
            <span>Built by</span>
            <span className="font-bold text-white">Metages Yibeltal</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse inline" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright Statement */}
          <div>
            © {currentYear} Metages Yibeltal. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;