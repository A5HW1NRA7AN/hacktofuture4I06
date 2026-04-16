import { useAuthStore } from '../../store/authStore';
import { Activity, Bot, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Overview() {
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.first_name || 'Product Manager'}!
        </h1>
        <p className="text-gray-400 text-lg">Here's your autonomous workspace status.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0f1318]/60 backdrop-blur border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white">Action Orchestrator</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">Online</p>
          <p className="text-sm text-emerald-400 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Ready to process commands
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0f1318]/60 backdrop-blur border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Recent Actions</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">14</p>
          <p className="text-sm text-gray-400">Automated tasks this week</p>
        </motion.div>
      </div>

      <div className="bg-[#0f1318]/40 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-full shadow-xl shadow-indigo-500/20 mb-6">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Ready to automate your workflow?</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Tell VoxBridge to follow up on standups, create bug reports, or transition tickets across Jira and Slack.
        </p>
        <Link 
          to="/chat" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20"
        >
          Start Copilot Chat <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
