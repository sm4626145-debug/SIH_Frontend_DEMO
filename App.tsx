import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import sbLogo from "@/imports/SIH_Hackathon_Logo_UI-1.jpeg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Tab = "dashboard" | "skillzone" | "skillintel" | "opportunities" | "portfolio" | "placements" | "collaborate" | "labourmarket";
type Role = "Student" | "Industry" | "Academician" | "Institution";
type AuthScreen = "role-select" | "student" | "industry" | "academic";

const ROLE_DISPLAY: Record<Role, string> = {
  Student: "Candidate",
  Industry: "Industry",
  Academician: "Academician",
  Institution: "Institution",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const placementTrend = [42, 58, 71, 65, 89, 104];
const trendLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const skillGapData = [
  { skill: "React.js", required: 85, yours: 30 },
  { skill: "Node.js", required: 80, yours: 20 },
  { skill: "SQL", required: 75, yours: 55 },
  { skill: "JavaScript", required: 90, yours: 60 },
  { skill: "Git", required: 70, yours: 50 },
  { skill: "HTML/CSS", required: 80, yours: 85 },
];

const radarPoints = [
  { label: "Frontend", value: 30 },
  { label: "Backend", value: 20 },
  { label: "Database", value: 55 },
  { label: "Tools", value: 50 },
  { label: "Problem Solving", value: 65 },
];

const domainDist = [
  { name: "Software Dev", value: 48, color: "#4ADE80" },
  { name: "Data & AI", value: 22, color: "#818CF8" },
  { name: "Product", value: 14, color: "#FBBF24" },
  { name: "DevOps", value: 10, color: "#38BDF8" },
  { name: "Design", value: 6, color: "#F472B6" },
];

const activity = [
  { user: "TechNova", action: "posted a new internship", time: "2m ago", icon: "💼" },
  { user: "Priya S.", action: "completed Skill Verification for React", time: "18m ago", icon: "🎯" },
  { user: "Prof. Mehta", action: "aligned Python curriculum with industry", time: "1h ago", icon: "📚" },
  { user: "DataMind AI", action: "shortlisted 5 candidates", time: "2h ago", icon: "🏆" },
  { user: "Rahul G.", action: "achieved Industry Readiness Score: 82/100", time: "3h ago", icon: "🎯" },
];

const internshipListings = [
  { id: 1, company: "TechNova Solutions", role: "Full Stack Developer Intern", type: "Internship", duration: "3 months", stipend: "₹15,000/mo", skills: ["React", "Node.js", "MongoDB"], match: 78, status: "Open", logo: "TN", color: "#6366F1" },
  { id: 2, company: "DataMind AI", role: "ML Engineering Intern", type: "Internship", duration: "6 months", stipend: "₹20,000/mo", skills: ["Python", "TensorFlow", "SQL"], match: 65, status: "Open", logo: "DM", color: "#F59E0B" },
  { id: 3, company: "CloudBase Inc.", role: "DevOps Intern", type: "Apprenticeship", duration: "4 months", stipend: "₹12,000/mo", skills: ["Docker", "AWS", "CI/CD"], match: 52, status: "Closing Soon", logo: "CB", color: "#EF4444" },
  { id: 4, company: "UX Studio", role: "Product Design Intern", type: "Internship", duration: "3 months", stipend: "₹10,000/mo", skills: ["Figma", "User Research", "Prototyping"], match: 90, status: "Open", logo: "UX", color: "#22C55E" },
  { id: 5, company: "FinCore Labs", role: "Backend Developer Intern", type: "Project", duration: "5 months", stipend: "₹18,000/mo", skills: ["Java", "Spring Boot", "PostgreSQL"], match: 43, status: "Open", logo: "FC", color: "#8B5CF6" },
  { id: 6, company: "EduTech Global", role: "Data Analyst Intern", type: "Internship", duration: "3 months", stipend: "₹14,000/mo", skills: ["Excel", "Power BI", "Python"], match: 70, status: "Open", logo: "ET", color: "#0EA5E9" },
];

const jobListings = [
  { id: 1, company: "Google", role: "Software Engineer – New Grad", type: "Full-time", package: "₹35 LPA", skills: ["DSA", "System Design", "Java/C++"], match: 62, logo: "GG", color: "#4285F4" },
  { id: 2, company: "Razorpay", role: "Product Analyst", type: "Full-time", package: "₹22 LPA", skills: ["SQL", "Analytics", "Product Sense"], match: 74, logo: "RZ", color: "#2563EB" },
  { id: 3, company: "Swiggy", role: "Frontend Engineer", type: "Full-time", package: "₹18 LPA", skills: ["React", "TypeScript", "CSS"], match: 88, logo: "SW", color: "#F97316" },
  { id: 4, company: "Zepto", role: "Data Engineer", type: "Full-time", package: "₹20 LPA", skills: ["Spark", "Python", "Kafka"], match: 45, logo: "ZP", color: "#7C3AED" },
];

const learningPrograms = [
  { id: 1, company: "Microsoft", title: "Azure Cloud Fundamentals Bootcamp", type: "Certification", duration: "8 weeks", seats: 60, enrolled: 42, skills: ["Azure", "Cloud Computing", "DevOps"], color: "#0078D4", logo: "MS" },
  { id: 2, company: "Google", title: "Machine Learning Crash Course + Certification", type: "Course", duration: "12 weeks", seats: 100, enrolled: 89, skills: ["Python", "TensorFlow", "ML"], color: "#34A853", logo: "GG" },
  { id: 3, company: "Amazon", title: "Full Stack Web Dev Mentorship Program", type: "Mentorship", duration: "16 weeks", seats: 30, enrolled: 18, skills: ["React", "Node.js", "AWS"], color: "#FF9900", logo: "AZ" },
  { id: 4, company: "Infosys", title: "Agile & Scrum Practitioner Workshop", type: "Workshop", duration: "2 days", seats: 80, enrolled: 65, skills: ["Agile", "Scrum", "JIRA"], color: "#007CC3", logo: "IF" },
];

const fdpListings = [
  { id: 1, company: "IIT Bombay & TCS", title: "FDP on AI/ML for Engineering Faculty", type: "FDP", duration: "5 days", stipend: "₹8,000", seats: 40, deadline: "Sep 15, 2026", color: "#6366F1" },
  { id: 2, company: "NASSCOM", title: "Industry Immersion Program for CS Faculty", type: "Faculty Internship", duration: "4 weeks", stipend: "₹25,000/mo", seats: 20, deadline: "Sep 30, 2026", color: "#22C55E" },
  { id: 3, company: "Wipro", title: "Consultancy on Digital Transformation", type: "Consultancy", duration: "3 months", stipend: "₹50,000/mo", seats: 5, deadline: "Oct 10, 2026", color: "#F59E0B" },
  { id: 4, company: "DRDO & NIT Trichy", title: "Collaborative Research: Edge Computing", type: "Research", duration: "6 months", stipend: "₹35,000/mo", seats: 3, deadline: "Sep 20, 2026", color: "#EF4444" },
];

const placements = [
  { name: "Priya Sharma", role: "SDE-1 @ Amazon", package: "₹24 LPA", skills: ["Java", "DSA", "System Design"], status: "Placed", avatar: "PS", color: "#22C55E", cgpa: 8.9 },
  { name: "Rahul Gupta", role: "Data Scientist @ Flipkart", package: "₹18 LPA", skills: ["Python", "ML", "SQL"], status: "Placed", avatar: "RG", color: "#22C55E", cgpa: 8.4 },
  { name: "Sneha Iyer", role: "Frontend Dev @ Zomato", package: "₹14 LPA", skills: ["React", "TS", "CSS"], status: "Placed", avatar: "SI", color: "#22C55E", cgpa: 7.8 },
  { name: "Arjun Nair", role: "DevOps @ Infosys", package: "₹10 LPA", skills: ["Docker", "AWS", "Linux"], status: "Placed", avatar: "AN", color: "#22C55E", cgpa: 7.2 },
  { name: "Meera Patel", role: "Interviewing @ Google", package: "–", skills: ["C++", "DSA", "ML"], status: "In Progress", avatar: "MP", color: "#F59E0B", cgpa: 9.1 },
  { name: "Kiran Das", role: "Product @ Swiggy", package: "₹16 LPA", skills: ["PM", "Analytics", "UX"], status: "Placed", avatar: "KD", color: "#22C55E", cgpa: 8.0 },
];

const collaborationEvents = [
  { id: 1, title: "AI & Future of Work – Guest Lecture", host: "Microsoft India", type: "Guest Lecture", date: "Sep 5, 2026", seats: 200, registered: 178, color: "#0078D4", icon: "🎤" },
  { id: 2, title: "National Hackathon: Smart Cities 2026", host: "Govt of India + IIT Delhi", type: "Hackathon", date: "Sep 12-14, 2026", seats: 500, registered: 432, color: "#EF4444", icon: "💡" },
  { id: 3, title: "Workshop: Building Production-Grade APIs", host: "Postman + Razorpay", type: "Workshop", date: "Sep 19, 2026", seats: 80, registered: 67, color: "#F59E0B", icon: "🔧" },
  { id: 4, title: "Industry Connect: Career Fair 2026", host: "CII & 48 Companies", type: "Career Fair", date: "Oct 2, 2026", seats: 1000, registered: 820, color: "#22C55E", icon: "🤝" },
];

const mentors = [
  { name: "Anil Sharma", title: "Principal Engineer @ Google", expertise: ["System Design", "DSA", "Career Growth"], sessions: 142, rating: 4.9, available: true, avatar: "AS", color: "#4285F4" },
  { name: "Riya Kapoor", title: "Senior Data Scientist @ Amazon", expertise: ["ML", "Python", "Statistics"], sessions: 98, rating: 4.8, available: true, avatar: "RK", color: "#FF9900" },
  { name: "Vivek Nair", title: "Product Lead @ Flipkart", expertise: ["Product Strategy", "Analytics", "UX"], sessions: 76, rating: 4.7, available: false, avatar: "VN", color: "#6366F1" },
  { name: "Sneha Bose", title: "DevOps Architect @ Infosys", expertise: ["Kubernetes", "AWS", "CI/CD"], sessions: 61, rating: 4.9, available: true, avatar: "SB", color: "#22C55E" },
];

const innovationChallenges = [
  { title: "GreenTech Innovation Sprint", by: "Tata Sustainability Group", prize: "₹5 Lakhs", deadline: "Sep 28, 2026", teams: 84, domain: "Sustainability", color: "#22C55E" },
  { title: "FinTech Disrupt Challenge", by: "HDFC x Razorpay", prize: "₹3 Lakhs", deadline: "Oct 5, 2026", teams: 120, domain: "Finance", color: "#2563EB" },
  { title: "HealthAI Hackathon", by: "Apollo Hospitals + IISc", prize: "₹4 Lakhs", deadline: "Oct 15, 2026", teams: 56, domain: "Healthcare", color: "#EF4444" },
];

const portfolioSkills = [
  { name: "React.js", level: 3, verified: true },
  { name: "JavaScript", level: 4, verified: true },
  { name: "HTML/CSS", level: 5, verified: true },
  { name: "Node.js", level: 2, verified: false },
  { name: "SQL", level: 3, verified: true },
  { name: "Git", level: 4, verified: true },
  { name: "Python", level: 2, verified: false },
  { name: "Figma", level: 3, verified: true },
];

const certifications = [
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "Jul 2026", verified: true, color: "#FF9900" },
  { name: "React Developer Certification", issuer: "Meta (Coursera)", date: "May 2026", verified: true, color: "#4267B2" },
  { name: "Google Analytics Certified", issuer: "Google", date: "Mar 2026", verified: true, color: "#34A853" },
];

const projects = [
  { name: "SmartKart – E-commerce Platform", desc: "Full-stack MERN app with payment integration, real-time inventory, and admin dashboard.", stack: ["React", "Node.js", "MongoDB", "Stripe"], github: true, live: true },
  { name: "ML Crop Yield Predictor", desc: "Trained Random Forest model on soil + weather data to predict crop yield with 87% accuracy.", stack: ["Python", "Scikit-learn", "Flask", "Pandas"], github: true, live: false },
  { name: "CollegeConnect – Campus App", desc: "Mobile-responsive app for student announcements, club events, and facility booking.", stack: ["React", "Firebase", "Tailwind"], github: true, live: true },
];

const assessmentQuestions = [
  { id: 1, domain: "Technical – Frontend", question: "How well can you build responsive UI layouts using HTML/CSS?", options: ["Beginner – Learning basics", "Familiar – Need reference docs", "Proficient – Build without help", "Expert – Can mentor others"] },
  { id: 2, domain: "Technical – Programming", question: "How comfortable are you with data structures and algorithms?", options: ["Not started", "Know basics (arrays, loops)", "Can solve medium-level problems", "Strong – Can handle contest problems"] },
  { id: 3, domain: "Technical – Frameworks", question: "What is your experience with modern JS frameworks (React, Vue)?", options: ["Never used one", "Done tutorials only", "Built 1–2 projects", "Professionally experienced"] },
  { id: 4, domain: "Technical – Backend", question: "Can you design and build REST APIs with a backend framework?", options: ["Not familiar", "Understand concepts only", "Built basic APIs", "Built production APIs"] },
  { id: 5, domain: "Technical – Databases", question: "How proficient are you with SQL and relational databases?", options: ["No experience", "Basic SELECT queries", "Joins, indexes, transactions", "Complex queries and optimization"] },
  { id: 6, domain: "Soft Skills – Communication", question: "How would you rate your ability to present technical ideas to non-technical audiences?", options: ["Very uncomfortable", "Can do with preparation", "Fairly comfortable", "Confident presenter"] },
  { id: 7, domain: "Soft Skills – Teamwork", question: "How experienced are you working in collaborative development teams?", options: ["Solo projects only", "A few group assignments", "Academic team projects", "Professional team experience"] },
  { id: 8, domain: "Aptitude", question: "How often do you independently solve unfamiliar technical problems?", options: ["Rarely – I ask for help quickly", "Sometimes – Try for a while first", "Often – Comfortable researching", "Always – Enjoy problem-solving"] },
];

const institutionBatchData = [
  { dept: "CS", total: 120, placed: 98, avgPkg: "₹14.2L", topPkg: "₹24L" },
  { dept: "IT", total: 80, placed: 61, avgPkg: "₹12.8L", topPkg: "₹20L" },
  { dept: "ECE", total: 90, placed: 65, avgPkg: "₹10.5L", topPkg: "₹18L" },
  { dept: "MCA", total: 60, placed: 52, avgPkg: "₹13.1L", topPkg: "₹22L" },
];

// ─── Skill Intel Data ─────────────────────────────────────────────────────────
type SkillPriority = "Critical" | "High" | "Moderate" | "Met";
type SkillTrend = "Rising" | "Stable" | "Declining";
type TechSkill = { name: string; category: string; required: number; yours: number; trend: SkillTrend; jobs: number; priority: SkillPriority };
type SoftSkill = { name: string; category: string; required: number; yours: number; trend: SkillTrend; priority: SkillPriority };

const jobRolesSkillData: Record<string, { technical: TechSkill[]; nonTechnical: SoftSkill[] }> = {
  "Full Stack Developer": {
    technical: [
      { name: "React.js", category: "Frontend", required: 85, yours: 30, trend: "Rising", jobs: 12400, priority: "Critical" },
      { name: "Node.js", category: "Backend", required: 80, yours: 20, trend: "Rising", jobs: 10200, priority: "Critical" },
      { name: "TypeScript", category: "Language", required: 75, yours: 40, trend: "Rising", jobs: 9800, priority: "High" },
      { name: "REST API Design", category: "Backend", required: 80, yours: 35, trend: "Stable", jobs: 11000, priority: "Critical" },
      { name: "SQL / PostgreSQL", category: "Database", required: 70, yours: 55, trend: "Stable", jobs: 8900, priority: "Moderate" },
      { name: "Docker / Containers", category: "DevOps", required: 60, yours: 15, trend: "Rising", jobs: 7200, priority: "High" },
      { name: "System Design Basics", category: "Architecture", required: 70, yours: 25, trend: "Rising", jobs: 9500, priority: "High" },
      { name: "Git & Version Control", category: "Tools", required: 65, yours: 50, trend: "Stable", jobs: 14000, priority: "Moderate" },
    ],
    nonTechnical: [
      { name: "Problem Solving", category: "Analytical", required: 85, yours: 70, trend: "Rising", priority: "High" },
      { name: "Technical Writing", category: "Communication", required: 60, yours: 40, trend: "Rising", priority: "High" },
      { name: "Communication", category: "Interpersonal", required: 75, yours: 60, trend: "Stable", priority: "Moderate" },
      { name: "Team Collaboration", category: "Teamwork", required: 80, yours: 65, trend: "Stable", priority: "Moderate" },
      { name: "Time Management", category: "Self-Management", required: 70, yours: 55, trend: "Stable", priority: "Moderate" },
      { name: "Adaptability", category: "Mindset", required: 75, yours: 72, trend: "Rising", priority: "Met" },
    ],
  },
  "Data Scientist": {
    technical: [
      { name: "Python", category: "Language", required: 90, yours: 20, trend: "Rising", jobs: 15200, priority: "Critical" },
      { name: "Machine Learning", category: "AI/ML", required: 85, yours: 15, trend: "Rising", jobs: 11800, priority: "Critical" },
      { name: "Statistics & Probability", category: "Mathematics", required: 85, yours: 30, trend: "Rising", jobs: 10100, priority: "Critical" },
      { name: "TensorFlow / PyTorch", category: "AI/ML", required: 75, yours: 10, trend: "Rising", jobs: 8400, priority: "Critical" },
      { name: "Feature Engineering", category: "AI/ML", required: 75, yours: 15, trend: "Rising", jobs: 7200, priority: "Critical" },
      { name: "SQL & Data Querying", category: "Database", required: 80, yours: 55, trend: "Stable", jobs: 9200, priority: "High" },
      { name: "Data Visualization", category: "Analytics", required: 70, yours: 40, trend: "Stable", jobs: 7800, priority: "High" },
      { name: "Cloud Platforms (AWS/GCP)", category: "Cloud", required: 65, yours: 15, trend: "Rising", jobs: 8900, priority: "High" },
    ],
    nonTechnical: [
      { name: "Business Acumen", category: "Strategy", required: 70, yours: 35, trend: "Rising", priority: "Critical" },
      { name: "Problem Framing", category: "Analytical", required: 80, yours: 55, trend: "Rising", priority: "High" },
      { name: "Communication", category: "Interpersonal", required: 80, yours: 60, trend: "Stable", priority: "High" },
      { name: "Analytical Thinking", category: "Analytical", required: 90, yours: 75, trend: "Rising", priority: "Moderate" },
      { name: "Attention to Detail", category: "Self-Management", required: 85, yours: 75, trend: "Stable", priority: "Moderate" },
      { name: "Curiosity & Research", category: "Mindset", required: 85, yours: 82, trend: "Stable", priority: "Met" },
    ],
  },
  "DevOps Engineer": {
    technical: [
      { name: "Docker & Kubernetes", category: "Containerization", required: 90, yours: 15, trend: "Rising", jobs: 9800, priority: "Critical" },
      { name: "CI/CD Pipelines", category: "Automation", required: 85, yours: 20, trend: "Rising", jobs: 8600, priority: "Critical" },
      { name: "AWS / Azure / GCP", category: "Cloud", required: 85, yours: 15, trend: "Rising", jobs: 11200, priority: "Critical" },
      { name: "Infrastructure as Code", category: "Automation", required: 75, yours: 10, trend: "Rising", jobs: 6800, priority: "Critical" },
      { name: "Linux / Shell Scripting", category: "Systems", required: 80, yours: 50, trend: "Stable", jobs: 9400, priority: "High" },
      { name: "Monitoring & Logging", category: "Operations", required: 70, yours: 25, trend: "Stable", jobs: 7200, priority: "High" },
      { name: "Security & Compliance", category: "Security", required: 65, yours: 15, trend: "Rising", jobs: 6400, priority: "High" },
      { name: "Git & Branching Strategy", category: "Tools", required: 80, yours: 50, trend: "Stable", jobs: 12000, priority: "Moderate" },
    ],
    nonTechnical: [
      { name: "Incident Management", category: "Operations", required: 80, yours: 30, trend: "Rising", priority: "Critical" },
      { name: "Documentation", category: "Communication", required: 75, yours: 40, trend: "Stable", priority: "High" },
      { name: "Cross-team Communication", category: "Interpersonal", required: 75, yours: 55, trend: "Stable", priority: "High" },
      { name: "Problem Solving", category: "Analytical", required: 90, yours: 70, trend: "Rising", priority: "High" },
      { name: "Collaboration", category: "Teamwork", required: 85, yours: 65, trend: "Stable", priority: "Moderate" },
      { name: "Continuous Learning", category: "Mindset", required: 85, yours: 82, trend: "Rising", priority: "Met" },
    ],
  },
  "Product Manager": {
    technical: [
      { name: "Product Roadmapping", category: "Strategy", required: 85, yours: 20, trend: "Rising", jobs: 5400, priority: "Critical" },
      { name: "A/B Testing", category: "Analytics", required: 75, yours: 25, trend: "Rising", jobs: 4900, priority: "Critical" },
      { name: "Agile / Scrum", category: "Methodology", required: 80, yours: 35, trend: "Stable", jobs: 7800, priority: "Critical" },
      { name: "Figma / Wireframing", category: "Design", required: 65, yours: 30, trend: "Stable", jobs: 5200, priority: "High" },
      { name: "Data Analysis & SQL", category: "Analytics", required: 70, yours: 55, trend: "Rising", jobs: 6800, priority: "Moderate" },
      { name: "Basic Engineering Concepts", category: "Technical", required: 60, yours: 40, trend: "Stable", jobs: 5800, priority: "Moderate" },
    ],
    nonTechnical: [
      { name: "Strategic Thinking", category: "Strategy", required: 90, yours: 50, trend: "Rising", priority: "Critical" },
      { name: "Stakeholder Management", category: "Leadership", required: 85, yours: 40, trend: "Rising", priority: "Critical" },
      { name: "Market Awareness", category: "Business", required: 75, yours: 35, trend: "Rising", priority: "Critical" },
      { name: "Decision Making", category: "Leadership", required: 85, yours: 55, trend: "Rising", priority: "High" },
      { name: "Communication & Influence", category: "Interpersonal", required: 90, yours: 65, trend: "Stable", priority: "High" },
      { name: "Empathy & User Research", category: "UX Mindset", required: 80, yours: 60, trend: "Rising", priority: "High" },
    ],
  },
  "UI/UX Designer": {
    technical: [
      { name: "Figma", category: "Design Tools", required: 90, yours: 30, trend: "Rising", jobs: 7400, priority: "Critical" },
      { name: "User Research Methods", category: "Research", required: 85, yours: 25, trend: "Rising", jobs: 5800, priority: "Critical" },
      { name: "Design Systems", category: "Design", required: 75, yours: 20, trend: "Rising", jobs: 5400, priority: "Critical" },
      { name: "Prototyping", category: "Design Tools", required: 80, yours: 35, trend: "Stable", jobs: 6200, priority: "Critical" },
      { name: "Accessibility (a11y)", category: "Standards", required: 70, yours: 25, trend: "Rising", jobs: 4800, priority: "High" },
      { name: "Motion Design", category: "Animation", required: 55, yours: 15, trend: "Rising", jobs: 3600, priority: "High" },
      { name: "HTML/CSS Basics", category: "Technical", required: 60, yours: 85, trend: "Stable", jobs: 6800, priority: "Met" },
    ],
    nonTechnical: [
      { name: "Storytelling", category: "Communication", required: 80, yours: 45, trend: "Rising", priority: "Critical" },
      { name: "Visual Communication", category: "Design Thinking", required: 85, yours: 55, trend: "Stable", priority: "High" },
      { name: "Empathy", category: "UX Mindset", required: 90, yours: 75, trend: "Rising", priority: "Moderate" },
      { name: "Attention to Detail", category: "Self-Management", required: 85, yours: 70, trend: "Stable", priority: "Moderate" },
      { name: "Collaboration with Devs", category: "Teamwork", required: 80, yours: 65, trend: "Stable", priority: "Moderate" },
      { name: "Feedback Receptiveness", category: "Mindset", required: 75, yours: 72, trend: "Stable", priority: "Met" },
    ],
  },
};

const industryTrendsData = [
  { skill: "Generative AI / LLMs", growth: 142, demand: "Explosive", openings: 8400, color: "#818CF8" },
  { skill: "Cloud Architecture", growth: 58, demand: "Very High", openings: 6200, color: "#38BDF8" },
  { skill: "Cybersecurity", growth: 52, demand: "Very High", openings: 5800, color: "#EF4444" },
  { skill: "DevOps / MLOps", growth: 44, demand: "High", openings: 5100, color: "#4ADE80" },
  { skill: "React / Next.js", growth: 38, demand: "High", openings: 12400, color: "#22D3EE" },
  { skill: "Data Engineering", growth: 36, demand: "High", openings: 4800, color: "#F59E0B" },
  { skill: "UI/UX Design", growth: 24, demand: "Moderate", openings: 3400, color: "#F472B6" },
  { skill: "Blockchain / Web3", growth: 12, demand: "Growing", openings: 2100, color: "#C084FC" },
];

// ─── SVG Charts ───────────────────────────────────────────────────────────────
function AreaSparkline({ values }: { values: number[] }) {
  const w = 400, h = 120, pad = 10;
  const min = Math.min(...values), max = Math.max(...values);
  const xs = values.map((_, i) => pad + (i / (values.length - 1)) * (w - pad * 2));
  const ys = values.map((v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${line} L${xs[xs.length - 1]},${h - pad} L${xs[0]},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ag)" />
      <path d={line} fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#4ADE80" stroke="#1C2333" strokeWidth="1.5" />)}
      {trendLabels.map((label, i) => <text key={i} x={xs[i]} y={h} textAnchor="middle" fontSize="9" fill="#6B7280">{label}</text>)}
    </svg>
  );
}

function RadarSVG({ data }: { data: { label: string; value: number }[] }) {
  const cx = 110, cy = 110, r = 80, n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, radius: number) => ({ x: cx + radius * Math.cos(angle(i)), y: cy + radius * Math.sin(angle(i)) });
  return (
    <svg viewBox="0 0 220 220" className="w-full h-52">
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon key={ring} points={data.map((_, i) => { const p = pt(i, r * ring); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {data.map((_, i) => { const o = pt(i, r); return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />; })}
      <polygon points={data.map((d, i) => { const p = pt(i, r * d.value / 100); return `${p.x},${p.y}`; }).join(" ")} fill="#C084FC" fillOpacity="0.25" stroke="#C084FC" strokeWidth="2" />
      {data.map((d, i) => { const p = pt(i, r + 18); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#9CA3AF">{d.label}</text>; })}
    </svg>
  );
}

function DonutSVG({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 70, cy = 70, outerR = 55, innerR = 35;
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const start = cumAngle; cumAngle += angle;
    const x1 = cx + outerR * Math.cos(start), y1 = cy + outerR * Math.sin(start);
    const x2 = cx + outerR * Math.cos(cumAngle), y2 = cy + outerR * Math.sin(cumAngle);
    const ix1 = cx + innerR * Math.cos(start), iy1 = cy + innerR * Math.sin(start);
    const ix2 = cx + innerR * Math.cos(cumAngle), iy2 = cy + innerR * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { path: `M${x1},${y1} A${outerR},${outerR} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${innerR},${innerR} 0 ${large},0 ${ix1},${iy1} Z`, color: d.color };
  });
  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32 flex-shrink-0">
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
    </svg>
  );
}

function BarSVG({ data }: { data: { label: string; value: number; highlight?: boolean }[] }) {
  const w = 280, h = 120, pad = 10;
  const max = Math.max(...data.map((d) => d.value));
  const bw = (w - pad * 2) / data.length - 6;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - pad * 2 - 16);
        const x = pad + i * ((w - pad * 2) / data.length) + 3;
        const y = h - pad - 14 - bh;
        return <g key={i}><rect x={x} y={y} width={bw} height={bh} rx="3" fill={d.highlight ? "#2DD4BF" : "rgba(255,255,255,0.08)"} /><text x={x + bw / 2} y={h - 2} textAnchor="middle" fontSize="8" fill="#6B7280">{d.label}</text></g>;
      })}
    </svg>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, valueClassName }: { label: string; value: string; sub: string; color: string; valueClassName?: string }) {
  return (
    <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold text-white ${valueClassName ?? ""}`}>{value}</p>
      <p className="text-xs mt-1 font-medium" style={{ color }}>{sub}</p>
    </div>
  );
}

function Av({ init, color, size = "md" }: { init: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  return <div className={`${sz} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`} style={{ background: color }}>{init}</div>;
}

function MatchBar({ pct }: { pct: number }) {
  const color = pct >= 75 ? "#22C55E" : pct >= 55 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-white/10 rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} /></div>
      <span className="text-xs font-semibold" style={{ color }}>{pct}%</span>
    </div>
  );
}

function InnerTabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${active === t ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-gray-300"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return <span className="text-xs px-2.5 py-1 rounded-full font-medium border" style={{ color, borderColor: `${color}30`, background: `${color}12` }}>{text}</span>;
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ role, userName = "", userEmail = "" }: { role: Role; userName?: string; userEmail?: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const safeName = userName || "there";
  const firstName = safeName.split(" ")[0] || safeName;

  const roleLabel: Record<Role, string> = {
    Student: "Candidate",
    Industry: "Industry Professional",
    Academician: "Academician",
    Institution: "Institution Admin",
  };
  const roleColor: Record<Role, string> = { Student: "#22D3EE", Industry: "#FB923C", Academician: "#C084FC", Institution: "#34D399" };

  const statsMap: Record<Role, { label: string; value: string; sub: string; color: string; valueClassName?: string }[]> = {
    Student: [
      { label: "Readiness Score", value: "72/100", sub: "+5 from last week", color: "#4ADE80" },
      { label: "Skills Verified", value: "8", sub: "3 pending review", color: "#818CF8" },
      { label: "Applications", value: "12", sub: "4 shortlisted", color: "#FBBF24" },
      { label: "Profile Views", value: "34", sub: "By 7 companies", color: "#38BDF8", valueClassName: "font-['Inter']" },
    ],
    Industry: [
      { label: "Active Postings", value: "6", sub: "2 closing this week", color: "#4ADE80" },
      { label: "Candidates Reviewed", value: "128", sub: "48 shortlisted", color: "#818CF8" },
      { label: "Interviews Scheduled", value: "19", sub: "This month", color: "#FBBF24" },
      { label: "Offers Extended", value: "5", sub: "3 accepted", color: "#38BDF8" },
    ],
    Academician: [
      { label: "Candidates Tracked", value: "243", sub: "12 at-risk flagged", color: "#4ADE80" },
      { label: "Skill Gap Alerts", value: "38", sub: "Across 6 domains", color: "#F87171" },
      { label: "Curriculum Updates", value: "5", sub: "Pending approval", color: "#FBBF24" },
      { label: "FDPs Available", value: "12", sub: "3 deadlines this month", color: "#818CF8" },
    ],
    Institution: [
      { label: "Total Candidates", value: "350", sub: "Across 4 departments", color: "#4ADE80" },
      { label: "Placement Rate", value: "79%", sub: "+11% vs last year", color: "#2DD4BF" },
      { label: "Industry Partners", value: "48", sub: "12 new this year", color: "#F472B6" },
      { label: "Avg. Package", value: "₹13.2L", sub: "Highest: ₹24L", color: "#FBBF24" },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-[#22D3EE]" style={{ fontFamily: "Poppins, sans-serif" }}>{greeting}, {firstName} 👋</h2>

          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-500">Here's your platform overview for today.</p>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: roleColor[role], background: `${roleColor[role]}14`, border: `1px solid ${roleColor[role]}30` }}>
              {roleLabel[role]}
            </span>
          </div>
          {userEmail && <p className="text-xs text-gray-600 mt-1">{userEmail}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: `${roleColor[role]}20`, color: roleColor[role], border: `1px solid ${roleColor[role]}30` }}>
            {safeName.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white leading-tight">{safeName}</p>
            <p className="text-xs text-gray-500">{roleLabel[role]}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsMap[role].map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Placement Trend</p>
              <p className="text-base font-bold text-[#67E8F9]" style={{ fontFamily: "Poppins, sans-serif" }}>Candidates Placed per Month</p>
            </div>
            <span className="text-xs bg-green-400/10 text-green-400 font-semibold px-2.5 py-1 rounded-full">+24.5%</span>
          </div>
          <AreaSparkline values={placementTrend} />
        </div>
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Domain Distribution</p>
          <p className="text-base font-bold text-[#67E8F9] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Placements by field</p>
          <div className="flex items-center gap-3">
            <DonutSVG data={domainDist} />
            <div className="space-y-1.5">
              {domainDist.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-400">{d.name}</span>
                  <span className="text-xs font-semibold text-white ml-auto pl-1">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {role === "Institution" && (
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-base font-bold text-[#67E8F9] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Department-wise Placement Summary</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left pb-3">Department</th>
                  <th className="text-center pb-3">Total</th>
                  <th className="text-center pb-3">Placed</th>
                  <th className="text-center pb-3">Rate</th>
                  <th className="text-center pb-3">Avg. Package</th>
                  <th className="text-center pb-3">Top Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {institutionBatchData.map((d) => (
                  <tr key={d.dept} className="text-gray-300">
                    <td className="py-3 font-semibold text-white">{d.dept}</td>
                    <td className="text-center py-3">{d.total}</td>
                    <td className="text-center py-3 text-green-400 font-semibold">{d.placed}</td>
                    <td className="text-center py-3">
                      <span className="bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">{Math.round((d.placed / d.total) * 100)}%</span>
                    </td>
                    <td className="text-center py-3">{d.avgPkg}</td>
                    <td className="text-center py-3 text-yellow-400 font-semibold">{d.topPkg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#67E8F9] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Recent Activity</p>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{a.icon}</span>
                <div>
                  <p className="text-sm text-gray-300"><span className="font-semibold text-white">{a.user}</span> {a.action}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#0F2A1E] to-[#0D1F35] rounded-2xl p-5 border border-green-400/10">
          <p className="text-xs text-green-400 uppercase tracking-wide font-medium mb-1">Your Journey</p>
          <p className="text-base font-semibold text-white mb-4">Platform Flow</p>
          <div className="space-y-3">
            {[
              { step: "1", label: "Create Profile & Portfolio", done: true },
              { step: "2", label: "Take Skill Assessment", done: true },
              { step: "3", label: "Get AI Roadmap", done: false },
              { step: "4", label: "Learn & Build Projects", done: false },
              { step: "5", label: "Apply for Internships", done: false },
              { step: "6", label: "Get Skill Verified", done: false },
              { step: "7", label: "Land Your Opportunity", done: false },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.done ? "bg-green-400 text-gray-900" : "bg-white/10 text-white/30"}`}>{s.done ? "✓" : s.step}</div>
                <span className={`text-sm ${s.done ? "text-white" : "text-white/30"}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full bg-green-400 text-gray-900 font-semibold text-sm py-2.5 rounded-xl hover:bg-green-300 transition-colors">Continue Learning →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Skill Zone Tab ───────────────────────────────────────────────────────────
function SkillZoneTab({ role }: { role: Role }) {
  const isAcademician = role === "Academician";
  const [innerTab, setInnerTab] = useState(isAcademician ? "Course Mapping" : "Skill Assessment");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");

  const totalQ = assessmentQuestions.length;
  const currentQ = assessmentQuestions[step];
  const score = completed ? Math.round(Object.values(answers).reduce((a, b) => a + b, 0) / (totalQ * 3) * 100) : 72;

  const handleAnswer = (val: number) => {
    setAnswers({ ...answers, [step]: val });
    if (step < totalQ - 1) setStep(step + 1);
    else setCompleted(true);
  };

  const Heading = (txt: string) => <p className="text-sm font-bold text-[#D8B4FE] mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{txt}</p>;

  if (isAcademician) {
    const acTabs = ["Course Mapping", "Curriculum Alignment", "Candidate Analytics", "Faculty Upskilling"];
    const [acInner, setAcInner] = useState("Course Mapping");

    const courseData = [
      { code: "CS301", name: "Web Technologies", skills: ["HTML/CSS", "JavaScript", "React", "REST APIs"], alignment: 88, students: 62 },
      { code: "CS401", name: "Database Systems", skills: ["SQL", "NoSQL", "Schema Design", "Optimization"], alignment: 74, students: 58 },
      { code: "CS501", name: "Cloud Computing", skills: ["AWS", "Docker", "Kubernetes", "CI/CD"], alignment: 91, students: 45 },
      { code: "CS201", name: "Data Structures", skills: ["Algorithms", "Complexity", "Trees", "Graphs"], alignment: 62, students: 70 },
      { code: "CS601", name: "Machine Learning", skills: ["Python", "Scikit-learn", "Statistics", "TensorFlow"], alignment: 83, students: 38 },
    ];

    const studentSkillDist = [
      { skill: "JavaScript", proficiency: 71, students: 44 },
      { skill: "Python", proficiency: 65, students: 38 },
      { skill: "SQL", proficiency: 58, students: 41 },
      { skill: "React", proficiency: 48, students: 29 },
      { skill: "Docker", proficiency: 32, students: 18 },
      { skill: "REST APIs", proficiency: 55, students: 35 },
    ];

    const pdGoals = [
      { goal: "AWS Solutions Architect", progress: 62, due: "Dec 2026", status: "In Progress" },
      { goal: "Advanced ML Techniques", progress: 40, due: "Mar 2027", status: "In Progress" },
      { goal: "Industry Mentorship Program", progress: 100, due: "Completed", status: "Done" },
      { goal: "Research Paper – NLP", progress: 25, due: "Jun 2027", status: "Early Stage" },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#C084FC]" style={{ fontFamily: "Outfit, sans-serif" }}>Curriculum Zone</h2>
            <p className="text-sm text-gray-500 mt-0.5">Map course outcomes to industry skills, track curriculum alignment, and monitor student development.</p>
          </div>
          <InnerTabBar tabs={acTabs} active={acInner} onChange={setAcInner} />
        </div>

        {acInner === "Course Mapping" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: "Courses Managed", val: "5", icon: "📚", color: "#C084FC" }, { label: "Avg. Alignment Score", val: "79%", icon: "📊", color: "#4ADE80" }, { label: "Total Candidates", val: "273", icon: "👥", color: "#22D3EE" }].map((s) => (
                <div key={s.label} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>{s.icon}</div>
                  <div><p className="text-2xl font-bold text-white">{s.val}</p><p className="text-xs text-gray-500">{s.label}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Course–Skill Mapping")}
              <p className="text-xs text-gray-500 mb-4">Skills covered per course and industry alignment score.</p>
              <div className="space-y-4">
                {courseData.map((c) => (
                  <div key={c.code} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{c.name} <span className="text-xs text-gray-500 font-normal">({c.code})</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.students} students enrolled</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Industry Alignment</span>
                        <span className="text-sm font-bold" style={{ color: c.alignment >= 80 ? "#4ADE80" : c.alignment >= 65 ? "#F59E0B" : "#F87171" }}>{c.alignment}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {c.skills.map((sk) => <span key={sk} className="text-xs bg-[#C084FC]/10 text-[#C084FC] px-2.5 py-0.5 rounded-full border border-[#C084FC]/20">{sk}</span>)}
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.alignment}%`, background: c.alignment >= 80 ? "#4ADE80" : c.alignment >= 65 ? "#F59E0B" : "#F87171" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {acInner === "Curriculum Alignment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Industry Demand vs Curriculum Coverage")}
              <p className="text-xs text-gray-500 mb-4">How well your courses cover industry-demanded skills.</p>
              <div className="space-y-3">
                {[
                  { skill: "Cloud & DevOps", demand: 92, coverage: 85 },
                  { skill: "Machine Learning", demand: 88, coverage: 78 },
                  { skill: "Full Stack Web", demand: 85, coverage: 90 },
                  { skill: "Data Engineering", demand: 80, coverage: 55 },
                  { skill: "Cybersecurity", demand: 74, coverage: 40 },
                  { skill: "Blockchain", demand: 52, coverage: 20 },
                ].map((d) => (
                  <div key={d.skill}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-gray-300">{d.skill}</span>
                      <span className="text-gray-500">Demand <span className="text-white font-semibold">{d.demand}%</span> · Coverage <span className={d.coverage >= d.demand ? "text-green-400 font-semibold" : "text-amber-400 font-semibold"}>{d.coverage}%</span></span>
                    </div>
                    <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="absolute h-full bg-[#C084FC]/20 rounded-full" style={{ width: `${d.demand}%` }} />
                      <div className="absolute h-full rounded-full" style={{ width: `${d.coverage}%`, background: d.coverage >= d.demand ? "#4ADE80" : "#F59E0B" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Suggested Curriculum Updates")}
              <p className="text-xs text-gray-500 mb-4">Recommendations based on hiring trend data.</p>
              <div className="space-y-3">
                {[
                  { course: "CS201 – Data Structures", action: "Add Graph Algorithms module", urgency: "High", impact: "+12% alignment" },
                  { course: "CS401 – Databases", action: "Introduce NoSQL & Redis unit", urgency: "High", impact: "+9% alignment" },
                  { course: "CS501 – Cloud", action: "Add Terraform & IaC module", urgency: "Medium", impact: "+7% alignment" },
                  { course: "New Course", action: "Launch Cybersecurity elective", urgency: "Medium", impact: "New coverage" },
                  { course: "CS301 – Web Tech", action: "Update to React 19 patterns", urgency: "Low", impact: "+3% alignment" },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: r.urgency === "High" ? "#F87171" : r.urgency === "Medium" ? "#F59E0B" : "#4ADE80" }} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{r.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.course}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge text={r.urgency} color={r.urgency === "High" ? "#F87171" : r.urgency === "Medium" ? "#F59E0B" : "#4ADE80"} />
                      <p className="text-xs text-green-400 mt-1 font-medium">{r.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {acInner === "Candidate Analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: "Avg Skill Score", val: "64/100", color: "#C084FC" }, { label: "Assessment Completions", val: "81%", color: "#4ADE80" }, { label: "Candidates with Gaps", val: "47", color: "#F87171" }, { label: "Top Performers", val: "18", color: "#F59E0B" }].map((s) => (
                <div key={s.label} className="bg-[#161B27] rounded-2xl p-4 border border-white/[0.06] text-center">
                  <p className="text-2xl font-bold text-white">{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Class Skill Proficiency Breakdown")}
              <p className="text-xs text-gray-500 mb-4">Average proficiency and number of proficient students per skill across all your courses.</p>
              <div className="space-y-4">
                {studentSkillDist.map((d) => (
                  <div key={d.skill}>
                    <div className="flex justify-between mb-1.5 text-xs">
                      <span className="text-gray-200 font-medium">{d.skill}</span>
                      <div className="flex gap-4 text-gray-500">
                        <span>Avg proficiency: <span className="text-white font-semibold">{d.proficiency}%</span></span>
                        <span>Proficient: <span className="text-[#C084FC] font-semibold">{d.students} students</span></span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C084FC] rounded-full" style={{ width: `${d.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#120828] to-[#0d1117] rounded-2xl p-5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-sm font-bold text-white">AI Cohort Insights</p>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">COMING SOON</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">The AI agent will automatically identify at-risk students, flag skill gaps cohort-wide, and recommend targeted interventions per course.</p>
            </div>
          </div>
        )}

        {acInner === "Faculty Upskilling" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("My Professional Development Goals")}
              <p className="text-xs text-gray-500 mb-4">Track your upskilling progress alongside your teaching commitments.</p>
              <div className="space-y-4">
                {pdGoals.map((g, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-white">{g.goal}</p>
                      <Badge text={g.status} color={g.status === "Done" ? "#4ADE80" : g.status === "In Progress" ? "#C084FC" : "#F59E0B"} />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Target: {g.due}</p>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${g.progress}%`, background: g.status === "Done" ? "#4ADE80" : "#C084FC" }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{g.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
                {Heading("Recommended Programs")}
                <p className="text-xs text-gray-500 mb-3">FDPs and industry certifications matched to your teaching domain.</p>
                <div className="space-y-3">
                  {[
                    { name: "Google Cloud Professional Data Engineer", provider: "Google", type: "Certification", match: 94 },
                    { name: "Advanced Deep Learning FDP", provider: "NPTEL", type: "FDP", match: 88 },
                    { name: "Industry 4.0 & IoT Applications", provider: "AICTE", type: "FDP", match: 76 },
                    { name: "Research Methodology & Ethics", provider: "UGC", type: "Workshop", match: 71 },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.provider} · {p.type}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#C084FC]">{p.match}%</p>
                        <p className="text-xs text-gray-600">match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
                {Heading("Quick Stats")}
                <div className="grid grid-cols-2 gap-3">
                  {[{ l: "FDPs Completed", v: "6" }, { l: "Certifications", v: "3" }, { l: "Papers Published", v: "12" }, { l: "Workshops Attended", v: "9" }].map((s) => (
                    <div key={s.l} className="text-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <p className="text-xl font-bold text-white">{s.v}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#C084FC]" style={{ fontFamily: "Outfit, sans-serif" }}>Skill Zone</h2>
          <p className="text-sm text-gray-500 mt-0.5">Assess, map, and grow your skills with AI-powered guidance.</p>
        </div>
        <InnerTabBar tabs={["Skill Assessment", "Skill Profile", "Gap Analysis", "Learning Roadmap"]} active={innerTab} onChange={setInnerTab} />
      </div>

      {innerTab === "Skill Assessment" && (
        <div className="max-w-2xl mx-auto">
          {!completed && step === 0 && Object.keys(answers).length === 0 ? (
            <div className="bg-[#161B27] rounded-2xl p-8 border border-white/[0.06] text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Skill Assessment</h3>
              <p className="text-gray-400 text-sm mb-2">8 questions across Technical Skills, Soft Skills, and Aptitude.</p>
              <p className="text-gray-500 text-xs mb-6">Takes ~5 minutes. Your results generate a verified skill profile.</p>
              <div className="grid grid-cols-3 gap-3 mb-8 text-center">
                {[{ n: "5", l: "Technical" }, { n: "2", l: "Soft Skills" }, { n: "1", l: "Aptitude" }].map((s) => (
                  <div key={s.l} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                    <p className="text-2xl font-bold text-[#C084FC]">{s.n}</p>
                    <p className="text-xs text-gray-500">{s.l}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="bg-[#C084FC] text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-[#D8B4FE] transition-colors">Start Assessment →</button>
            </div>
          ) : completed ? (
            <div className="space-y-4">
              <div className="bg-[#161B27] rounded-2xl p-8 border border-white/[0.06] text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-white mb-1">Assessment Complete!</h3>
                <p className="text-gray-400 text-sm mb-4">Your skill profile has been generated and verified.</p>
                <div className="flex items-center justify-center gap-8">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#C084FC" strokeWidth="10" strokeDasharray={`${(score / 100) * 314} 314`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{score}</span>
                      <span className="text-xs text-white/40">/100</span>
                    </div>
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-white font-semibold">Industry Readiness</p>
                    <Badge text={score >= 75 ? "Strong Profile" : score >= 50 ? "Developing" : "Beginner"} color={score >= 75 ? "#4ADE80" : score >= 50 ? "#FBBF24" : "#F87171"} />
                    <p className="text-xs text-gray-400">View detailed report in Skill Profile</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-center mt-6">
                  <button onClick={() => { setStep(0); setAnswers({}); setCompleted(false); }} className="border border-white/10 text-gray-300 text-sm px-5 py-2 rounded-xl hover:bg-white/[0.05]">Retake</button>
                  <button onClick={() => setInnerTab("Skill Profile")} className="bg-[#C084FC] text-gray-900 font-bold text-sm px-5 py-2 rounded-xl hover:bg-[#D8B4FE]">View Profile →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#161B27] rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-[#C084FC] font-semibold">{currentQ.domain}</p>
                <p className="text-xs text-gray-500">{step + 1} / {totalQ}</p>
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-1.5 mb-6">
                <div className="h-1.5 rounded-full bg-[#C084FC] transition-all" style={{ width: `${((step + 1) / totalQ) * 100}%` }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-6">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)}
                    className="w-full text-left p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-[#C084FC]/10 hover:border-[#C084FC]/30 text-gray-300 text-sm transition-all">
                    <span className="text-[#C084FC] font-bold mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {innerTab === "Skill Profile" && (
        <div className="space-y-4">
          {/* AI Score Placeholder */}
          <div className="flex items-start gap-4 bg-[#161B27] rounded-2xl p-5 border border-purple-500/20"
            style={{ background: "linear-gradient(135deg, #120828 0%, #161B27 60%)" }}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl flex-shrink-0">🤖</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-bold text-white">AI Readiness Score</p>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">COMING SOON</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">The AI agent will analyze your full profile — assessments, projects, certifications, and GitHub activity — to assign a precise, role-specific readiness score.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: "AI Skill Score", val: "–/100", hint: "Computed by agent" },
                  { label: "Confidence Level", val: "–%", hint: "Based on evidence" },
                  { label: "Role Fit Index", val: "–/10", hint: "For your target role" },
                  { label: "Peer Percentile", val: "–%", hint: "Among similar profiles" },
                ].map((m) => (
                  <div key={m.label} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] text-center">
                    <p className="text-lg font-bold text-purple-400">{m.val}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{m.label}</p>
                    <p className="text-[9px] text-gray-600 mt-0.5">{m.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Skill Radar")}
              <RadarSVG data={radarPoints} />
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Verified Skill Levels")}
              <div className="mt-3 space-y-3">
                {portfolioSkills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-200">{s.name}</span>
                        {s.verified && <span className="text-xs bg-green-400/10 text-green-400 px-1.5 py-0.5 rounded font-medium">Verified</span>}
                      </div>
                      <span className="text-xs text-gray-500">{["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][s.level]}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#C084FC]" style={{ width: `${(s.level / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {innerTab === "Gap Analysis" && (
        <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#1A0F2E] to-[#0D1F35] rounded-2xl p-6 border border-[#C084FC]/10 flex flex-col items-center">
            <p className="text-xs text-[#C084FC] uppercase tracking-wide font-medium mb-4">Industry Readiness</p>
            <div className="relative w-32 h-32 mb-3">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#C084FC" strokeWidth="10" strokeDasharray={`${(72 / 100) * 314} 314`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">72</span>
                <span className="text-xs text-white/40">/100</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-white text-center mb-4">{targetRole}</p>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full text-xs border border-white/10 rounded-xl px-3 py-2 bg-white/[0.05] text-gray-300 focus:outline-none">
              <option>Full Stack Developer</option><option>Data Scientist</option><option>DevOps Engineer</option><option>Product Manager</option>
            </select>
          </div>
          <div className="md:col-span-2 bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Top Skill Gaps")}
            <p className="text-xs text-gray-500 mb-4">Required level vs your current level</p>
            <div className="space-y-4">
              {skillGapData.map((s) => {
                const gap = s.required - s.yours;
                return (
                  <div key={s.skill}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-200">{s.skill}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-gray-500">Req: <span className="font-semibold text-gray-300">{s.required}%</span></span>
                        <span className="text-gray-500">Yours: <span className="font-semibold text-gray-300">{s.yours}%</span></span>
                        <span className={`font-bold ${gap > 0 ? "text-red-400" : "text-green-400"}`}>{gap > 0 ? `▲ ${gap}%` : `✓ +${Math.abs(gap)}%`}</span>
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="absolute h-full bg-[#C084FC]/20 rounded-full" style={{ width: `${s.required}%` }} />
                      <div className="absolute h-full bg-[#C084FC] rounded-full" style={{ width: `${Math.min(s.yours, s.required)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl p-4 border border-purple-500/20"
          style={{ background: "linear-gradient(135deg, #120828 0%, #0d1117 70%)" }}>
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-sm font-bold text-white">AI-Powered Gap Recommendations</p>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">COMING SOON</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Once integrated, the AI agent will automatically rank your gaps by market urgency, suggest the fastest learning paths, and surface live courses, projects, and mentors that directly close each gap.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Gap-to-resource linking", "Fastest closure paths", "Week-by-week study plan", "Skill verification milestones"].map((f) => (
                <span key={f} className="text-[10px] bg-white/[0.04] border border-white/[0.08] text-gray-400 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}

      {innerTab === "Learning Roadmap" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("AI-Generated Learning Path")}
            <p className="text-xs text-gray-500 mb-4">Personalized for Full Stack Developer role</p>
            <div className="space-y-2.5">
              {[
                { phase: "Week 1-2", task: "React Fundamentals – Hooks, Context, State Management", priority: "High" },
                { phase: "Week 3-4", task: "Build 2 full-stack CRUD projects end-to-end", priority: "High" },
                { phase: "Month 2", task: "Node.js REST APIs + MongoDB + Authentication", priority: "Medium" },
                { phase: "Month 3", task: "DSA: Arrays, Trees, Graphs (50 LeetCode problems)", priority: "Medium" },
                { phase: "Month 4", task: "System Design fundamentals + Mock Interviews", priority: "Low" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-[#C084FC]/5 border border-white/[0.04] transition-colors">
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: r.priority === "High" ? "#EF4444" : r.priority === "Medium" ? "#F59E0B" : "#6B7280" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">{r.phase}</p>
                    <p className="text-sm text-gray-200 font-medium">{r.task}</p>
                  </div>
                  <Badge text={r.priority} color={r.priority === "High" ? "#EF4444" : r.priority === "Medium" ? "#F59E0B" : "#6B7280"} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Career Guidance")}
            <p className="text-xs text-gray-500 mb-4">Roles that match your current skill profile</p>
            <div className="space-y-3">
              {[
                { role: "Frontend Developer", match: 82, demand: "High", salary: "₹8–18 LPA" },
                { role: "Full Stack Developer", match: 68, demand: "Very High", salary: "₹12–28 LPA" },
                { role: "React Native Developer", match: 74, demand: "High", salary: "₹10–22 LPA" },
                { role: "UI Engineer", match: 90, demand: "Medium", salary: "₹7–16 LPA" },
                { role: "Data Analyst", match: 55, demand: "High", salary: "₹6–15 LPA" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{c.role}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{c.salary}</span>
                      <Badge text={`Demand: ${c.demand}`} color={c.demand === "Very High" ? "#4ADE80" : c.demand === "High" ? "#FBBF24" : "#6B7280"} />
                    </div>
                  </div>
                  <MatchBar pct={c.match} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skill Intel Tab ─────────────────────────────────────────────────────────
function SkillIntelTab() {
  const roleNames = Object.keys(jobRolesSkillData);
  const [selectedRole, setSelectedRole] = useState(roleNames[0]);
  const [section, setSection] = useState<"technical" | "nonTechnical">("technical");
  const data = jobRolesSkillData[selectedRole];

  const allSkills = [...data.technical, ...data.nonTechnical];
  const overallMatch = Math.round(
    allSkills.reduce((s, sk) => s + Math.min((sk.yours / sk.required) * 100, 100), 0) / allSkills.length
  );
  const criticalCount = allSkills.filter((s) => s.priority === "Critical").length;
  const metCount = allSkills.filter((s) => s.priority === "Met" || s.yours >= s.required).length;

  const priorityColor = (p: SkillPriority) =>
    p === "Critical" ? "#EF4444" : p === "High" ? "#F59E0B" : p === "Moderate" ? "#38BDF8" : "#4ADE80";
  const trendIcon = (t: SkillTrend) => t === "Rising" ? "↑" : t === "Declining" ? "↓" : "→";
  const trendColor = (t: SkillTrend) => t === "Rising" ? "#4ADE80" : t === "Declining" ? "#EF4444" : "#6B7280";

  const activeSkills = section === "technical" ? data.technical : data.nonTechnical;

  // Development priorities: all non-Met skills ordered by priority then gap size
  const priorityOrder: SkillPriority[] = ["Critical", "High", "Moderate"];
  const devQueue = allSkills
    .filter((s) => s.priority !== "Met")
    .sort((a, b) => {
      const po = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      if (po !== 0) return po;
      return (b.required - b.yours) - (a.required - a.yours);
    });

  const maxGrowth = Math.max(...industryTrendsData.map((d) => d.growth));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F59E0B]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Skill Intelligence Hub
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Explore job-specific skill requirements, track industry demand, and identify your development priorities.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#1A1030] border border-purple-500/25 rounded-xl px-4 py-2.5 flex-shrink-0">
          <span className="text-base">🤖</span>
          <div>
            <p className="text-xs font-semibold text-purple-300">AI Skill Agent</p>
            <p className="text-[10px] text-purple-400/60">Auto-scoring integration pending</p>
          </div>
          <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">SOON</span>
        </div>
      </div>

      {/* AI Agent Teaser Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 p-5"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d1117 55%, #0a1a30 100%)" }}>
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-purple-500/8 pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-blue-500/8 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <p className="text-white font-bold text-base">AI Skill Analysis Agent</p>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold tracking-wide">COMING SOON</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                An AI agent is being integrated that will <span className="text-purple-300 font-medium">automatically scan your profile</span>,
                assign a precision readiness score per role, surface your most critical skill gaps, and generate a
                weekly-updated learning plan with direct opportunity links.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { icon: "🎯", label: "Auto Skill Scoring" },
                  { icon: "📊", label: "Role-wise Gap Report" },
                  { icon: "💡", label: "Smart Learning Plan" },
                  { icon: "🔗", label: "Opportunity Matching" },
                  { icon: "📈", label: "Weekly Progress Insights" },
                ].map((f) => (
                  <span key={f.label} className="text-xs bg-white/[0.05] border border-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all whitespace-nowrap">
              🔔 Notify Me When Live
            </button>
            <p className="text-center text-[10px] text-gray-600">Integrating with Skill Zone</p>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-medium">Select Target Job Role</p>
        <div className="flex flex-wrap gap-2">
          {roleNames.map((r) => (
            <button key={r} onClick={() => setSelectedRole(r)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={selectedRole === r
                ? { background: "#F59E0B18", color: "#F59E0B", border: "1px solid #F59E0B40" }
                : { background: "rgba(255,255,255,0.03)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Overall Profile Match", value: `${overallMatch}%`, sub: `For ${selectedRole}`, color: overallMatch >= 65 ? "#4ADE80" : overallMatch >= 45 ? "#F59E0B" : "#EF4444" },
          { label: "Critical Gaps", value: `${criticalCount}`, sub: "Skills needing urgent focus", color: "#EF4444" },
          { label: "Skills Met / Exceeded", value: `${metCount}`, sub: "Already at required level", color: "#4ADE80" },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium">{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Technical / Non-Technical Toggle + Skills Grid */}
      <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-[#FCD34D]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {section === "technical" ? "Technical Skills Required" : "Non-Technical & Soft Skills Required"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">For <span className="text-white font-medium">{selectedRole}</span> — your current level vs industry requirement</p>
          </div>
          <div className="flex gap-1 bg-white/[0.05] p-1 rounded-xl">
            {(["technical", "nonTechnical"] as const).map((s) => (
              <button key={s} onClick={() => setSection(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={section === s ? { background: "#F59E0B", color: "#111" } : { color: "#6B7280" }}>
                {s === "technical" ? "⚙️ Technical" : "🧠 Non-Technical"}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white/10" /> Industry Required</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> Your Level</div>
          {[["Critical", "#EF4444"], ["High", "#F59E0B"], ["Moderate", "#38BDF8"], ["Met", "#4ADE80"]].map(([p, c]) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c }} />
              {p}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {activeSkills.map((s) => {
            const gap = s.required - s.yours;
            return (
              <div key={s.name} className="group">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-sm font-semibold text-gray-100 truncate">{s.name}</span>
                    <span className="text-[10px] bg-white/[0.06] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06] whitespace-nowrap">{s.category}</span>
                    {"jobs" in s && (
                      <span className="text-[10px] text-gray-500 hidden md:inline">{(s as TechSkill).jobs.toLocaleString()} openings</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold" style={{ color: trendColor(s.trend) }}>{trendIcon(s.trend)} {s.trend}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: priorityColor(s.priority), background: `${priorityColor(s.priority)}12`, borderColor: `${priorityColor(s.priority)}30` }}>
                      {s.priority}
                    </span>
                    <span className={`text-xs font-bold ${gap > 0 ? "text-red-400" : "text-green-400"}`}>
                      {gap > 0 ? `▲ ${gap}% gap` : `✓ +${Math.abs(gap)}%`}
                    </span>
                  </div>
                </div>
                <div className="relative h-5 bg-white/[0.05] rounded-full overflow-hidden">
                  {/* Required level backdrop */}
                  <div className="absolute inset-y-0 left-0 rounded-full bg-white/[0.08]" style={{ width: `${s.required}%` }} />
                  {/* Your level fill */}
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{ width: `${Math.min(s.yours, s.required)}%`, background: `${priorityColor(s.priority)}90` }} />
                  {/* Overflow if you exceed required */}
                  {s.yours > s.required && (
                    <div className="absolute inset-y-0 left-0 rounded-full bg-green-400" style={{ width: `${s.required}%` }} />
                  )}
                  <div className="absolute inset-0 flex items-center px-3 justify-between">
                    <span className="text-[9px] font-bold text-white/80">You: {s.yours}%</span>
                    <span className="text-[9px] text-white/40">Required: {s.required}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Industry Trends + Development Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Industry Trends */}
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#FCD34D] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
            Industry Skill Demand Trends
          </p>
          <p className="text-xs text-gray-500 mb-4">Q3 2026 · Year-over-year hiring growth</p>
          <div className="space-y-3">
            {industryTrendsData.map((d) => (
              <div key={d.skill}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-sm text-gray-200 font-medium">{d.skill}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">{d.openings.toLocaleString()} jobs</span>
                    <span className="font-bold text-green-400">+{d.growth}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(d.growth / maxGrowth) * 100}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Priority Queue */}
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#FCD34D]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Your Development Queue
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Ordered by urgency · {devQueue.length} skills to cover</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <span className="text-amber-400 text-sm font-bold">{devQueue.length}</span>
            </div>
          </div>

          {/* AI placeholder row */}
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 mb-3">
            <span className="text-sm">🤖</span>
            <p className="text-xs text-purple-300">AI Agent will auto-prioritize and link resources for each gap</p>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {devQueue.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/10 transition-colors">
                <span className="text-xs font-bold text-gray-600 w-5 flex-shrink-0">#{i + 1}</span>
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: priorityColor(s.priority) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-500">{s.category} · Gap: {s.required - s.yours}%</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
                  style={{ color: priorityColor(s.priority), background: `${priorityColor(s.priority)}12`, borderColor: `${priorityColor(s.priority)}30` }}>
                  {s.priority}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full text-xs border border-dashed border-white/10 rounded-xl py-2.5 text-gray-500 hover:border-amber-400/30 hover:text-amber-400 transition-colors">
            📋 Export Development Plan (PDF)
          </button>
        </div>
      </div>

    </div>
  );
}

// ─── Opportunities Tab ────────────────────────────────────────────────────────
function OpportunitiesTab({ role }: { role: Role }) {
  const defaultTab = role === "Academician" ? "FDPs & Research" : "Internships";
  const [innerTab, setInnerTab] = useState(defaultTab);
  const tabs = role === "Academician"
    ? ["FDPs & Research", "Internships", "Learning Programs"]
    : role === "Industry"
    ? ["Post Opportunity", "Internships", "Jobs", "Learning Programs"]
    : ["Internships", "Jobs", "Learning Programs"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#FB923C]" style={{ fontFamily: "Work Sans, sans-serif" }}>Opportunities</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {role === "Academician" ? "FDPs, research, faculty internships, and learning programs." : "Internships, jobs, and industry learning programs — all matched to your profile."}
          </p>
        </div>
        <InnerTabBar tabs={tabs} active={innerTab} onChange={setInnerTab} />
      </div>

      {innerTab === "Internships" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internshipListings.map((intern) => (
              <div key={intern.id} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: intern.color }}>{intern.logo}</div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{intern.company}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{intern.role}</p>
                    </div>
                  </div>
                  <Badge text={intern.status} color={intern.status === "Open" ? "#4ADE80" : "#FB923C"} />
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mb-3">
                  <Badge text={intern.type} color="#FB923C" />
                  <span className="self-center">⏱ {intern.duration}</span>
                  <span className="self-center">💰 {intern.stipend}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {intern.skills.map((sk) => <span key={sk} className="text-xs bg-white/[0.06] text-gray-400 px-2.5 py-1 rounded-full border border-white/[0.06]">{sk}</span>)}
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between mb-1"><span className="text-xs text-gray-500">Profile Match</span></div>
                  <MatchBar pct={intern.match} />
                  <button className="mt-4 w-full bg-white/[0.06] hover:bg-[#FB923C] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "Open Internships", value: "124", icon: "💼" }, { label: "Companies Active", value: "48", icon: "🏢" }, { label: "Avg. Stipend", value: "₹14,500/mo", icon: "💰" }].map((s) => (
              <div key={s.label} className="bg-[#161B27] rounded-2xl p-4 border border-white/[0.06] flex items-center gap-4">
                <span className="text-2xl">{s.icon}</span>
                <div><p className="text-xl font-bold text-white">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
              </div>
            ))}
          </div>
        </>
      )}

      {innerTab === "Jobs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: job.color }}>{job.logo}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{job.company}</p>
                      <p className="text-xs text-gray-500">{job.role}</p>
                    </div>
                  </div>
                  <Badge text={job.type} color="#FB923C" />
                </div>
                <div className="flex gap-3 flex-wrap">
                  {job.skills.map((sk) => <span key={sk} className="text-xs bg-white/[0.06] text-gray-400 px-2.5 py-1 rounded-full border border-white/[0.06]">{sk}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#FBBF24]">{job.package}</p>
                  <div className="w-32"><MatchBar pct={job.match} /></div>
                </div>
                <button className="w-full bg-white/[0.06] hover:bg-[#FB923C] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === "Learning Programs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPrograms.map((p) => (
            <div key={p.id} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: p.color }}>{p.logo}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.company} · {p.duration}</p>
                </div>
                <Badge text={p.type} color="#FB923C" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((sk) => <span key={sk} className="text-xs bg-white/[0.06] text-gray-400 px-2.5 py-1 rounded-full border border-white/[0.06]">{sk}</span>)}
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Enrollment</span><span>{p.enrolled}/{p.seats} seats</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(p.enrolled / p.seats) * 100}%`, background: p.color }} />
                </div>
              </div>
              <button className="w-full bg-white/[0.06] hover:bg-[#FB923C] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Enroll Now</button>
            </div>
          ))}
        </div>
      )}

      {innerTab === "FDPs & Research" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fdpListings.map((f) => (
              <div key={f.id} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge text={f.type} color={f.color} />
                    <p className="text-sm font-semibold text-white mt-2">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.company}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  {[{ label: "Duration", val: f.duration }, { label: "Stipend", val: f.stipend }, { label: "Seats", val: `${f.seats} left` }].map((d) => (
                    <div key={d.label} className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                      <p className="text-gray-500">{d.label}</p>
                      <p className="text-white font-semibold mt-0.5">{d.val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>⏰ Deadline: <span className="text-[#FB923C] font-medium">{f.deadline}</span></span>
                </div>
                <button className="w-full bg-white/[0.06] hover:bg-[#FB923C] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === "Post Opportunity" && (
        <div className="max-w-2xl mx-auto bg-[#161B27] rounded-2xl p-6 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#FB923C] mb-4" style={{ fontFamily: "Work Sans, sans-serif" }}>Post New Opportunity</p>
          <div className="space-y-4">
            {[
              { label: "Opportunity Type", type: "select", options: ["Internship", "Job", "Project", "Apprenticeship", "Learning Program"] },
              { label: "Role / Title", type: "text", placeholder: "e.g. Full Stack Developer Intern" },
              { label: "Required Skills (comma separated)", type: "text", placeholder: "React, Node.js, MongoDB" },
              { label: "Duration", type: "text", placeholder: "e.g. 3 months / Full-time" },
              { label: "Stipend / Package", type: "text", placeholder: "e.g. ₹15,000/mo or ₹18 LPA" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">{f.label}</label>
                {f.type === "select"
                  ? <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#FB923C]/40">{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
                  : <input type="text" placeholder={f.placeholder} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#FB923C]/40 placeholder-gray-600" />}
              </div>
            ))}
            <button className="w-full bg-[#FB923C] text-gray-900 font-bold py-3 rounded-xl hover:bg-[#FDBA74] transition-colors mt-2">Publish Opportunity</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Tab ────────────────────────────────────────────────────────────
function PortfolioTab({ role }: { role: Role }) {
  const [innerTab, setInnerTab] = useState("Overview");
  const Heading = (txt: string) => <p className="text-sm font-bold text-[#34D399] mb-3" style={{ fontFamily: "Nunito, sans-serif" }}>{txt}</p>;

  if (role === "Academician") {
    const [acTab, setAcTab] = useState("Publications");
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#34D399]" style={{ fontFamily: "Nunito, sans-serif" }}>Academic Portfolio</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your verified academic record — publications, courses, research, and recognitions.</p>
          </div>
          <div className="flex items-center gap-3">
            <InnerTabBar tabs={["Publications", "Courses Taught", "Research Projects", "Recognitions"]} active={acTab} onChange={setAcTab} />
            <button className="text-xs bg-[#34D399] text-gray-900 font-bold px-3 py-1.5 rounded-full hover:bg-[#6EE7B7] transition-colors">Share ↗</button>
          </div>
        </div>

        {/* Faculty profile header */}
        <div className="bg-gradient-to-br from-[#0A2A1F] to-[#0D1A2A] rounded-2xl p-6 border border-[#34D399]/10 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#34D399] flex items-center justify-center text-gray-900 text-2xl font-bold flex-shrink-0">PM</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-white">Prof. Priya Mehta</h3>
              <Badge text="Verified Faculty" color="#34D399" />
            </div>
            <p className="text-sm text-gray-400 mt-0.5">Associate Professor · Computer Science · MIT Pune</p>
            <p className="text-sm text-gray-300 mt-2 max-w-xl">Specializes in Machine Learning, Cloud Systems, and Web Technologies. Active researcher with 12+ publications. Mentors 30+ students per semester.</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>📍 Pune, Maharashtra</span>
              <span>🎓 PhD – IIT Bombay</span>
              <span>📅 Experience: 11 years</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold text-[#34D399]">87</p>
            <p className="text-xs text-gray-500">H-Index Score</p>
            <p className="text-xs text-[#34D399] mt-1 font-medium">Top 5% Faculty</p>
          </div>
        </div>

        {acTab === "Publications" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ l: "Total Papers", v: "12" }, { l: "Citations", v: "284" }, { l: "h-index", v: "8" }, { l: "i10-index", v: "5" }].map((s) => (
                <div key={s.l} className="bg-[#161B27] rounded-2xl p-4 border border-white/[0.06] text-center">
                  <p className="text-2xl font-bold text-[#34D399]">{s.v}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] space-y-4">
              {Heading("Research Publications")}
              {[
                { title: "Adaptive Federated Learning for Edge IoT Systems", journal: "IEEE IoT Journal", year: "2025", citations: 41, status: "Published" },
                { title: "Curriculum-to-Industry Skill Gap: A Data-Driven Study", journal: "ACM Education", year: "2024", citations: 27, status: "Published" },
                { title: "Explainable AI for Candidate Performance Prediction", journal: "Elsevier Expert Systems", year: "2024", citations: 19, status: "Published" },
                { title: "Serverless ML Inference Optimization on AWS Lambda", journal: "Springer Computing", year: "2025", citations: 6, status: "Under Review" },
                { title: "Graph Neural Networks for Placement Prediction", journal: "AAAI Workshop", year: "2026", citations: 0, status: "Preprint" },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-snug">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.journal} · {p.year}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge text={p.status} color={p.status === "Published" ? "#34D399" : p.status === "Under Review" ? "#F59E0B" : "#6B7280"} />
                    <p className="text-xs text-gray-400">{p.citations} citations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {acTab === "Courses Taught" && (
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] space-y-4">
            {Heading("Teaching Record")}
            {[
              { code: "CS301", name: "Web Technologies", semester: "Sem 5 · 2025-26", students: 62, rating: 4.6, outcomes: ["React", "REST APIs", "Node.js"] },
              { code: "CS501", name: "Cloud Computing", semester: "Sem 7 · 2025-26", students: 45, rating: 4.8, outcomes: ["AWS", "Docker", "Kubernetes"] },
              { code: "CS401", name: "Database Systems", semester: "Sem 5 · 2024-25", students: 58, rating: 4.4, outcomes: ["SQL", "NoSQL", "Optimization"] },
              { code: "CS601", name: "Machine Learning", semester: "Sem 7 · 2024-25", students: 38, rating: 4.7, outcomes: ["Python", "Scikit-learn", "TensorFlow"] },
            ].map((c, i) => (
              <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{c.name} <span className="text-xs text-gray-500 font-normal">({c.code})</span></p>
                    <p className="text-xs text-gray-500">{c.semester} · {c.students} students</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-bold text-white">{c.rating}</span>
                    <span className="text-xs text-gray-500">/ 5</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.outcomes.map((o) => <span key={o} className="text-xs bg-[#34D399]/10 text-[#34D399] px-2.5 py-0.5 rounded-full border border-[#34D399]/20">{o}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {acTab === "Research Projects" && (
          <div className="space-y-4">
            {[
              { title: "AI-Driven Curriculum Alignment with Industry Demand", funder: "DST – SERB", amount: "₹24.5L", status: "Active", progress: 65, duration: "2024–2027", team: 4 },
              { title: "Federated Learning for Healthcare Data Privacy", funder: "ICMR", amount: "₹18L", status: "Active", progress: 40, duration: "2025–2028", team: 3 },
              { title: "Intelligent Placement Prediction System", funder: "AICTE", amount: "₹8L", status: "Completed", progress: 100, duration: "2022–2024", team: 2 },
              { title: "Edge Computing for Real-Time Traffic Management", funder: "MSRIT Internal", amount: "₹3L", status: "Active", progress: 80, duration: "2024–2025", team: 2 },
            ].map((p, i) => (
              <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{p.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span>🏦 {p.funder}</span><span>📅 {p.duration}</span><span>👥 {p.team} researchers</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge text={p.status} color={p.status === "Active" ? "#4ADE80" : "#6B7280"} />
                    <p className="text-sm font-bold text-[#34D399] mt-1">{p.amount}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.status === "Completed" ? "#34D399" : "#C084FC" }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{p.progress}% complete</p>
              </div>
            ))}
          </div>
        )}

        {acTab === "Recognitions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Awards & Honours")}
              <div className="space-y-3">
                {[
                  { award: "Best Researcher Award", body: "MIT Pune", year: "2025", icon: "🏆" },
                  { award: "Outstanding Educator", body: "AICTE National", year: "2024", icon: "🎓" },
                  { award: "Young Scientist Fellowship", body: "DST India", year: "2023", icon: "🔬" },
                  { award: "Best Paper Award", body: "IEEE IoT Conf.", year: "2023", icon: "📄" },
                  { award: "Mentor of the Year", body: "SkillBridge Portal", year: "2025", icon: "⭐" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <span className="text-xl">{a.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{a.award}</p>
                      <p className="text-xs text-gray-500">{a.body} · {a.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              {Heading("Professional Memberships")}
              <div className="space-y-3 mb-4">
                {[
                  { org: "IEEE Senior Member", since: "2021" },
                  { org: "ACM India Council Member", since: "2022" },
                  { org: "CSI Life Member", since: "2015" },
                  { org: "ISTE Member", since: "2014" },
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                    <p className="text-sm font-medium text-white">{m.org}</p>
                    <p className="text-xs text-gray-500">Since {m.since}</p>
                  </div>
                ))}
              </div>
              {Heading("Patent Filed")}
              <div className="p-3 bg-[#34D399]/5 border border-[#34D399]/20 rounded-xl">
                <p className="text-sm font-semibold text-white">Adaptive Skill Assessment Framework</p>
                <p className="text-xs text-gray-500 mt-0.5">Patent No: 202341012345 · Filed 2023 · Under Examination</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#34D399]" style={{ fontFamily: "Nunito, sans-serif" }}>Digital Portfolio</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your verified, shareable professional profile — powered by SkillBridge.</p>
        </div>
        <div className="flex items-center gap-3">
          <InnerTabBar tabs={["Overview", "Skills & Certs", "Projects", "Achievements"]} active={innerTab} onChange={setInnerTab} />
          <button className="text-xs bg-[#34D399] text-gray-900 font-bold px-3 py-1.5 rounded-full hover:bg-[#6EE7B7] transition-colors">Share ↗</button>
        </div>
      </div>

      {/* Profile header always shown */}
      <div className="bg-gradient-to-br from-[#0A2A1F] to-[#0D1A2A] rounded-2xl p-6 border border-[#34D399]/10 flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#34D399] flex items-center justify-center text-gray-900 text-2xl font-bold flex-shrink-0">AR</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-white">Arjun Rajan</h3>
            <Badge text="Verified Profile" color="#34D399" />
          </div>
          <p className="text-sm text-gray-400 mt-0.5">B.Tech Computer Science · MIT Pune · Batch 2026</p>
          <p className="text-sm text-gray-300 mt-2 max-w-xl">Full-stack developer with a passion for building scalable web applications. Skilled in React, Node.js, and cloud infrastructure. Open to internships and full-time opportunities.</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>📍 Pune, Maharashtra</span>
            <span>🎓 CGPA: 8.2</span>
            <span>👁 Portfolio views: 34</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold text-[#34D399]">72</p>
          <p className="text-xs text-gray-500">Readiness Score</p>
          <p className="text-xs text-[#34D399] mt-1 font-medium">+8 this month</p>
        </div>
      </div>

      {innerTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Internship History")}
            <div className="space-y-3">
              {[
                { company: "Webify Labs", role: "Frontend Intern", duration: "Jun–Aug 2025", color: "#6366F1" },
                { company: "DataBridge AI", role: "ML Intern", duration: "Dec–Jan 2025", color: "#F59E0B" },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: e.color }}>{e.company.slice(0, 2)}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{e.company}</p>
                    <p className="text-xs text-gray-500">{e.role} · {e.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Top Skills")}
            <div className="flex flex-wrap gap-2">
              {portfolioSkills.filter((s) => s.verified).map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full">
                  <span className="text-xs text-white font-medium">{s.name}</span>
                  <span className="text-green-400 text-xs">✓</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Certifications")}
            <div className="space-y-3">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: c.color }}>{c.issuer.slice(0, 1)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.issuer} · {c.date}</p>
                  </div>
                  {c.verified && <span className="text-green-400 text-xs flex-shrink-0">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {innerTab === "Skills & Certs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Skill Proficiency")}
            <div className="space-y-3 mt-2">
              {portfolioSkills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-200">{s.name}</span>
                      {s.verified && <span className="text-xs bg-green-400/10 text-green-400 px-1.5 py-0.5 rounded font-medium">Verified</span>}
                    </div>
                    <span className="text-xs text-gray-500">{["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][s.level]}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#34D399]" style={{ width: `${(s.level / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
            {Heading("Certifications")}
            <div className="space-y-4 mt-2">
              {certifications.map((c, i) => (
                <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.04] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: c.color }}>{c.issuer.slice(0, 1)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.issuer} · Issued {c.date}</p>
                  </div>
                  <Badge text="Verified" color="#34D399" />
                </div>
              ))}
              <button className="w-full border border-dashed border-white/10 rounded-xl py-3 text-xs text-gray-500 hover:border-[#34D399]/30 hover:text-[#34D399] transition-colors">+ Add Certification</button>
            </div>
          </div>
        </div>
      )}

      {innerTab === "Projects" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-[#34D399]/20 transition-all flex flex-col gap-3">
              <p className="text-sm font-bold text-white">{p.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((sk) => <span key={sk} className="text-xs bg-white/[0.06] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">{sk}</span>)}
              </div>
              <div className="flex gap-2 mt-auto">
                {p.github && <button className="flex-1 text-xs border border-white/10 text-gray-300 py-1.5 rounded-lg hover:border-white/20 transition-colors">GitHub</button>}
                {p.live && <button className="flex-1 text-xs bg-[#34D399] text-gray-900 font-semibold py-1.5 rounded-lg hover:bg-[#6EE7B7] transition-colors">Live ↗</button>}
              </div>
            </div>
          ))}
          <div className="bg-[#161B27] rounded-2xl p-5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-center hover:border-[#34D399]/30 transition-colors cursor-pointer">
            <span className="text-3xl">＋</span>
            <p className="text-sm text-gray-500">Add New Project</p>
          </div>
        </div>
      )}

      {innerTab === "Achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "🏆", title: "1st Place – College Hackathon 2025", desc: "Built an AI-powered crop monitoring system in 24 hours.", date: "Nov 2025", color: "#FBBF24" },
            { icon: "🎓", title: "Merit Scholarship – Academic Year 2024-25", desc: "Awarded to top 5% students based on CGPA.", date: "Apr 2025", color: "#818CF8" },
            { icon: "🌟", title: "Campus Ambassador – TechNova 2025", desc: "Organized 3 workshops, onboarded 120+ students.", date: "Jan 2025", color: "#34D399" },
            { icon: "📜", title: "Paper Published – IJCSE Vol. 12", desc: "Research on efficient state management in React SPAs.", date: "Dec 2024", color: "#38BDF8" },
          ].map((a, i) => (
            <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] flex gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${a.color}18` }}>{a.icon}</div>
              <div>
                <p className="text-sm font-bold text-white">{a.title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{a.desc}</p>
                <p className="text-xs text-gray-600 mt-2">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Placements Tab ───────────────────────────────────────────────────────────
function PlacementsTab({ role }: { role: Role }) {
  const placed = placements.filter((p) => p.status === "Placed").length;
  const pkgData = [
    { label: "8-12", value: 12 }, { label: "12-16", value: 18, highlight: true },
    { label: "16-20", value: 10 }, { label: "20-24", value: 5 }, { label: "24+", value: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#2DD4BF]" style={{ fontFamily: "Nunito, sans-serif" }}>Placement Tracker</h2>
        <p className="text-sm text-gray-500 mt-0.5">Real-time placement data, analytics, and application tracking.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Candidates" value={`${placements.length}`} sub="In current batch" color="#818CF8" />
        <StatCard label="Placed" value={`${placed}`} sub={`${Math.round((placed / placements.length) * 100)}% placement rate`} color="#4ADE80" />
        <StatCard label="Avg. Package" value="₹16.5 LPA" sub="+18% vs last year" color="#FBBF24" />
        <StatCard label="Top Package" value="₹24 LPA" sub="Amazon SDE-1" color="#F87171" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#5EEAD4] mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>Package Breakdown</p>
          <p className="text-xs text-gray-500 mb-3">LPA distribution (in lakhs)</p>
          <BarSVG data={pkgData} />
          <p className="text-xs text-center text-gray-600 mt-1">LPA Range</p>
        </div>
        <div className="md:col-span-2 bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#5EEAD4] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Candidate Placement Records</p>
          <div className="space-y-2">
            {placements.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                <Av init={p.avatar} color={p.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.role}</p>
                </div>
                <div className="hidden md:flex gap-1 flex-wrap justify-end">
                  {p.skills.map((sk) => <span key={sk} className="text-xs bg-white/[0.06] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">{sk}</span>)}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{p.package}</p>
                  <Badge text={p.status} color={p.status === "Placed" ? "#4ADE80" : "#FBBF24"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {role === "Industry" && (
        <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
          <p className="text-sm font-bold text-[#5EEAD4] mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>Candidate Shortlisting — Full Stack Role</p>
          <div className="space-y-2">
            {placements.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Av init={p.avatar} color={p.color} />
                <div className="flex-1"><p className="text-sm font-semibold text-white">{p.name}</p><p className="text-xs text-gray-500">CGPA {p.cgpa}</p></div>
                <MatchBar pct={70 + i * 5} />
                <div className="flex gap-2">
                  <button className="text-xs bg-green-400/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-400/20 transition-colors">Shortlist</button>
                  <button className="text-xs bg-white/[0.05] text-gray-400 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#0A2020] to-[#0D1A2A] rounded-2xl p-6 border border-[#2DD4BF]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-[#2DD4BF] text-xs font-semibold uppercase tracking-wide mb-1">Skill Passport</p>
          <h3 className="text-white text-lg font-bold">Get your skills industry-verified</h3>
          <p className="text-white/40 text-sm mt-1">Assessments, coding tests, peer and industry evaluations.</p>
        </div>
        <button className="bg-[#2DD4BF] text-gray-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#5EEAD4] transition-colors whitespace-nowrap">Start Verification →</button>
      </div>
    </div>
  );
}

// ─── Collaborate Tab ──────────────────────────────────────────────────────────
function CollaborateTab({ role }: { role: Role }) {
  const [innerTab, setInnerTab] = useState("Events");
  const tabs = role === "Academician"
    ? ["Events", "Mentorship", "Innovation Challenges", "Research Partnerships"]
    : ["Events", "Mentorship", "Innovation Challenges"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F472B6]" style={{ fontFamily: "Poppins, sans-serif" }}>Collaborate</h2>
          <p className="text-sm text-gray-500 mt-0.5">Mentorship, workshops, innovation challenges, and research partnerships.</p>
        </div>
        <InnerTabBar tabs={tabs} active={innerTab} onChange={setInnerTab} />
      </div>

      {innerTab === "Events" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborationEvents.map((e) => (
              <div key={e.id} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${e.color}18` }}>{e.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{e.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{e.host}</p>
                    </div>
                  </div>
                  <Badge text={e.type} color={e.color} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📅 {e.date}</span>
                  <span>{e.registered}/{e.seats} registered</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(e.registered / e.seats) * 100}%`, background: e.color }} />
                </div>
                <button className="w-full bg-white/[0.06] hover:bg-[#F472B6] hover:text-gray-900 text-white text-sm font-semibold py-2 rounded-xl border border-white/10 transition-all">Register Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === "Mentorship" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((m, i) => (
            <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <Av init={m.avatar} color={m.color} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.available ? "bg-green-400" : "bg-gray-500"}`} />
                    <span className={`text-xs ${m.available ? "text-green-400" : "text-gray-500"}`}>{m.available ? "Available" : "Busy"}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{m.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>⭐ {m.rating}</span>
                    <span>📅 {m.sessions} sessions</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.expertise.map((e) => <span key={e} className="text-xs bg-white/[0.06] text-gray-400 px-2.5 py-1 rounded-full border border-white/[0.06]">{e}</span>)}
              </div>
              <button disabled={!m.available} className={`w-full text-sm font-semibold py-2.5 rounded-xl border transition-all ${m.available ? "bg-white/[0.06] hover:bg-[#F472B6] hover:text-gray-900 text-white border-white/10" : "text-gray-600 border-white/[0.04] cursor-not-allowed"}`}>
                {m.available ? "Request Session" : "Currently Unavailable"}
              </button>
            </div>
          ))}
        </div>
      )}

      {innerTab === "Innovation Challenges" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {innovationChallenges.map((c, i) => (
              <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-3">
                <Badge text={c.domain} color={c.color} />
                <p className="text-sm font-bold text-white">{c.title}</p>
                <p className="text-xs text-gray-500">{c.by}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  {[{ label: "Prize Pool", val: c.prize }, { label: "Teams Joined", val: `${c.teams}` }].map((d) => (
                    <div key={d.label} className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                      <p className="text-gray-500">{d.label}</p>
                      <p className="text-white font-bold mt-0.5">{d.val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">⏰ Deadline: <span className="text-[#F472B6] font-medium">{c.deadline}</span></p>
                <button className="w-full bg-white/[0.06] hover:bg-[#F472B6] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Participate →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {innerTab === "Research Partnerships" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Edge Computing in IoT Networks", partner: "IIT Madras + Bosch", type: "Joint Research", duration: "12 months", funding: "₹8 Lakhs", open: 2, color: "#6366F1" },
            { title: "NLP for Indian Regional Languages", partner: "IISc + Microsoft Research", type: "Collaborative Project", duration: "18 months", funding: "₹15 Lakhs", open: 3, color: "#22C55E" },
            { title: "Sustainable Energy Optimization", partner: "NIT Trichy + TATA Power", type: "Industry Research", duration: "8 months", funding: "₹5 Lakhs", open: 1, color: "#F59E0B" },
            { title: "AI in Predictive Healthcare Analytics", partner: "AIIMS + Google Health", type: "Multi-Institutional", duration: "24 months", funding: "₹20 Lakhs", open: 4, color: "#EF4444" },
          ].map((r, i) => (
            <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge text={r.type} color={r.color} />
                  <p className="text-sm font-bold text-white mt-2">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.partner}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                {[{ label: "Duration", val: r.duration }, { label: "Funding", val: r.funding }, { label: "Open Slots", val: `${r.open}` }].map((d) => (
                  <div key={d.label} className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
                    <p className="text-gray-500">{d.label}</p><p className="text-white font-bold mt-0.5">{d.val}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-white/[0.06] hover:bg-[#F472B6] hover:text-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10 transition-all">Express Interest →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
// ─── Auth Components ──────────────────────────────────────────────────────────

function SBLogo({ size = 36 }: { size?: number }) {
  return <img src={sbLogo} alt="SkillBridge" width={size} height={size} style={{ objectFit: "contain", flexShrink: 0 }} />;
}

function AuthField({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
    </div>
  );
}

function AuthSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1.5 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d1117] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-white/25 transition-colors">
        <option value="">Select...</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SBWordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const logoSize = size === "lg" ? 108 : 48;
  const nameClass = size === "lg" ? "text-4xl" : "text-base";
  const tagClass = size === "lg" ? "text-sm mt-1.5" : "text-[10px] mt-1";
  const gap = size === "lg" ? "gap-5" : "gap-3";
  return (
    <div className={`flex items-center ${gap}`}>
      <SBLogo size={logoSize} />
      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-widest uppercase ${nameClass}`}
          style={{ background: "linear-gradient(135deg,#4ADE80 0%,#22D3EE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "0.14em" }}>
          SkillBridge
        </span>
        <span className={`${tagClass} tracking-[0.18em] uppercase text-gray-500`}>Building Bridges to Future Success</span>
      </div>
    </div>
  );
}

function AuthLayout({ accentColor, icon, headline, subtitle, stats, children }: {
  accentColor: string; icon: string; headline: string; subtitle: string;
  stats: { n: string; l: string }[]; children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-10 relative overflow-hidden"
        style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}18 0%, #0D1117 65%)` }} />
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"
          style={{ background: accentColor, filter: "blur(60px)" }} />
        <div className="relative z-10"><SBWordmark size="lg" /></div>
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>{icon}</div>
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight"
            dangerouslySetInnerHTML={{ __html: headline.replace(/\{c\}/g, accentColor) }} />
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">{subtitle}</p>
          <div className="grid grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.l} className="text-center p-3 rounded-xl" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
                <p className="text-xl font-bold" style={{ color: accentColor }}>{s.n}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-gray-700">© 2026 SkillBridge · SIH 2024 Hackathon</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function RoleSelectPage({ onSelect }: { onSelect: (s: AuthScreen) => void }) {
  const cards = [
    { screen: "student" as AuthScreen, label: "Candidate", icon: "🎓", color: "#22D3EE", desc: "Access internships, skill assessments, and build a verified portfolio for your career.", tag: "10K+ candidates" },
    { screen: "industry" as AuthScreen, label: "Industry Professional", icon: "🏢", color: "#FB923C", desc: "Post opportunities, scout talent from top institutions, and build your workforce.", tag: "500+ companies" },
    { screen: "academic" as AuthScreen, label: "Academician", icon: "📚", color: "#C084FC", desc: "Map curriculum to industry skills, mentor students, publish research, and earn FDPs.", tag: "1.2K+ faculty" },
    { screen: "academic" as AuthScreen, label: "Institution", icon: "🏛️", color: "#34D399", desc: "Drive campus placements, forge industry partnerships, and track institutional analytics.", tag: "150+ institutions" },
  ];
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6"><SBWordmark size="lg" /></div>
        <h1 className="text-2xl font-bold text-white mb-2">Who are you?</h1>
        <p className="text-gray-500 text-sm">Select your role to access your personalized portal.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {cards.map((c, i) => (
          <button key={i} onClick={() => onSelect(c.screen)}
            className="text-left p-6 bg-[#161B27] rounded-2xl border border-white/[0.06] hover:border-white/10 transition-all group hover:-translate-y-0.5 hover:shadow-lg">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: `${c.color}14`, border: `1px solid ${c.color}30` }}>{c.icon}</div>
            <p className="font-bold text-white text-base mb-1.5">{c.label}</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{c.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: c.color, background: `${c.color}14` }}>{c.tag}</span>
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-700 mt-8">© 2026 SkillBridge · All rights reserved</p>
    </div>
  );
}

function StudentAuthPage({ onLogin, onBack }: { onLogin: (name: string, email: string) => void; onBack: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", studentId: "", university: "", course: "", year: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const ac = "#22D3EE";

  const submit = () => {
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "signup" && (!form.name || !form.studentId || !form.university)) { setError("Please fill all required fields."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(mode === "signup" ? form.name : form.email.split("@")[0].replace(/[._]/g, " "), form.email); }, 800);
  };

  return (
    <AuthLayout accentColor={ac} icon="🎓"
      headline={`Discover your<br /><span style="color:${ac}">potential.</span>`}
      subtitle="Bridge the gap between your skills and your dream career with AI-powered guidance and verified portfolio building."
      stats={[{ n: "10K+", l: "Candidates" }, { n: "500+", l: "Companies" }, { n: "2K+", l: "Internships" }]}>
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-8 transition-colors">← Back to role selection</button>
        <div className="mb-6">
          <div className="inline-flex items-center rounded-full px-3 py-1 mb-3 text-xs font-semibold" style={{ color: ac, background: `${ac}12`, border: `1px solid ${ac}25` }}>🎓 Candidate Portal</div>
          <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome back!" : "Join SkillBridge"}</h1>
          <p className="text-gray-500 text-sm mt-1">{mode === "login" ? "Sign in to continue your journey." : "Create your student account today."}</p>
        </div>
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-5">
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              style={mode === m ? { background: `${ac}18`, color: ac, border: `1px solid ${ac}30` } : { color: "#6B7280" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <div className="space-y-3 mb-4">
          {mode === "signup" && <AuthField label="Full Name *" value={form.name} onChange={v => set("name", v)} placeholder="Arjun Rajan" />}
          <AuthField label="Candidate Email *" type="email" value={form.email} onChange={v => set("email", v)} placeholder="you@university.edu.in" />
          {mode === "signup" && (
            <>
              <AuthField label="Candidate ID *" value={form.studentId} onChange={v => set("studentId", v)} placeholder="2022CSE0456" />
              <AuthField label="University / Institution *" value={form.university} onChange={v => set("university", v)} placeholder="MIT Pune" />
              <div className="grid grid-cols-2 gap-3">
                <AuthField label="Course" value={form.course} onChange={v => set("course", v)} placeholder="B.Tech CSE" />
                <AuthSelect label="Year" value={form.year} onChange={v => set("year", v)} options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} />
              </div>
            </>
          )}
          <AuthField label="Password *" type="password" value={form.password} onChange={v => set("password", v)} placeholder="••••••••" />
        </div>
        {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-gray-900 hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg,${ac},#4ADE80)` }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>
        <p className="text-xs text-gray-600 text-center mt-4">By continuing you agree to SkillBridge Terms &amp; Privacy Policy.</p>
      </div>
    </AuthLayout>
  );
}

function IndustryAuthPage({ onLogin, onBack }: { onLogin: (name: string, email: string) => void; onBack: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", company: "", designation: "", sector: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const ac = "#FB923C";

  const submit = () => {
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "signup" && (!form.name || !form.company || !form.designation)) { setError("Please fill all required fields."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(mode === "signup" ? form.name : form.email.split("@")[0].replace(/[._]/g, " "), form.email); }, 800);
  };

  return (
    <AuthLayout accentColor={ac} icon="🏢"
      headline={`Find top talent.<br /><span style="color:${ac}">Build tomorrow.</span>`}
      subtitle="Connect with skilled candidates from premier institutions, post opportunities, and build the workforce of tomorrow."
      stats={[{ n: "5K+", l: "Candidates" }, { n: "200+", l: "Institutions" }, { n: "95%", l: "Match Rate" }]}>
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-8 transition-colors">← Back to role selection</button>
        <div className="mb-6">
          <div className="inline-flex items-center rounded-full px-3 py-1 mb-3 text-xs font-semibold" style={{ color: ac, background: `${ac}12`, border: `1px solid ${ac}25` }}>🏢 Industry Portal</div>
          <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome back!" : "Join as Industry"}</h1>
          <p className="text-gray-500 text-sm mt-1">{mode === "login" ? "Access your talent dashboard." : "Start hiring from top academic institutions."}</p>
        </div>
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-5">
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              style={mode === m ? { background: `${ac}18`, color: ac, border: `1px solid ${ac}30` } : { color: "#6B7280" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <div className="space-y-3 mb-4">
          {mode === "signup" && <AuthField label="Contact Person Name *" value={form.name} onChange={v => set("name", v)} placeholder="Tanvi Nair" />}
          <AuthField label="Work Email *" type="email" value={form.email} onChange={v => set("email", v)} placeholder="hr@company.com" />
          {mode === "signup" && (
            <>
              <AuthField label="Company Name *" value={form.company} onChange={v => set("company", v)} placeholder="TechNova Solutions" />
              <AuthField label="Designation *" value={form.designation} onChange={v => set("designation", v)} placeholder="HR Manager" />
              <AuthSelect label="Industry Sector" value={form.sector} onChange={v => set("sector", v)}
                options={["Information Technology", "Finance & Fintech", "Healthcare", "Manufacturing", "E-Commerce", "EdTech", "Other"]} />
            </>
          )}
          <AuthField label="Password *" type="password" value={form.password} onChange={v => set("password", v)} placeholder="••••••••" />
        </div>
        {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-gray-900 hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg,${ac},#FBBF24)` }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>
        <p className="text-xs text-gray-600 text-center mt-4">By continuing you agree to SkillBridge Terms &amp; Privacy Policy.</p>
      </div>
    </AuthLayout>
  );
}

function AcademicAuthPage({ onLogin, onBack }: { onLogin: (name: string, email: string, role: "Academician" | "Institution") => void; onBack: () => void }) {
  const [subRole, setSubRole] = useState<"Academician" | "Institution">("Academician");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [acForm, setAcForm] = useState({ name: "", email: "", employeeId: "", department: "", designation: "", password: "" });
  const [insForm, setInsForm] = useState({ institutionName: "", contactPerson: "", email: "", type: "", affiliated: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAc = (k: keyof typeof acForm, v: string) => setAcForm(f => ({ ...f, [k]: v }));
  const setIns = (k: keyof typeof insForm, v: string) => setInsForm(f => ({ ...f, [k]: v }));
  const ac = subRole === "Academician" ? "#C084FC" : "#34D399";

  const submit = () => {
    if (subRole === "Academician") {
      if (!acForm.email || !acForm.password) { setError("Email and password are required."); return; }
      if (mode === "signup" && (!acForm.name || !acForm.employeeId || !acForm.department)) { setError("Please fill all required fields."); return; }
      setError(""); setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(mode === "signup" ? acForm.name : acForm.email.split("@")[0].replace(/[._]/g, " "), acForm.email, "Academician"); }, 800);
    } else {
      if (!insForm.email || !insForm.password) { setError("Email and password are required."); return; }
      if (mode === "signup" && (!insForm.institutionName || !insForm.contactPerson)) { setError("Please fill all required fields."); return; }
      setError(""); setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(mode === "signup" ? insForm.institutionName : insForm.email.split("@")[0].replace(/[._]/g, " "), insForm.email, "Institution"); }, 800);
    }
  };

  return (
    <AuthLayout accentColor={ac}
      icon={subRole === "Academician" ? "📚" : "🏛️"}
      headline={subRole === "Academician" ? `Shape careers.<br /><span style="color:${ac}">Align education.</span>` : `Empower your<br /><span style="color:${ac}">institution.</span>`}
      subtitle={subRole === "Academician" ? "Map your courses to industry skills, mentor students, and collaborate on cutting-edge research." : "Drive placements, build industry partnerships, and access institution-wide analytics."}
      stats={subRole === "Academician" ? [{ n: "1.2K+", l: "Faculty" }, { n: "300+", l: "Courses" }, { n: "90%", l: "Aligned" }] : [{ n: "150+", l: "Institutions" }, { n: "₹2.4Cr", l: "Avg Pkg" }, { n: "400+", l: "Tie-ups" }]}>
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-6 transition-colors">← Back to role selection</button>
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-5">
          {(["Academician", "Institution"] as const).map(sr => {
            const c = sr === "Academician" ? "#C084FC" : "#34D399";
            return (
              <button key={sr} onClick={() => { setSubRole(sr); setError(""); }} className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
                style={subRole === sr ? { background: `${c}18`, color: c, border: `1px solid ${c}30` } : { color: "#6B7280" }}>
                {sr === "Academician" ? "📚 Academician" : "🏛️ Institution"}
              </button>
            );
          })}
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{mode === "login" ? "Welcome back!" : `Join as ${subRole}`}</h1>
          <p className="text-gray-500 text-sm mt-1">{mode === "login" ? "Sign in to your account." : `Create your ${subRole.toLowerCase()} account.`}</p>
        </div>
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-5">
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              style={mode === m ? { background: `${ac}18`, color: ac, border: `1px solid ${ac}30` } : { color: "#6B7280" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <div className="space-y-3 mb-4">
          {subRole === "Academician" ? (
            <>
              {mode === "signup" && <AuthField label="Full Name *" value={acForm.name} onChange={v => setAc("name", v)} placeholder="Prof. Priya Mehta" />}
              <AuthField label="Institution Email *" type="email" value={acForm.email} onChange={v => setAc("email", v)} placeholder="priya@institution.edu.in" />
              {mode === "signup" && (
                <>
                  <AuthField label="Employee ID *" value={acForm.employeeId} onChange={v => setAc("employeeId", v)} placeholder="FAC2019001" />
                  <AuthField label="Department *" value={acForm.department} onChange={v => setAc("department", v)} placeholder="Computer Science" />
                  <AuthSelect label="Designation" value={acForm.designation} onChange={v => setAc("designation", v)}
                    options={["Assistant Professor", "Associate Professor", "Professor", "HOD", "Dean", "Principal"]} />
                </>
              )}
              <AuthField label="Password *" type="password" value={acForm.password} onChange={v => setAc("password", v)} placeholder="••••••••" />
            </>
          ) : (
            <>
              {mode === "signup" && <AuthField label="Institution Name *" value={insForm.institutionName} onChange={v => setIns("institutionName", v)} placeholder="MIT Pune" />}
              {mode === "signup" && <AuthField label="Contact Person Name *" value={insForm.contactPerson} onChange={v => setIns("contactPerson", v)} placeholder="Dr. Rajesh Kumar" />}
              <AuthField label="Official Email *" type="email" value={insForm.email} onChange={v => setIns("email", v)} placeholder="admin@institution.edu.in" />
              {mode === "signup" && (
                <>
                  <AuthSelect label="Institution Type *" value={insForm.type} onChange={v => setIns("type", v)}
                    options={["Autonomous University", "Deemed University", "Affiliated College", "Government College", "Polytechnic", "IIT / NIT / IIIT"]} />
                  <AuthField label="Affiliated University" value={insForm.affiliated} onChange={v => setIns("affiliated", v)} placeholder="Savitribai Phule Pune University" />
                </>
              )}
              <AuthField label="Password *" type="password" value={insForm.password} onChange={v => setIns("password", v)} placeholder="••••••••" />
            </>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm text-gray-900 hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg,${ac},${subRole === "Academician" ? "#818CF8" : "#22D3EE"})` }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>
        <p className="text-xs text-gray-600 text-center mt-4">By continuing you agree to SkillBridge Terms &amp; Privacy Policy.</p>
      </div>
    </AuthLayout>
  );
}

function AccountModal({ userName, userEmail, role, onClose, onLogout }: {
  userName: string; userEmail: string; role: Role; onClose: () => void; onLogout: () => void;
}) {
  const roleColor: Record<Role, string> = { Student: "#22D3EE", Industry: "#FB923C", Academician: "#C084FC", Institution: "#34D399" };
  const roleIcon: Record<Role, string> = { Student: "🎓", Industry: "🏢", Academician: "📚", Institution: "🏛️" };
  const c = roleColor[role];
  const initials = userName.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "US";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#161B27] rounded-2xl border border-white/[0.08] w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">My Account</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-900 flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${c},${c}99)` }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ color: c, background: `${c}14`, border: `1px solid ${c}30` }}>
                {roleIcon[role]} {ROLE_DISPLAY[role]}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "#F59E0B0A", border: "1px solid #F59E0B25" }}>
            <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">🔒</span>
            <p className="text-xs text-amber-300/80 leading-relaxed">Your role (<strong>{ROLE_DISPLAY[role]}</strong>) is set at registration and cannot be changed here. To switch roles, register a new account.</p>
          </div>
          <div className="space-y-0 divide-y divide-white/[0.05]">
            {[
              { label: "Full Name", value: userName },
              { label: "Email", value: userEmail },
              { label: "Role", value: ROLE_DISPLAY[role], locked: true },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-3">
                <span className="text-xs text-gray-500">{row.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-200">{row.value}</span>
                  {row.locked && <span className="text-gray-600 text-xs">🔒</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 pt-0">
          <button onClick={onLogout} className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Labour Market Intelligence Tab ──────────────────────────────────────────
const lmiTrendingSkills = [
  { name: "Generative AI & LLMs", demand: 94, growth: "+38%" },
  { name: "Cloud Architecture (AWS/GCP)", demand: 88, growth: "+24%" },
  { name: "Data Engineering", demand: 83, growth: "+31%" },
  { name: "Cybersecurity & Ethical Hacking", demand: 79, growth: "+19%" },
  { name: "Full Stack (MERN/MEAN)", demand: 76, growth: "+17%" },
];
const lmiDecliningSkills = [
  { name: "Manual Software Testing", demand: 28, drop: "-22%" },
  { name: "Basic HTML/CSS Only", demand: 24, drop: "-18%" },
  { name: "Core Java (Legacy)", demand: 20, drop: "-15%" },
  { name: "MS Access / FoxPro", demand: 12, drop: "-34%" },
  { name: "COBOL Programming", demand: 8, drop: "-41%" },
];
const lmiSkillGapRows = [
  { course: "B.Tech CSE – Sem 5", skill: "React.js", demand: 88, status: "Healthy" },
  { course: "BCA – Sem 4", skill: "Python (Data Science)", demand: 82, status: "Oversupplied" },
  { course: "MCA – Sem 3", skill: "DevOps / Docker", demand: 76, status: "Obsolete" },
  { course: "B.Sc IT – Sem 6", skill: "Machine Learning", demand: 91, status: "Healthy" },
  { course: "Diploma CS – Year 2", skill: "COBOL / Legacy Systems", demand: 9, status: "Obsolete" },
  { course: "MBA Tech – Sem 2", skill: "Product Analytics", demand: 74, status: "Oversupplied" },
  { course: "B.Tech IT – Sem 7", skill: "Cloud Computing", demand: 85, status: "Healthy" },
  { course: "BCA – Sem 6", skill: "Mobile Dev (Flutter)", demand: 68, status: "Healthy" },
];
const lmiRecommendations = [
  { module: "Introduction to Generative AI & Prompt Engineering", reason: "Demand for GenAI skills has grown 38% YoY. Industry partners report 94% of new job descriptions now reference AI literacy as a baseline requirement.", trend: "+38%", color: "#4ADE80" },
  { module: "Cloud-Native Application Development (AWS/GCP)", reason: "Cloud architecture skills show consistent demand across 88% of tech JDs. Currently, only 12% of graduates possess verified cloud credentials.", trend: "+24%", color: "#22D3EE" },
  { module: "Data Engineering & Pipeline Design", reason: "Growing gap between data science graduates and engineering-capable candidates. ETL, Spark, and Kafka skills are critically undersupplied in the district.", trend: "+31%", color: "#A78BFA" },
  { module: "Applied Cybersecurity & Ethical Hacking", reason: "Government and BFSI sectors report 3× increase in cybersecurity hiring. Existing courses lack practical, hands-on labs aligned to industry certifications.", trend: "+19%", color: "#FB923C" },
];

const districtCourseMix: Record<string, { name: string; value: number; color: string }[]> = {
  "Pune": [
    { name: "GenAI", value: 32, color: "#4ADE80" },
    { name: "Cloud", value: 28, color: "#22D3EE" },
    { name: "Data Eng.", value: 22, color: "#A78BFA" },
    { name: "Cybersec", value: 12, color: "#FB923C" },
    { name: "Mobile Dev", value: 6, color: "#F472B6" },
  ],
  "Nashik": [
    { name: "GenAI", value: 25, color: "#4ADE80" },
    { name: "Cloud", value: 20, color: "#22D3EE" },
    { name: "Data Eng.", value: 30, color: "#A78BFA" },
    { name: "IoT", value: 15, color: "#FBBF24" },
    { name: "Cybersec", value: 10, color: "#FB923C" },
  ],
  "Nagpur": [
    { name: "Cloud", value: 35, color: "#22D3EE" },
    { name: "GenAI", value: 20, color: "#4ADE80" },
    { name: "Cybersec", value: 25, color: "#FB923C" },
    { name: "Data Eng.", value: 12, color: "#A78BFA" },
    { name: "Full Stack", value: 8, color: "#F472B6" },
  ],
  "Aurangabad": [
    { name: "Full Stack", value: 30, color: "#F472B6" },
    { name: "Data Eng.", value: 25, color: "#A78BFA" },
    { name: "GenAI", value: 20, color: "#4ADE80" },
    { name: "Cloud", value: 15, color: "#22D3EE" },
    { name: "Mobile Dev", value: 10, color: "#FBBF24" },
  ],
  "Solapur": [
    { name: "Cybersec", value: 28, color: "#FB923C" },
    { name: "Cloud", value: 22, color: "#22D3EE" },
    { name: "GenAI", value: 18, color: "#4ADE80" },
    { name: "Data Eng.", value: 20, color: "#A78BFA" },
    { name: "IoT", value: 12, color: "#FBBF24" },
  ],
};

const allTrainerSkills = ["Python", "Machine Learning", "React.js", "Node.js", "Cloud (AWS)", "Docker/K8s", "Cybersecurity", "Data Engineering", "GenAI/LLMs", "DevOps CI/CD", "Java Spring Boot", "Mobile (Flutter)", "SQL/PostgreSQL", "UI/UX Design", "Agile/Scrum"];
const defaultEquipment = [
  { id: 1, name: "GPU Workstations (NVIDIA RTX 4090)", qty: 8 },
  { id: 2, name: "Server Rack with 64 GB RAM Nodes", qty: 3 },
  { id: 3, name: "Raspberry Pi 4 Kits (IoT Lab)", qty: 24 },
  { id: 4, name: "Network Security Lab Setup", qty: 1 },
];

function LabourMarketIntelTab({ role }: { role: Role }) {
  const [innerTab, setInnerTab] = useState("Demand Signals");
  const lmiTabs = ["Demand Signals", "Skill Gap Map", "Curriculum Recommendations", "Capacity Planning"];

  // Demand Signals filters
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterSkill, setFilterSkill] = useState("All Skills");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterProficiency, setFilterProficiency] = useState("All Levels");

  // Skill Gap Map
  const [gapSearch, setGapSearch] = useState("");

  // Curriculum Reco states
  const [recoStates, setRecoStates] = useState<Record<number, "accepted" | "rejected" | "modifying" | null>>({});

  // Capacity Planning
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "React.js", "Cloud (AWS)", "Docker/K8s"]);
  const [equipment, setEquipment] = useState(defaultEquipment);
  const [newEquip, setNewEquip] = useState("");

  // District modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");

  const filteredGapRows = lmiSkillGapRows.filter(r => {
    const q = gapSearch.toLowerCase();
    return !q || r.course.toLowerCase().includes(q) || r.skill.toLowerCase().includes(q) || r.status.toLowerCase().includes(q);
  });

  const statusColor = (s: string) => s === "Healthy" ? "#4ADE80" : s === "Obsolete" ? "#EF4444" : "#F59E0B";
  const statusBg = (s: string) => s === "Healthy" ? "#4ADE8015" : s === "Obsolete" ? "#EF444415" : "#F59E0B15";

  const gapAlertSkills = allTrainerSkills.filter(s =>
    ["GenAI/LLMs", "Data Engineering", "Cybersecurity", "DevOps CI/CD", "Mobile (Flutter)"].includes(s) &&
    !selectedSkills.includes(s)
  );
  const hasGapAlert = gapAlertSkills.length > 0;

  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const addEquipment = () => {
    if (newEquip.trim()) {
      setEquipment(prev => [...prev, { id: Date.now(), name: newEquip.trim(), qty: 1 }]);
      setNewEquip("");
    }
  };
  const removeEquip = (id: number) => setEquipment(prev => prev.filter(e => e.id !== id));

  const acColor = "#4ADE80";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: acColor, fontFamily: "Poppins, sans-serif" }}>Labour Market Intelligence</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {role === "Institution" ? "District-level demand analytics and training capacity planning for your institution." : "Real-time skill demand signals and curriculum alignment for your department."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 flex-wrap">
            {lmiTabs.map(t => (
              <button key={t} onClick={() => setInnerTab(t)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
                style={innerTab === t ? { background: `${acColor}18`, color: acColor, border: `1px solid ${acColor}30` } : { color: "#6B7280", border: "1px solid transparent" }}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#4ADE80,#22D3EE)", color: "#0D1117" }}>
            <span>🗺️</span> Generate District Plan
          </button>
        </div>
      </div>

      {/* ── Demand Signals ── */}
      {innerTab === "Demand Signals" && (
        <div className="space-y-5">
          {/* Filter bar */}
          <div className="bg-[#161B27] rounded-2xl p-4 border border-white/[0.06] flex flex-wrap gap-3 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Filters</span>
            {[
              { label: "Role", value: filterRole, setter: setFilterRole, options: ["All Roles", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager", "Cybersecurity Analyst"] },
              { label: "Skill", value: filterSkill, setter: setFilterSkill, options: ["All Skills", "Python", "React.js", "Cloud (AWS)", "Machine Learning", "Docker", "Cybersecurity"] },
              { label: "Location", value: filterLocation, setter: setFilterLocation, options: ["All Locations", "Pune", "Mumbai", "Nashik", "Nagpur", "Aurangabad", "Solapur"] },
              { label: "Proficiency", value: filterProficiency, setter: setFilterProficiency, options: ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"] },
            ].map(({ label, value, setter, options }) => (
              <select key={label} value={value} onChange={e => setter(e.target.value)}
                className="bg-[#0D1117] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#4ADE80]/40 cursor-pointer min-w-[130px]">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <button className="ml-auto text-xs text-[#4ADE80] hover:opacity-80 transition-opacity font-medium">Apply →</button>
          </div>

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Trending */}
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "#4ADE8018" }}>📈</div>
                <div>
                  <p className="text-sm font-bold text-white">Trending Skills</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">High demand · Rising</p>
                </div>
              </div>
              <div className="space-y-3">
                {lmiTrendingSkills.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-4 text-right font-mono">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-200 font-medium">{s.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#4ADE80]">▲ {s.growth}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.demand}%`, background: "linear-gradient(90deg,#4ADE80,#22D3EE)" }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono w-8 text-right">{s.demand}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Declining */}
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "#EF444418" }}>📉</div>
                <div>
                  <p className="text-sm font-bold text-white">Declining Skills</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Low demand · Fading</p>
                </div>
              </div>
              <div className="space-y-3">
                {lmiDecliningSkills.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-4 text-right font-mono">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-200 font-medium">{s.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#EF4444]">▼ {s.drop}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.demand}%`, background: "linear-gradient(90deg,#EF4444,#F97316)" }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono w-8 text-right">{s.demand}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight banner */}
          <div className="bg-[#161B27] rounded-2xl p-4 border border-[#4ADE80]/20 flex items-start gap-3">
            <span className="text-lg mt-0.5">💡</span>
            <div>
              <p className="text-xs font-semibold text-[#4ADE80] mb-0.5">District Insight</p>
              <p className="text-xs text-gray-400">GenAI and Cloud skills are seeing the steepest demand growth in your district. Institutions realigning 15%+ of elective credits toward these domains report 28% higher placement rates within 2 years.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Skill Gap Map ── */}
      {innerTab === "Skill Gap Map" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={gapSearch} onChange={e => setGapSearch(e.target.value)} placeholder="Search by course, skill, or status..."
                className="w-full bg-[#161B27] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#4ADE80]/30" />
            </div>
            <select className="bg-[#161B27] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-[#4ADE80]/30 min-w-[160px]">
              <option>All Institutions</option>
              <option>MIT Pune</option>
              <option>COEP</option>
              <option>VIT Pune</option>
            </select>
            <select className="bg-[#161B27] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-[#4ADE80]/30 min-w-[140px]">
              <option>All Districts</option>
              <option>Pune</option>
              <option>Nashik</option>
              <option>Nagpur</option>
            </select>
          </div>

          <div className="bg-[#161B27] rounded-2xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Course Name", "Linked Skill", "Demand Level", "Status"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGapRows.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-600 text-sm">No results matching your search.</td></tr>
                ) : filteredGapRows.map((r, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-gray-300 font-medium">{r.course}</td>
                    <td className="px-5 py-3.5 text-gray-400">{r.skill}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/[0.05] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${r.demand}%`, background: statusColor(r.status) }} />
                        </div>
                        <span className="text-gray-400 font-mono">{r.demand}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ color: statusColor(r.status), background: statusBg(r.status) }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 text-xs text-gray-500">
            {[["#4ADE80", "Healthy"], ["#EF4444", "Obsolete"], ["#F59E0B", "Oversupplied"]].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Curriculum Recommendations ── */}
      {innerTab === "Curriculum Recommendations" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">AI-generated recommendations based on real-time labour market demand signals and current curriculum gaps.</p>
          {lmiRecommendations.map((rec, i) => {
            const state = recoStates[i];
            return (
              <div key={i} className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${rec.color}18` }}>📘</div>
                      <p className="text-sm font-semibold text-white">{rec.module}</p>
                      <span className="ml-auto flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: rec.color, background: `${rec.color}18` }}>
                        Demand {rec.trend}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{rec.reason}</p>
                    {state === "modifying" && (
                      <div className="mt-3 bg-[#0D1117] rounded-xl p-3 border border-white/[0.06]">
                        <p className="text-[10px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">Modify Module Name</p>
                        <input defaultValue={rec.module}
                          className="w-full bg-transparent text-xs text-gray-200 focus:outline-none border-b border-white/[0.1] pb-1 mb-2" />
                        <textarea rows={2} defaultValue={rec.reason}
                          className="w-full bg-transparent text-xs text-gray-400 focus:outline-none resize-none" />
                        <button onClick={() => setRecoStates(p => ({ ...p, [i]: "accepted" }))}
                          className="mt-2 text-xs text-[#4ADE80] font-semibold hover:opacity-80 transition-opacity">
                          Save Modifications →
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex md:flex-col gap-2 flex-shrink-0">
                    {state === "accepted" ? (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#4ADE80] bg-[#4ADE8018] border border-[#4ADE80]/20">✓ Accepted</span>
                    ) : state === "rejected" ? (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#EF4444] bg-[#EF444418] border border-[#EF4444]/20">✗ Rejected</span>
                    ) : (
                      <>
                        <button onClick={() => setRecoStates(p => ({ ...p, [i]: "accepted" }))}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                          style={{ background: "#4ADE8018", color: "#4ADE80", border: "1px solid #4ADE8030" }}>
                          Accept
                        </button>
                        <button onClick={() => setRecoStates(p => ({ ...p, [i]: state === "modifying" ? null : "modifying" }))}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                          style={{ background: "#22D3EE18", color: "#22D3EE", border: "1px solid #22D3EE30" }}>
                          Modify
                        </button>
                        <button onClick={() => setRecoStates(p => ({ ...p, [i]: "rejected" }))}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                          style={{ background: "#EF444418", color: "#EF4444", border: "1px solid #EF444430" }}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Capacity Planning ── */}
      {innerTab === "Capacity Planning" && (
        <div className="space-y-5">
          {/* Gap Alert */}
          {hasGapAlert && (
            <div className="rounded-2xl p-4 border flex items-start gap-3" style={{ background: "#EF444410", borderColor: "#EF444430" }}>
              <span className="text-xl mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-bold text-[#EF4444] mb-1">Trainer Skill Gap Alert</p>
                <p className="text-xs text-gray-400">
                  Your institution lacks certified trainers for high-demand skills:{" "}
                  <span className="font-semibold text-[#FBBF24]">{gapAlertSkills.join(", ")}</span>.
                  These skills appear in <strong className="text-white">top demand signals</strong> for your district. Consider upskilling faculty or onboarding industry trainers.
                </p>
              </div>
            </div>
          )}
          {!hasGapAlert && (
            <div className="rounded-2xl p-4 border flex items-start gap-3" style={{ background: "#4ADE8010", borderColor: "#4ADE8030" }}>
              <span className="text-xl mt-0.5">✅</span>
              <div>
                <p className="text-sm font-bold text-[#4ADE80] mb-1">Trainer Coverage Looks Good</p>
                <p className="text-xs text-gray-400">Your current trainer skillsets cover all high-priority demand signals for your district. Keep updating as market signals evolve.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Trainer Skillsets */}
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              <p className="text-sm font-bold text-white mb-1">Trainer Skillsets</p>
              <p className="text-xs text-gray-500 mb-4">Select all skills currently covered by your training faculty.</p>
              <div className="flex flex-wrap gap-2">
                {allTrainerSkills.map(s => {
                  const isSelected = selectedSkills.includes(s);
                  const isHighDemand = ["GenAI/LLMs", "Data Engineering", "Cybersecurity", "DevOps CI/CD", "Mobile (Flutter)"].includes(s);
                  return (
                    <button key={s} onClick={() => toggleSkill(s)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border"
                      style={isSelected
                        ? { background: "#4ADE8018", color: "#4ADE80", borderColor: "#4ADE8040" }
                        : isHighDemand
                          ? { background: "#EF444410", color: "#EF4444", borderColor: "#EF444430" }
                          : { background: "transparent", color: "#6B7280", borderColor: "#6B728040" }}>
                      {s} {isHighDemand && !isSelected ? "⚠" : isSelected ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-600 mt-3">⚠ = High market demand · Not yet covered</p>
            </div>

            {/* Equipment Inventory */}
            <div className="bg-[#161B27] rounded-2xl p-5 border border-white/[0.06]">
              <p className="text-sm font-bold text-white mb-1">Equipment Inventory</p>
              <p className="text-xs text-gray-500 mb-4">Log lab infrastructure and hardware available for training.</p>
              <div className="space-y-2 mb-4">
                {equipment.map(eq => (
                  <div key={eq.id} className="flex items-center gap-3 bg-[#0D1117] rounded-xl px-3 py-2.5">
                    <span className="text-sm">🖥️</span>
                    <span className="flex-1 text-xs text-gray-300">{eq.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">×{eq.qty}</span>
                    <button onClick={() => removeEquip(eq.id)} className="text-gray-700 hover:text-red-400 transition-colors text-xs ml-1">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newEquip} onChange={e => setNewEquip(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addEquipment()}
                  placeholder="Add equipment..."
                  className="flex-1 bg-[#0D1117] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#4ADE80]/30" />
                <button onClick={addEquipment}
                  className="px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: "#4ADE8020", color: "#4ADE80", border: "1px solid #4ADE8030" }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── District Training Plan Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div className="bg-[#161B27] rounded-2xl border border-white/[0.08] w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div>
                <p className="text-base font-bold text-white">Generate District Training Plan</p>
                <p className="text-xs text-gray-500 mt-0.5">Select a district to view the recommended course mix and training allocation.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-400 whitespace-nowrap">Select District</label>
                <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}
                  className="flex-1 bg-[#0D1117] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#4ADE80]/30">
                  {Object.keys(districtCourseMix).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recommended Course Mix — {selectedDistrict}</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtCourseMix[selectedDistrict]} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        contentStyle={{ background: "#0D1117", border: "1px solid #ffffff12", borderRadius: 10, fontSize: 11 }}
                        labelStyle={{ color: "#E6EDF3" }}
                        formatter={(v) => [`${v}%`, "Allocation"]}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {districtCourseMix[selectedDistrict].map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {districtCourseMix[selectedDistrict].map(c => (
                  <span key={c.name} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c.color }} />
                    {c.name} · <strong className="text-gray-200">{c.value}%</strong>
                  </span>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-colors border border-white/[0.06] hover:border-white/10">
                  Close
                </button>
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#4ADE80,#22D3EE)", color: "#0D1117" }}>
                  <span>⬇</span> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [role, setRole] = useState<Role>("Student");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("role-select");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showAccount, setShowAccount] = useState(false);

  const roleTabMap: Record<Role, Tab[]> = {
    Student:      ["dashboard", "skillzone", "skillintel", "opportunities", "portfolio", "placements", "collaborate"],
    Industry:     ["dashboard", "opportunities", "placements", "collaborate"],
    Academician:  ["dashboard", "skillzone", "opportunities", "portfolio", "placements", "collaborate", "labourmarket"],
    Institution:  ["dashboard", "opportunities", "placements", "collaborate", "labourmarket"],
  };

  const allNavItems: { id: Tab; label: string }[] = [
    { id: "dashboard",    label: "Dashboard" },
    { id: "skillzone",    label: role === "Academician" ? "Curriculum Zone" : "Skill Zone" },
    { id: "skillintel",   label: "Skill Intel" },
    { id: "opportunities", label: role === "Industry" ? "Talent Pool" : role === "Institution" ? "Partnerships" : "Opportunities" },
    { id: "portfolio",    label: role === "Academician" ? "Academic Portfolio" : "Portfolio" },
    { id: "placements",   label: role === "Industry" ? "Hiring Pipeline" : role === "Institution" ? "Campus Placements" : "Placements" },
    { id: "collaborate",  label: "Collaborate" },
    { id: "labourmarket", label: "Labour Intel" },
  ];

  const navItems = allNavItems.filter(n => (roleTabMap[role] ?? roleTabMap["Student"]).includes(n.id));

  useEffect(() => {
    const validIds = roleTabMap[role] ?? roleTabMap["Student"];
    if (!validIds.includes(activeTab)) setActiveTab("dashboard");
  }, [role]);

  const tabColors: Record<Tab, string> = {
    dashboard: "#22D3EE", skillzone: "#C084FC", skillintel: "#F59E0B", opportunities: "#FB923C",
    portfolio: "#34D399", placements: "#2DD4BF", collaborate: "#F472B6", labourmarket: "#4ADE80",
  };

  const roleColors: Record<Role, string> = { Student: "#22D3EE", Industry: "#FB923C", Academician: "#C084FC", Institution: "#34D399" };
  const roleColor = roleColors[role];

  const handleLogin = (name: string, email: string, loginRole: Role) => {
    setUserName(name.trim() || email.split("@")[0]);
    setUserEmail(email);
    setRole(loginRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setShowAccount(false);
    setAuthScreen("role-select");
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    if (authScreen === "role-select") return <RoleSelectPage onSelect={setAuthScreen} />;
    if (authScreen === "student") return <StudentAuthPage onLogin={(n, e) => handleLogin(n, e, "Student")} onBack={() => setAuthScreen("role-select")} />;
    if (authScreen === "industry") return <IndustryAuthPage onLogin={(n, e) => handleLogin(n, e, "Industry")} onBack={() => setAuthScreen("role-select")} />;
    if (authScreen === "academic") return <AcademicAuthPage onLogin={(n, e, r) => handleLogin(n, e, r)} onBack={() => setAuthScreen("role-select")} />;
    return null;
  }

  const userInitials = userName.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "US";

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {showAccount && <AccountModal userName={userName} userEmail={userEmail} role={role} onClose={() => setShowAccount(false)} onLogout={handleLogout} />}

      <header className="bg-[#0D1117]/80 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-14 gap-3">
            <div className="hidden sm:block flex-shrink-0"><SBWordmark /></div>
            <div className="sm:hidden flex-shrink-0"><SBLogo size={40} /></div>

            <nav className="hidden lg:flex items-center gap-0.5 ml-2 overflow-x-auto">
              {navItems.map((n) => (
                <button key={n.id} onClick={() => setActiveTab(n.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
                  style={activeTab === n.id ? { background: `${tabColors[n.id]}18`, color: tabColors[n.id], border: `1px solid ${tabColors[n.id]}30` } : { color: "#6B7280" }}>
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="flex-1" />

            <div className="hidden sm:flex items-center bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 gap-2">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className="bg-transparent text-xs text-gray-300 focus:outline-none w-24 placeholder-gray-600" placeholder="Search..." />
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1.5">
              <span className="text-xs text-gray-300 font-medium max-w-[100px] truncate">{userName}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: roleColor, background: `${roleColor}18` }}>{ROLE_DISPLAY[role]}</span>
            </div>

            <button onClick={() => setShowAccount(true)} className="flex-shrink-0 rounded-full transition-all hover:opacity-80">
              <Av init={userInitials} color={`${roleColor}55`} size="sm" />
            </button>

            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="lg:hidden border-t border-white/[0.06] py-2 flex flex-col gap-1">
              {navItems.map((n) => (
                <button key={n.id} onClick={() => { setActiveTab(n.id); setMenuOpen(false); }}
                  className="text-left px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={activeTab === n.id ? { background: `${tabColors[n.id]}12`, color: tabColors[n.id] } : { color: "#6B7280" }}>
                  {n.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 mt-1">
                <span className="text-xs text-gray-400">{userName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: roleColor, background: `${roleColor}18` }}>{ROLE_DISPLAY[role]}</span>
              </div>
              <button onClick={() => { setShowAccount(true); setMenuOpen(false); }}
                className="text-left px-4 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Account Settings
              </button>
              <button onClick={handleLogout} className="text-left px-4 py-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {activeTab === "dashboard" && <DashboardTab role={role} userName={userName} userEmail={userEmail} />}
        {activeTab === "skillzone" && <SkillZoneTab role={role} />}
        {activeTab === "skillintel" && <SkillIntelTab />}
        {activeTab === "opportunities" && <OpportunitiesTab role={role} />}
        {activeTab === "portfolio" && <PortfolioTab role={role} />}
        {activeTab === "placements" && <PlacementsTab role={role} />}
        {activeTab === "collaborate" && <CollaborateTab role={role} />}
        {activeTab === "labourmarket" && <LabourMarketIntelTab role={role} />}
      </main>
    </div>
  );
}
