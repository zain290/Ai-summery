export const AGENCY_DATA = {
  name: 'sum up',
  tagline: 'AI-powered text summarization. Paste text or upload files to get instant, concise summaries.',
  website: 'sumup.app',

  contact: {
    email: 'hello@sumup.app',
  },

  overview: {
    positioning: 'sum up is an AI-powered tool that makes text summarization fast, private, and free.',
    approach: 'Simply paste your text or upload a file, choose your preferred summary style, and get a concise, accurate summary in seconds.',
    philosophy: 'We believe information should be distilled, not diluted. AI should help you read less and understand more.',
  },

  services: [
    {
      name: 'Text Summarization',
      description: 'Paste any text and get an instant AI-powered summary with customizable detail levels.',
      deliverables: [
        'Bullet-point summaries',
        'Paragraph summaries',
        'Customizable length',
        'File upload support',
        'Privacy-first processing',
      ],
      pricing: 'Free to use.',
    },
  ],

  process: [
    'Paste your text or upload a file (TXT, PDF, DOCX, MD).',
    'Choose your preferred summary style and detail level.',
    'Get an instant AI-generated summary you can copy or share.',
  ],

  products: [
    {
      name: 'sum up Web',
      status: 'Live',
      description: 'The web-based text summarization tool accessible from any browser.',
    },
  ],

  portfolio: [],

  faqs: [
    {
      q: 'Is my data private?',
      a: 'Yes. Your text is processed securely and not stored permanently.',
    },
    {
      q: 'What file types can I upload?',
      a: 'TXT, PDF, DOCX, and MD files up to 5MB.',
    },
    {
      q: 'Is there a word limit?',
      a: 'You can summarize texts up to 10,000 words.',
    },
    {
      q: 'Is it free?',
      a: 'Yes, sum up is completely free to use.',
    },
  ],

  guardrails: {
    pricing: 'If someone asks about pricing, tell them sum up is completely free.',
    outOfScope: 'If someone asks about anything unrelated to sum up or text summarization, politely decline to answer.',
  },

  agentPersonality: 'Friendly, concise, and helpful. Never invent facts. Never answer unrelated questions.',
};

export const CHAT_SUGGESTIONS = {
  initial: [
    'How does sum up work?',
    'Is my data private?',
    'What file types are supported?',
  ],
  followUp: [
    'Is there a word limit?',
    'Is it free?',
    'Can I customize summary length?',
    'What is the maximum file size?',
    'What languages are supported?',
    'How do I contact support?',
  ],
};

export const OPENING_MESSAGE =
  `Hi, I'm the ${AGENCY_DATA.name} assistant.\n` +
  `I can help with features, file types, privacy, and general questions about the summarizer.`;
