/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Layout, ChevronRight, Home, Compass, MessageSquare, User } from "lucide-react";
import Profile from "./Profile";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans text-slate-800 selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-md border-b border-white/30 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            N
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">NexusVillage</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md active:scale-95 transition-all duration-200">
          Enter Space
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 flex flex-col items-center max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Hero Image Section */}
              <section className="w-full max-w-lg mb-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group"
                >
                  <img 
                    alt="Isometric 3D view of collaborative space" 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1Vv82VT8PZ6Uiu-uAkDk352k69DPUxap8k-gsvhyuVAhW8VPpQ0slyX8Ll6sP9zabDXtfyrywObI_Yx58ZuJKi1UPn8IwGppl2cQ3y404pnDePflEjC7KDsCMdz75_TXIMRwk5byEoh6tHdzMApanDTrgWCDE1tqxHuyBhlFUEgmdUzcvNAucP2uCEfhbXpIxUEBPLKGxiF4EarfLEdt-E50Zy70eRmoa_Wm1JqmdykYRxZMCMav2mnOOHXeTPFgEG8ZvxHATh7Eg"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Label */}
                  <div className="absolute bottom-6 left-6 bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-800 border border-white/40 shadow-sm">
                    Live Collaborative Space #402
                  </div>
                </motion.div>
              </section>

              {/* Hero Text */}
              <section className="text-center max-w-xl mb-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight"
                >
                  Where Digital Meets <br />
                  <span className="text-blue-600">Dimensions</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg text-slate-600 mb-10 leading-relaxed px-4"
                >
                  Step into a serene 3D environment designed for focused collaboration. 
                  Interact with floating interfaces, build with your team, and redefine 
                  the web in an aesthetic village setting.
                </motion.p>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 px-4">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center transition-all hover:shadow-md"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Team Play</span>
                    <p className="text-base font-bold text-slate-800">Multiplayer UI</p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center transition-all hover:shadow-md"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                      <Layout className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Environment</span>
                    <p className="text-base font-bold text-slate-800">Zen Village</p>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 px-4 w-full max-w-md mx-auto">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Start Exploring
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-slate-700 py-5 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    View Showcase
                  </motion.button>
                </div>
              </section>
            </motion.div>
          ) : activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Profile />
            </motion.div>
          ) : (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center pt-20"
            >
              <p className="text-xl font-bold text-slate-400">Coming Soon</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-4 text-center mt-auto">
        <div className="flex justify-center gap-8 mb-6">
          <a className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors" href="#">Documentation</a>
          <a className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors" href="#">Privacy</a>
          <a className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors" href="#">Terms</a>
        </div>
        <p className="text-xs text-slate-300 font-medium">
          © 2026 NexusVillage Spatial Web Engine. All rights reserved.
        </p>
      </footer>

      {/* Fixed Footer Bar / Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-8 sm:gap-10">
        <motion.button 
          onClick={() => setActiveTab("home")}
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-blue-600" : "text-slate-400 hover:text-slate-800 transition-colors"}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </motion.button>
        <motion.button 
          onClick={() => setActiveTab("explore")}
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className={`flex flex-col items-center gap-1 ${activeTab === "explore" ? "text-blue-600" : "text-slate-400 hover:text-slate-800 transition-colors"}`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold">Explore</span>
        </motion.button>
        <motion.button 
          onClick={() => setActiveTab("chat")}
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className={`flex flex-col items-center gap-1 ${activeTab === "chat" ? "text-blue-600" : "text-slate-400 hover:text-slate-800 transition-colors"}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-bold">Chat</span>
        </motion.button>
        <motion.button 
          onClick={() => setActiveTab("profile")}
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className={`flex flex-col items-center gap-1 ${activeTab === "profile" ? "text-blue-600" : "text-slate-400 hover:text-slate-800 transition-colors"}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Profile</span>
        </motion.button>
      </nav>
    </div>
  );
}
