import { MembershipPlan } from "@/types";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";

// 멤버십 플랜 조회
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const res = await axiosInstance.get(ENDPOINTS.MEMBERSHIP);
  return res.data;
}

// 멤버십 구매
export async function purchaseMembership(planId: string): Promise<void> {
  const res = await axiosInstance.post(ENDPOINTS.MEMBERSHIP, { planId });
  return res.data;
}
