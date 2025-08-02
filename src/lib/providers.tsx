"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function RQProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터를 5분간 fresh로 유지
            staleTime: 5 * 60 * 1000,
            // 캐시된 데이터를 10분간 유지
            gcTime: 10 * 60 * 1000,
            // 백그라운드에서 자동으로 refetch
            refetchOnWindowFocus: false,
            // 네트워크 재연결 시 refetch
            refetchOnReconnect: true,
            // 에러 시 재시도 횟수
            retry: 1,
            // 재시도 간격
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 실패 시 재시도
            retry: 1,
            // 재시도 간격
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
