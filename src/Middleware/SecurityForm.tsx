import React, { useState } from "react";
import { FaKey, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SecurityForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setLoading(false);
    setError("Admin login is disabled because Supabase was removed.");
    navigate("/");
  };

  return (
    <div className="h-lvh flex justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-md p-8 shadow-2xl border border-white/20"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Marvin Portfolio Admin
          </h1>
          <p className="text-sm text-gray-300 mt-1">Sign in to continue</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-teal-300 mb-1">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="pl-10 bg-white/20 text-gray-100 border border-teal-400/30 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-teal-300 mb-1">
            Password
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pl-10 bg-white/20 text-gray-100 border border-teal-400/30 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent block w-full p-2.5 placeholder-gray-400"
            />
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-2.5 rounded-md bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 text-[#0a192f] font-semibold hover:from-teal-300 hover:to-blue-400 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SecurityForm;
