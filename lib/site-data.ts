// Central site configuration & static content for the AMTMTI platform.
// Database-driven content (programs, news, research) is seeded from these
// shapes via Supabase; these constants serve as the marketing fallback.

export const SITE = {
  name: 'AMTMTI',
  fullName: 'Africa Medication Therapy Management Training Institute',
  phone: '+254 721 421 719',
  hours: 'Open 24 Hours · Monday – Sunday',
  address: {
    line1: 'Thika Superhighway',
    line2: 'Kimbo, Ruiru',
    country: 'Kenya',
  },
  email: 'info@amtmti.africa',
} as const

export const MAIN_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Research', href: '/research' },
  { label: 'News', href: '/news' },
  { label: 'E-Learning', href: '/portal' },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact', href: '/contact' },
] as const

export const PROFESSION_CATEGORIES = [
  {
    slug: 'clinicians',
    title: 'Clinicians',
    description: 'Advanced MTM competencies for frontline clinical decision-making.',
  },
  {
    slug: 'nurses',
    title: 'Nurses',
    description: 'Medication safety and adherence training for nursing practice.',
  },
  {
    slug: 'pharmaceutical-technicians',
    title: 'Pharmaceutical Technicians',
    description: 'Foundational dispensing and pharmaceutical care skills.',
  },
  {
    slug: 'pharmaceutical-technologists',
    title: 'Pharmaceutical Technologists',
    description: 'Technical mastery across the medicines management chain.',
  },
  {
    slug: 'pharmacists',
    title: 'Pharmacists',
    description: 'Comprehensive MTM, clinical pharmacy and postgraduate pathways.',
  },
  {
    slug: 'physicians',
    title: 'Physicians',
    description: 'Collaborative prescribing and therapeutic optimisation.',
  },
] as const

export const PROGRAM_LEVELS = [
  'Certificate',
  'Diploma',
  'Postgraduate Diploma',
  'CPD Course',
] as const

export const DELIVERY_MODES = ['Online', 'Hybrid', 'In-Person'] as const

export const VALUES = [
  {
    title: 'Excellence',
    description:
      'World-class curricula benchmarked against global standards and delivered by leading practitioners.',
    icon: 'Award',
  },
  {
    title: 'Integrity',
    description:
      'Ethical, evidence-based education that puts patient safety at the centre of everything we do.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Impact',
    description:
      'Measurable improvements in medication outcomes across African health systems.',
    icon: 'TrendingUp',
  },
  {
    title: 'Equity',
    description:
      'Accessible training that reaches every profession, every region, and every patient.',
    icon: 'Scale',
  },
] as const

export const RESEARCH_STATS = [
  { label: 'Publications', value: 4 },
  { label: 'Active Studies', value: 18 },
  { label: 'Country Partners', value: 12 },
  { label: 'Funded Grants', value: 7 },
] as const

export const RESEARCH_AREAS = [
  {
    title: 'Medication Safety',
    description: 'Reducing preventable harm through systems-based safety research.',
    icon: 'ShieldPlus',
  },
  {
    title: 'Clinical Pharmacy',
    description: 'Advancing the clinical role of pharmacists at the bedside.',
    icon: 'Stethoscope',
  },
  {
    title: 'Pharmaceutical Care',
    description: 'Patient-centred frameworks for comprehensive medicines management.',
    icon: 'HeartPulse',
  },
  {
    title: 'Public Health',
    description: 'Population-level interventions for rational medicine use.',
    icon: 'Globe2',
  },
  {
    title: 'Medication Adherence',
    description: 'Behavioural science to improve treatment adherence and outcomes.',
    icon: 'CheckCircle2',
  },
] as const

export const HERO_STATS = [
  { label: 'Professionals Trained', value: '12,400+' },
  { label: 'Accredited Programs', value: '40+' },
  { label: 'Country Partners', value: '12' },
  { label: 'Research Studies', value: '18' },
] as const

export const STRATEGIC_OBJECTIVES = [
  { year: '2030', title: 'Train 50,000 professionals', description: 'Scale accredited MTM training across the continent.' },
  { year: '2030', title: 'Accredit 30+ institutions', description: 'Build a network of recognised training partners.' },
  { year: '2030', title: 'Publish African-led research', description: 'Generate the evidence base for African MTM practice.' },
  { year: '2030', title: 'Embed MTM into primary care', description: 'Integrate medication therapy management at the point of care.' },
  { year: '2030', title: 'Build continent-wide membership', description: 'Establish a thriving pan-African community of practice.' },
] as const

export const JOURNEY = [
  { year: '2019', title: 'Founded', description: 'AMTMTI established to close the MTM training gap.' },
  { year: '2021', title: 'First Cohort', description: 'Inaugural class of pharmacists and clinicians graduates.' },
  { year: '2023', title: 'Research Division', description: 'Launch of multi-country medication safety research.' },
  { year: '2025', title: 'Pan-African Expansion', description: 'Partnerships established across 12 countries.' },
  { year: '2026', title: 'Today', description: 'A continent-wide institute serving thousands of professionals.' },
] as const

export const LEADERSHIP = [
  {
    name: 'Prof. Wanjiru Kamau',
    role: 'Executive Director',
    bio: 'Clinical pharmacist, formerly WHO AFRO advisor.',
  },
  {
    name: 'Dr. Samuel Okoro',
    role: 'Dean of Studies',
    bio: '30 years in pharmacy education and curriculum design.',
  },
  {
    name: 'Dr. Fatima El-Hassan',
    role: 'Director of Research',
    bio: 'Leads multi-country medication safety trials.',
  },
  {
    name: 'Dr. Brian Mutiso',
    role: 'Director of Membership',
    bio: "Builds AMTMTI's pan-African professional network.",
  },
] as const

export const MEMBERSHIP_TIERS = [
  {
    name: 'Student',
    price: 'Free',
    period: '',
    popular: false,
    benefits: ['Community Access', 'Webinar Discounts', 'Career Resources'],
  },
  {
    name: 'Affiliate',
    price: 'KSH 10,400',
    period: '/ year',
    popular: true,
    benefits: [
      'Full Community Access',
      'CPD Discounts',
      'Research Library',
      'Member Badge',
    ],
  },
  {
    name: 'Corporate',
    price: 'KSH 156,000',
    period: '/ year',
    popular: false,
    benefits: [
      '25 Seats',
      'Institutional Dashboard',
      'Co-Branded Training',
      'Annual Reports',
    ],
  },
] as const

export const TESTIMONIALS = [
  {
    quote:
      'AMTMTI transformed how I practice. The MTM framework is now central to every patient consultation I run.',
    name: 'Achieng Otieno',
    role: 'Community Pharmacist, Kisumu',
  },
  {
    quote:
      'The postgraduate diploma gave me the clinical confidence to lead our hospital medication safety committee.',
    name: 'Dr. Kwame Asante',
    role: 'Clinical Pharmacist, Accra',
  },
  {
    quote:
      'World-class faculty, rigorous content, and a genuinely pan-African community. Exactly what the continent needs.',
    name: 'Dr. Amina Yusuf',
    role: 'Researcher, Lagos',
  },
  {
    quote:
      'Our institution adopted AMTMTI training for our entire pharmacy team. The impact on patient outcomes is measurable.',
    name: 'Grace Mwangi',
    role: 'Healthcare Director, Nairobi',
  },
]

export const PARTNERS = [
  'University of Nairobi',
  'Kenyatta National Hospital',
  'WHO AFRO',
  'Makerere University',
  'Aga Khan University',
  'Pharmacy & Poisons Board',
  'Africa CDC',
  'University of Ghana',
]

export const PROGRAM_TYPES = [
  'Certificate',
  'Diploma',
  'Postgraduate Diploma',
  'CPD Courses',
] as const
