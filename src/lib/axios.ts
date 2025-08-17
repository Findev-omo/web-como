import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 자동으로 포함
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    // 클라이언트 사이드에서만 토큰 가져오기
    if (typeof window !== "undefined") {
      // 쿠키에서 토큰 가져오기
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };

      const token = getCookie("accessToken");
      const role = getCookie("role");
      console.log("토큰 확인:", token ? "토큰 있음" : "토큰 없음");
      console.log("사용자 역할:", role || "역할 정보 없음");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization 헤더 설정됨");
      } else {
        console.warn("토큰이 없어서 Authorization 헤더가 설정되지 않음");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
