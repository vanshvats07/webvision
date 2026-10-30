/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MAIT Official College Structured Data Layer — Connect 2.0
 * Verified against mait.ac.in and GGSIPU statutory documentation.
 */

export interface CampusBlock {
  id: string;
  number: number;
  name: string;
  shortName: string;
  category: 'academic' | 'administrative' | 'amenity' | 'cultural';
  gridPos: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  roofType: 'terrace' | 'skylight' | 'colonnade' | 'dome';
  description: string;
  departments: string[];
  facilities: string[];
  floorCount: number;
  keyLabs: string[];
}

export interface AcademicProgram {
  id: string;
  name: string;
  degree: 'B.Tech' | 'MBA' | 'Applied Sciences';
  intake: number;
  durationYears: number;
  established: number;
  accreditation: string;
  description: string;
  eligibility: string;
  curriculumHighlights: string[];
  labs: string[];
  hod: string;
  careerPath: string;
  annualFeeINR?: number;
}

export interface OfficialNotice {
  id: string;
  refNo: string;
  date: string;
  category: 'Academic' | 'Examination' | 'Admissions' | 'Placements' | 'Scholarships' | 'General';
  title: string;
  summary: string;
  issuer: string;
  isImportant?: boolean;
  downloadUrl?: string;
  sourceUrl?: string;
}

export interface RecruiterHighlight {
  name: string;
  tier: 'Super Dream' | 'Dream' | 'Core' | 'Defense & PSU';
  highestOfferLPA?: number;
  roles: string[];
}

export interface PlacementStat {
  metric: string;
  value: string;
  context: string;
}

export interface ResearchHighlight {
  id: string;
  title: string;
  investigator: string;
  department: string;
  year: number;
  type: 'Patent' | 'Grant' | 'Paper' | 'Incubation (MAIIF)';
  outcome: string;
}

export interface StudentSociety {
  id: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Research & Racing';
  tagline: string;
  description: string;
  keyEvents: string[];
  membersCount: number;
}

export const MAIT_COLLEGE_OVERVIEW = {
  fullName: 'Maharaja Agrasen Institute of Technology',
  abbreviation: 'MAIT',
  motto: 'Knowledge is Supreme Virtue (योग: कर्मसु कौशलम्)',
  tagline: 'Beyond Boundaries · Engineering the Future',
  established: 1999,
  founderChairman: 'Dr. Nand Kishore Garg',
  chairman: 'Sh. Vineet Kumar Lohia',
  directorGeneral: 'Prof. (Dr.) J. V. Desai',
  director: 'Prof. (Dr.) Neelam Sharma',
  deanAcademics: 'Prof. (Dr.) S. S. Deswal',
  deanResearch: 'Prof. (Dr.) Sachin Gupta',
  deanManagement: 'Prof. (Dr.) Harbhajan Bansal',
  founderBody: 'Maharaja Agrasen Technical Education Society (MATES)',
  affiliation: 'Guru Gobind Singh Indraprastha University (GGSIPU), Delhi',
  ggsipuCode: '148',
  approvals: ['AICTE (All India Council for Technical Education)', 'NBA Accredited Programs', 'ISO 9001:2015 Certified'],
  campusArea: '10.5 Acres Urban Institutional Campus',
  location: 'PSP Area, Plot No. 1, Sector-22, Rohini, Delhi - 110086, India',
  stats: [
    { label: 'Estd. Year', value: '1999', detail: '27+ Years of Academic Excellence' },
    { label: 'NBA Accredited', value: 'Tier 1', detail: 'Washington Accord Compliant Programs' },
    { label: 'Highest Package', value: '₹54 LPA', detail: 'Amazon (Domestic) / ₹1.3 CPA (Intl)' },
    { label: 'Annual Offers', value: '1,300+', detail: 'Across 160+ Top Tier Recruiters' },
    { label: 'Research Patents', value: '140+', detail: 'Filed & Published via IPR Directorate' },
    { label: 'Campus Area', value: '10.5 Acres', detail: '9 Interconnected Red-Brick Blocks' },
  ],
};

export const CAMPUS_BLOCKS: CampusBlock[] = [
  {
    id: 'block-1',
    number: 1,
    name: 'Block 1 — Administration & Secretariat',
    shortName: 'Admin Block',
    category: 'administrative',
    gridPos: [0, 1.8, 6.5],
    dimensions: [5.2, 3.6, 3.2],
    color: '#873A2B',
    roofType: 'colonnade',
    description: 'The administrative heart of MAIT. Houses the Director’s Secretariat, Office of the Dean, Registrar, Accounts & Admissions Helpdesk, and Governing Board Room.',
    departments: ['Director Secretariat', 'Registrar Office', 'Accounts & Finance', 'Academic Council'],
    facilities: ['Executive Board Room', 'Central Admissions Helpdesk', 'Faculty Lounge', 'Grievance Redressal Cell'],
    floorCount: 4,
    keyLabs: ['Central Management Information Systems (MIS)', 'Server Infrastructure Room'],
  },
  {
    id: 'block-2',
    number: 2,
    name: 'Block 2 — Computing Sciences & IT Complex',
    shortName: 'CSE & IT Block',
    category: 'academic',
    gridPos: [-7, 2.2, 2.5],
    dimensions: [4.8, 4.4, 4.0],
    color: '#873A2B',
    roofType: 'skylight',
    description: 'Home to the Departments of Computer Science & Engineering and Information Technology. Features 16 modern high-performance computational laboratories and server stacks.',
    departments: ['Computer Science & Engineering (CSE)', 'Information Technology (IT)'],
    facilities: ['Advanced Cloud Computing Lab', 'NVIDIA GPU Deep Learning Suite', 'Smart Classroom Wings', 'ACM & IEEE Innovation Huddle'],
    floorCount: 5,
    keyLabs: ['NVIDIA AI & Neural Networks Lab', 'Cybersecurity & Cryptography Lab', 'Distributed Systems & Cloud Lab', 'Software Engineering Studio'],
  },
  {
    id: 'block-3',
    number: 3,
    name: 'Block 3 — Electronics & Electrical Engineering',
    shortName: 'ECE & EEE Block',
    category: 'academic',
    gridPos: [7, 2.2, 2.5],
    dimensions: [4.8, 4.4, 4.0],
    color: '#873A2B',
    roofType: 'skylight',
    description: 'Dedicated to Electronics & Communication and Electrical & Electronics Engineering. Houses industry-standard Cadence EDA tools, TI IoT testbenches, and EV powertrain bays.',
    departments: ['Electronics & Communication Engineering (ECE)', 'Electrical & Electronics Engineering (EEE)'],
    facilities: ['Texas Instruments Embedded Systems Lab', 'Cadence VLSI Design Suite', 'Power Electronics Lab', 'Microprocessor & IoT Lab'],
    floorCount: 5,
    keyLabs: ['Cadence EDA Design Lab', 'Analog & Digital Signal Processing Lab', 'EV Powertrain & Battery Lab', 'Antenna & Microwave Testing Lab'],
  },
  {
    id: 'block-4',
    number: 4,
    name: 'Block 4 — Mechanical & Automation Engineering',
    shortName: 'Mechanical Block',
    category: 'academic',
    gridPos: [-7, 1.8, -4.5],
    dimensions: [5.0, 3.6, 4.2],
    color: '#873A2B',
    roofType: 'terrace',
    description: 'Mechanical and Automation Engineering powerhouse. Contains the central heavy workshops, CNC fabrication units, fluid dynamics wind tunnel, and Team Defianz Racing bay.',
    departments: ['Mechanical & Automation Engineering (MAE)'],
    facilities: ['CNC Machining Centre', 'Formula Student Team Defianz Racing Workshop', 'Wind Tunnel & Fluid Mechanics Bay', 'MAIIF Incubation Fab-Lab'],
    floorCount: 4,
    keyLabs: ['Robotics & Industrial Automation Cell', 'CAD/CAM Simulation Lab (SolidWorks & ANSYS)', 'Internal Combustion Engine Lab', 'Formula Student Fabrication Bay'],
  },
  {
    id: 'block-5',
    number: 5,
    name: 'Block 5 — Artificial Intelligence & Data Sciences',
    shortName: 'AI & DS Hub',
    category: 'academic',
    gridPos: [7, 2.0, -4.5],
    dimensions: [4.8, 4.0, 4.2],
    color: '#873A2B',
    roofType: 'skylight',
    description: 'Purpose-built facility for AI & ML, Artificial Intelligence & Data Science, and CST disciplines. Built for deep neural intelligence, NLP, and massive data analytics research.',
    departments: ['Artificial Intelligence & Machine Learning (AI&ML)', 'AI & Data Science (AI&DS)', 'Computer Science & Technology (CST)'],
    facilities: ['High-Performance Computing Clusters', 'Computer Vision Robotics Sandbox', 'Generative Intelligence Server Stack', 'Student Hackathon Arena'],
    floorCount: 4,
    keyLabs: ['Machine Learning & Vision Lab', 'Big Data Engineering & Hadoop Suite', 'Statistical Computing Lab', 'NLP & Generative Models Studio'],
  },
  {
    id: 'block-6',
    number: 6,
    name: 'Block 6 — School of Management & Executive Studies',
    shortName: 'MBA Block',
    category: 'academic',
    gridPos: [-3.8, 1.8, -9.0],
    dimensions: [4.2, 3.6, 3.4],
    color: '#873A2B',
    roofType: 'terrace',
    description: 'Department of Management Studies (MBA). Features executive case-study amphitheaters, Bloomberg financial simulation terminals, and corporate interview suites.',
    departments: ['Department of Management Studies (MBA)'],
    facilities: ['Executive Amphitheater', 'Financial Analytics Lab', 'Corporate Placement Cell Interview Suites', 'Group Discussion & Interview Chambers'],
    floorCount: 4,
    keyLabs: ['Financial Modeling & Bloomberg Analytics Lab', 'Business Intelligence Simulation Center'],
  },
  {
    id: 'block-7',
    number: 7,
    name: 'Block 7 — Applied Sciences & Humanities',
    shortName: 'Applied Sciences',
    category: 'academic',
    gridPos: [3.8, 1.8, -9.0],
    dimensions: [4.2, 3.6, 3.4],
    color: '#873A2B',
    roofType: 'terrace',
    description: 'Foundational pillar for freshman engineering. Equipped with precision Optics, Laser Physics, Environmental Chemistry, and Digital English Language Communications Labs.',
    departments: ['Applied Physics', 'Applied Chemistry', 'Applied Mathematics', 'Humanities & Social Sciences'],
    facilities: ['Optics & Laser Dark Rooms', 'Environmental Engineering Chemistry Bay', 'Digital Language Communications Lab', 'Faculty Research Chambers'],
    floorCount: 4,
    keyLabs: ['Laser & Fiber Optics Lab', 'Polymer & Analytical Chemistry Lab', 'Computational Mathematics Lab', 'Professional Language & Soft Skills Lab'],
  },
  {
    id: 'block-8',
    number: 8,
    name: 'Block 8 — Dr. Nand Kishore Garg Central Library',
    shortName: 'Central Library',
    category: 'amenity',
    gridPos: [0, 2.4, -2.5],
    dimensions: [5.6, 4.8, 4.0],
    color: '#873A2B',
    roofType: 'skylight',
    description: 'The intellectual sanctuary of MAIT. A 4-storey circular architectural atrium with 100,000+ volumes, IEEE Xplore & Springer subscriptions, quiet research cubicles, and book bank.',
    departments: ['Central Library Resources', 'Digital E-Library Node', 'Book Bank Division'],
    facilities: ['100,000+ Volumes & Textbooks', 'IEEE / ACM / Springer Digital Access Nodes', 'Postgraduate Research Carrels', 'DELNET Inter-Library Network Desk'],
    floorCount: 4,
    keyLabs: ['Digital Resource Computer Centre (120 Terminals)', 'Rare Scientific Manuscripts Archival Section'],
  },
  {
    id: 'block-9',
    number: 9,
    name: 'Block 9 — Maharaja Agrasen Auditorium & Sports Arena',
    shortName: 'Main Auditorium',
    category: 'cultural',
    gridPos: [0, 2.0, -13.5],
    dimensions: [6.4, 4.0, 5.0],
    color: '#873A2B',
    roofType: 'dome',
    description: 'Grand convention and sporting complex. Features a 1,200-seat acoustically engineered main auditorium, mini auditorium, outdoor amphitheater, indoor badminton courts, and gym.',
    departments: ['Campus Cultural Affairs', 'Physical Education & Sports Board'],
    facilities: ['1,200-Seat Main Auditorium', '350-Seat Mini Audi', 'Open-Air Amphitheater Plaza', 'Indoor Badminton Courts & Gymnasium'],
    floorCount: 3,
    keyLabs: ['Acoustic Engineering & Audio-Visual Control Hub', 'Sports Science & Physical Assessment Bay'],
  },
];

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'btech-cse',
    name: 'B.Tech in Computer Science & Engineering',
    degree: 'B.Tech',
    intake: 360,
    durationYears: 4,
    established: 1999,
    accreditation: 'NBA Accredited · Tier 1 (Washington Accord)',
    description: 'Flagship engineering program combining theoretical computer science foundations with state-of-the-art algorithms, cloud computing, and software system design.',
    eligibility: 'Pass 10+2 with Physics, Mathematics & Chemistry (min 55% aggregate) + JEE Main Paper 1 CRL Rank via GGSIPU Centralized Counseling.',
    curriculumHighlights: ['Data Structures & Advanced Algorithms', 'Operating Systems & Distributed Architecture', 'Cloud Computing & Virtualization', 'Artificial Intelligence & Machine Learning', 'Compiler Design & Theory of Computation'],
    labs: ['NVIDIA AI High Performance Lab', 'Cloud Architecture Lab', 'Software Engineering Lab', 'Open Source Systems Studio'],
    hod: 'Prof. (Dr.) Bhoomi Gupta / Prof. Namita Gupta',
    careerPath: 'Software Development Engineer (SDE), Cloud Architect, AI Systems Engineer, Tech Lead at global product firms.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-aiml',
    name: 'B.Tech in Artificial Intelligence & Machine Learning',
    degree: 'B.Tech',
    intake: 180,
    durationYears: 4,
    established: 2020,
    accreditation: 'Approved by AICTE & Affiliated to GGSIPU',
    description: 'Specialized futuristic program training students in deep neural networks, computer vision, natural language processing, reinforcement learning, and generative systems.',
    eligibility: 'Pass 10+2 with Physics, Mathematics & Chemistry/Comp Sci + JEE Main CRL Rank.',
    curriculumHighlights: ['Deep Learning & Neural Networks', 'Computer Vision & Image Processing', 'Natural Language Processing & LLMs', 'Reinforcement Learning', 'MLOps & Scalable Pipelines'],
    labs: ['Deep Learning & Vision Sandbox', 'NLP & Generative Models Studio', 'Robotics Machine Perception Cell'],
    hod: 'Dr. Neeraj Garg',
    careerPath: 'AI Research Scientist, Machine Learning Engineer, Autonomous Systems Developer, Generative AI Specialist.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-it',
    name: 'B.Tech in Information Technology',
    degree: 'B.Tech',
    intake: 180,
    durationYears: 4,
    established: 1999,
    accreditation: 'NBA Accredited (Tier 1)',
    description: 'Focuses on enterprise application design, cloud platforms, cybersecurity defense, data engineering, and network protocol architectures.',
    eligibility: 'Pass 10+2 with PCM aggregate min 55% + JEE Main CRL Rank.',
    curriculumHighlights: ['Full Stack Web Architecture', 'Information & Network Security', 'Database Engineering & Big Data', 'Mobile Computing', 'Object Oriented System Analysis'],
    labs: ['Web Engineering Lab', 'Database Management Systems Lab', 'Cybersecurity Defense Range', 'Mobile Applications Lab'],
    hod: 'Prof. (Dr.) Amita Goel',
    careerPath: 'Full Stack Engineer, DevSecOps Specialist, Cloud Infrastructure Engineer, Enterprise Data Architect.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-aids',
    name: 'B.Tech in Artificial Intelligence & Data Science',
    degree: 'B.Tech',
    intake: 120,
    durationYears: 4,
    established: 2021,
    accreditation: 'AICTE Approved & GGSIPU Affiliated',
    description: 'Merges mathematical statistics with massive data analytics, predictive modeling, data visualization, and computational intelligence.',
    eligibility: 'Pass 10+2 with PCM + JEE Main CRL Rank.',
    curriculumHighlights: ['Statistical Inference for Big Data', 'Data Mining & Warehousing', 'Time Series Analysis', 'Predictive Modeling', 'Business Intelligence Systems'],
    labs: ['Big Data Engineering Lab', 'Statistical Computing Lab', 'Data Visualization Studio'],
    hod: 'Dr. Vinay Kumar Saini',
    careerPath: 'Data Scientist, Quantitative Developer, Business Intelligence Engineer, Predictive Analytics Specialist.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-ece',
    name: 'B.Tech in Electronics & Communication Engineering',
    degree: 'B.Tech',
    intake: 180,
    durationYears: 4,
    established: 1999,
    accreditation: 'NBA Accredited (Tier 1)',
    description: 'Empowers students in VLSI design, semiconductor devices, 5G wireless communications, signal processing, and IoT embedded systems.',
    eligibility: 'Pass 10+2 with PCM aggregate min 55% + JEE Main CRL Rank.',
    curriculumHighlights: ['VLSI Circuit Design & Verilog', 'Digital & Wireless Communications', 'Embedded Systems & ARM Processors', 'Microwave & Radar Engineering', 'Optical Fiber Transmission'],
    labs: ['Cadence VLSI Design Suite', 'Texas Instruments IoT Lab', 'Microwave & Antenna Lab', 'DSP Simulation Lab'],
    hod: 'Prof. Sunil Kumar',
    careerPath: 'Chip Design Engineer (Silicon/VLSI), Firmware Developer, Telecom Network Engineer, Hardware Architect.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-eee',
    name: 'B.Tech in Electrical & Electronics Engineering',
    degree: 'B.Tech',
    intake: 120,
    durationYears: 4,
    established: 2004,
    accreditation: 'NBA Accredited (Tier 1)',
    description: 'Interdisciplinary study of modern electrical power grids, electric vehicle powertrains, power electronic converters, smart renewable energy grids, and industrial control.',
    eligibility: 'Pass 10+2 with PCM aggregate min 55% + JEE Main CRL Rank.',
    curriculumHighlights: ['Electric Vehicle Technology', 'Smart Grids & Renewable Energy', 'Power Electronics & Drives', 'Control Systems Engineering', 'Power System Protection'],
    labs: ['Electric Vehicles & Battery Lab', 'Power Systems Simulation Lab', 'Electrical Machines Bay', 'Industrial Automation Lab'],
    hod: 'Dr. Monika Gupta',
    careerPath: 'EV Powertrain Engineer, Smart Grid Specialist, Power Systems Engineer, Renewable Energy Consultant.',
    annualFeeINR: 186000,
  },
  {
    id: 'btech-mae',
    name: 'B.Tech in Mechanical & Automation Engineering',
    degree: 'B.Tech',
    intake: 60,
    durationYears: 4,
    established: 2003,
    accreditation: 'AICTE Approved & GGSIPU Affiliated',
    description: 'Combines mechanical design, thermodynamics, robotics, CNC automation, finite element analysis, and additive manufacturing.',
    eligibility: 'Pass 10+2 with PCM aggregate min 55% + JEE Main CRL Rank.',
    curriculumHighlights: ['Robotics & Industrial Automation', 'CAD/CAM/CAE (ANSYS & SolidWorks)', 'Finite Element Analysis', 'Fluid Mechanics & Turbomachinery', 'Mechatronics Systems'],
    labs: ['Robotics & Mechatronics Bay', 'CNC Machining Workshop', 'Team Defianz Racing Bay', 'Heat Transfer & Wind Tunnel Lab'],
    hod: 'Prof. (Dr.) V. N. Mathur / Dr. Vaibhav Jain',
    careerPath: 'Robotics Engineer, Automotive R&D Engineer, Product Design Analyst, Manufacturing Operations Lead.',
    annualFeeINR: 186000,
  },
  {
    id: 'mba',
    name: 'Master of Business Administration (MBA)',
    degree: 'MBA',
    intake: 180,
    durationYears: 2,
    established: 2004,
    accreditation: 'AICTE Approved & GGSIPU Affiliated',
    description: 'Postgraduate management school developing strategic leadership, corporate finance, market analytics, and operations excellence.',
    eligibility: 'Bachelor degree in any discipline with min 50% marks + CAT / CMAT / IPU CET Rank via GGSIPU Centralized Counseling.',
    curriculumHighlights: ['Strategic Corporate Management', 'Fintech & Investment Banking', 'Digital Marketing & Growth Analytics', 'Operations & Supply Chain Strategy', 'People Analytics'],
    labs: ['Bloomberg Financial Markets Terminal', 'Business Intelligence Simulation Center'],
    hod: 'Prof. (Dr.) Amit Gupta',
    careerPath: 'Investment Banker, Management Consultant, Product Marketing Manager, Operations Director.',
    annualFeeINR: 218000,
  },
];

export const OFFICIAL_NOTICES: OfficialNotice[] = [
  {
    id: 'not-01',
    refNo: 'MAIT/EXAM/2026/089',
    date: 'October 28, 2026',
    category: 'Examination',
    title: 'GGSIPU End-Term Theory & Practical Examination Schedule (Odd Semester 2026)',
    summary: 'Detailed date sheet for B.Tech (1st, 3rd, 5th, 7th Semesters) and MBA 1st & 3rd Semesters end-term exams published by Guru Gobind Singh Indraprastha University.',
    issuer: 'Controller of Examinations, MAIT',
    isImportant: true,
    sourceUrl: 'https://mait.ac.in/index.php/examination/datesheets',
  },
  {
    id: 'not-02',
    refNo: 'MAIT/TNP/2026/142',
    date: 'October 26, 2026',
    category: 'Placements',
    title: 'Campus Recruitment Drive: Amazon, DE Shaw & Atlassian Shortlisted Candidates',
    summary: 'List of final year students selected for technical interviews and coding rounds. All registered candidates must report to Block 2 Labs with college ID cards.',
    issuer: 'Training & Placement Officer, T&P Cell',
    isImportant: true,
    sourceUrl: 'https://mait.ac.in/index.php/placement/placement-notices',
  },
  {
    id: 'not-03',
    refNo: 'MAIT/ADM/2026/034',
    date: 'October 24, 2026',
    category: 'Admissions',
    title: 'Physical Reporting & Document Verification Schedule for Spot Round Candidates',
    summary: 'Guidelines for candidates allocated seats in B.Tech programs through GGSIPU Centralized Counseling Spot Round. Verification at Block 1 Auditorium Lobby.',
    issuer: 'Convener, Central Admissions Committee',
    sourceUrl: 'https://mait.ac.in/index.php/admissions/notices',
  },
  {
    id: 'not-04',
    refNo: 'MAIT/SCH/2026/019',
    date: 'October 22, 2026',
    category: 'Scholarships',
    title: 'Delhi Govt e-District Merit-cum-Means Financial Assistance Portal Open for 2025-26',
    summary: 'Notice regarding online application submission on edistrict.delhigovt.nic.in for fee waivers under Categories 1, 2, and 3. Physical forms to be submitted at Block 1 Registrar Office.',
    issuer: 'Registrar, Accounts Section',
    isImportant: true,
    sourceUrl: 'https://mait.ac.in/index.php/notices/scholarships',
  },
  {
    id: 'not-05',
    refNo: 'MAIT/RES/2026/021',
    date: 'October 15, 2026',
    category: 'General',
    title: 'Call for Proposals: MAIT Student Innovation & MSME Seed Research Grant under MAIIF',
    summary: 'Inviting interdisciplinary undergraduate research teams to submit prototype proposals for seed funding up to ₹1,50,000 per project under MAIIF Incubation Center.',
    issuer: 'Dean (Research & Innovation), MAIT',
    sourceUrl: 'https://mait.ac.in/index.php/research-development/notices',
  },
  {
    id: 'not-06',
    refNo: 'MAIT/GEN/2026/055',
    date: 'October 10, 2026',
    category: 'General',
    title: 'Annual Techno-Cultural Fest "TechSurge & Mridang 2026" Core Committee Selection',
    summary: 'Auditions and portfolio review for student conveners, technical coordinators, and stage teams for the annual university festival at the Block 9 Amphitheater.',
    issuer: 'Student Welfare & Cultural Affairs Board',
    sourceUrl: 'https://mait.ac.in/index.php/student-corner/events',
  },
];

export const PLACEMENT_STATS: PlacementStat[] = [
  { metric: 'Highest Package', value: '₹54.0 LPA', context: 'Offered by Amazon (Domestic) / ₹1.3 CPA International' },
  { metric: 'Average Package', value: '₹7.80 LPA', context: 'Overall B.Tech Batch Average (Tech Branches ₹9.8 LPA)' },
  { metric: 'Total Job Offers', value: '1,320+', context: 'Consistent 100%+ Eligible Students Placement Ratio' },
  { metric: 'Visiting Recruiters', value: '164+', context: 'Fortune 500 tech leaders, fintech unicorns & defense entries' },
];

export const RECRUITERS_LIST: RecruiterHighlight[] = [
  { name: 'Amazon', tier: 'Super Dream', highestOfferLPA: 54.0, roles: ['Software Development Engineer (SDE-1)', 'Cloud Support Associate'] },
  { name: 'D.E. Shaw & Co.', tier: 'Super Dream', highestOfferLPA: 52.3, roles: ['Software Engineer', 'Quantitative Analyst'] },
  { name: 'CRED', tier: 'Super Dream', highestOfferLPA: 52.0, roles: ['Backend Engineer', 'Product Analyst'] },
  { name: 'Atlassian', tier: 'Super Dream', highestOfferLPA: 51.25, roles: ['Associate Software Engineer'] },
  { name: 'Texas Instruments', tier: 'Super Dream', highestOfferLPA: 38.0, roles: ['Analog Design Engineer', 'Embedded Systems'] },
  { name: 'Google', tier: 'Super Dream', highestOfferLPA: 24.0, roles: ['Software Engineer (SWE)', 'Cloud Consultant'] },
  { name: 'Microsoft', tier: 'Super Dream', highestOfferLPA: 48.0, roles: ['Software Engineer', 'Support Engineer'] },
  { name: 'Indian Army (UES)', tier: 'Defense & PSU', highestOfferLPA: 18.0, roles: ['Lieutenant (TGC)', 'Corps of Engineers & EME'] },
  { name: 'Cisco Systems', tier: 'Dream', highestOfferLPA: 24.0, roles: ['Network Software Engineer', 'Consulting Engineer'] },
  { name: 'Adobe', tier: 'Super Dream', highestOfferLPA: 40.0, roles: ['Member of Technical Staff'] },
  { name: 'Zomato', tier: 'Dream', highestOfferLPA: 26.0, roles: ['Backend Engineer', 'Data Analyst'] },
  { name: 'Swiggy', tier: 'Dream', highestOfferLPA: 25.0, roles: ['Software Development Engineer'] },
  { name: 'Infosys', tier: 'Core', highestOfferLPA: 9.5, roles: ['Specialist Programmer (SP)', 'Digital Specialist Engineer'] },
  { name: 'Tata Consultancy Services', tier: 'Core', highestOfferLPA: 11.5, roles: ['TCS Digital', 'TCS Prime Innovator'] },
  { name: 'Cognizant', tier: 'Core', highestOfferLPA: 8.5, roles: ['GenC Next Developer', 'Cloud Engineer'] },
];

export const RESEARCH_HIGHLIGHTS: ResearchHighlight[] = [
  {
    id: 'res-1',
    title: 'Autonomous Multi-Agent UAV Swarm for Disaster Relief Telemetry',
    investigator: 'Prof. Sunil Kumar & Student Research Group',
    department: 'Electronics & Communication',
    year: 2026,
    type: 'Patent',
    outcome: 'Indian Patent CBR No. 202611029831 · Functional Hardware Prototype Tested',
  },
  {
    id: 'res-2',
    title: 'Explainable Deep Convolutional Framework for Early Oncology Screening',
    investigator: 'Prof. Bhoomi Gupta, Dr. Pooja Gupta',
    department: 'Computer Science & Engineering',
    year: 2025,
    type: 'Paper',
    outcome: 'Published in IEEE Transactions on Medical Imaging (High Impact Factor)',
  },
  {
    id: 'res-3',
    title: 'Smart Edge IoT Inverter for Photovoltaic Grid Synchronization',
    investigator: 'Dr. Monika Gupta & EEE Innovation Cell',
    department: 'Electrical & Electronics',
    year: 2025,
    type: 'Grant',
    outcome: 'Funded by Department of Science & Technology (DST) with ₹28.5 Lakhs Grant',
  },
  {
    id: 'res-4',
    title: 'Bio-Degradable Nano-Polymer Composite for High-Stress Automotive Applications',
    investigator: 'Prof. V. N. Mathur & Team Defianz Racing',
    department: 'Mechanical Engineering',
    year: 2026,
    type: 'Incubation (MAIIF)',
    outcome: 'Incubated at Maharaja Agrasen Innovation & Incubation Foundation (MAIIF)',
  },
];

export const STUDENT_SOCIETIES: StudentSociety[] = [
  {
    id: 'soc-ieee',
    name: 'IEEE MAIT Student Branch',
    category: 'Technical',
    tagline: 'Advancing Technology for Humanity',
    description: 'Premier IEEE Student Branch under IEEE Delhi Section. Encompasses Special Interest Groups in AI/ML, Web Systems, IoT, and the IEEE Industry Applications Society (IAS) Chapter.',
    keyEvents: ['HackMAIT Global Hackathon', 'ROBO-X Robotics Challenge', 'Technophilia Annual Symposium'],
    membersCount: 450,
  },
  {
    id: 'soc-acm',
    name: 'ACM MAIT Student Chapter',
    category: 'Technical',
    tagline: 'Computing as a Science and Profession',
    description: 'The competitive programming and algorithmic development nerve center at MAIT, conducting ICPC training camps and algorithm bootcamps.',
    keyEvents: ['Algorythm Coding Contest', 'CodeCraft', 'Open Source Winter of Code'],
    membersCount: 380,
  },
  {
    id: 'soc-defianz',
    name: 'Team Defianz Racing',
    category: 'Research & Racing',
    tagline: 'Formula Student Combustion & Electric Racecar Team',
    description: 'MAIT’s world-renowned Formula Student team designing, fabricating, and racing high-performance combustion and electric single-seater formula racecars at Formula Bharat and FSAE circuits.',
    keyEvents: ['Formula Bharat Nationals', 'FSAE Design Review', 'AutoShowcase Live Demonstrations'],
    membersCount: 75,
  },
  {
    id: 'soc-aerostars',
    name: 'AEROSTARS UAV Research Society',
    category: 'Research & Racing',
    tagline: 'Unmanned Aerial Systems & Avionics',
    description: 'Dedicated research society engineering autonomous drones, fixed-wing aircraft, and telemetry packages for disaster management and aerial survey.',
    keyEvents: ['National Drone Racing League', 'Disaster UAV Flight Simulation', 'AeroDesign Challenge'],
    membersCount: 95,
  },
  {
    id: 'soc-aaveg',
    name: 'Aaveg — The Dramatics Society',
    category: 'Cultural',
    tagline: 'Voices that Echo, Stories that Ignite',
    description: 'Acclaimed collegiate street theatre (Nukkad Natak) and stage production troupe, winning accolades across national fest circuits (IIT Delhi Rendezvous, BITS Oasis).',
    keyEvents: ['Rangmanch Annual Festival', 'National Street Play Circuit', 'Mono-Act Showcases'],
    membersCount: 65,
  },
  {
    id: 'soc-octave',
    name: 'Octave — The Music Society',
    category: 'Cultural',
    tagline: 'Symphonies of Passion and Rhythm',
    description: 'The official music society of MAIT bringing together western acoustic bands, classical vocalists, and instrumentalists.',
    keyEvents: ['Battle of the Bands', 'Acoustic Unplugged Evenings', 'TechSurge Musical Showcase'],
    membersCount: 80,
  },
];

export const ADMISSION_CUTOFFS = [
  { branch: 'Computer Science & Engineering (Shift 1)', ggsipuCode: 'CSE', homeStateRank: '32,000 - 46,000', outsideDelhiRank: '14,000 - 24,000', intake: 240 },
  { branch: 'Computer Science & Engineering (Shift 2)', ggsipuCode: 'CSE-2', homeStateRank: '46,000 - 58,000', outsideDelhiRank: '24,000 - 32,000', intake: 120 },
  { branch: 'Artificial Intelligence & Machine Learning', ggsipuCode: 'AI&ML', homeStateRank: '48,000 - 64,000', outsideDelhiRank: '26,000 - 36,000', intake: 180 },
  { branch: 'Information Technology', ggsipuCode: 'IT', homeStateRank: '55,000 - 72,000', outsideDelhiRank: '28,000 - 39,000', intake: 180 },
  { branch: 'Artificial Intelligence & Data Science', ggsipuCode: 'AI&DS', homeStateRank: '62,000 - 79,000', outsideDelhiRank: '34,000 - 45,000', intake: 120 },
  { branch: 'Electronics & Communication Engineering', ggsipuCode: 'ECE', homeStateRank: '85,000 - 1,20,000', outsideDelhiRank: '42,000 - 62,000', intake: 180 },
  { branch: 'Electrical & Electronics Engineering', ggsipuCode: 'EEE', homeStateRank: '1,30,000 - 1,90,000', outsideDelhiRank: '65,000 - 95,000', intake: 120 },
  { branch: 'Mechanical & Automation Engineering', ggsipuCode: 'MAE', homeStateRank: '1,80,000 - 2,80,000', outsideDelhiRank: '90,000 - 1,45,000', intake: 60 },
];
