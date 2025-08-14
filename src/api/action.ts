"use server";

import { getAccessToken, getClubId } from "@/lib/cookies";
import type { IResponse } from "@/api/types/index";

export const getData = async (
  endpoint: string,
  useClubId?: boolean,
  params?: { [key: string]: string | number },
  options?: { noCache?: boolean }
) => {
  const clubId = await getClubId();
  const token = await getAccessToken();
  console.log("현재 clubId", clubId);

  const finalEndpoint = useClubId
    ? endpoint.replace("{clubId}", clubId || "")
    : endpoint;
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${finalEndpoint}`;
  console.log("url", url);

  const fetchInit: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (options?.noCache) {
    // 최신값 강제 조회
    (fetchInit as RequestInit).cache = "no-store";
  } else {
    fetchInit.next = { revalidate: 60 };
  }

  const response = await fetch(url, fetchInit);
  // console.log(endpoint);
  // console.log(response);
  const res: IResponse<any> = await response.json();
  // console.log(res);

  return res;
};
