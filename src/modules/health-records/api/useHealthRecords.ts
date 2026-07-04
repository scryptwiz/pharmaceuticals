import { useQuery } from "@tanstack/react-query";
import { HealthRecord, mockDb } from "../../../mocks/mock-db";
import { apiClient } from "../../../shared/lib/api-client";

export interface FetchHealthRecordsParams {
  query?: string;
  type?: string;
}

export function useHealthRecords(params: FetchHealthRecordsParams) {
  return useQuery({
    queryKey: ["healthRecords", params],
    queryFn: async () => {
      const fetchCall = async (): Promise<HealthRecord[]> => {
        return mockDb.getHealthRecords(params.query, params.type);
      };

      return apiClient.request(fetchCall);
    },
  });
}
export type { HealthRecord };
