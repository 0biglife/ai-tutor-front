"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { CustomerType, MembershipPlan } from "@/types";
import MembershipCard from "./MembershipCard";
import { useOpenModal } from "@/hooks";
import MembershipPurchaseModal from "./MembershipPurchaseModal";
import { useUserStore } from "@/store/useUserStore";
import CompanyCodeModal from "./CompanyCodeModal";
import { purchaseMembership } from "@/lib/apis/membership";
import { fetchUser } from "@/lib/apis/user";

interface MembershipContainerProps {
  membershipPlan: MembershipPlan[];
}

export default function MembershipContainer({
  membershipPlan,
}: MembershipContainerProps) {
  const { user, setUser } = useUserStore();
  const [targetType, setTargetType] = useState<CustomerType>("B2C");
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // 멤버십 결제 모달
  const {
    isOpen: isPurchaseModalOpen,
    onOpen: openPurchaseModal,
    onClose: closePurchaseModal,
  } = useOpenModal();

  // 기업용(B2B) 인증 모달
  const {
    isOpen: isCompanyModalOpen,
    onOpen: openCompanyModal,
    onClose: closeCompanyModal,
  } = useOpenModal();

  const filteredPlans = membershipPlan.filter(
    (plan) => plan.target === targetType
  );

  // 결제 버튼 핸들러
  const handleBuyClick = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    openPurchaseModal();
  };

  // 결제 요청
  const handlePurchase = async () => {
    if (!selectedPlan) return;
    try {
      setIsLoading(true);
      await purchaseMembership(selectedPlan.id);
      const updatedUser = await fetchUser();
      setUser(updatedUser);
      closePurchaseModal();
    } catch (err) {
      console.error("handlePurchase Error : ", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 개인용/기업용 멤버십 전환
  const handleButtonGroupClick = (type: CustomerType) => {
    const isB2B = type === "B2B";

    if (isB2B && !isVerified) {
      openCompanyModal();
      setTargetType("B2C");
      return;
    }

    setTargetType(type);
    if (!isB2B) closeCompanyModal();
  };

  // 기업 인증 코드 핸들러
  // - 테스트용으로 B2B 입력 시 검증된 것으로 취급하였습니다.
  const handleConfirmCompanyCode = (code: string) => {
    const isValidCode = code === "B2B";
    if (isValidCode) {
      setIsVerified(true);
      setTargetType("B2B");
    }
    closeCompanyModal();
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md" pl={2}>
          {targetType === "B2C" ? "개인 고객용 플랜" : "기업 고객용 플랜"}
        </Heading>

        {/* 개인/기업 멤버십 전환 토글 */}
        <ButtonGroup isAttached>
          <Button
            onClick={() => handleButtonGroupClick("B2C")}
            colorScheme={targetType === "B2C" ? "purple" : "gray"}
            size="sm"
          >
            개인용
          </Button>
          <Button
            onClick={() => handleButtonGroupClick("B2B")}
            colorScheme={targetType === "B2B" ? "purple" : "gray"}
            size="sm"
          >
            기업용
          </Button>
        </ButtonGroup>
      </HStack>

      {/* 멤버십 그리드 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {filteredPlans.map((plan, index) => {
          let highlight: "추천" | "최저가" | null = null;
          if (index === 2) highlight = "추천";
          if (index === 3) highlight = "최저가";

          return (
            <MembershipCard
              key={plan.id}
              plan={plan}
              highlight={highlight}
              isOwned={
                !!user?.memberships?.some(
                  (m) => m.plan.id === plan.id && !m.isExpired
                )
              }
              onBuyClick={() => handleBuyClick(plan)}
            />
          );
        })}
      </SimpleGrid>

      {/* 모달 */}
      {selectedPlan && (
        <MembershipPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={closePurchaseModal}
          isLoading={isLoading}
          plan={selectedPlan}
          onPurchase={handlePurchase}
        />
      )}
      {user?.customerType === "B2C" && (
        <CompanyCodeModal
          isOpen={isCompanyModalOpen}
          onClose={closeCompanyModal}
          onConfirm={handleConfirmCompanyCode}
        />
      )}
    </Box>
  );
}
