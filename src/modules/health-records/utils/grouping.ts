import { HealthRecord } from "../api/useHealthRecords";

export interface GroupedSection {
  title: string;
  data: HealthRecord[];
}

export function groupRecordsByMonthYear(
  records: HealthRecord[],
): GroupedSection[] {
  const groups: Record<string, { dateObj: Date; data: HealthRecord[] }> = {};

  records.forEach((record) => {
    const [year, month] = record.date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, 1);
    const title = dateObj.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });

    if (!groups[title]) {
      groups[title] = {
        dateObj,
        data: [],
      };
    }
    groups[title].data.push(record);
  });

  const sortedSections = Object.keys(groups)
    .map((title) => ({
      title,
      dateObj: groups[title].dateObj,
      data: groups[title].data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  return sortedSections.map(({ title, data }) => ({ title, data }));
}
