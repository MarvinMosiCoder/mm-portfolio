import React from 'react';

interface TableRowProps {
    project: {
        year: string;
        project_name: string;
        made_at: string;
        build_with: string[];
        link: string;
    };
    darkMode?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ project, darkMode }) => (
    <>
        <tr>
            {/* {Object.values(project).map((value, index) => (
                <td className="border-b-[0.2px] border-slate-700 px-4 py-4 text-gray-300" key={index}>
                    {value}
                </td>
                
            ))} */}
            <td className={`border-b-[0.2px] border-slate-700 px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.year}</td>
            <td className={`border-b-[0.2px] border-slate-700 px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.project_name}</td>
            <td className={`border-b-[0.2px] border-slate-700 px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} hidden lg:table-cell`}>{project.made_at}</td>
            <td className={`border-b-[0.2px] border-slate-700 px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} hidden lg:table-cell`}>
                {project.build_with.map((tech, index) => (
                    <button
                        key={index}
                        className={`p-1 m-1 border ${darkMode ? 'border-teal-300' : 'border-neutral-300/60 bg-white/70 text-gray-800 hover:bg-white/90 hover:border-neutral-300'} bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent hover:bg-teal-300 hover:text-[#0a192f] rounded-md transition-colors duration-300`}
                    >
                        {tech}
                    </button>
                ))}
            </td>
            {/* <td className="border-b-[0.2px] border-slate-700 px-4 py-4 text-gray-300 hidden lg:table-cell">{project.link}</td> */}
        </tr>
    </>
);

export default TableRow;