import axios, { type AxiosInstance } from "axios";
import { getAccessToken } from "@/lib/cookies";

const createClient = async (): Promise<AxiosInstance> => {
  const token = await getAccessToken();

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
  });

  return client;
};

export default createClient;
