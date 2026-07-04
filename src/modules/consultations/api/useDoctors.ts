import { useQuery } from "@tanstack/react-query";
import { Doctor, mockDb } from "../../../mocks/mock-db";
import { apiClient } from "../../../shared/lib/api-client";

export interface FetchDoctorsParams {
  query?: string;
  specialty?: string;
}

export function useDoctors(params: FetchDoctorsParams) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const fetchCall = async (): Promise<Doctor[]> => {
        return mockDb.getDoctors(params.query, params.specialty);
      };

      return apiClient.request(fetchCall);
    },
  });
}
export type { Doctor };
