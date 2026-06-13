export type Program = {
  slug: string
  title: string
  category: string // profession slug
  categoryLabel: string
  level: 'Certificate' | 'Diploma' | 'Postgraduate Diploma' | 'CPD Course'
  mode: 'Online' | 'Hybrid' | 'In-Person'
  duration: string
  feesKsh: number
  summary: string
  outcomes: string[]
  featured?: boolean
}

export const PROGRAMS: Program[] = [
  {
    slug: 'mtm-foundations-certificate',
    title: 'MTM Foundations Certificate',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Certificate',
    mode: 'Online',
    duration: '8 weeks',
    feesKsh: 28000,
    summary:
      'Build a solid grounding in medication therapy management principles, patient assessment, and care planning.',
    outcomes: [
      'Conduct comprehensive medication reviews',
      'Develop patient-centred care plans',
      'Document MTM interventions effectively',
    ],
    featured: true,
  },
  {
    slug: 'clinical-pharmacy-diploma',
    title: 'Clinical Pharmacy Diploma',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Diploma',
    mode: 'Hybrid',
    duration: '12 months',
    feesKsh: 145000,
    summary:
      'An in-depth clinical programme preparing pharmacists for advanced ward-based and ambulatory care roles.',
    outcomes: [
      'Lead therapeutic drug monitoring',
      'Optimise complex medication regimens',
      'Collaborate within multidisciplinary teams',
    ],
    featured: true,
  },
  {
    slug: 'postgraduate-diploma-mtm',
    title: 'Postgraduate Diploma in MTM',
    category: 'pharmacists',
    categoryLabel: 'Pharmacists',
    level: 'Postgraduate Diploma',
    mode: 'Hybrid',
    duration: '18 months',
    feesKsh: 320000,
    summary:
      'Our flagship postgraduate pathway for clinical leaders driving medication safety at a systems level.',
    outcomes: [
      'Design medication safety programmes',
      'Lead clinical governance initiatives',
      'Conduct practice-based research',
    ],
    featured: true,
  },
  {
    slug: 'medication-safety-clinicians',
    title: 'Medication Safety for Clinicians',
    category: 'clinicians',
    categoryLabel: 'Clinicians',
    level: 'CPD Course',
    mode: 'Online',
    duration: '4 weeks',
    feesKsh: 18000,
    summary:
      'A focused CPD course equipping clinicians with practical medication safety and prescribing tools.',
    outcomes: [
      'Identify high-risk prescribing patterns',
      'Apply safe prescribing frameworks',
      'Reduce preventable medication harm',
    ],
    featured: true,
  },
  {
    slug: 'adherence-nursing-certificate',
    title: 'Medication Adherence for Nurses',
    category: 'nurses',
    categoryLabel: 'Nurses',
    level: 'Certificate',
    mode: 'Online',
    duration: '6 weeks',
    feesKsh: 22000,
    summary:
      'Practical adherence counselling and medication management skills tailored for nursing practice.',
    outcomes: [
      'Deliver effective adherence counselling',
      'Support safe medication administration',
      'Educate patients on therapy plans',
    ],
  },
  {
    slug: 'dispensing-technicians-certificate',
    title: 'Advanced Dispensing Certificate',
    category: 'pharmaceutical-technicians',
    categoryLabel: 'Pharmaceutical Technicians',
    level: 'Certificate',
    mode: 'In-Person',
    duration: '10 weeks',
    feesKsh: 26000,
    summary:
      'Strengthen dispensing accuracy, inventory practice, and patient interaction for technicians.',
    outcomes: [
      'Apply accurate dispensing protocols',
      'Manage pharmaceutical inventory',
      'Support pharmaceutical care delivery',
    ],
  },
  {
    slug: 'pharmaceutical-technology-diploma',
    title: 'Pharmaceutical Technology Diploma',
    category: 'pharmaceutical-technologists',
    categoryLabel: 'Pharmaceutical Technologists',
    level: 'Diploma',
    mode: 'Hybrid',
    duration: '12 months',
    feesKsh: 138000,
    summary:
      'Technical mastery across formulation, quality, and the medicines management chain.',
    outcomes: [
      'Apply quality assurance standards',
      'Support formulation and compounding',
      'Manage the medicines supply chain',
    ],
  },
  {
    slug: 'collaborative-prescribing-physicians',
    title: 'Collaborative Prescribing for Physicians',
    category: 'physicians',
    categoryLabel: 'Physicians',
    level: 'CPD Course',
    mode: 'Online',
    duration: '5 weeks',
    feesKsh: 24000,
    summary:
      'Therapeutic optimisation and collaborative MTM practice for prescribing physicians.',
    outcomes: [
      'Integrate MTM into clinical workflows',
      'Optimise therapy in complex patients',
      'Collaborate with pharmacy teams',
    ],
  },
]

export function formatKsh(amount: number) {
  return `KSH ${amount.toLocaleString('en-KE')}`
}
