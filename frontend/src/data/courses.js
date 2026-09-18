/* ────────────────────────────────────────────────────────────
   courses.js – Static course catalogue for Thillai Martial Arts
   ──────────────────────────────────────────────────────────── */

import { getBatchForCourse, getBatchById } from './batches.js'

export const COURSES = [
  {
    id: 1,
    slug: 'taekwondo',
    name: 'Taekwondo',
    category: 'martial-arts',
    icon: '🥋',
    color: '#3F72AF',
    tagline: 'The Art of Kicks & Power',
    feePerMonth: 300,
    batchId: 1,
    schedule: {
      days: 'Monday, Wednesday, Friday',
      daysShort: 'Mon, Wed, Fri',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/taekwondo.jpg',
    history: `Taekwondo is a Korean martial art and combat sport that emphasizes
head-height kicks, jumping and spinning kicks, and fast kicking techniques.
Developed in the 1940s and 1950s by Korean martial artists with backgrounds in
karate and Chinese martial arts, Taekwondo was systematically organized and
developed by the South Korean military, and was officially adopted as a military
self-defence style from 1955 onwards. Taekwondo became an Olympic sport at the
2000 Sydney Olympics. The name Taekwondo translates to "the way of the foot and
fist." In South Korea, it is governed by the Korea Taekwondo Association and
has been practised by over 80 million people in 210 countries worldwide.
Our club is affiliated with the Cuddalore District Taekwondo Sports Association
and the Tamil Nadu Taekwondo Association, giving students access to state and
national-level competitions.`,
    benefits: [
      'Improves cardiovascular health and overall fitness',
      'Develops self-defence skills and situational awareness',
      'Builds mental discipline, focus and concentration',
      'Enhances flexibility, balance and coordination',
      'Fosters self-confidence and positive self-image',
      'Teaches respect, humility and martial ethics',
      'Opens pathways to state and national competition',
      'Provides an excellent stress-relief outlet',
    ],
    whyJoin: `At Thillai Martial Arts Club our Taekwondo programme is led by Master
R. HariHaran, a Black Belt Dan 4 holder and National Referee. We follow the
World Taekwondo (WT) curriculum and prepare students from white belt through
to black belt and beyond. Our students have earned State and National medals,
and we run regular grading examinations certified by the Tamil Nadu Taekwondo
Association.`,
    career: `Taekwondo practitioners can become certified coaches, national referees,
armed forces instructors, or represent India at international tournaments.
Many of our alumni have secured prestigious positions in government service
through sports quota.`,
  },
  {
    id: 2,
    slug: 'boxing',
    name: 'Boxing',
    category: 'martial-arts',
    icon: '🥊',
    color: '#3F72AF',
    tagline: 'Sweet Science of Strength',
    feePerMonth: 300,
    batchId: 1,
    schedule: {
      days: 'Monday, Wednesday, Friday',
      daysShort: 'Mon, Wed, Fri',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/boxing.jpg',
    history: `Boxing is one of humanity's oldest combat sports, depicted in ancient
Sumerian reliefs dating to 3000 BCE and included in the ancient Greek Olympic
Games in 688 BCE. Modern boxing evolved in 18th-century England when Jack
Broughton introduced the first set of rules in 1743. The Marquess of
Queensberry Rules of 1867, which mandated gloves and three-minute rounds,
form the backbone of today's sport. Boxing develops explosive power,
lightning-fast reflexes, tactical intelligence, and exceptional cardiovascular
endurance. It is widely regarded as the world's most complete combat sport and
is featured at every Olympic Games since 1904.`,
    benefits: [
      'Develops explosive punching power and speed',
      'Builds superior cardiovascular and muscular endurance',
      'Sharpens reflexes, timing and hand-eye coordination',
      'Burns up to 700 calories per hour of training',
      'Teaches effective self-defence strategies',
      'Cultivates mental toughness under pressure',
      'Improves posture and core strength',
      'Provides an exhilarating full-body workout',
    ],
    whyJoin: `Our boxing programme blends technical pad work, bag work, footwork
drills and sparring sessions under expert guidance. Beginners learn fundamental
stance, guard and combination punching while advanced students refine ring
craft and tactical awareness. All sparring is fully supervised and safety is
our top priority.`,
    career: `Skilled boxers can compete at district, state and national amateur
tournaments, pursue professional boxing, or become certified fitness and
boxing coaches. Many corporate wellness programmes now actively seek boxing
trainers.`,
  },
  {
    id: 3,
    slug: 'silambam',
    name: 'Silambam',
    category: 'martial-arts',
    icon: '🥢',
    color: '#3F72AF',
    tagline: 'Ancient Tamil Martial Heritage',
    feePerMonth: 300,
    batchId: 1,
    schedule: {
      days: 'Monday, Wednesday, Friday',
      daysShort: 'Mon, Wed, Fri',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/silambam.jpg',
    history: `Silambam is an ancient weapon-based Indian martial art that originated
in the Tamil Nadu region more than 5,000 years ago. References to Silambam
appear in Sangam-period Tamil literature such as Silappatikaram and
Manimegalai. The word "Silambam" derives from the Tamil word for bamboo,
referring to the primary weapon: a long bamboo staff. Ancient Tamil kings
were required by tradition to learn Silambam as part of their royal education.
The art nearly vanished during British colonial rule but was revived in the
late 20th century and is now recognized as a traditional sport of Tamil Nadu.
Silambam develops extraordinary speed, fluid movement and hand-eye
coordination, and is considered one of the most aesthetically beautiful
martial arts in the world.`,
    benefits: [
      'Preserves and promotes ancient Tamil cultural heritage',
      'Develops exceptional speed, agility and reflexes',
      'Improves coordination between hand, eye and feet',
      'Builds core strength and rotational power',
      'Teaches traditional weapon-handling techniques',
      'Creates a deep connection with Tamil history and tradition',
      'Enhances mental focus and calm under pressure',
      'Can be practised as both sport and art form',
    ],
    whyJoin: `As practitioners of Tamil Nadu's own martial heritage, we take pride in
offering authentic Silambam training. Our instructors have studied under
traditional masters and will guide you through foundational staff movements
(kol adigal), offensive and defensive sequences, and advanced spinning
techniques. Students may participate in Tamil Nadu Silambam Association
competitions.`,
    career: `Silambam practitioners can become cultural ambassadors, traditional
arts instructors, perform at cultural events, or compete at national and
international Silambam championships. Government recognition of Silambam
creates opportunities in the Khelo India framework.`,
  },
  {
    id: 4,
    slug: 'yoga',
    name: 'Yoga',
    category: 'wellness',
    icon: '🧘',
    color: '#8B5CF6',
    tagline: 'Union of Body, Mind & Spirit',
    feePerMonth: 300,
    batchId: 2,
    schedule: {
      days: 'Tuesday, Thursday, Saturday',
      daysShort: 'Tue, Thu, Sat',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/yoga.jpg',
    history: `Yoga is an ancient physical, mental and spiritual practice that originated
in India over 5,000 years ago. The word yoga is derived from the Sanskrit
root "yuj" meaning to yoke or unite. The Yoga Sutras of Patanjali, compiled
around 400 CE, form the foundational text of classical yoga philosophy.
Modern postural yoga, primarily derived from Hatha Yoga, became widely
practised in the 20th century and is today one of the world's most popular
health and fitness disciplines. The United Nations declared June 21st as
International Yoga Day in 2015. In 2024, Yogasana was formally recognized as
a competitive sport in India. Master HariHaran holds an MSc in Yoga and is
affiliated with the Tamil Nadu Yogasana Association, ensuring students receive
certified, authentic instruction.`,
    benefits: [
      'Increases flexibility, strength and body awareness',
      'Reduces stress, anxiety and cortisol levels',
      'Improves respiratory function and oxygen efficiency',
      'Enhances posture and spinal alignment',
      'Promotes mindfulness and emotional regulation',
      'Supports healthy weight management',
      'Boosts immune system function',
      'Improves sleep quality and energy levels',
    ],
    whyJoin: `Our Yoga sessions are conducted by Master R. HariHaran (MSc Yoga, Tamil Nadu
Yogasana Association member), combining classical Hatha Yoga asanas with
modern therapeutic techniques. We cater to all fitness levels from beginners
to advanced practitioners and offer both general wellness classes and
competitive Yogasana training.`,
    career: `Certified yoga instructors are in high demand globally. Career paths
include running yoga studios, corporate wellness programmes, sports yoga
coaching, therapeutic yoga, and participating in national Yogasana competitions.`,
  },
  {
    id: 5,
    slug: 'fitness',
    name: 'Fitness',
    category: 'wellness',
    icon: '💪',
    color: '#EF4444',
    tagline: 'Build Your Best Body',
    feePerMonth: 300,
    batchId: 3,
    schedule: {
      days: 'Daily (Monday – Saturday)',
      daysShort: 'Daily (Mon–Sat)',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/fitness.jpg',
    history: `Physical fitness training has evolved from ancient Greek gymnastics and
military conditioning into a scientifically structured discipline that
encompasses strength training, cardiovascular exercise, flexibility work
and nutrition science. Modern exercise science draws on biomechanics,
sports medicine, physiology and psychology to optimise human performance.
The WHO recommends at least 150 minutes of moderate aerobic activity per
week for adults. Our fitness programme is designed around functional
movement patterns, progressive overload principles and evidence-based
nutrition guidance — making it accessible to everyone from teenagers
to senior citizens.`,
    benefits: [
      'Builds lean muscle mass and increases metabolic rate',
      'Strengthens cardiovascular system and heart health',
      'Reduces risk of chronic diseases including diabetes and hypertension',
      'Improves energy levels and reduces fatigue',
      'Enhances mental health and combats depression',
      'Supports healthy body weight and composition',
      'Increases bone density and joint health',
      'Improves overall quality of life and longevity',
    ],
    whyJoin: `Our fitness programme (certified by Master HariHaran, a Food Nutrition
Specialist) integrates bodyweight training, resistance work, HIIT circuits
and flexible stretching routines. We create personalised fitness plans for
every student, track progress regularly, and provide nutritional guidance
to maximise results safely.`,
    career: `Fitness professionals can become personal trainers, gym managers, sports
conditioning coaches, corporate wellness consultants, or nutrition advisors.
The Indian fitness industry is growing at 25% annually, creating abundant
career opportunities.`,
  },
  {
    id: 6,
    slug: 'guitar',
    name: 'Guitar',
    category: 'skill',
    icon: '🎸',
    color: '#F59E0B',
    tagline: 'Strum Your Way to Expression',
    feePerMonth: 300,
    batchId: 2,
    schedule: {
      days: 'Tuesday, Thursday, Saturday',
      daysShort: 'Tue, Thu, Sat',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/guitar.jpg',
    history: `The guitar is one of the world's most beloved and versatile musical instruments,
with a history stretching back to ancient lutes found in Mesopotamia around
3000 BCE. The modern guitar emerged in Spain during the 16th century, with
Antonio de Torres Jurado standardising the classical guitar design in the
19th century. The electric guitar, invented in the 1930s, revolutionised
popular music. Today, guitar spans every genre from classical and flamenco
to rock, jazz, blues, Carnatic and Bollywood. Learning guitar develops
musical literacy, enhances creative expression, trains both hands for
independent coordination, and provides a lifelong source of joy and
artistic expression.`,
    benefits: [
      'Develops musical literacy and ear training',
      'Trains independent hand-eye coordination',
      'Enhances creativity and emotional expression',
      'Builds patience, discipline and practice habits',
      'Provides a stress-relief and creative outlet',
      'Opens doors to musical performance and collaboration',
      'Improves memory and cognitive function',
      'Cultivates a lifelong artistic skill',
    ],
    whyJoin: `Our guitar curriculum covers Western classical, chords, scales, popular
Bollywood and Tamil film music, and music theory fundamentals. Students
progress from open chords and basic strumming to fingerpicking techniques,
barre chords and solo playing. All ages welcome — from 7 to 70.`,
    career: `Guitar skills can lead to professional performance, session musician work,
music teaching, jingle production, film scoring, or simply enriching life
with a beautiful creative skill. Many students have gone on to form bands
and perform at local events.`,
  },
  {
    id: 7,
    slug: 'chess',
    name: 'Chess',
    category: 'skill',
    icon: '♟️',
    color: '#6B7280',
    tagline: 'Master the 64-Square Battlefield',
    feePerMonth: 300,
    batchId: 4,
    schedule: {
      days: 'Saturday, Sunday',
      daysShort: 'Sat, Sun',
      time: 'Morning / Evening (According to school presence)',
      timingNote: 'Morning or Evening batches scheduled according to school presence',
      holiday: 'Classes Active on Sunday (No Holiday)',
    },
    imageUrl: '/images/courses/chess.jpg',
    history: `Chess is one of the oldest and most intellectually demanding strategy games
in human history, originating in 6th-century India as chaturanga before
spreading through Persia as shatranj and reaching Europe by the 10th century.
The modern rules were largely standardised by the late 15th century.
The World Chess Federation (FIDE) was founded in 1924 and today chess
boasts over 600 million players worldwide. India has produced legendary
World Champions including Viswanathan Anand and a new generation of
grandmasters. Chess develops logical reasoning, pattern recognition,
strategic planning, and emotional resilience — skills that transfer
directly to academic and professional success.`,
    benefits: [
      'Develops critical thinking and logical reasoning skills',
      'Enhances concentration, memory and mental endurance',
      'Builds strategic planning and decision-making ability',
      'Teaches patience, foresight and consequence analysis',
      'Improves academic performance across all subjects',
      'Develops emotional resilience and sportsmanship',
      'Provides a structured mental challenge for all ages',
      'Opens pathways to competitive rating and tournaments',
    ],
    whyJoin: `We teach chess from the absolute basics through to tournament-level
openings, middle-game tactics and endgame technique. Our sessions include
game analysis, puzzle-solving exercises and friendly internal tournaments.
Students are encouraged to register with FIDE and Tamil Nadu State Chess
Association for official rating.`,
    career: `Chess coaches are sought after in schools across India. Competitive players
can earn FIDE ratings and titles. Chess coaching has become a recognised
profession with growing demand from both schools and online platforms.`,
  },
  {
    id: 8,
    slug: 'hindi',
    name: 'Hindi',
    category: 'language',
    icon: '🇮🇳',
    color: '#10B981',
    tagline: 'Connect with 600 Million Speakers',
    feePerMonth: 300,
    batchId: 3,
    schedule: {
      days: 'Daily (Monday – Saturday)',
      daysShort: 'Daily (Mon–Sat)',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    },
    imageUrl: '/images/courses/hindi.jpg',
    history: `Hindi is the most widely spoken language in India and the third most spoken
language in the world with over 600 million speakers. As a modern Indo-Aryan
language, Hindi evolved from Sanskrit and Apabhramsha, developing through the
medieval Brajbhasha and Avadhi literary dialects into the standardised
Khari Boli of today. It became the official language of India alongside
English in 1950. For Tamil-speaking Indians, proficiency in Hindi is
increasingly essential for national career opportunities, governmental work,
higher education at central institutions, and communicating across India's
diverse linguistic landscape.`,
    benefits: [
      'Opens doors to national career opportunities across India',
      'Essential for government service and civil service examinations',
      'Required for admission to central universities and colleges',
      'Enables communication across 29 states and union territories',
      'Enriches appreciation of Bollywood and Hindi literature',
      'Strengthens national unity and cultural understanding',
      'Adds a valuable credential to any resume',
      'Facilitates business and trade across North and Central India',
    ],
    whyJoin: `Master HariHaran is a qualified Hindi Pandit and teaches Hindi through
a proven curriculum covering the Devanagari script, vocabulary, grammar,
reading comprehension, spoken Hindi and written composition. Students are
prepared for state board Hindi examinations and the Rashtrabhasha Prachar
Sabha (Wardha) certificate levels.`,
    career: `Hindi proficiency is essential for IAS/IPS preparation, central government
employment, railway services, banking examinations, and professional
communication in pan-India corporations.`,
  },
  {
    id: 9,
    slug: 'english-grammar',
    name: 'English Grammar',
    category: 'language',
    icon: '📚',
    color: '#3B82F6',
    tagline: 'Master the Language of Opportunity',
    feePerMonth: 300,
    batchId: 4,
    schedule: {
      days: 'Saturday, Sunday',
      daysShort: 'Sat, Sun',
      time: 'Morning / Evening (According to school presence)',
      timingNote: 'Morning or Evening batches scheduled according to school presence',
      holiday: 'Classes Active on Sunday (No Holiday)',
    },
    imageUrl: '/images/courses/english-grammar.jpg',
    history: `English is the global language of science, technology, commerce, diplomacy
and higher education, with over 1.5 billion speakers worldwide. English
grammar traces its roots to Old English (Anglo-Saxon), Middle English and
Early Modern English, being codified through landmark works such as Samuel
Johnson's Dictionary (1755) and Robert Lowth's Short Introduction to English
Grammar (1762). In India, English became a medium of higher education under
Macaulay's Minute of 1835 and today remains essential for competitive
examinations, corporate careers and international communication. For students
in Tamil Nadu, strong English grammar skills dramatically widen access to
quality higher education and employment opportunities.`,
    benefits: [
      'Essential for all competitive examinations (UPSC, TNPSC, Bank PO, IELTS)',
      'Improves spoken English fluency and communication confidence',
      'Strengthens writing skills for academic and professional contexts',
      'Expands vocabulary and reading comprehension skills',
      'Required for engineering, medical and management entrances',
      'Builds a foundation for international careers and study abroad',
      'Enhances logical thinking through grammatical analysis',
      'Boosts confidence in professional and social settings',
    ],
    whyJoin: `Our weekend English Grammar classes cover parts of speech, tenses,
subject-verb agreement, active and passive voice, direct and indirect speech,
comprehension passages, essay writing and letter writing. Classes are
interactive, practical and focused on preparing students for board exams
and competitive examinations.`,
    career: `Strong English skills are a gateway to higher education, civil services,
software and IT careers, journalism, content writing, teaching, banking and
international opportunities. English proficiency is the single biggest
differentiator in today's job market.`,
  },
]

export const getCourseBySlug = (slug) =>
  getAllCoursesMerged().find(c => (c.slug || '').toLowerCase() === (slug || '').toLowerCase()) || null

export const getCoursesByBatch = (batchId) =>
  getAllCoursesMerged().filter(c => c.batchId === batchId)

export const CATEGORIES = [
  { key: 'all',          label: 'All Courses' },
  { key: 'martial-arts', label: 'Martial Arts' },
  { key: 'wellness',     label: 'Yoga & Fitness' },
  { key: 'creative',     label: 'Creative & Mind' },
]

export const CUSTOM_COURSES_KEY = 'tma_custom_courses'
export const DELETED_COURSES_KEY = 'tma_deleted_courses'

export const getDeletedCourses = () => {
  try {
    const raw = localStorage.getItem(DELETED_COURSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    return []
  }
}

export const getCustomCourses = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_COURSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load custom courses from localStorage:', err)
    return []
  }
}

export const saveCustomCourse = (course) => {
  try {
    const existing = getCustomCourses()
    const slugStr = (course.slug || '').toLowerCase()

    // Unmark as deleted if it was previously deleted
    const deleted = getDeletedCourses().filter(s => s !== slugStr)
    localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify(deleted))

    const index = existing.findIndex(c => (c.slug && c.slug.toLowerCase() === slugStr) || (c.id && c.id === course.id))
    let updated
    if (index >= 0) {
      updated = [...existing]
      updated[index] = { ...existing[index], ...course }
    } else {
      updated = [...existing, course]
    }
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('tma:courses-updated', { detail: updated }))
    return updated
  } catch (err) {
    console.error('Failed to save custom course:', err)
    return getCustomCourses()
  }
}

export const deleteCourse = (slugOrId) => {
  try {
    const slugStr = String(slugOrId).toLowerCase()

    // 1. Remove from custom courses if present
    const existing = getCustomCourses()
    const updatedCustom = existing.filter(c => (c.slug || '').toLowerCase() !== slugStr && String(c.id) !== String(slugOrId))
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(updatedCustom))

    // 2. Track as deleted so static/API courses are also hidden
    const deleted = getDeletedCourses()
    if (!deleted.includes(slugStr)) {
      deleted.push(slugStr)
      localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify(deleted))
    }

    window.dispatchEvent(new CustomEvent('tma:courses-updated', { detail: { deleted: slugStr } }))
    return true
  } catch (err) {
    console.error('Failed to delete course:', err)
    return false
  }
}

export const deleteCustomCourse = deleteCourse

export const restoreDefaultCourses = () => {
  try {
    localStorage.removeItem(DELETED_COURSES_KEY)
    window.dispatchEvent(new CustomEvent('tma:courses-updated'))
  } catch (err) {
    console.error('Failed to restore default courses:', err)
  }
}

export const getCourseImageUrl = (course) => {
  if (!course) return '/images/courses/taekwondo.jpg'
  if (course.imageUrl && typeof course.imageUrl === 'string' && course.imageUrl.trim()) {
    return course.imageUrl.trim()
  }
  const slug = (course.slug || '').toLowerCase()
  return `/images/courses/${slug || 'taekwondo'}.jpg`
}

export const getAllCoursesMerged = (apiCourses = []) => {
  const custom = getCustomCourses()
  const deletedSlugs = new Set(getDeletedCourses().map(s => String(s).toLowerCase()))
  const map = new Map()

  const resolveSchedule = (c, key) => {
    if (c.schedule && c.schedule.days) return c.schedule
    const batch = getBatchForCourse(key) || getBatchById(c.batchId)
    if (batch) {
      return {
        days: batch.days,
        daysShort: Array.isArray(batch.daysShort) ? batch.daysShort.join(', ') : batch.daysShort,
        time: batch.time,
        timingNote: batch.timingNote,
        holiday: batch.holiday,
        holidayNote: batch.holidayNote,
      }
    }
    return {
      days: 'Monday, Wednesday, Friday',
      daysShort: 'Mon, Wed, Fri',
      time: '6:30 PM – 9:00 PM',
      holiday: 'Sunday Holiday',
    }
  }

  // 1. Static base courses
  COURSES.forEach(c => {
    const slugKey = (c.slug || '').toLowerCase()
    map.set(slugKey, {
      ...c,
      schedule: resolveSchedule(c, slugKey),
      imageUrl: c.imageUrl || `/images/courses/${slugKey}.jpg`,
    })
  })

  // 2. Custom courses from localStorage
  custom.forEach(c => {
    const key = (c.slug || '').toLowerCase()
    const existing = map.get(key) || {}
    map.set(key, {
      ...existing,
      ...c,
      schedule: resolveSchedule({ ...existing, ...c }, key),
    })
  })

  // 3. API courses from database
  if (Array.isArray(apiCourses)) {
    apiCourses.forEach(ac => {
      const key = (ac.slug || '').toLowerCase()
      if (key) {
        const existing = map.get(key) || {}

        // Safely parse benefits: array, string, or fallback to existing
        const parsedBenefits = Array.isArray(ac.benefits) && ac.benefits.length > 0
          ? ac.benefits
          : (typeof ac.benefits === 'string' && ac.benefits.trim()
              ? ac.benefits.split('\n').map(s => s.trim()).filter(Boolean)
              : (existing.benefits || []))

        // Safely parse curriculum: array, string, or fallback to existing
        const parsedCurriculum = Array.isArray(ac.curriculum) && ac.curriculum.length > 0
          ? ac.curriculum
          : (typeof ac.curriculum === 'string' && ac.curriculum.trim()
              ? ac.curriculum.split('\n').map(s => s.trim()).filter(Boolean)
              : (existing.curriculum || []))

        const batch = getBatchForCourse(key) || getBatchById(ac.batch?.id || ac.batchId || existing.batchId)

        map.set(key, {
          ...existing,
          ...ac,
          benefits: parsedBenefits,
          curriculum: parsedCurriculum,
          tagline: ac.tagline || existing.tagline || '',
          overview: ac.overview || existing.overview || '',
          icon: ac.icon || existing.icon || '🥋',
          feePerMonth: ac.feePerMonth ?? existing.feePerMonth ?? 300,
          batchId: ac.batch?.id || ac.batchId || batch?.id || existing.batchId || 1,
          schedule: resolveSchedule({ ...existing, ...ac, batchId: ac.batch?.id || ac.batchId || batch?.id || existing.batchId }, key),
          imageUrl: ac.imageUrl || existing.imageUrl || `/images/courses/${key}.jpg`,
        })
      }
    })
  }

  // Filter out any deleted courses
  return Array.from(map.values()).filter(c => {
    const slugKey = (c.slug || '').toLowerCase()
    const idKey = String(c.id || '')
    return !deletedSlugs.has(slugKey) && !deletedSlugs.has(idKey)
  })
}

export const getCourseBySlugMerged = (slug, apiCourses = []) => {
  const all = getAllCoursesMerged(apiCourses)
  return all.find(c => (c.slug || '').toLowerCase() === (slug || '').toLowerCase()) || null
}


