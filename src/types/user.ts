import { CustomerType } from "./enums";

// 유저
export interface User {
  id: string;
  name: string;
  email: string;
  region: string;
  profileImage?: string;
  customerType: CustomerType;
  memberships: Membership[];
}

// 멤버십
export interface Membership {
  id: string;
  plan: MembershipPlan;
  startedAt: string;
  expiresAt: string;
  remainingChatUses: number | null;
  remainingAnalysisUses: number | null;
  grantedByAdmin: boolean;
  isExpired: boolean;
}

// 멤버십 플랜
export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  features: {
    chatUses: number | null;
    analysisUses: number | null;
  };
  target: CustomerType;
  price: number;
  active?: boolean;
}
