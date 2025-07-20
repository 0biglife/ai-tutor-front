"use client";

import { Container, Flex } from "@chakra-ui/react";
import {
  MembershipSelectorModal,
  MembershipViewModal,
  ProfileSection,
  SettingSection,
  TutorSection,
} from "@/components";
import { useRouter } from "next/navigation";
import { useOpenModal } from "@/hooks";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { fetchUser } from "@/lib/apis/user";

export default function HomeContainer() {
  const router = useRouter();
  const { user, setUser, setSelectedMembershipId } = useUserStore();

  // 멤버십 선택 모달
  const {
    isOpen: selectorOpen,
    onOpen: onSelectorOpen,
    onClose: onSelectorClose,
  } = useOpenModal();
  // 멤버십 단순 조회 모달
  const {
    isOpen: viewerOpen,
    onOpen: onViewerOpen,
    onClose: onViewerClose,
  } = useOpenModal();

  // 유저 데이터 패칭
  useEffect(() => {
    if (!user) fetchUser().then(setUser);
  }, []);

  // 이벤트 함수
  const handleEnterTutor = () => onSelectorOpen();
  const handleViewMembership = () => onViewerOpen();
  const handleConfirmSelectedMembership = (membershipId: string) => {
    setSelectedMembershipId(membershipId);
    router.push("/tutor");
  };

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        justify="center"
        w="full"
        maxW="1200px"
        width="100%"
        mx="auto"
      >
        {/* 튜터 섹션 */}
        <TutorSection onEnterTutor={handleEnterTutor} />

        {/* 프로필 및 멤버십 섹션 */}
        <ProfileSection onEnterMembership={handleViewMembership} />
      </Flex>

      {/* 튜터 설정 섹션 */}
      <SettingSection />

      {/* 모달 */}
      <MembershipSelectorModal
        isOpen={selectorOpen}
        onClose={onSelectorClose}
        onConfirm={handleConfirmSelectedMembership}
      />
      <MembershipViewModal isOpen={viewerOpen} onClose={onViewerClose} />
    </Container>
  );
}
