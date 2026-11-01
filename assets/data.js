/* Seed data for the prototype.
 * Every listing below is an ILLUSTRATIVE SAMPLE — not a real group, provider or organization.
 * Replace with approved partner data before any pilot. */
window.CFA_SEED = {
  categories: [
    {
      id: "work", name: "Work & Career", icon: "💼", pilot: true,
      blurb: "Burnout, career change, workplace challenges and professional communities.",
      topics: [
        { id: "burnout", name: "Stress & burnout" },
        { id: "transition", name: "Career transition & job loss" },
        { id: "conflict", name: "Workplace conflict & harassment" },
        { id: "return", name: "Returning to work" }
      ],
      audiences: [
        { id: "healthcare", name: "Healthcare", roles: ["Nurse", "Physician", "Allied health", "Home health aide"] },
        { id: "education", name: "Education", roles: ["Teacher", "Administrator", "Support staff"] },
        { id: "first-responders", name: "First responders", roles: ["Firefighter", "EMS", "Law enforcement", "Dispatcher"] },
        { id: "general", name: "Any profession", roles: [] }
      ]
    },
    {
      id: "education", name: "Education & Student Life", icon: "🎓", pilot: true,
      blurb: "Academic stress, belonging, first-generation students and transitions.",
      topics: [
        { id: "academic-stress", name: "Academic stress" },
        { id: "first-gen", name: "First-generation students" },
        { id: "belonging", name: "Loneliness & belonging" },
        { id: "next-steps", name: "Life after graduation" }
      ],
      audiences: [
        { id: "high-school", name: "High school (with guardian consent)", roles: [] },
        { id: "college", name: "College & university", roles: ["Undergraduate", "Graduate", "Adult learner"] },
        { id: "parents", name: "Parents of students", roles: [] }
      ]
    },
    {
      id: "disability", name: "Disability & Accessibility", icon: "♿", pilot: true,
      blurb: "Living with disability, navigating services, advocacy and independence.",
      topics: [
        { id: "new-diagnosis", name: "Adjusting to a new disability" },
        { id: "benefits", name: "Benefits & services navigation" },
        { id: "employment", name: "Employment & accommodations" },
        { id: "independent-living", name: "Independent living" }
      ],
      audiences: [
        { id: "self", name: "People with disabilities", roles: [] },
        { id: "family", name: "Family members", roles: [] },
        { id: "youth", name: "Youth & young adults", roles: [] }
      ]
    },
    {
      id: "caregiving", name: "Caregiving & Family Support", icon: "🤝", pilot: true,
      blurb: "Caring for aging parents, children with special needs and loved ones.",
      topics: [
        { id: "caregiver-stress", name: "Caregiver stress" },
        { id: "aging-parents", name: "Caring for aging parents" },
        { id: "special-needs", name: "Children with special needs" },
        { id: "respite", name: "Respite & practical help" }
      ],
      audiences: [
        { id: "adult-children", name: "Adult children", roles: [] },
        { id: "parents", name: "Parents", roles: [] },
        { id: "spouses", name: "Spouses & partners", roles: [] },
        { id: "working-caregivers", name: "Working caregivers", roles: ["Healthcare", "Education", "Other"] }
      ]
    },
    { id: "health", name: "Health & Wellness", icon: "🌿", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] },
    { id: "grief", name: "Grief & Loss", icon: "🕊️", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] },
    { id: "relationships", name: "Relationships", icon: "💬", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] },
    { id: "finances", name: "Finances & Housing", icon: "🏠", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] },
    { id: "military", name: "Veterans & Military Families", icon: "🎖️", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] },
    { id: "recovery", name: "Recovery", icon: "🌱", pilot: false, blurb: "Coming after the pilot.", topics: [], audiences: [] }
  ],

  groups: [
    {
      id: "g1", name: "Night Shift Nurses Circle", category: "work", topic: "burnout",
      audience: "healthcare", role: "Nurse", format: "online", privacy: "private",
      location: "Online (Ohio-based)", schedule: "Every other Tuesday, 8:00–9:00 AM (after night shift)",
      description: "A peer circle for nurses working nights or rotating shifts. We share what helps with fatigue, compassion fatigue and staying connected outside work.",
      expectations: "Cameras optional. Confidentiality agreement required. No patient-identifying details.",
      leader: "Peer facilitator (RN, trained in peer support)", status: "approved",
      reviewedAt: "2026-09-15", renewalDue: "2027-09-15", submittedBy: "seed"
    },
    {
      id: "g2", name: "Healthcare Workers Burnout Recovery", category: "work", topic: "burnout",
      audience: "healthcare", role: null, format: "in-person", privacy: "open",
      location: "Columbus, OH — community center meeting room", schedule: "First Thursday monthly, 6:30–8:00 PM",
      description: "Open drop-in group for anyone working in healthcare — clinical or non-clinical — who is feeling worn down.",
      expectations: "Drop in any month. Light refreshments. Respectful listening.",
      leader: "Co-led by two peer facilitators", status: "approved",
      reviewedAt: "2026-08-02", renewalDue: "2027-08-02", submittedBy: "seed"
    },
    {
      id: "g3", name: "Teachers Recharge", category: "work", topic: "burnout",
      audience: "education", role: "Teacher", format: "hybrid", privacy: "open",
      location: "Westerville, OH + online", schedule: "Sundays, 4:00–5:00 PM",
      description: "K–12 teachers supporting each other through the pressures of the school year.",
      expectations: "Come as you are. Hybrid: join in person or online.",
      leader: "Retired teacher & certified peer specialist", status: "approved",
      reviewedAt: "2026-10-01", renewalDue: "2027-10-01", submittedBy: "seed"
    },
    {
      id: "g4", name: "Career Changers Collective", category: "work", topic: "transition",
      audience: "general", role: null, format: "online", privacy: "open",
      location: "Online", schedule: "Wednesdays, 7:00–8:00 PM",
      description: "For anyone navigating job loss, a layoff or a deliberate career change.",
      expectations: "Weekly check-ins and accountability partners.",
      leader: "Volunteer facilitator", status: "approved",
      reviewedAt: "2026-07-20", renewalDue: "2026-11-20", submittedBy: "seed"
    },
    {
      id: "g5", name: "First-Gen Student Connect", category: "education", topic: "first-gen",
      audience: "college", role: null, format: "in-person", privacy: "open",
      location: "Columbus, OH — campus area library", schedule: "Mondays, 5:00–6:00 PM during the semester",
      description: "First-generation college students sharing tips, wins and frustrations.",
      expectations: "Students 18+. Student ID not required.",
      leader: "Graduate student peer mentor", status: "approved",
      reviewedAt: "2026-08-25", renewalDue: "2027-08-25", submittedBy: "seed"
    },
    {
      id: "g6", name: "Exam Season Support Circle", category: "education", topic: "academic-stress",
      audience: "college", role: null, format: "online", privacy: "open",
      location: "Online", schedule: "Thursdays, 9:00–9:45 PM",
      description: "A short, calm evening check-in for students managing academic pressure.",
      expectations: "Drop in as needed.",
      leader: "Peer mentor", status: "approved",
      reviewedAt: "2026-09-05", renewalDue: "2027-09-05", submittedBy: "seed"
    },
    {
      id: "g7", name: "Navigating Benefits Together", category: "disability", topic: "benefits",
      audience: "self", role: null, format: "hybrid", privacy: "open",
      location: "Grove City, OH + online", schedule: "Second Saturday monthly, 10:00–11:30 AM",
      description: "Peers helping peers understand benefit applications, appeals and service systems.",
      expectations: "Wheelchair-accessible venue. Live captions provided online.",
      leader: "Disability peer advocate", status: "approved",
      reviewedAt: "2026-06-30", renewalDue: "2027-06-30", submittedBy: "seed"
    },
    {
      id: "g8", name: "Parents of Children with Special Needs", category: "caregiving", topic: "special-needs",
      audience: "parents", role: null, format: "in-person", privacy: "private",
      location: "Dublin, OH", schedule: "Every other Monday, 7:00–8:30 PM",
      description: "A private circle for parents and guardians raising children with disabilities or complex medical needs.",
      expectations: "Brief intake call with the facilitator before joining.",
      leader: "Parent peer facilitator", status: "approved",
      reviewedAt: "2026-09-12", renewalDue: "2027-09-12", submittedBy: "seed"
    },
    {
      id: "g9", name: "Working Caregivers Lunch Break", category: "caregiving", topic: "caregiver-stress",
      audience: "working-caregivers", role: null, format: "online", privacy: "open",
      location: "Online", schedule: "Fridays, 12:15–12:45 PM",
      description: "A 30-minute lunchtime group for people balancing a job with caring for a loved one.",
      expectations: "Short and practical. Cameras optional.",
      leader: "Caregiver peer facilitator", status: "approved",
      reviewedAt: "2026-10-10", renewalDue: "2027-10-10", submittedBy: "seed"
    },
    {
      id: "g10", name: "Caring for Mom & Dad", category: "caregiving", topic: "aging-parents",
      audience: "adult-children", role: null, format: "in-person", privacy: "open",
      location: "Westerville, OH", schedule: "Third Tuesday monthly, 6:00–7:30 PM",
      description: "Adult children supporting aging parents — sharing resources and encouragement.",
      expectations: "Open to all adult children and in-laws.",
      leader: "Volunteer facilitator", status: "approved",
      reviewedAt: "2026-05-18", renewalDue: "2026-11-18", submittedBy: "seed"
    },
    {
      id: "g11", name: "ER Nurses Decompression Group", category: "work", topic: "burnout",
      audience: "healthcare", role: "Nurse", format: "in-person", privacy: "private",
      location: "Columbus, OH", schedule: "Proposed: monthly Saturdays",
      description: "Proposed peer group for emergency department nurses.",
      expectations: "Confidentiality agreement required.",
      leader: "Applicant: ED charge nurse", status: "pending",
      reviewedAt: null, renewalDue: null, submittedBy: "seed",
      application: { credentials: "RN, 9 years ED experience; completed peer-support facilitator training (certificate attached).", organization: "Independent" }
    }
  ],

  professionals: [
    {
      id: "p1", name: "Jordan Ellis", title: "Licensed Professional Clinical Counselor (LPCC)",
      credentials: "LPCC, MA Clinical Mental Health Counseling", licenseVerified: true, licenseState: "OH",
      categories: ["work", "caregiving"], topics: ["burnout", "caregiver-stress"], audiences: ["healthcare", "working-caregivers"],
      specialties: ["Healthcare worker burnout", "Compassion fatigue", "Caregiver stress"],
      area: "Columbus, OH", online: true, inPerson: true,
      fees: "$120–$150 per session; sliding scale available", insurance: "Several major plans accepted — confirm with provider",
      bookingUrl: "https://example.org/booking/jordan-ellis", sponsored: true, status: "approved"
    },
    {
      id: "p2", name: "Priya Raman", title: "Certified Career Coach",
      credentials: "Certified career coach (credentialing body listed on profile)", licenseVerified: false, licenseState: null,
      categories: ["work", "education"], topics: ["transition", "next-steps", "return"], audiences: ["general", "college"],
      specialties: ["Career change", "Returning to work", "New graduates"],
      area: "Online — serves all of Ohio", online: true, inPerson: false,
      fees: "$90 per session; free 20-minute consult", insurance: "Not applicable",
      bookingUrl: "https://example.org/booking/priya-raman", sponsored: false, status: "approved"
    },
    {
      id: "p3", name: "Marcus Bell", title: "Licensed Independent Social Worker (LISW-S)",
      credentials: "LISW-S, MSW", licenseVerified: true, licenseState: "OH",
      categories: ["disability", "caregiving"], topics: ["benefits", "new-diagnosis", "special-needs", "aging-parents"], audiences: ["self", "family", "parents", "adult-children"],
      specialties: ["Disability adjustment", "Family systems", "Care planning"],
      area: "Dublin & Columbus, OH", online: true, inPerson: true,
      fees: "$110 per session", insurance: "Medicaid and several commercial plans",
      bookingUrl: "https://example.org/booking/marcus-bell", sponsored: false, status: "approved"
    },
    {
      id: "p4", name: "Dr. Alana Cho", title: "Licensed Psychologist",
      credentials: "PhD, Licensed Psychologist", licenseVerified: true, licenseState: "OH",
      categories: ["work", "education"], topics: ["burnout", "academic-stress", "conflict"], audiences: ["healthcare", "education", "first-responders", "college"],
      specialties: ["Occupational stress", "First responder wellness", "Student anxiety"],
      area: "Westerville, OH", online: true, inPerson: true,
      fees: "$160 per session", insurance: "Out-of-network superbills provided",
      bookingUrl: "https://example.org/booking/alana-cho", sponsored: false, status: "approved"
    },
    {
      id: "p5", name: "Sam Okafor", title: "Certified Rehabilitation Counselor",
      credentials: "CRC (pending verification)", licenseVerified: false, licenseState: "OH",
      categories: ["disability"], topics: ["employment"], audiences: ["self", "youth"],
      specialties: ["Workplace accommodations", "Vocational planning"],
      area: "Grove City, OH", online: true, inPerson: true,
      fees: "$85 per session", insurance: "Contact for details",
      bookingUrl: "https://example.org/booking/sam-okafor", sponsored: false, status: "pending",
      application: { licenseNumber: "CRC-000000 (sample)", notes: "Requests verification of national certification." }
    }
  ],

  resources: [
    {
      id: "r1", name: "Central Ohio Caregiver Respite Program", org: "Sample Area Agency (illustrative)",
      categories: ["caregiving"], topics: ["respite", "aging-parents", "caregiver-stress"],
      description: "Short-term respite care so family caregivers can rest, work or attend appointments.",
      serves: "Family caregivers of adults 60+ in Central Ohio counties",
      services: "In-home respite hours, adult day program referrals, caregiver training",
      eligibility: "Caregiver of an adult 60+ residing in the service area; income not required",
      location: "Columbus, OH (serves surrounding counties)", contact: "(555) 010-0101",
      website: "https://example.org/respite", lastReviewed: "2026-09-30", status: "approved"
    },
    {
      id: "r2", name: "Healthcare Worker Wellbeing Toolkit", org: "Sample Nursing Association (illustrative)",
      categories: ["work"], topics: ["burnout"],
      description: "Practical guides on fatigue management, peer support and talking with leadership about workload.",
      serves: "Nurses and healthcare staff",
      services: "Downloadable guides, webinar recordings, employer conversation templates",
      eligibility: "Free and open to all",
      location: "Online", contact: "info@example.org",
      website: "https://example.org/toolkit", lastReviewed: "2026-10-12", status: "approved"
    },
    {
      id: "r3", name: "Disability Benefits Navigation Clinic", org: "Sample Legal Aid (illustrative)",
      categories: ["disability"], topics: ["benefits", "employment"],
      description: "Free help understanding disability benefit applications, appeals and work incentives.",
      serves: "Adults with disabilities and their families",
      services: "One-on-one navigation appointments, appeal guidance, workshops",
      eligibility: "Ohio residents; income limits may apply for some services",
      location: "Columbus, OH + phone appointments", contact: "(555) 010-0202",
      website: "https://example.org/benefits", lastReviewed: "2026-08-20", status: "approved"
    },
    {
      id: "r4", name: "Campus Basic Needs Directory", org: "Sample Student Services (illustrative)",
      categories: ["education"], topics: ["first-gen", "academic-stress", "belonging"],
      description: "Food pantries, emergency grants, tutoring and counseling options for students.",
      serves: "College students in Central Ohio",
      services: "Directory, emergency aid application links",
      eligibility: "Currently enrolled students",
      location: "Columbus, OH", contact: "help@example.org",
      website: "https://example.org/basic-needs", lastReviewed: "2026-09-01", status: "approved"
    },
    {
      id: "r5", name: "Workplace Rights Know-Your-Options Guide", org: "Sample Worker Center (illustrative)",
      categories: ["work"], topics: ["conflict", "return", "transition"],
      description: "Plain-language explanations of workplace leave, accommodation and complaint options.",
      serves: "Workers in Ohio",
      services: "Guides, monthly free info sessions",
      eligibility: "Free and open to all",
      location: "Online", contact: "guide@example.org",
      website: "https://example.org/workplace", lastReviewed: "2026-07-14", status: "approved"
    },
    {
      id: "r6", name: "Family Special Needs Resource Line", org: "Sample Family Network (illustrative)",
      categories: ["caregiving", "disability"], topics: ["special-needs", "benefits"],
      description: "Phone line staffed by trained parent navigators.",
      serves: "Families of children with disabilities",
      services: "Referrals, IEP preparation support, parent-to-parent matching",
      eligibility: "Ohio families",
      location: "Phone & online", contact: "(555) 010-0303",
      website: "https://example.org/family-line", lastReviewed: "2026-10-05", status: "pending"
    }
  ],

  events: [
    { id: "e1", title: "Burnout First Aid for Healthcare Workers (workshop)", date: "2026-11-12", time: "6:30 PM", format: "online", category: "work", host: "Sample Nursing Association (illustrative)", capacity: 50, registered: 18 },
    { id: "e2", title: "Caregiver Resource Fair", date: "2026-11-21", time: "10:00 AM", format: "in-person", location: "Columbus, OH", category: "caregiving", host: "Community partners (illustrative)", capacity: 200, registered: 64 },
    { id: "e3", title: "Accommodations at Work: Q&A", date: "2026-12-03", time: "7:00 PM", format: "online", category: "disability", host: "Sample Legal Aid (illustrative)", capacity: 80, registered: 22 },
    { id: "e4", title: "Finals Week Decompress Night", date: "2026-12-08", time: "8:00 PM", format: "hybrid", location: "Columbus, OH + online", category: "education", host: "Peer mentors (illustrative)", capacity: 40, registered: 9 }
  ]
};
