export interface TreatmentRecord {
  id: string
  type: "injection" | "laser" | "surgery" | "facial" | "other"
  name: string
  date: string
  doctor: {
    name: string
    specialty: string
    clinic: string
    avatar?: string
  }
  description: string
  area: string
  cost: number
  beforePhoto?: string
  afterPhoto?: string
  notes?: string
  nextAppointment?: string
  status: "completed" | "scheduled" | "follow-up"
}

export const treatmentHistory: TreatmentRecord[] = [
  {
    id: "1",
    type: "injection",
    name: "Botox Forehead Treatment",
    date: "2024-03-15",
    doctor: {
      name: "Dr. Emily Chen",
      specialty: "Dermatologist",
      clinic: "Radiance Medical Spa",
      avatar: "/female-doctor.png",
    },
    description: "Botulinum toxin injection to reduce forehead lines and wrinkles",
    area: "Forehead, Glabella",
    cost: 450,
    beforePhoto: "/woman-forehead-wrinkles-before.jpg",
    afterPhoto: "/woman-smooth-forehead-after.jpg",
    notes: "20 units administered. Results visible within 3-5 days. Effects last 3-4 months.",
    nextAppointment: "2024-06-15",
    status: "completed",
  },
  {
    id: "2",
    type: "laser",
    name: "Fractional CO2 Laser Resurfacing",
    date: "2024-02-20",
    doctor: {
      name: "Dr. Michael Zhang",
      specialty: "Aesthetic Medicine Specialist",
      clinic: "Elite Skin Clinic",
      avatar: "/male-doctor.png",
    },
    description: "Laser treatment for skin texture improvement and pigmentation reduction",
    area: "Full Face",
    cost: 1200,
    beforePhoto: "/woman-face-pigmentation-before.jpg",
    afterPhoto: "/woman-clear-skin-after.jpg",
    notes: "3 sessions recommended. Downtime: 5-7 days. Use SPF 50+ daily.",
    nextAppointment: "2024-05-20",
    status: "completed",
  },
  {
    id: "3",
    type: "injection",
    name: "Hyaluronic Acid Dermal Fillers",
    date: "2024-01-10",
    doctor: {
      name: "Dr. Sarah Williams",
      specialty: "Cosmetic Dermatologist",
      clinic: "Beauty & Wellness Center",
      avatar: "/female-dermatologist.png",
    },
    description: "Dermal filler injection for volume restoration and contouring",
    area: "Cheeks, Nasolabial Folds",
    cost: 800,
    beforePhoto: "/woman-face-volume-loss-before.jpg",
    afterPhoto: "/woman-face-lifted-after.jpg",
    notes: "1.5ml used. Results last 12-18 months. Minimal swelling for 2-3 days.",
    status: "completed",
  },
  {
    id: "4",
    type: "facial",
    name: "HydraFacial MD Treatment",
    date: "2023-12-05",
    doctor: {
      name: "Dr. Emily Chen",
      specialty: "Dermatologist",
      clinic: "Radiance Medical Spa",
      avatar: "/female-doctor.png",
    },
    description: "Deep cleansing, exfoliation, and hydration facial treatment",
    area: "Full Face",
    cost: 250,
    beforePhoto: "/woman-dull-skin-before.jpg",
    afterPhoto: "/woman-glowing-skin-after.jpg",
    notes: "Monthly treatments recommended for optimal results. No downtime.",
    nextAppointment: "2024-04-05",
    status: "completed",
  },
  {
    id: "5",
    type: "laser",
    name: "IPL Photofacial",
    date: "2023-11-15",
    doctor: {
      name: "Dr. Michael Zhang",
      specialty: "Aesthetic Medicine Specialist",
      clinic: "Elite Skin Clinic",
      avatar: "/male-doctor.png",
    },
    description: "Intense pulsed light therapy for sun damage and redness reduction",
    area: "Face, Neck",
    cost: 400,
    beforePhoto: "/woman-sun-damage-before.jpg",
    afterPhoto: "/woman-even-skin-tone-after.jpg",
    notes: "Series of 3-5 treatments recommended. Avoid sun exposure for 2 weeks.",
    status: "completed",
  },
  {
    id: "6",
    type: "injection",
    name: "PRP Microneedling",
    date: "2024-04-10",
    doctor: {
      name: "Dr. Sarah Williams",
      specialty: "Cosmetic Dermatologist",
      clinic: "Beauty & Wellness Center",
      avatar: "/female-dermatologist.png",
    },
    description: "Platelet-rich plasma with microneedling for skin rejuvenation",
    area: "Full Face",
    cost: 650,
    notes: "Follow-up session scheduled. Use gentle skincare for 1 week.",
    nextAppointment: "2024-07-10",
    status: "scheduled",
  },
]
