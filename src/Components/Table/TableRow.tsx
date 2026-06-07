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
                        className={`brand-gradient-text p-1 m-1 border ${darkMode ? 'border-cyan-300/35 bg-cyan-300/5' : 'border-teal-500/20 bg-white/70 hover:bg-teal-500/5 hover:border-teal-500/40'} rounded-md transition-colors duration-300`}
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
