import axios from "axios";

const token = process.env.NEXT_PUBLIC_TEST_BEARER_TOKEN || "";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Axios 인터셉터 설정
axiosInstance.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 공통 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 성공
    return response;
  },
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // 인증 오류 케이스 없기 때문에 비워둠
        // 추후 리다이렉트 + 로그아웃 등
        break;
      case 403:
        console.warn("권한 없음");
        break;
      case 500:
        console.error("Server 오류 발생", error);
        break;
      default:
        console.error("알 수 없는 오류", error);
    }

    return Promise.reject(error);
  }
);
