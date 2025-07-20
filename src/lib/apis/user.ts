import { User } from "@/types";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";

// 사용자 정보 요청
export async function fetchUser(): Promise<User> {
  const res = await axiosInstance.get(ENDPOINTS.USER_ME);
  return res.data;
}
