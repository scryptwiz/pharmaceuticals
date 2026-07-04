import {
  Doctor,
  generateDoctors,
  generateHealthRecords,
  generateProducts,
  HealthRecord,
  Product,
} from "./generators/generators";

class MockDatabase {
  private doctors: Doctor[] = [];
  private products: Product[] = [];
  private records: HealthRecord[] = [];

  private productsByCategory = new Map<string, Product[]>();
  private doctorsBySpecialty = new Map<string, Doctor[]>();
  private productsById = new Map<string, Product>();
  private doctorsById = new Map<string, Doctor>();

  private productSearchIndex: { id: string; searchStr: string }[] = [];
  private doctorSearchIndex: { id: string; searchStr: string }[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    const start = Date.now();
    this.doctors = generateDoctors(5000);
    this.products = generateProducts(20000);
    this.records = generateHealthRecords(10000);

    // Product indices
    this.products.forEach((p) => {
      this.productsById.set(p.id, p);

      const cat = p.category.toLowerCase();
      if (!this.productsByCategory.has(cat)) {
        this.productsByCategory.set(cat, []);
      }
      this.productsByCategory.get(cat)!.push(p);

      this.productSearchIndex.push({
        id: p.id,
        searchStr: `${p.name.toLowerCase()} ${p.category.toLowerCase()} ${p.description.toLowerCase()}`,
      });
    });

    // Doctor indices
    this.doctors.forEach((d) => {
      this.doctorsById.set(d.id, d);

      const spec = d.specialty.toLowerCase();
      if (!this.doctorsBySpecialty.has(spec)) {
        this.doctorsBySpecialty.set(spec, []);
      }
      this.doctorsBySpecialty.get(spec)!.push(d);

      this.doctorSearchIndex.push({
        id: d.id,
        searchStr: `${d.name.toLowerCase()} ${d.specialty.toLowerCase()}`,
      });
    });
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctorsById.get(id);
  }

  getProductById(id: string): Product | undefined {
    return this.productsById.get(id);
  }

  getDoctors(query?: string, specialty?: string): Doctor[] {
    let filtered = this.doctors;

    if (specialty) {
      filtered = this.doctorsBySpecialty.get(specialty.toLowerCase()) || [];
    }

    if (query) {
      const q = query.toLowerCase();
      const matchedIds = new Set(
        this.doctorSearchIndex
          .filter((item) => item.searchStr.includes(q))
          .map((item) => item.id),
      );
      filtered = filtered.filter((d) => matchedIds.has(d.id));
    }

    return filtered;
  }

  getProducts(
    query?: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Product[] {
    let filtered = this.products;

    if (category) {
      filtered = this.productsByCategory.get(category.toLowerCase()) || [];
    }

    if (query) {
      const q = query.toLowerCase();
      const matchedIds = new Set(
        this.productSearchIndex
          .filter((item) => item.searchStr.includes(q))
          .map((item) => item.id),
      );
      filtered = filtered.filter((p) => matchedIds.has(p.id));
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice ?? 0;
      const max = maxPrice ?? Infinity;
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    return filtered;
  }

  getHealthRecords(query?: string, type?: string): HealthRecord[] {
    let filtered = this.records;

    if (type) {
      const t = type.toLowerCase();
      filtered = filtered.filter((r) => r.type.toLowerCase() === t);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q),
      );
    }

    return filtered;
  }
}

export const mockDb = new MockDatabase();
export type { Doctor, HealthRecord, Product };
