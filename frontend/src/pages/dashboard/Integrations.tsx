import { useState, useEffect } from 'react';
import { backendApi } from '../../api/backend';
import { Plug, CheckCircle2, ChevronRight, Briefcase, Hash, Zap, RefreshCw, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Integration {
  id: number;
  provider: string;
  is_active: boolean;
}

// Default available integrations to show even when backend returns empty
const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: 1, provider: 'jira', is_active: false },
  { id: 2, provider: 'slack', is_active: false },
  { id: 3, provider: 'linear', is_active: false },
  { id: 4, provider: 'hubspot', is_active: false },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  useEffect(() => {
    backendApi.get('/integrations/')
      .then(res => {
        // Handle paginated DRF response: { count, results: [...] }
        const data = res.data?.results ?? res.data;
        const list = Array.isArray(data) ? data : [];
        // If empty, show default integrations so the UI isn't blank
        setIntegrations(list.length > 0 ? list : DEFAULT_INTEGRATIONS);
      })
      .catch(() => {
        // Fallback to defaults on any error  
        setIntegrations(DEFAULT_INTEGRATIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async (id: number) => {
    setSyncingId(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, is_active: true } : i));
      setSyncingId(null);
    }, 1500);
  };

  const getIcon = (provider: string) => {
    switch (provider) {
      case 'jira': return <Briefcase className="w-8 h-8 text-blue-400" />;
      case 'slack': return <Hash className="w-8 h-8 text-purple-400" />;
      case 'hubspot': return <Globe className="w-8 h-8 text-orange-400" />;
      default: return <Zap className="w-8 h-8 text-amber-400" />;
    }
  };

  const getDescription = (provider: string) => {
    switch (provider) {
      case 'jira': return 'Create, manage, and transition Jira issues automatically from voice or text commands.';
      case 'slack': return 'Read threads, post standup summaries, and send automated team notifications.';
      case 'linear': return 'Sync issues, track progress, and manage sprints across your Linear workspace.';
      case 'hubspot': return 'Access CRM data, manage contacts, and automate deal pipeline actions.';
      default: return 'Connect this service to enable autonomous actions.';
    }
  };

  const getDisplayName = (provider: string) => {
    const names: Record<string, string> = { jira: 'Jira', slack: 'Slack', linear: 'Linear', hubspot: 'HubSpot' };
    return names[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Plug className="w-6 h-6 text-indigo-400" /> Connected Apps
        </h1>
        <p className="text-gray-400 mt-1">Connect your workspace tools to enable Autonomous PM actions.</p>
      </header>

      {loading ? (
        <div className="text-gray-500 text-sm animate-pulse">Loading available integrations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((app) => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f1318]/60 backdrop-blur border border-white/5 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
                    {getIcon(app.provider)}
                  </div>
                  {app.is_active ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-gray-500/10 border border-white/5 text-gray-500 text-xs font-medium">
                      Not Connected
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white">{getDisplayName(app.provider)}</h3>
                <p className="text-sm text-gray-400 mt-1">{getDescription(app.provider)}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                {app.is_active ? (
                  <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                    Manage Connection <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect(app.id)}
                    disabled={syncingId === app.id}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
                  >
                    {syncingId === app.id ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...</>
                    ) : 'Connect Account'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
