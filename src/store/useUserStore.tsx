import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/types/user";

interface UserState {
  user: User | null;
  selectedMembershipId: string | null;
  // 유저 정보 저장
  setUser: (user: User) => void;
  // 멤버십 채팅 횟수 업데이트
  updateChatUses: (membershipId: string, remaining: number) => void;
  // 선택된 멤버십id 업데이트
  setSelectedMembershipId: (id: string | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        selectedMembershipId: null,

        setUser: (user) => set({ user }, false, "setUser"),
        setSelectedMembershipId: (id) =>
          set({ selectedMembershipId: id }, false, "setSelectedMembershipId"),

        updateChatUses: (membershipId, remaining) => {
          const { user } = get();
          if (!user) return;

          const updatedMemberships = user.memberships.map((m) =>
            m.id === membershipId ? { ...m, remainingChatUses: remaining } : m
          );

          set(
            {
              user: {
                ...user,
                memberships: updatedMemberships,
              },
            },
            false,
            "updateChatUses"
          );
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          user: state.user,
          selectedMembershipId: state.selectedMembershipId,
        }),
      }
    )
  )
);
