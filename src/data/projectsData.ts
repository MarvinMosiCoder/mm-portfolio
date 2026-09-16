export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  year: string;
  project_name: string;
  made_at: string;
  build_with: string[];
  description: string;
  features: string[];
  images?: ProjectImage[];
  link: string;
}

export const projectsData: Project[] = [
  {
    id: '1',
    year: '2026',
    project_name: 'Chartineer',
    made_at: 'Personal Project',
    build_with: ['PHP(Laravel)', 'React', 'TypeScript', 'Tailwind','MySQL'],
    description: "A trading-practice platform for exploring market data, replaying candles, and reviewing simulated trades. Now developed as Chartineer.",
    features: ["Multi-exchange market data and candle replay", "Simulated trade execution and chart drawings", "Trade journal, performance reports, and alerts"],
    images: [
      {
        src: '/projects-ss/chartineer/home.png',
        alt: 'Chartineer home page introducing trading replay and practice features',
        caption: 'Home page',
      },
      {
        src: '/projects-ss/chartineer/dashboard.png',
        alt: 'Chartineer market dashboard with cryptocurrency highlights and a watchlist',
        caption: 'Market dashboard',
      },
      {
        src: '/projects-ss/chartineer/login.png',
        alt: 'Chartineer login page with email, Google, and Facebook sign-in options',
        caption: 'Login page',
      },
      {
        src: '/projects-ss/chartineer/workspace.png',
        alt: 'Chartineer Workspace users can practice chart here using any tools',
        caption: 'Workspace',
      },
      {
        src: '/projects-ss/chartineer/journal.png',
        alt: 'Chartineer journal traders can record journal trade',
        caption: 'Journal',
      },
      {
        src: '/projects-ss/chartineer/journal-2.png',
        alt: 'Chartineer journal traders can record journal trade',
        caption: 'Journal',
      },
      {
        src: '/projects-ss/chartineer/more.png',
        alt: 'Chartineer journal traders can record journal trade',
        caption: 'More',
      },
    ],
    link: 'https://your-chartineer.com',
  },
  {
    id: '2',
    year: '2026',
    project_name: 'Vram RBAC Admin Template',
    made_at: 'Personal Project',
    build_with: ['PHP(Laravel)', 'React', 'TypeScript', 'Tailwind','MySQL'],
    description: "A reusable administration template for building Laravel and React business applications with role-based access control and generated modules.",
    features: ["User, role, and permission management", "Generated CRUD modules with shared tables and forms", "Configurable menus, notifications, and dashboard statistics"],
    link: '#',
  },
  {
    id: '3',
    year: '2026',
    project_name: 'DAS',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)', 'React', 'TypeScript', 'Tailwind','MySQL'],
    description: "A warranty-service application that organizes retail, e-commerce, and dead-on-arrival product requests for Digits Trading Corp.",
    features: ["Retail warranty workflows", "E-commerce request intake", "DOA processing and shared status notifications"],
    link: '#',
  },
  {
    id: '4',
    year: '2026',
    project_name: 'Vram RBAC Using Python',
    made_at: 'Personal Project',
    build_with: ['Python(FastAPI)','React', 'Tailwind','PostgreSQL'],
    description: "A personal role-based administration project using a Python FastAPI backend and React interface, with PostgreSQL for data storage.",
    features: ["Role-based access control", "React administration interface", "FastAPI backend with PostgreSQL"],
    link: '#',
  },
  {
    id: '5',
    year: '2026',
    project_name: 'Digits New Ordering System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','React', 'Tailwind','MySQL'],
    description: "An internal ordering application for managing store orders, approvals, and scheduling alongside product and store master data.",
    features: ["Order creation and order history", "Approval matrices and order approval", "Order schedules, stores, and item management"],
    link: '#',
  },
  {
    id: '6',
    year: '2025',
    project_name: 'N8N Automations workflow',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['Webhooks','AI Agent','APIs','OATH Authentications','Etc...'],
    description: "A collection of n8n automation workflows connecting business tools through webhooks, APIs, and AI-assisted processing.",
    features: ["Webhook-triggered workflows", "API integrations and authenticated connections", "AI agent workflow steps"],
    link: '#',
  },
  {
    id: '7',
    year: '2024',
    project_name: 'Gashapon Inventory System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','MySQL','HTML/CSS','Jquery'],
    description: "An inventory application for Gashapon operations, organizing capsule and item records alongside point-of-sale activity and inventory history.",
    features: ["Capsule and item inventory records", "Point-of-sale modules", "Inventory history and audit records"],
    images: [
      {
        src: '/projects-ss/gis/gis-1.png',
        alt: 'Gashapon Inventory System backend login page with blue branding',
        caption: 'Backend login',
      },
      {
        src: '/projects-ss/gis/gis-2.png',
        alt: 'Gashapon Inventory System frontend login page with red branding',
        caption: 'Frontend login',
      },
    ],
    link: '#',
  },
  {
    id: '8',
    year: '2025',
    project_name: 'Digits Report System',
    made_at: 'DIGITS TRADING CORP',
    build_with: ['PHP(Laravel)','Jquery', 'HTML/CSS','MySQL'],
    description: "A centralized reporting application for Digits Trading Corp, bringing together sales, inventory, and tender information across business operations.",
    features: ["Store sales and inventory reporting", "Warehouse and in-transit inventory reports", "Data uploads, tender reports, and report access privileges"],
    link: '#',
  },
];
