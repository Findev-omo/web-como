import { getAccessToken } from "@/lib/cookies";

export const getSummary = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error("토큰 정보가 없습니다.");
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const url = `${baseUrl}/v1/manager/club/report/summary`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });
  const result = await response.json();
  if (result.resultCode === "OK") {
    return result.data;
  } else {
    throw new Error(result.resultMessage);
  }
};
