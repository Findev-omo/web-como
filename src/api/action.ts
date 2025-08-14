"use server";

import { getAccessToken, getClubId } from "@/lib/cookies";
import type { IResponse } from "@/api/types/index";

export const getData = async (
  endpoint: string,
  useClubId?: boolean,
  params?: { [key: string]: string | number },
  options?: { cache?: RequestCache; revalidate?: number }
) => {
  const clubId = await getClubId();
  const token = await getAccessToken();
  console.log("현재 clubId", clubId);

  const finalEndpoint = useClubId
    ? endpoint.replace("{clubId}", clubId || "")
    : endpoint;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${finalEndpoint}`;
  console.log("url", url);

  const fetchInit: RequestInit & { next?: { revalidate?: number } } = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (options?.cache) {
    fetchInit.cache = options.cache;
  }

  // 기본은 60초 재검증, 옵션으로 덮어쓰기 가능
  fetchInit.next = {
    revalidate: options?.revalidate ?? 60,
  };

  const response = await fetch(url, fetchInit);
  // console.log(endpoint);
  // console.log(response);
  const res: IResponse<any> = await response.json();
  // console.log(res);

  return res;
};
