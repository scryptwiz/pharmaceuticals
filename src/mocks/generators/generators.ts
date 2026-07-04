function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  availabilitySlots: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  type: "Lab Report" | "Prescription" | "Vaccination" | "Discharge Summary";
  date: string;
  patientName: string;
  facility: string;
  notes: string;
}

const FIRST_NAMES = [
  "Aarav",
  "Ananya",
  "Vikram",
  "Priya",
  "Kabir",
  "Meera",
  "Rohan",
  "Aditi",
  "Dev",
  "Diya",
  "Siddharth",
  "Neha",
  "Arjun",
  "Kavya",
  "Rahul",
  "Riya",
  "Amit",
  "Pooja",
  "Sanjay",
  "Geeta",
];
const LAST_NAMES = [
  "Sharma",
  "Verma",
  "Patel",
  "Mehta",
  "Joshi",
  "Iyer",
  "Nair",
  "Rao",
  "Gupta",
  "Sen",
  "Singh",
  "Reddy",
  "Choudhury",
  "Das",
  "Banerjee",
  "Mishra",
  "Trivedi",
  "Kumar",
  "Prasad",
  "Shah",
];

const SPECIALTIES = [
  "Kayachikitsa (General Medicine)",
  "Shalya Tantra (Surgery)",
  "Shalakya Tantra (ENT & Ophthalmology)",
  "Kaumarbhritya (Pediatrics)",
  "Panchakarma (Detoxification)",
  "Rasayana (Rejuvenation)",
  "Prasuti Tantra (Obstetrics & Gynecology)",
  "Bhuta Vidya (Psychiatry)",
];

const PRODUCT_CATEGORIES = [
  "Herbal Supplements",
  "Wellness Oils",
  "Skin Care & Beauty",
  "Organic Foods",
  "Teas & Infusions",
  "Hair Care",
  "Digestive Care",
  "Immunity Boosters",
];
const ADJECTIVES = [
  "Organic",
  "Pure",
  "Traditional",
  "Natural",
  "Golden",
  "Ancient",
  "Soothing",
  "Healing",
  "Rejuvenating",
  "Active",
  "Daily",
  "Premium",
  "Wild-Harvested",
  "Authentic",
  "Fortified",
];
const NOUNS = [
  "Chyawanprash",
  "Ashwagandha",
  "Triphala",
  "Ghee",
  "Amla Juice",
  "Turmeric Extract",
  "Brahmi Syrup",
  "Neem Soap",
  "Sandalwood Oil",
  "Shilajit Capsule",
  "Tulsi Drops",
  "Aloe Vera Gel",
  "Kansa Wand",
  "Herbal Tea",
  "Dashmoolarishta",
];

const RECORD_TITLES = [
  "Bi-annual Blood Panel",
  "Post-Panchakarma Recovery Summary",
  "Allergy Screening Report",
  "Liver Function Test",
  "General Consultation Summary",
  "Cardiovascular Screening",
  "Thyroid Profile Report",
  "Immunity Level Analysis",
];
const FACILITIES = [
  "AyurHealth Center",
  "Vedic Life Clinic",
  "Sri Sri Wellness Sanctuary",
  "Patanjali Diagnostics",
  "Charaka Ayurvedic Hospital",
  "Nadi Pariksha Lab",
  "Sushruta Surgical Clinic",
];

export function generateDoctors(count = 5000): Doctor[] {
  const doctors: Doctor[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i + 1000;
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed + 1);
    const rand3 = seededRandom(seed + 2);
    const rand4 = seededRandom(seed + 3);

    const firstName = FIRST_NAMES[Math.floor(rand1 * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand2 * LAST_NAMES.length)];
    const specialty = SPECIALTIES[Math.floor(rand3 * SPECIALTIES.length)];
    const rating = parseFloat((4.0 + rand4 * 1.0).toFixed(1));
    const experience = Math.floor(rand1 * 30) + 3;

    const slots = [];
    const hours = [9, 10, 11, 14, 15, 16];
    for (let h = 0; h < hours.length; h++) {
      if (seededRandom(seed + 10 + h) > 0.4) {
        slots.push(`${hours[h].toString().padStart(2, "0")}:00`);
      }
    }

    doctors.push({
      id: `doc-${i + 1}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty,
      rating,
      experience,
      availabilitySlots: slots,
    });
  }
  return doctors;
}

export function generateProducts(count = 20000): Product[] {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i + 20000;
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed + 1);
    const rand3 = seededRandom(seed + 2);
    const rand4 = seededRandom(seed + 3);

    const adj = ADJECTIVES[Math.floor(rand1 * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(rand2 * NOUNS.length)];
    const category =
      PRODUCT_CATEGORIES[Math.floor(rand3 * PRODUCT_CATEGORIES.length)];
    const name = `${adj} ${noun} ${i + 1}`;
    const price = Math.floor(99 + rand4 * 4900);
    const stock = Math.floor(rand1 * 200);
    const rating = parseFloat((3.5 + rand2 * 1.5).toFixed(1));

    products.push({
      id: `prod-${i + 1}`,
      name,
      category,
      price,
      stock,
      rating,
      description: `Premium quality ${adj} ${noun} formulated using traditional Ayurvedic principles. Crafted with pure ingredients for optimal wellness and vitality.`,
    });
  }
  return products;
}

export function generateHealthRecords(count = 10000): HealthRecord[] {
  const records: HealthRecord[] = [];
  const recordTypes: HealthRecord["type"][] = [
    "Lab Report",
    "Prescription",
    "Vaccination",
    "Discharge Summary",
  ];

  // generate 2 years yecords
  const startDate = new Date(2024, 0, 1).getTime();
  const endDate = new Date(2026, 6, 1).getTime();
  const timeSpan = endDate - startDate;

  for (let i = 0; i < count; i++) {
    const seed = i + 50000;
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed + 1);
    const rand3 = seededRandom(seed + 2);
    const rand4 = seededRandom(seed + 3);

    const title = `${RECORD_TITLES[Math.floor(rand1 * RECORD_TITLES.length)]} #${i + 1}`;
    const type = recordTypes[Math.floor(rand2 * recordTypes.length)];
    const facility = FACILITIES[Math.floor(rand3 * FACILITIES.length)];
    const patientFirstName =
      FIRST_NAMES[Math.floor(rand4 * FIRST_NAMES.length)];
    const patientLastName = LAST_NAMES[Math.floor(rand1 * LAST_NAMES.length)];

    const recordTime = startDate + Math.floor(rand4 * timeSpan);
    const date = new Date(recordTime).toISOString().split("T")[0];

    records.push({
      id: `rec-${i + 1}`,
      title,
      type,
      date,
      patientName: `${patientFirstName} ${patientLastName}`,
      facility,
      notes: `Standard diagnostic report recorded at ${facility}. Vital stats checked, pulse analysis shows normal levels. Follow traditional recommendations.`,
    });
  }
  return records;
}
