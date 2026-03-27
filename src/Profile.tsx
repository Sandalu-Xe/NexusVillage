import { motion } from "motion/react";
import { User, Mail, Settings, Bell, Shield, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="w-full flex flex-col items-center">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mb-24"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
          <div className="absolute -bottom-16 left-8 lg:left-12">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400">
                <User size={64} />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200">
              Edit
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8 lg:px-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">nexus_explorer</h1>
          <p className="text-slate-500 font-medium mb-8">Digital Villager • Level 12</p>

          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-blue-600 mb-1">42</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Spaces Visited</span>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-emerald-600 mb-1">1,024</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Nexus Points</span>
            </div>
          </div>

          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Settings & Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100 hover:shadow-sm cursor-pointer group">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Mail className="text-blue-500 w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900">Email Address</p>
                 <p className="text-xs font-medium text-slate-500">explorer@nexusvillage.app</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100 hover:shadow-sm cursor-pointer group">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Bell className="text-amber-500 w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900">Notifications</p>
                 <p className="text-xs font-medium text-slate-500">Manage alerts and sounds</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100 hover:shadow-sm cursor-pointer group">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Shield className="text-emerald-500 w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900">Privacy & Security</p>
                 <p className="text-xs font-medium text-slate-500">Protect your spatial identity</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100 hover:shadow-sm cursor-pointer group">
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Settings className="text-slate-500 w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900">App Preferences</p>
                 <p className="text-xs font-medium text-slate-500">Theme, graphics, and performance</p>
               </div>
            </div>
          </div>

          <button className="mt-8 w-full py-4 rounded-2xl font-bold text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100 transition-colors flex items-center justify-center gap-2 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </motion.section>
    </div>
  );
}
