import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed Programs
    console.log('📚 Seeding programs...')
    const programs = [
      {
        title: 'MTM Foundations Certificate',
        slug: 'mtm-foundations-certificate',
        category: 'pharmacists',
        category_label: 'Pharmacists',
        level: 'Certificate',
        mode: 'Online',
        duration: '8 weeks',
        fees_ksh: 28000,
        summary: 'Build a solid grounding in medication therapy management principles, patient assessment, and care planning.',
        outcomes: [
          'Conduct comprehensive medication reviews',
          'Develop patient-centred care plans',
          'Document MTM interventions effectively',
        ],
        featured: true,
      },
      {
        title: 'Clinical Pharmacy Diploma',
        slug: 'clinical-pharmacy-diploma',
        category: 'pharmacists',
        category_label: 'Pharmacists',
        level: 'Diploma',
        mode: 'Hybrid',
        duration: '12 months',
        fees_ksh: 145000,
        summary: 'An in-depth clinical programme preparing pharmacists for advanced ward-based and ambulatory care roles.',
        outcomes: [
          'Lead therapeutic drug monitoring',
          'Optimise complex medication regimens',
          'Collaborate within multidisciplinary teams',
        ],
        featured: true,
      },
      {
        title: 'Postgraduate Diploma in MTM',
        slug: 'postgraduate-diploma-mtm',
        category: 'pharmacists',
        category_label: 'Pharmacists',
        level: 'Postgraduate Diploma',
        mode: 'Hybrid',
        duration: '18 months',
        fees_ksh: 320000,
        summary: 'Our flagship postgraduate pathway for clinical leaders driving medication safety at a systems level.',
        outcomes: [
          'Design medication safety programmes',
          'Lead clinical governance initiatives',
          'Conduct practice-based research',
        ],
        featured: true,
      },
      {
        title: 'Medication Safety for Clinicians',
        slug: 'medication-safety-clinicians',
        category: 'clinicians',
        category_label: 'Clinicians',
        level: 'CPD Course',
        mode: 'Online',
        duration: '4 weeks',
        fees_ksh: 18000,
        summary: 'A focused CPD course equipping clinicians with practical medication safety and prescribing tools.',
        outcomes: [
          'Identify high-risk prescribing patterns',
          'Apply safe prescribing frameworks',
          'Reduce preventable medication harm',
        ],
        featured: true,
      },
      {
        title: 'Medication Adherence for Nurses',
        slug: 'adherence-nursing-certificate',
        category: 'nurses',
        category_label: 'Nurses',
        level: 'Certificate',
        mode: 'Online',
        duration: '6 weeks',
        fees_ksh: 22000,
        summary: 'Practical adherence counselling and medication management skills tailored for nursing practice.',
        outcomes: [
          'Deliver effective adherence counselling',
          'Support safe medication administration',
          'Educate patients on therapy plans',
        ],
      },
      {
        title: 'Advanced Dispensing Certificate',
        slug: 'dispensing-technicians-certificate',
        category: 'pharmaceutical-technicians',
        category_label: 'Pharmaceutical Technicians',
        level: 'Certificate',
        mode: 'In-Person',
        duration: '10 weeks',
        fees_ksh: 26000,
        summary: 'Strengthen dispensing accuracy, inventory practice, and patient interaction for technicians.',
        outcomes: [
          'Apply accurate dispensing protocols',
          'Manage pharmaceutical inventory',
          'Support pharmaceutical care delivery',
        ],
      },
      {
        title: 'Pharmaceutical Technology Diploma',
        slug: 'pharmaceutical-technology-diploma',
        category: 'pharmaceutical-technologists',
        category_label: 'Pharmaceutical Technologists',
        level: 'Diploma',
        mode: 'Hybrid',
        duration: '12 months',
        fees_ksh: 138000,
        summary: 'Technical mastery across formulation, quality, and the medicines management chain.',
        outcomes: [
          'Apply quality assurance standards',
          'Support formulation and compounding',
          'Manage the medicines supply chain',
        ],
      },
      {
        title: 'Collaborative Prescribing for Physicians',
        slug: 'collaborative-prescribing-physicians',
        category: 'physicians',
        category_label: 'Physicians',
        level: 'CPD Course',
        mode: 'Online',
        duration: '5 weeks',
        fees_ksh: 24000,
        summary: 'Therapeutic optimisation and collaborative MTM practice for prescribing physicians.',
        outcomes: [
          'Integrate MTM into clinical workflows',
          'Optimise therapy in complex patients',
          'Collaborate with pharmacy teams',
        ],
      },
    ]

    const { error: programError } = await supabase
      .from('programs')
      .insert(programs)

    if (programError) {
      console.error('❌ Error seeding programs:', programError.message)
    } else {
      console.log('✅ Programs seeded successfully')
    }

    // Seed News
    console.log('📰 Seeding news...')
    const news = [
      {
        title: 'AMTMTI expands medication therapy training to twelve countries',
        slug: 'amtmti-expands-to-twelve-countries',
        category: 'Announcements',
        excerpt: 'The institute marks a major milestone in its pan-African mission with new partnerships across East and West Africa.',
        body: 'AMTMTI has formally expanded its accredited medication therapy management programmes to twelve African countries, establishing new training partnerships with leading universities and hospitals.',
        author: 'AMTMTI Communications',
        read_minutes: 4,
        featured: true,
      },
      {
        title: 'Multi-country medication safety trial reports encouraging results',
        slug: 'medication-safety-trial-results',
        category: 'Research Updates',
        excerpt: 'Early findings from a four-country study show measurable reductions in preventable medication harm.',
        body: 'The AMTMTI Research Division has released early findings from its flagship medication safety trial, conducted across four countries. The study demonstrates measurable reductions in preventable medication-related harm.',
        author: 'Dr. Fatima El-Hassan',
        read_minutes: 6,
        featured: true,
      },
      {
        title: 'New partnership with WHO AFRO to strengthen pharmaceutical care',
        slug: 'partnership-who-afro',
        category: 'Partnerships',
        excerpt: 'A landmark collaboration will support curriculum development and continental capacity building.',
        body: 'AMTMTI has entered a strategic partnership with WHO AFRO to strengthen pharmaceutical care capacity across the region.',
        author: 'AMTMTI Communications',
        read_minutes: 3,
      },
    ]

    const { error: newsError } = await supabase
      .from('news')
      .insert(news)

    if (newsError) {
      console.error('❌ Error seeding news:', newsError.message)
    } else {
      console.log('✅ News seeded successfully')
    }

    // Seed Events
    console.log('🎪 Seeding events...')
    const events = [
      {
        title: 'Pan-African MTM Summit 2026',
        slug: 'pan-african-mtm-summit-2026',
        date: '2026-09-15T09:00:00Z',
        location: 'Nairobi, Kenya',
        mode: 'Hybrid',
        description: 'Three days of keynotes, workshops, and research on medication therapy management.',
      },
      {
        title: 'Webinar: Reducing Preventable Medication Harm',
        slug: 'medication-safety-webinar',
        date: '2026-07-08T14:00:00Z',
        location: 'Online',
        mode: 'Virtual',
        description: 'A practical session on systems-based approaches to medication safety.',
      },
      {
        title: 'Clinical Pharmacy Masterclass',
        slug: 'clinical-pharmacy-masterclass',
        date: '2026-08-22T09:00:00Z',
        location: 'Accra, Ghana',
        mode: 'In-Person',
        description: 'Hands-on masterclass for pharmacists advancing into clinical roles.',
      },
    ]

    const { error: eventsError } = await supabase
      .from('events')
      .insert(events)

    if (eventsError) {
      console.error('❌ Error seeding events:', eventsError.message)
    } else {
      console.log('✅ Events seeded successfully')
    }

    // Seed Partners
    console.log('🤝 Seeding partners...')
    const partners = [
      {
        name: 'University of Nairobi',
        country: 'Kenya',
        display_order: 1,
        is_active: true,
      },
      {
        name: 'Kenyatta National Hospital',
        country: 'Kenya',
        display_order: 2,
        is_active: true,
      },
      {
        name: 'WHO AFRO',
        country: 'Global',
        display_order: 3,
        is_active: true,
      },
      {
        name: 'Makerere University',
        country: 'Uganda',
        display_order: 4,
        is_active: true,
      },
      {
        name: 'Aga Khan University',
        country: 'Global',
        display_order: 5,
        is_active: true,
      },
      {
        name: 'Pharmacy & Poisons Board',
        country: 'Kenya',
        display_order: 6,
        is_active: true,
      },
      {
        name: 'Africa CDC',
        country: 'Global',
        display_order: 7,
        is_active: true,
      },
      {
        name: 'University of Ghana',
        country: 'Ghana',
        display_order: 8,
        is_active: true,
      },
    ]

    const { error: partnersError } = await supabase
      .from('partners')
      .insert(partners)

    if (partnersError) {
      console.error('❌ Error seeding partners:', partnersError.message)
    } else {
      console.log('✅ Partners seeded successfully')
    }

    // Seed Research Projects
    console.log('🔬 Seeding research projects...')
    const researchProjects = [
      {
        title: 'Multi-country Medication Safety Trial',
        slug: 'multi-country-medication-safety',
        description: 'A four-country study measuring the impact of pharmacist-led MTM interventions on preventing medication-related harm.',
        status: 'active',
        principal_investigator: 'Dr. Fatima El-Hassan',
        countries: ['Kenya', 'Uganda', 'Ghana', 'Tanzania'],
        start_date: '2023-01-15',
      },
      {
        title: 'Clinical Pharmacy Practice Patterns in Africa',
        slug: 'clinical-pharmacy-patterns',
        description: 'A cross-sectional study examining current clinical pharmacy practice across African hospitals.',
        status: 'active',
        principal_investigator: 'Prof. Wanjiru Kamau',
        countries: ['Kenya', 'Uganda', 'Nigeria', 'South Africa'],
        start_date: '2023-06-01',
      },
    ]

    const { error: researchError } = await supabase
      .from('research_projects')
      .insert(researchProjects)

    if (researchError) {
      console.error('❌ Error seeding research projects:', researchError.message)
    } else {
      console.log('✅ Research projects seeded successfully')
    }

    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seed()
