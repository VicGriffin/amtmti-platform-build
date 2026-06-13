export type NewsItem = {
  slug: string
  title: string
  category: 'News' | 'Research Updates' | 'Partnerships' | 'Announcements' | 'Events'
  excerpt: string
  body: string
  date: string
  author: string
  readMinutes: number
}

export const NEWS: NewsItem[] = [
  {
    slug: 'amtmti-expands-to-twelve-countries',
    title: 'AMTMTI expands medication therapy training to twelve countries',
    category: 'Announcements',
    excerpt:
      'The institute marks a major milestone in its pan-African mission with new partnerships across East and West Africa.',
    body: 'AMTMTI has formally expanded its accredited medication therapy management programmes to twelve African countries, establishing new training partnerships with leading universities and hospitals. The expansion is part of the institute\u2019s 2030 strategy to train 50,000 healthcare professionals and embed MTM into primary care across the continent.',
    date: '2026-05-18',
    author: 'AMTMTI Communications',
    readMinutes: 4,
  },
  {
    slug: 'medication-safety-trial-results',
    title: 'Multi-country medication safety trial reports encouraging results',
    category: 'Research Updates',
    excerpt:
      'Early findings from a four-country study show measurable reductions in preventable medication harm.',
    body: 'The AMTMTI Research Division has released early findings from its flagship medication safety trial, conducted across four countries. The study demonstrates measurable reductions in preventable medication-related harm where pharmacist-led MTM interventions were implemented.',
    date: '2026-04-30',
    author: 'Dr. Fatima El-Hassan',
    readMinutes: 6,
  },
  {
    slug: 'partnership-who-afro',
    title: 'New partnership with WHO AFRO to strengthen pharmaceutical care',
    category: 'Partnerships',
    excerpt:
      'A landmark collaboration will support curriculum development and continental capacity building.',
    body: 'AMTMTI has entered a strategic partnership with WHO AFRO to strengthen pharmaceutical care capacity across the region. The collaboration will support curriculum development, faculty exchange, and the rollout of standardised MTM competencies.',
    date: '2026-04-12',
    author: 'AMTMTI Communications',
    readMinutes: 3,
  },
  {
    slug: 'annual-mtm-summit-2026',
    title: 'Registration opens for the 2026 Pan-African MTM Summit',
    category: 'Events',
    excerpt:
      'Join hundreds of pharmacists, clinicians, and researchers in Nairobi this September.',
    body: 'Registration is now open for the 2026 Pan-African MTM Summit, taking place in Nairobi. The three-day event brings together pharmacists, clinicians, researchers, and healthcare leaders for keynote sessions, workshops, and research presentations.',
    date: '2026-03-28',
    author: 'Events Team',
    readMinutes: 2,
  },
  {
    slug: 'new-postgraduate-cohort',
    title: 'Largest-ever postgraduate cohort begins studies',
    category: 'News',
    excerpt:
      'A record number of pharmacists join the Postgraduate Diploma in Medication Therapy Management.',
    body: 'AMTMTI welcomed its largest-ever postgraduate cohort this term, with pharmacists joining from across the continent to pursue the Postgraduate Diploma in Medication Therapy Management.',
    date: '2026-03-05',
    author: 'Dr. Samuel Okoro',
    readMinutes: 3,
  },
]

export type EventItem = {
  slug: string
  title: string
  date: string
  location: string
  mode: 'In-Person' | 'Virtual' | 'Hybrid'
  description: string
}

export const EVENTS: EventItem[] = [
  {
    slug: 'pan-african-mtm-summit-2026',
    title: 'Pan-African MTM Summit 2026',
    date: '2026-09-15',
    location: 'Nairobi, Kenya',
    mode: 'Hybrid',
    description: 'Three days of keynotes, workshops, and research on medication therapy management.',
  },
  {
    slug: 'medication-safety-webinar',
    title: 'Webinar: Reducing Preventable Medication Harm',
    date: '2026-07-08',
    location: 'Online',
    mode: 'Virtual',
    description: 'A practical session on systems-based approaches to medication safety.',
  },
  {
    slug: 'clinical-pharmacy-masterclass',
    title: 'Clinical Pharmacy Masterclass',
    date: '2026-08-22',
    location: 'Accra, Ghana',
    mode: 'In-Person',
    description: 'Hands-on masterclass for pharmacists advancing into clinical roles.',
  },
]

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
