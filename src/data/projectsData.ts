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
    id: '9',
    year: '2026',
    project_name: 'BacktradeLab',
    made_at: 'Personal Project',
    build_with: ['React', 'TypeScript', 'Tailwind', 'TradingView Tools','PHP Laravel'],
    link: 'https://your-backtradelab-link.com',
  },
  {
    id: '1',
    year: '2026',
    project_name: 'Digits New Ordering System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','React', 'Tailwind'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '2',
    year: '2025',
    project_name: 'Digits Report System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '3',
    year: '2024',
    project_name: 'Middleware System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '4',
    year: '2023',
    project_name: 'Apple Enrollment System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','React','Alpine Js', 'HTML/CSS'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '5',
    year: '2022',
    project_name: 'Tasteless Assets Management',
    made_at: 'DIGITS TRADING CORP(TASTELESS FOOD GROUP)',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '6',
    year: '2022',
    project_name: 'Digits Assets Management',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS'],
    link: 'https://your-ecommerce-link.com',
  },
  {
    id: '7',
    year: '2021',
    project_name: 'Purchase Order System',
    made_at: 'REX GROUP COMPANIES',
    build_with: ['Php(Codeigniter)', 'Jquery', 'HTML/CSS'],
    link: 'https://your-taskmanager-link.com',
  },
  {
    id: '8',
    year: '2021',
    project_name: 'Profit & Loss System',
    made_at: 'REX GROUP COMPANIES',
    build_with: ['Php(Codeigniter)', 'Jquery', 'HTML/CSS'],
    link: 'https://your-taskmanager-link.com',
  },
];
