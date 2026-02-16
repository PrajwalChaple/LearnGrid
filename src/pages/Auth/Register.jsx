import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'Student'
      });

      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        alert(result.message);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900">
      {/* Left Column - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Gradients/Shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors w-fit">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="mt-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Start your learning journey today.</h2>
            <p className="text-indigo-200 text-lg max-w-md">Create your free account and get immediate access to all tools.</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="relative z-10 mt-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle size={18} />
            </div>
            <div>
              <h4 className="font-bold">Real-time Dashboard</h4>
              <p className="text-sm text-indigo-200">Track all your assignments in one place</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckCircle size={18} />
            </div>
            <div>
              <h4 className="font-bold">Smart Reminders</h4>
              <p className="text-sm text-indigo-200">Never miss a deadline again</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle size={18} />
            </div>
            <div>
              <h4 className="font-bold">Collaboration Tools</h4>
              <p className="text-sm text-indigo-200">Share notes and study together</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
          <p className="text-sm text-indigo-300">© 2026 LearnGrid Inc.</p>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 animate-slide-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-500">
              Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Get Started <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
