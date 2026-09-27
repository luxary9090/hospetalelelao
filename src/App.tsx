import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'home' | 'search' | 'results' | 'details' | 'map' | 'arrived'

interface Dept {
  id: string
  name: string
  floor: number
  wing: string
  building: string
  room: string
  description: string
  keywords: string[]
  walkMinutes: number
  category: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEPARTMENTS: Dept[] = [
  {
    id: 'cardiology',
    name: 'Cardiology Department',
    floor: 3, wing: 'B', building: 'Main Building', room: '3B-04',
    description: 'Heart and cardiovascular care, diagnosis, and outpatient consultations. Open Monday–Friday, 08:00–18:00.',
    keywords: ['cardiology', 'heart', 'cardiovascular', 'cardiac', 'ecg', 'cardiologist'],
    walkMinutes: 8, category: 'Clinical',
  },
  {
    id: 'cardio-clinic',
    name: 'Cardiology Outpatient Clinic',
    floor: 2, wing: 'A', building: 'Main Building', room: '2A-12',
    description: 'Scheduled outpatient appointments, ECG monitoring, and cardiac follow-up care.',
    keywords: ['cardiology', 'outpatient', 'ecg', 'heart', 'clinic', 'appointment', 'cardiac'],
    walkMinutes: 5, category: 'Outpatient',
  },
  {
    id: 'cardiac-icu',
    name: 'Cardiac Intensive Care Unit',
    floor: 4, wing: 'C', building: 'Main Building', room: '4C-01',
    description: 'Specialised critical care for patients with acute cardiac conditions.',
    keywords: ['cardiac', 'icu', 'intensive', 'cardiology', 'heart', 'critical'],
    walkMinutes: 12, category: 'ICU',
  },
  {
    id: 'emergency',
    name: 'Emergency Department',
    floor: 1, wing: 'A', building: 'Main Building', room: '1A-01',
    description: 'Immediate emergency medical care for acute and life-threatening conditions. Open 24 hours.',
    keywords: ['emergency', 'urgent', 'er', 'accident', 'crisis', 'a&e', 'ambulance'],
    walkMinutes: 2, category: 'Emergency',
  },
  {
    id: 'radiology',
    name: 'Radiology & Imaging',
    floor: 2, wing: 'B', building: 'Main Building', room: '2B-08',
    description: 'X-ray, MRI, CT scan, and ultrasound diagnostic imaging services.',
    keywords: ['radiology', 'xray', 'x-ray', 'mri', 'ct', 'scan', 'imaging', 'ultrasound'],
    walkMinutes: 6, category: 'Diagnostic',
  },
  {
    id: 'pharmacy',
    name: 'Main Pharmacy',
    floor: 1, wing: 'A', building: 'Main Building', room: '1A-05',
    description: 'Prescription dispensing, over-the-counter medications, and medication advice.',
    keywords: ['pharmacy', 'medicine', 'prescription', 'medication', 'drugs', 'dispensing'],
    walkMinutes: 3, category: 'Services',
  },
  {
    id: 'laboratory',
    name: 'Clinical Laboratory',
    floor: 1, wing: 'B', building: 'Main Building', room: '1B-10',
    description: 'Blood tests, urinalysis, biopsies, and full pathology and diagnostic services.',
    keywords: ['lab', 'laboratory', 'blood', 'test', 'pathology', 'biopsy', 'urine', 'sample'],
    walkMinutes: 4, category: 'Diagnostic',
  },
  {
    id: 'ortho',
    name: 'Orthopaedics Department',
    floor: 3, wing: 'A', building: 'Main Building', room: '3A-06',
    description: 'Bone, joint, and musculoskeletal disorders including fractures, arthritis, and sports injuries.',
    keywords: ['orthopaedics', 'orthopedics', 'bone', 'joint', 'fracture', 'knee', 'hip', 'spine', 'sports'],
    walkMinutes: 7, category: 'Clinical',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    floor: 4, wing: 'A', building: 'Main Building', room: '4A-03',
    description: 'Diagnosis and treatment of brain, spinal cord, and nervous system disorders.',
    keywords: ['neurology', 'brain', 'nerve', 'neurological', 'headache', 'spinal', 'migraine', 'epilepsy'],
    walkMinutes: 11, category: 'Clinical',
  },
  {
    id: 'outpatient',
    name: 'Outpatient Registration',
    floor: 1, wing: 'A', building: 'Main Building', room: '1A-03',
    description: 'Outpatient check-in, appointment registration, and patient information services.',
    keywords: ['outpatient', 'registration', 'check-in', 'appointment', 'admin', 'register'],
    walkMinutes: 2, category: 'Admin',
  },
]

const ROUTE_STEPS = [
  {
    id: 1,
    instruction: 'Head to the main elevators',
    detail: 'From the main entrance, walk past the Reception desk. Elevators are on your left, approximately 30 metres ahead.',
    icon: '🚶',
  },
  {
    id: 2,
    instruction: 'Take the elevator to Floor 3',
    detail: 'Press button "3". This elevator serves the Main Building, Wings A and B.',
    icon: '🛗',
  },
  {
    id: 3,
    instruction: 'Exit the elevator and turn right',
    detail: 'You are now on Floor 3. Follow the Wing B signage along the Main Corridor.',
    icon: '↱',
  },
  {
    id: 4,
    instruction: 'Walk along Main Corridor',
    detail: 'Continue straight for approximately 50 metres. You will pass the Radiology and CT / MRI rooms on your right.',
    icon: '🚶',
  },
  {
    id: 5,
    instruction: 'Cardiology Department — on your right',
    detail: 'Look for the blue department sign. Enter through the double doors into Room 3B-04.',
    icon: '📍',
  },
]

const CAT_STYLE: Record<string, string> = {
  Clinical:   'bg-blue-50 text-blue-700 border-blue-100',
  Outpatient: 'bg-violet-50 text-violet-700 border-violet-100',
  ICU:        'bg-red-50 text-red-700 border-red-100',
  Emergency:  'bg-rose-50 text-rose-700 border-rose-100',
  Diagnostic: 'bg-teal-50 text-teal-700 border-teal-100',
  Services:   'bg-emerald-50 text-emerald-700 border-emerald-100',
  Admin:      'bg-slate-100 text-slate-600 border-slate-200',
}

const DEPT_ICON: Record<string, string> = {
  Clinical: '🏥', Outpatient: '📋', ICU: '❤️',
  Emergency: '🚨', Diagnostic: '🔬', Services: '💊', Admin: '📝',
}

// SVG map: marker [x, y] per step index (Floor 3 Wing B)
const STEP_POS: [number, number][] = [
  [48, 216],  // step 0: at elevator
  [48, 216],  // step 1: taking elevator
  [100, 216], // step 2: exited elevator
  [370, 216], // step 3: mid-corridor
  [692, 110], // step 4: inside Cardiology
]

// Solid progress path per step
const PROG_PATH = [
  '',
  '',
  'M 48,216 H 100',
  'M 48,216 H 370',
  'M 48,216 H 692 V 110',
]

// ─── Search ───────────────────────────────────────────────────────────────────

function searchDepts(term: string): Dept[] {
  const t = term.toLowerCase().trim()
  if (!t) return []
  return DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(t) ||
    d.category.toLowerCase().includes(t) ||
    d.keywords.some(k => k.includes(t) || t.includes(k))
  )
}

// ─── Shared header ────────────────────────────────────────────────────────────

function AppHeader({
  title,
  sub,
  onBack,
  right,
}: {
  title: string
  sub: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  return (
    <header className="bg-blue-700 px-4 py-4 flex items-center gap-3 shrink-0">
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:bg-white/35 transition-colors shrink-0"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-base leading-tight truncate">{title}</p>
        <p className="text-blue-200 text-xs mt-0.5">{sub}</p>
      </div>
      {right}
    </header>
  )
}

// ─── SVG Floor Map ────────────────────────────────────────────────────────────

function HospitalMap({ step }: { step: number }) {
  const pos = STEP_POS[step] ?? STEP_POS[0]
  const progPath = PROG_PATH[step] ?? ''

  return (
    <svg
      viewBox="0 0 760 420"
      className="w-full block"
      role="img"
      aria-label="Hospital floor plan, Floor 3 Wing B. Your route runs from the elevator along Main Corridor to Cardiology Department."
    >
      {/* Background */}
      <rect width="760" height="420" fill="#F1F5F9" />

      {/* ── TOP ROOMS (y 8–172) ───────────────────────────────────── */}

      {/* Elevator bay */}
      <rect x="8" y="8" width="80" height="164" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="48" y="83" textAnchor="middle" fontSize="20" fontFamily="sans-serif">🛗</text>
      <text x="48" y="103" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">Elevator</text>
      <text x="48" y="117" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">Lift 3B</text>

      {/* Waiting Area */}
      <rect x="96" y="8" width="128" height="164" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="160" y="91" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">Waiting Area</text>
      <text x="160" y="107" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">3B–W1</text>

      {/* Radiology */}
      <rect x="232" y="8" width="138" height="164" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="301" y="89" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">Radiology</text>
      <text x="301" y="105" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">Room 3B-01</text>

      {/* CT / MRI */}
      <rect x="378" y="8" width="138" height="164" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="447" y="85" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">CT / MRI</text>
      <text x="447" y="101" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="DM Sans,system-ui,sans-serif">Imaging</text>
      <text x="447" y="118" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">Room 3B-02</text>

      {/* Nurse Station */}
      <rect x="524" y="8" width="100" height="164" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="574" y="88" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">Nurse</text>
      <text x="574" y="104" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="DM Sans,system-ui,sans-serif">Station</text>
      <text x="574" y="121" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">3B-NS</text>

      {/* CARDIOLOGY – destination */}
      <rect x="632" y="8" width="120" height="164" rx="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2.5" />
      <text x="692" y="68" textAnchor="middle" fill="#1E3A8A" fontSize="13" fontWeight="700" fontFamily="DM Sans,system-ui,sans-serif">Cardiology</text>
      <text x="692" y="86" textAnchor="middle" fill="#1E3A8A" fontSize="13" fontWeight="700" fontFamily="DM Sans,system-ui,sans-serif">Department</text>
      <text x="692" y="103" textAnchor="middle" fill="#3B82F6" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">Room 3B-04</text>

      {/* ── MAIN CORRIDOR (y 180–252) ────────────────────────────── */}
      <rect x="0" y="180" width="760" height="72" fill="#EFF6FF" />
      <line x1="0" y1="180" x2="760" y2="180" stroke="#BFDBFE" strokeWidth="1.5" />
      <line x1="0" y1="252" x2="760" y2="252" stroke="#BFDBFE" strokeWidth="1.5" />
      <text x="14" y="200" fill="#93C5FD" fontSize="8" fontWeight="500" fontFamily="DM Sans,system-ui,sans-serif" letterSpacing="1.5">MAIN CORRIDOR — FLOOR 3, WING B</text>

      {/* ── BOTTOM ROOMS (y 260–412) ─────────────────────────────── */}

      <rect x="8" y="260" width="80" height="152" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="48" y="344" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">Storage</text>

      <rect x="96" y="260" width="88" height="152" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="140" y="344" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">WC</text>

      <rect x="192" y="260" width="130" height="152" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="257" y="344" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">Staff Room</text>

      <rect x="330" y="260" width="120" height="152" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="390" y="337" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">Consultation</text>
      <text x="390" y="351" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">3B-05</text>

      <rect x="458" y="260" width="120" height="152" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="518" y="337" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">Consultation</text>
      <text x="518" y="351" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">3B-06</text>

      <rect x="586" y="260" width="166" height="152" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <text x="669" y="337" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans,system-ui,sans-serif">Consultation</text>
      <text x="669" y="351" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="DM Sans,system-ui,sans-serif">3B-07</text>

      {/* ── ROUTE ─────────────────────────────────────────────────── */}

      {/* Full route (dashed light-blue) */}
      <path
        d="M 48,216 H 692 V 110"
        stroke="#93C5FD"
        fill="none"
        strokeWidth="4"
        strokeDasharray="10,7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Progress (solid blue) */}
      {progPath && (
        <path
          d={progPath}
          stroke="#2563EB"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* ── MARKERS ───────────────────────────────────────────────── */}

      {/* Destination pin */}
      <circle cx="692" cy="30" r="12" fill="#EF4444" stroke="white" strokeWidth="3" />
      <text x="692" y="35" textAnchor="middle" fill="white" fontSize="11" fontFamily="sans-serif">●</text>

      {/* Current location — pulse ring + dot */}
      <circle cx={pos[0]} cy={pos[1]} r="22" fill="#10B981" fillOpacity="0.18" />
      <circle cx={pos[0]} cy={pos[1]} r="13" fill="#10B981" stroke="white" strokeWidth="3" />
      <text x={pos[0]} y={pos[1] + 4} textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="DM Sans,system-ui,sans-serif" letterSpacing="0.5">YOU</text>

      {/* ── LEGEND ────────────────────────────────────────────────── */}
      <rect x="8" y="398" width="174" height="16" rx="3" fill="white" fillOpacity="0.88" />
      <circle cx="22" cy="406" r="5" fill="#10B981" />
      <text x="32" y="410" fill="#475569" fontSize="8" fontFamily="DM Sans,system-ui,sans-serif">You are here</text>
      <circle cx="90" cy="406" r="5" fill="#EF4444" />
      <text x="100" y="410" fill="#475569" fontSize="8" fontFamily="DM Sans,system-ui,sans-serif">Destination</text>

      {/* Floor badge */}
      <rect x="578" y="398" width="174" height="16" rx="3" fill="white" fillOpacity="0.88" />
      <text x="588" y="410" fill="#475569" fontSize="8" fontWeight="600" fontFamily="DM Sans,system-ui,sans-serif">Floor 3 · Wing B · Main Building</text>
    </svg>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ onStart }: { onStart: () => void }) {
  const quickTiles = [
    { label: 'Emergency', sub: 'Floor 1, Wing A', icon: '🚨', bg: 'bg-rose-50 border-rose-100 text-rose-900' },
    { label: 'Pharmacy', sub: 'Floor 1, Wing A', icon: '💊', bg: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
    { label: 'Outpatient', sub: 'Floor 1, Wing A', icon: '📋', bg: 'bg-violet-50 border-violet-100 text-violet-900' },
    { label: 'Laboratory', sub: 'Floor 1, Wing B', icon: '🔬', bg: 'bg-teal-50 border-teal-100 text-teal-900' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-700 px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-base leading-tight">St. Mary's University Hospital</p>
          <p className="text-blue-200 text-xs mt-0.5">Indoor Navigation System</p>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-700 to-blue-600 px-6 pt-8 pb-14">
        <h1 className="text-white text-[2rem] font-bold leading-tight mb-2">Find Your Way</h1>
        <p className="text-blue-100 text-base leading-relaxed max-w-xs">
          Search for any department or clinic and get clear, step-by-step directions.
        </p>
      </div>

      {/* Search card overlapping hero */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/10 border border-slate-100 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Where do you need to go?
          </p>
          <button
            onClick={onStart}
            className="w-full flex items-center gap-3 bg-slate-100 hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent text-slate-400 hover:text-blue-600 px-4 py-3.5 rounded-xl transition-all text-left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-sm">Search departments, e.g. Cardiology…</span>
          </button>
        </div>
      </div>

      {/* Quick access tiles */}
      <main className="flex-1 px-5 py-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Access</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickTiles.map(tile => (
            <button
              key={tile.label}
              onClick={onStart}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-100 ${tile.bg}`}
            >
              <span className="text-2xl shrink-0">{tile.icon}</span>
              <div className="text-left min-w-0">
                <p className="font-semibold text-sm leading-tight">{tile.label}</p>
                <p className="text-xs opacity-60 mt-0.5 truncate">{tile.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex gap-3 items-start">
          <span className="text-lg shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Need assistance?</p>
            <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
              Speak to any staff member at reception, or call the hospital information line:{' '}
              <span className="font-semibold">01 234 5678</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-300 border-t border-slate-100 shrink-0">
        St. Mary's University Hospital · Dublin 4
      </footer>
    </div>
  )
}

// ─── Search Screen ────────────────────────────────────────────────────────────

function SearchScreen({ onBack, onSearch }: { onBack: () => void; onSearch: (q: string) => void }) {
  const [q, setQ] = useState('')

  function submit(val?: string) {
    const v = (val ?? q).trim()
    if (v) onSearch(v)
  }

  const chips = ['Emergency', 'Pharmacy', 'Cardiology', 'Radiology', 'Laboratory', 'Outpatient', 'Orthopaedics', 'Neurology']

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AppHeader title="Search Departments" sub="St. Mary's University Hospital" onBack={onBack} />

      <main className="flex-1 px-5 py-6 flex flex-col">
        {/* Input */}
        <div className="relative mb-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="e.g. Cardiology, X-ray, Pharmacy…"
            autoFocus
            className="w-full bg-slate-100 focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl pl-12 pr-10 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              aria-label="Clear"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={() => submit()}
          disabled={!q.trim()}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-4 rounded-2xl transition-colors text-base mb-8"
        >
          Search
        </button>

        {/* Popular chips */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Departments</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => submit(chip)}
              className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 border border-transparent text-slate-700 text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-auto bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <span className="text-lg shrink-0">💡</span>
          <p className="text-sm text-amber-800 leading-relaxed">
            You can search by department name, medical specialty, or type of service — e.g. "blood test", "heart", or "scan".
          </p>
        </div>
      </main>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  query, results, loading, onBack, onSelect, onNewSearch,
}: {
  query: string; results: Dept[]; loading: boolean; onBack: () => void
  onSelect: (d: Dept) => void; onNewSearch: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader
        title="Search Results"
        sub={`"${query}"`}
        onBack={onBack}
        right={
          <button onClick={onNewSearch} className="text-blue-100 hover:text-white text-sm font-medium transition-colors shrink-0">
            New Search
          </button>
        }
      />

      <main className="flex-1 px-5 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Searching departments…</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="text-6xl mb-5">🔍</span>
            <p className="font-bold text-slate-900 text-xl mb-2">No results found</p>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              No departments matched "{query}". Try a different spelling or search term.
            </p>
            <button
              onClick={onNewSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-3">
              <span className="font-semibold text-slate-800">{results.length}</span>{' '}
              {results.length === 1 ? 'result' : 'results'} found
            </p>
            <div className="flex flex-col gap-3">
              {results.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => onSelect(dept)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-2xl shrink-0 transition-colors border border-slate-100">
                      {DEPT_ICON[dept.category] ?? '🏥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 text-[15px] group-hover:text-blue-700 transition-colors leading-tight">
                          {dept.name}
                        </p>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap">
                          ~{dept.walkMinutes} min
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Floor {dept.floor}, Wing {dept.wing} · Room {dept.room}
                      </p>
                      <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${CAT_STYLE[dept.category] ?? CAT_STYLE.Admin}`}>
                        {dept.category}
                      </span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 mt-1">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ─── Details Screen ───────────────────────────────────────────────────────────

function DetailsScreen({ dept, onBack, onStart }: { dept: Dept; onBack: () => void; onStart: () => void }) {
  const locationRows = [
    { icon: '🏢', label: 'Building', value: dept.building },
    { icon: '📍', label: 'Floor & Wing', value: `Floor ${dept.floor}, Wing ${dept.wing}` },
    { icon: '🚪', label: 'Room Number', value: dept.room },
  ]

  const routeOverview = [
    'Main Entrance',
    `Elevator → Floor ${dept.floor}`,
    `Wing ${dept.wing} Corridor`,
    `Room ${dept.room}`,
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader title="Destination Details" sub={dept.building} onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* Department card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 animate-slide-up">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shrink-0">
              {DEPT_ICON[dept.category] ?? '🏥'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{dept.name}</h1>
              <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${CAT_STYLE[dept.category] ?? CAT_STYLE.Admin}`}>
                {dept.category}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">{dept.description}</p>

          <div className="flex flex-col gap-2">
            {locationRows.map(row => (
              <div key={row.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-lg">{row.icon}</span>
                <div>
                  <p className="text-xs text-slate-400">{row.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey time card */}
        <div className="bg-blue-700 rounded-2xl p-5 text-white">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">Estimated Walking Time</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold leading-none">{dept.walkMinutes}</p>
              <p className="text-blue-200 text-sm mt-1">minutes from main entrance</p>
            </div>
            <span className="text-5xl">🚶</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-blue-200 text-xs">
            <span>🛗</span>
            <span>Via elevator · Floor {dept.floor} · Wing {dept.wing}</span>
          </div>
        </div>

        {/* Route overview */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Route Overview</p>
          <div className="flex flex-col">
            {routeOverview.map((label, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === routeOverview.length - 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    {i + 1}
                  </div>
                  {i < routeOverview.length - 1 && (
                    <div className="w-0.5 h-5 bg-blue-100 mt-1" />
                  )}
                </div>
                <p className={`text-sm pt-1.5 pb-4 ${i === routeOverview.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="bg-white border-t border-slate-200 px-5 py-4 shrink-0">
        <button
          onClick={onStart}
          className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-sm shadow-blue-200"
        >
          Start Navigation →
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">Tap to get step-by-step directions</p>
      </div>
    </div>
  )
}

// ─── Map Screen ───────────────────────────────────────────────────────────────

function MapScreen({
  dept, step, onBack, onNext, onPrev,
}: {
  dept: Dept; step: number; onBack: () => void; onNext: () => void; onPrev: () => void
}) {
  const rs = ROUTE_STEPS[step]
  const isLast = step === ROUTE_STEPS.length - 1
  const progress = Math.round(((step + 1) / ROUTE_STEPS.length) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-700 px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors shrink-0"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">
            Navigating to {dept.name}
          </p>
          <p className="text-blue-200 text-xs">Floor {dept.floor}, Wing {dept.wing} · Room {dept.room}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-blue-200 text-xs">Step</p>
          <p className="text-white font-bold text-sm">{step + 1}/{ROUTE_STEPS.length}</p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-2 bg-blue-100 shrink-0">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Map */}
      <div className="bg-slate-100 border-b border-slate-200 px-2 py-2 shrink-0">
        <HospitalMap step={step} />
      </div>

      {/* Current step */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl shrink-0">
              {rs.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Step {step + 1} of {ROUTE_STEPS.length}
              </p>
              <p className="font-bold text-slate-900 text-[15px] leading-snug">{rs.instruction}</p>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{rs.detail}</p>
            </div>
          </div>
        </div>

        {/* All steps list */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">All Steps</p>
          <div className="flex flex-col gap-1.5">
            {ROUTE_STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  i === step ? 'bg-blue-50 border border-blue-100' : ''
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <p className={`text-sm leading-tight ${
                  i === step ? 'font-semibold text-slate-900' : i < step ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {s.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="border-t border-slate-200 px-5 py-4 flex gap-3 shrink-0 bg-white">
        <button
          onClick={onPrev}
          disabled={step === 0}
          aria-label="Previous step"
          className="w-14 h-14 bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-lg shrink-0"
        >
          ←
        </button>
        <button
          onClick={onNext}
          className={`flex-1 font-bold py-4 rounded-2xl transition-colors text-white text-base ${
            isLast ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          {isLast ? '✓  I have arrived' : 'Next Step →'}
        </button>
      </div>
    </div>
  )
}

// ─── Arrived Screen ───────────────────────────────────────────────────────────

function ArrivedScreen({ dept, onReset }: { dept: Dept; onReset: () => void }) {
  const [rating, setRating] = useState<number | null>(null)
  const feedback = ['Sorry to hear that.', "We'll try to improve.", 'Glad to help!', 'Great to hear!', 'Wonderful!']
  const emojis = ['😞', '😐', '🙂', '😊', '😃']

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center animate-slide-up">
        {/* Success ring */}
        <div className="w-28 h-28 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="text-[2rem] font-bold text-slate-900 mb-2">You've Arrived!</h1>
        <p className="text-slate-500 text-base mb-8">You have reached your destination.</p>

        {/* Destination card */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 text-left mb-5">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">Destination</p>
          <p className="font-bold text-blue-900 text-lg leading-tight">{dept.name}</p>
          <p className="text-sm text-blue-700 mt-1">{dept.building}</p>
          <p className="text-sm text-blue-700">Floor {dept.floor}, Wing {dept.wing} · Room {dept.room}</p>
        </div>

        {/* Rating */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-4">How was your navigation experience?</p>
          <div className="flex justify-center gap-3">
            {emojis.map((e, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className={`w-11 h-11 rounded-full text-xl transition-all ${
                  rating === i + 1
                    ? 'bg-blue-100 ring-2 ring-blue-400 scale-110'
                    : 'hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          {rating !== null && (
            <p className="text-xs text-slate-500 text-center mt-3">
              {feedback[rating - 1]} Thank you for your feedback.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReset}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            Navigate Somewhere Else
          </button>
          <button
            onClick={onReset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 rounded-2xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Dept[]>([])
  const [selected, setSelected] = useState<Dept | null>(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  function handleSearch(q: string) {
    const t = q.trim()
    if (!t) return
    setQuery(t)
    setResults([])
    setLoading(true)
    setScreen('results')
    setTimeout(() => {
      setResults(searchDepts(t))
      setLoading(false)
    }, 500)
  }

  function handleSelect(d: Dept) {
    setSelected(d)
    setScreen('details')
  }

  function handleStartNav() {
    setStep(0)
    setScreen('map')
  }

  function handleNext() {
    if (step < ROUTE_STEPS.length - 1) setStep(s => s + 1)
    else setScreen('arrived')
  }

  function handlePrev() {
    setStep(s => Math.max(0, s - 1))
  }

  function handleBack() {
    const prev: Record<Screen, Screen> = {
      home: 'home', search: 'home', results: 'search',
      details: 'results', map: 'details', arrived: 'home',
    }
    setScreen(prev[screen])
  }

  function reset() {
    setScreen('home')
    setQuery('')
    setResults([])
    setSelected(null)
    setStep(0)
  }

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      <div key={screen} className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl shadow-slate-400/30 animate-fade-in">
        {screen === 'home' && (
          <HomeScreen onStart={() => setScreen('search')} />
        )}
        {screen === 'search' && (
          <SearchScreen onBack={handleBack} onSearch={handleSearch} />
        )}
        {screen === 'results' && (
          <ResultsScreen
            query={query} results={results} loading={loading}
            onBack={handleBack} onSelect={handleSelect}
            onNewSearch={() => setScreen('search')}
          />
        )}
        {screen === 'details' && selected && (
          <DetailsScreen dept={selected} onBack={handleBack} onStart={handleStartNav} />
        )}
        {screen === 'map' && selected && (
          <MapScreen dept={selected} step={step} onBack={handleBack} onNext={handleNext} onPrev={handlePrev} />
        )}
        {screen === 'arrived' && selected && (
          <ArrivedScreen dept={selected} onReset={reset} />
        )}
      </div>
    </div>
  )
}
