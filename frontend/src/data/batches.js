/* ─────────────────────────────────────────────────────────
   batches.js – Batch schedule data for Thillai Martial Arts
   ───────────────────────────────────────────────────────── */

export const BATCHES = [
  {
    id: 1,
    name: 'Martial Arts Batch',
    courses: ['Taekwondo', 'Boxing', 'Silambam'],
    courseSlugs: ['taekwondo', 'boxing', 'silambam'],
    days: 'Monday, Wednesday, Friday',
    daysShort: ['Mon', 'Wed', 'Fri'],
    time: '6:30 PM – 9:00 PM',
    holiday: 'Sunday Holiday',
    holidayNote: 'Sunday is a weekly holiday',
    icon: '🥋',
    color: '#3F72AF',
    description:
      "Our flagship martial arts batch covering Korea's Taekwondo, Western Boxing, and ancient Tamil Silambam under Master R. HariHaran.",
  },
  {
    id: 2,
    name: 'Yoga & Wellness Batch',
    courses: ['Yoga', 'Guitar'],
    courseSlugs: ['yoga', 'guitar'],
    days: 'Tuesday, Thursday, Saturday',
    daysShort: ['Tue', 'Thu', 'Sat'],
    time: '6:30 PM – 9:00 PM',
    holiday: 'Sunday Holiday',
    holidayNote: 'Sunday is a weekly holiday',
    icon: '🧘',
    color: '#8B5CF6',
    description:
      'Holistic physical wellness, classical asanas, flexibility, breathing, and creative discipline to develop the complete individual.',
  },
  {
    id: 3,
    name: 'Daily Fitness & Hindi Batch',
    courses: ['Fitness', 'Hindi'],
    courseSlugs: ['fitness', 'hindi'],
    days: 'Daily (Monday – Saturday)',
    daysShort: ['Mon–Sat (Daily)'],
    time: '6:30 PM – 9:00 PM',
    holiday: 'Sunday Holiday',
    holidayNote: 'Sunday is a weekly holiday',
    icon: '⚡',
    color: '#10B981',
    description:
      'Daily fitness conditioning, core stamina, and structured Hindi language coaching conducted every day except Sunday.',
  },
  {
    id: 4,
    name: 'Weekend Chess & English Grammar Batch',
    courses: ['Chess', 'English Grammar'],
    courseSlugs: ['chess', 'english-grammar'],
    days: 'Saturday, Sunday',
    daysShort: ['Sat', 'Sun'],
    time: 'Morning / Evening (According to school presence)',
    timingNote: 'Morning or Evening batches on Saturday & Sunday scheduled according to school presence',
    holiday: 'Classes Active on Sunday (No Holiday)',
    holidayNote: 'Open on Sunday — No Sunday holiday for Chess & English Grammar',
    icon: '♟️',
    color: '#F59E0B',
    description:
      'Strategic thinking in Chess and comprehensive English grammar coaching conducted on weekends with flexible morning or evening timings based on school presence.',
  },
]

export const GENERAL_SCHEDULE_INFO = {
  weekdayTiming: 'Regular batches run 6:30 PM – 9:00 PM.',
  weekendTiming: 'Chess and English Grammar batches run on Saturday and Sunday with Morning / Evening timings arranged according to school presence.',
  holidayRule: 'Sunday is a holiday for all programs except English Grammar and Chess (which run on Saturday & Sunday).',
}

export const getBatchForCourse = (courseSlug) => {
  const slug = (courseSlug || '').toLowerCase()
  return BATCHES.find(b => b.courseSlugs.includes(slug)) || null
}

export const getBatchById = (id) =>
  BATCHES.find(b => b.id === Number(id)) || null

/* Fee calculation */
export const FEE_PER_COURSE = 300

export const calculateFees = (selectedCourseSlugs = []) => {
  const count  = selectedCourseSlugs.length
  const total  = count * FEE_PER_COURSE
  return { count, total, perCourse: FEE_PER_COURSE }
}
