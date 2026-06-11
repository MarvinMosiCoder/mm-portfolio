export interface Project {
  id: string;
  year: string;
  project_name: string;
  made_at: string;
  build_with: string[];
  link: string;
}

export const projectsData: Project[] = [
  {
    id: '1',
    year: '2026',
    project_name: 'B2B Ordering System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','React', 'Tailwind'],
    link: '',
  },
  {
    id: '10',
    year: '2025',
    project_name: 'Assets Management with Inventory and ERF',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)', 'Jquery', 'MySQL'],
    link: '',
  },
  {
    id: '11',
    year: '2025',
    project_name: 'Gashapon Inventory System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)', 'Jquery', 'MySQL'],
    link: '',
  },
  {
    id: '2',
    year: '2025',
    project_name: 'Business Reporting System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: '',
  },
  {
    id: '3',
    year: '2024',
    project_name: 'Internal Middleware System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: '',
  },
  {
    id: '4',
    year: '2023',
    project_name: 'Partner Enrollment System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','React','Alpine Js', 'HTML/CSS'],
    link: '',
  },
  {
    id: '5',
    year: '2022',
    project_name: 'Group Asset Management System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: '',
  },
  {
    id: '6',
    year: '2022',
    project_name: 'Asset Inventory Management System',
    made_at: 'Employer Project',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: '',
  },
  {
    id: '7',
    year: '2021',
    project_name: 'Purchase Order System',
    made_at: 'Employer Project',
    build_with: ['Php(Codeigniter)', 'Jquery', 'HTML/CSS'],
    link: '',
  },
  {
    id: '8',
    year: '2021',
    project_name: 'Profit and Loss Reporting System',
    made_at: 'Employer Project',
    build_with: ['Php(Codeigniter)', 'Jquery', 'HTML/CSS'],
    link: '',
  },
];
