import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Year Counting App</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back, {user?.name || "User"}!
          </h2>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <span className="text-xs text-gray-500 block">User ID</span>
                <span className="text-sm font-semibold text-gray-800">{user?.id}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <span className="text-xs text-gray-500 block">Email Address</span>
                <span className="text-sm font-semibold text-gray-800">{user?.email}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <span className="text-xs text-gray-500 block">Role</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};