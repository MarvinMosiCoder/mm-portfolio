import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TableHeader from './Table/TableHeader';
import TableRow from './Table/TableRow';
import { projectsData } from '../data/projectsData';

const AnotherProjects: React.FC = () => {
  const [darkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const header = ['Year', 'Project', 'Made At', 'Build with', 'Link'];

  return (
    <div
      className={`${
        darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'
      } min-h-screen h-full items-center text-left pl-[30px] pr-[30px] pt-[30px] lg:pt-[30px] lg:pr-[80px]`}
    >
      <h2 className="flex gap-1 text-teal-200 text-lg">
        <Link to="/" className="cursor-pointer flex gap-1 text-teal-200 text-lg px-4">
          <FaArrowLeft
            className="text-teal-100 hover:text-teal-300 mt-[8px] transition duration-300"
            size={12}
          />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent font-bold hover:text-teal-300">
            Back
          </span>
        </Link>
      </h2>

      <div className="flex items-center">
        <h2
          className={`text-center ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } pb-10 text-[40px] font-bold px-4`}
        >
          ALL PROJECTS
        </h2>
      </div>

      <div className="text-white">
        <table className="w-full text-left">
          <TableHeader headers={header} />
          <tbody>
            {projectsData.map((project) => (
              <TableRow key={project.id} project={project} darkMode={darkMode} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnotherProjects;