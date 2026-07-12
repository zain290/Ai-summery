/*
  agencyData.ts
  Single source of truth for the on-site AI assistant.
*/

export const AGENCY_DATA = {
  name: 'ZEMZ',
  tagline: 'AI-native studio building agentic products, interfaces, and brands for high-growth startups.',
  website: 'zemz.pro',

  contact: {
    email: 'zemz.pro@gmail.com',
  },

  overview: {
    positioning: 'ZEMZ is an AI-native studio focused on product design, software development, and brand systems for founders building at the frontier of AI.',
    approach: 'The studio combines human judgment with frontier AI workflows to expand exploration, accelerate execution, and keep the final work intentional.',
    philosophy: 'The team believes creativity is the last bastion of human exceptionalism and uses AI as a high-fidelity co-pilot rather than a replacement for taste or strategy.',
  },

  services: [
    {
      name: 'Product Design',
      description: 'Designing interfaces and brands for an agent-native world.',
      deliverables: [
        'Agent native interfaces',
        'Prototyping as design',
        'Agentic design systems',
        'User testing',
        'Brand design',
        'Web and experiential',
      ],
      pricing: 'Contact the agency for pricing.',
    },
    {
      name: 'Software Development',
      description: 'Human architected. Agent accelerated.',
      deliverables: [
        'Web apps',
        'iOS development',
        'Native Mac apps',
        'Vibe coded slop remediation',
        'Cloud infrastructure and DevOps',
      ],
      pricing: 'Contact the agency for pricing.',
    },
  ],

  process: [
    'Discovery and alignment on goals, constraints, and opportunity.',
    'Fast exploration across multiple directions using AI-accelerated workflows.',
    'Refinement into a clear product, brand, or system direction.',
    'Execution, iteration, and launch support with close collaboration.',
  ],

  products: [
    {
      name: 'Blogistan',
      status: 'Live',
      description: 'A high-performance blogging engine designed for developers and creators who value speed and simplicity.',
    },
    {
      name: 'Bikeooa',
      status: 'Beta',
      description: 'A next-generation marketplace for cycling enthusiasts, connecting riders with premium gear.',
    },
    {
      name: 'CompareMar',
      status: 'Live',
      description: 'An intelligent market comparison tool that uses AI to provide real-time competitive analysis.',
    },
  ],

  portfolio: [
    {
      name: 'LibrareyLM',
      description: 'We designed a complete UI for the company LibraryLM, starting in Figma with multiple interactive prototypes. The process focused on refining user flows and ensuring smooth, end-to-end user interactions across the entire experience.',
      timeframe: '12 Weeks',
      role: 'Ui Designer',
    },
    {
      name: 'ForME',
      description: 'ForMe AI is our intelligent blogging agent platform built to automate the complete content workflow. It can generate structured blogs with tables and references, provide JSON-formatted outputs, save content directly to the database, and handle scheduling and automated Facebook publishing—all within a seamless AI-driven system.',
      timeframe: '6 Weeks',
      role: 'AI Engineer',
    },
    {
      name: 'RadioApp',
      description: 'This is a Figma-designed prototype for a modern news and podcast platform, featuring dual viewing modes, smooth animations, and a visually refined UI focused on an engaging user experience.',
      timeframe: '6 Weeks',
      role: 'Ui Designer',
    },
    {
      name: 'ZEMZ',
      description: 'This is the official website for ZEMZ, a creative agency specializing in web design, animation, and AI-powered solutions. The site features a modern, dynamic interface with interactive elements, clear service offerings, and case studies of past work.',
      timeframe: '6 Weeks',
      role: 'Full Stack Developer',
    },
    {
      name: 'Bikeooa',
      description: 'Bikeoyee is an intelligent bike discovery and comparison platform designed to help users find the perfect motorcycle based on their budget, riding style, and personal preferences. The platform provides detailed bike specifications, performance insights, feature breakdowns, expert ratings, and side-by-side comparisons, making it easier for users to explore options and make confident purchasing decisions through a modern, data-driven experience. Comming soon!',
      timeframe: '8 Weeks',
      role: 'Full Stack Developer',
    },
    {
      name: 'Blogistan',
      description: 'We built an agentic blogging platform that handles everything end-to-end—smart title discovery, SEO optimization, full blog writing, and automatic image generation. It also supports custom instructions for tailored content, plus web and Facebook posting with a built-in scheduling system to streamline your workflow.',
      timeframe: '6 Weeks',
      role: 'Full Stack Developer',
    },
    {
      name: 'Bider',
      description: 'Bider is an iOS application built around a dynamic bidding system for antique items, allowing users to explore and place bids through a seamless digital marketplace. The app features visually refined UI design, multiple interactive interfaces, and a smooth user experience focused on elegance, usability, and real-time engagement.',
      timeframe: '8 Weeks',
      role: 'UI Designer',
    },
    {
      name: 'Portfolio',
      description: 'This project is a modern interactive prototype focused on delivering premium web design and immersive UI/UX experiences. It features thoughtfully crafted layouts, dynamic user interactions, smooth hover animations, and visually engaging 3D elements that enhance usability while creating a polished and futuristic digital experience.',
      timeframe: '6 Weeks',
      role: 'Full Stack Development',
    },
  ],

  faqs: [
    {
      q: 'How do you work with AI?',
      a: 'ZEMZ treats AI as a high-fidelity co-pilot that accelerates the path from concept to production without replacing human aesthetic judgment.',
    },
    {
      q: 'What is your typical timeframe?',
      a: 'Most projects range from 4 to 12 weeks depending on complexity and scope.',
    },
    {
      q: 'Do you offer ongoing support?',
      a: 'Yes, the studio partners with clients long term for maintenance, updates, and strategic evolution.',
    },
    {
      q: 'What do you offer?',
      a: 'We offer AI animation and hosting, DB server management with complete back end and front end, and also we offer complete admin control.',
    },
  ],

  guardrails: {
    pricing: 'If someone asks about pricing, rates, estimates, or budgets, ask them to contact the agency first by email.',
    outOfScope: 'If someone asks about anything unrelated to ZEMZ, its services, process, products, portfolio, or public company information, politely decline to answer.',
  },

  agentPersonality: 'Friendly, concise, grounded, and helpful. Never invent facts. Never answer unrelated questions.',
};

export const CHAT_SUGGESTIONS = {
  initial: [
    'What services do you offer?',
    'How do you work with AI?',
    'What is your process?',
  ],
  followUp: [
    'What kind of products do you build?',
    'Can you tell me about LibrareyLM?',
    'Can you tell me about ForME?',
    'Can you tell me about RadioApp?',
    'Can you tell me about ZEMZ?',
    'Can you tell me about Bikeooa?',
    'Can you tell me about Blogistan?',
    'Can you tell me about Bider?',
    'Can you tell me about Portfolio?',
    'Do you offer ongoing support?',
    'How long does a project take?',
    'How should I contact the agency?',
  ],
};

export const OPENING_MESSAGE =
  `Hi, I'm the ${AGENCY_DATA.name} assistant.\n` +
  `I can help with services, process, products, portfolio, and general agency questions.`;
