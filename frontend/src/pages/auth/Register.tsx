import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { backendApi } from '../../api/backend';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Backend UserRegistrationSerializer expects:
      // { email, password, first_name, last_name, organization_name }
      const response = await backendApi.post('/auth/register/', { 
        email, 
        password,
        first_name: firstName,
        last_name: lastName,
        organization_name: orgName,
      });

      // Response: { user_id, email, access, refresh }
      const token = response.data.access;
      const user = {
        id: response.data.user_id || 'new',
        email: response.data.email || email,
        first_name: firstName,
        last_name: lastName,
        is_active: true,
      };
      
      setAuth(user, token);
      navigate('/');
    } catch (err: unknown) {
      console.error('Registration failed', err);
      const error = err as { response?: { data?: Record<string, string[] | string> } };
      const data = error.response?.data;
      // Build a readable error from DRF validation errors
      if (data && typeof data === 'object') {
        const messages: string[] = [];
        for (const [field, errors] of Object.entries(data)) {
          if (Array.isArray(errors)) {
            messages.push(`${field}: ${errors.join(', ')}`);
          } else if (typeof errors === 'string') {
            messages.push(errors);
          }
        }
        setError(messages.join(' | ') || 'Registration failed.');
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join VoxBridge today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0f1318]/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all sm:text-sm"
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all sm:text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Organization Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="block w-full pl-10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all sm:text-sm"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all sm:text-sm"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all sm:text-sm"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1318] focus:ring-indigo-500 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-xs text-gray-400">
              <p className="flex justify-center gap-1">
                Already have an account? 
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
