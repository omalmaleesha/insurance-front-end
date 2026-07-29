import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,//for the next 5 mins consider this data if fresh
      refetchOnWindowFocus: false,
    },
  },
});


//defaultOption means use these settings for all queries unless overridden in the individual query.
//queries means these settings apply to all queries (not mutations).
