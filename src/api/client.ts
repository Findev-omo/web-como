import axios, { type AxiosInstance, type AxiosError } from "axios";
import { getAccessToken, getClubId } from "@/lib/cookies";

// 응답 타입 정의
export interface ApiResponse<T = any> {
  resultCode: string;
  resultMessage: string;
  data: T;
}

// API 클라이언트 생성
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // 요청 인터셉터 - 토큰 자동 추가
  client.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 디버깅을 위한 로깅
      console.log("API 요청:", {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data,
      });

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 에러 처리 통합
  client.interceptors.response.use(
    (response) => {
      const data = response.data as ApiResponse;
      // 성공 코드: "OK", "200", 200 등
      const resultCode = String(data.resultCode);
      if (resultCode !== "OK" && resultCode !== "200") {
        throw new ApiError(data.resultMessage, data.resultCode);
      }
      return response;
    },
    (error: AxiosError) => {
      // 디버깅을 위한 에러 로깅
      console.error("API 에러 상세 정보:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        },
        message: error.message,
      });

      // 네트워크 에러나 기타 axios 에러 처리
      if (error.response?.status === 401) {
        throw new ApiError("인증이 필요합니다.", "UNAUTHORIZED");
      }

      // 서버 에러 응답 처리
      if (error.response?.data) {
        const errorData = error.response.data as any;
        const message =
          errorData.resultMessage || errorData.message || error.message;
        const code = errorData.resultCode || String(error.response.status);
        throw new ApiError(message, code, error);
      }

      throw new ApiError(
        error.message || "요청 처리 중 오류가 발생했습니다.",
        "NETWORK_ERROR",
        error
      );
    }
  );

  return client;
};

// 커스텀 API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 글로벌 API 클라이언트 인스턴스
export const apiClient = createApiClient();

// 편의 메서드들
export const api = {
  get: <T = any>(url: string, params?: Record<string, any>) =>
    apiClient.get<ApiResponse<T>>(url, { params }).then((res) => res.data.data),

  post: <T = any>(url: string, data?: any) =>
    apiClient.post<ApiResponse<T>>(url, data).then((res) => res.data.data),

  put: <T = any>(url: string, data?: any) =>
    apiClient.put<ApiResponse<T>>(url, data).then((res) => res.data.data),

  patch: <T = any>(url: string, data?: any) =>
    apiClient.patch<ApiResponse<T>>(url, data).then((res) => res.data.data),

  delete: <T = any>(url: string) =>
    apiClient.delete<ApiResponse<T>>(url).then((res) => res.data.data),
};

// 클럽 ID가 필요한 API 호출용 헬퍼
export const clubApi = {
  get: async <T = any>(endpoint: string, params?: Record<string, any>) => {
    const clubId = await getClubId();
    if (!clubId) throw new ApiError("클럽 정보가 없습니다.", "NO_CLUB_ID");
    return api.get<T>(endpoint.replace("{clubId}", clubId), params);
  },

  post: async <T = any>(endpoint: string, data?: any) => {
    const clubId = await getClubId();
    if (!clubId) throw new ApiError("클럽 정보가 없습니다.", "NO_CLUB_ID");
    return api.post<T>(endpoint.replace("{clubId}", clubId), data);
  },

  put: async <T = any>(endpoint: string, data?: any) => {
    const clubId = await getClubId();
    if (!clubId) throw new ApiError("클럽 정보가 없습니다.", "NO_CLUB_ID");
    return api.put<T>(endpoint.replace("{clubId}", clubId), data);
  },

  patch: async <T = any>(endpoint: string, data?: any) => {
    const clubId = await getClubId();
    if (!clubId) throw new ApiError("클럽 정보가 없습니다.", "NO_CLUB_ID");
    return api.patch<T>(endpoint.replace("{clubId}", clubId), data);
  },

  delete: async <T = any>(endpoint: string) => {
    const clubId = await getClubId();
    if (!clubId) throw new ApiError("클럽 정보가 없습니다.", "NO_CLUB_ID");
    return api.delete<T>(endpoint.replace("{clubId}", clubId));
  },
};

export default createApiClient;
