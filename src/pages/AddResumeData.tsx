import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AddResumeData: React.FC = () => {
    const navLinkBase =
    'block text-left rounded-lg px-3 py-2 text-sm transition font-medium';
    const inactive = 'text-slate-700 hover:bg-slate-100';
    const active = 'text-slate-900 bg-slate-100';
  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Add Profile Data</h1>
        <aside>
          <nav className="h-full flex flex-col px-4 py-6 space-y-3">
            <NavLink
              end
              to="/dashboard/resume-data/profile-form"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? active : inactive}`
              }
            >
              Add Profile
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:ml-64">
          <div className="w-full rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-lg mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AddResumeData;
