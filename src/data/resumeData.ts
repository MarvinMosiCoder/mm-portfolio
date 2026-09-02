import type { ResumeData } from "../Components/Resume";

export const resumeDataMap: Record<string, ResumeData> = {
  "marvin-mosico": {
    name: "Marvin Mosico",
    title: "Full Stack Web Developer",
    avatarUrl: "/img/image-logo.jpeg",
    contact: {
      email: "marvinmosicoo@gmail.com",
      phone: "09517567826",
      address: "Caloocan City",
      website: "marvinmosico.vercel.app",
      linkedin: "linkedin.com/in/marvin-mosico-0b1467210",
    },
    profile:
      "Full Stack Web Developer with hands-on experience in designing, developing, and maintaining scalable web applications. Proficient in modern frontend and backend technologies, with a strong focus on performance, usability, and clean code practices. Adept at collaborating with cross-functional teams to deliver high-quality solutions aligned with business objectives.",
    skills: {
      frontend: [
        "React",
        "Next.js / TypeScript",
        "JavaScript",
        "HTML / CSS / Tailwind",
        "jQuery",
      ],
      backend: ["PHP (Laravel), CodeIgniter", "Python", "PostgreSQL"],
      tools: [
        "Adobe Photoshop",
        "REST APIs",
        "Responsive Design",
        "Version Control (Git)",
        "CloudPanel",
        "cPanel",
        "N8N Automation",
      ],
    },
    experience: [
      {
        company: "Digits Trading Corp",
        role: "Full Stack Web Developer",
        time: "2022 - Present",
        bullets: [
          "Developed and maintained full-stack web applications, improving system performance and scalability.",
          "Collaborated with designers and developers to deliver functional and visually appealing applications.",
          "Built strong working relationships across teams, enhancing collaboration and project delivery.",
          "Mentored junior team members and contributed to improving team productivity.",
          "Followed best practices in coding standards and framework usage.",
        ],
      },
      {
        company: "Rex Group of Companies",
        role: "Full Stack Web Developer",
        time: "2021 - 2022",
        bullets: [
          "Developed dynamic web applications using PHP, JavaScript, and jQuery.",
          "Implemented responsive and user-friendly UI components using HTML, CSS, and JavaScript.",
          "Collaborated with designers and developers to deliver functional and visually appealing applications.",
          "Ensured application performance, scalability, and reliability through efficient coding practices.",
        ],
      },
    ],
    education: [
      {
        degree: "BSIT",
        school: "City of Malabon University",
        time: "2017 - 2020",
      },
      {
        degree: "Computer Science",
        school: "Access Computer College",
        time: "2016 - 2017",
      },
    ],
    awards: [],
    languages: [],
  },
};
