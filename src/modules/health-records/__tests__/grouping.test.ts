import { HealthRecord } from "../api/useHealthRecords";
import { groupRecordsByMonthYear } from "../utils/grouping";

describe("groupRecordsByMonthYear", () => {
  const mockRecords: HealthRecord[] = [
    {
      id: "rec-1",
      title: "Blood Test",
      type: "Lab Report",
      date: "2026-05-15",
      patientName: "John Doe",
      facility: "Clinic A",
      notes: "Some notes",
    },
    {
      id: "rec-2",
      title: "Prescription B",
      type: "Prescription",
      date: "2026-05-20",
      patientName: "John Doe",
      facility: "Clinic A",
      notes: "Some notes",
    },
    {
      id: "rec-3",
      title: "Vaccination C",
      type: "Vaccination",
      date: "2026-04-10",
      patientName: "John Doe",
      facility: "Clinic B",
      notes: "Some notes",
    },
  ];

  it("should group records by Month Year in correct structure", () => {
    const sections = groupRecordsByMonthYear(mockRecords);

    expect(sections).toHaveLength(2);

    expect(sections[0].title).toContain("May 2026");
    expect(sections[0].data).toHaveLength(2);

    expect(sections[0].data[0].id).toBe("rec-2");
    expect(sections[0].data[1].id).toBe("rec-1");

    expect(sections[1].title).toContain("April 2026");
    expect(sections[1].data).toHaveLength(1);
    expect(sections[1].data[0].id).toBe("rec-3");
  });
});
