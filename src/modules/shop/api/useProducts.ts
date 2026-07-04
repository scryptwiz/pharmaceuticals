import { useInfiniteQuery } from "@tanstack/react-query";
import { mockDb, Product } from "../../../mocks/mock-db";
import { apiClient } from "../../../shared/lib/api-client";

export interface FetchProductsParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "priceAsc" | "priceDesc" | "rating" | "default";
}

const PAGE_SIZE = 20;

export function useProducts(params: FetchProductsParams) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const fetchCall = async (): Promise<{
        products: Product[];
        nextPage: number | null;
      }> => {
        let items = mockDb.getProducts(
          params.query,
          params.category,
          params.minPrice,
          params.maxPrice,
        );

        if (params.sortBy === "priceAsc") {
          items = [...items].sort((a, b) => a.price - b.price);
        } else if (params.sortBy === "priceDesc") {
          items = [...items].sort((a, b) => b.price - a.price);
        } else if (params.sortBy === "rating") {
          items = [...items].sort((a, b) => b.rating - a.rating);
        }

        const startIdx = pageParam * PAGE_SIZE;
        const sliced = items.slice(startIdx, startIdx + PAGE_SIZE);
        const hasNext = startIdx + PAGE_SIZE < items.length;

        return {
          products: sliced,
          nextPage: hasNext ? pageParam + 1 : null,
        };
      };

      return apiClient.request(fetchCall);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
export type { Product };
