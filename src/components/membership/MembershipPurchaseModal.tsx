"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { MembershipPlan } from "@/types";
import { formatUsageCount } from "@/lib/utils";

interface MembershipPurchaseModalProps {
  plan: MembershipPlan;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export default function MembershipPurchaseModal({
  plan,
  isOpen,
  isLoading,
  onClose,
  onPurchase,
}: MembershipPurchaseModalProps) {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent borderRadius="2xl" bg={bg}>
        <ModalHeader>{plan.name}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={3}>
            <Text color="gray.500">{plan.description}</Text>
            <Text>
              수강기간: <strong>{plan.durationDays}일</strong>
            </Text>
            <Text>
              1:1 수업:{" "}
              <strong>
                {formatUsageCount(plan.features?.chatUses ?? null)}
              </strong>
            </Text>
            <Text>
              분석 기능:{" "}
              <strong>
                {formatUsageCount(plan.features?.analysisUses ?? null)}
              </strong>
            </Text>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="flex-end">
          <Button onClick={onClose} mr={3}>
            취소
          </Button>
          <Button
            colorScheme="purple"
            onClick={onPurchase}
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="결제 중..."
          >
            ₩{plan.price.toLocaleString()} 결제하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
