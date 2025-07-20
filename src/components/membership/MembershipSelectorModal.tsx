"use client";

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  Stack,
  useColorModeValue,
  Badge,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { formatDate, formatUsageCount } from "@/lib/utils";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";

interface MembershipSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (membershipId: string) => void;
}

export default function MembershipSelectorModal({
  isOpen,
  onClose,
  onConfirm,
}: MembershipSelectorModalProps) {
  const { user } = useUserStore();
  const memberships = user?.memberships || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedBorderColor = useColorModeValue("purple.200", "purple.300");
  const defaultBorderColor = useColorModeValue("gray.200", "gray.600");
  const selectedBgColor = useColorModeValue("purple.50", "purple.800");
  const hoverBgColor = useColorModeValue("purple.50", "purple.900");
  const bgColor = useColorModeValue("gray.100", "gray.600");

  // 이벤트 함수
  const handleConfirm = () => {
    if (selectedId && onConfirm) {
      onConfirm(selectedId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent borderRadius="2xl">
        <ModalHeader>멤버십 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {memberships.length === 0 ? (
              <Text>보유한 멤버십이 없습니다.</Text>
            ) : (
              memberships.map((membership) => {
                const isSelected = selectedId === membership.id;
                const isExpired = membership.isExpired === true;

                return (
                  <Box
                    key={membership.id}
                    borderWidth="2px"
                    borderRadius="xl"
                    p={4}
                    cursor={isExpired ? "" : "pointer"}
                    borderColor={
                      isSelected ? selectedBorderColor : defaultBorderColor
                    }
                    bg={
                      isExpired
                        ? bgColor
                        : isSelected
                        ? selectedBgColor
                        : "transparent"
                    }
                    onClick={() =>
                      !isExpired &&
                      setSelectedId(isSelected ? null : membership.id)
                    }
                    _hover={{
                      borderColor: isExpired ? "" : "purple.300",
                      bg: isExpired ? "" : hoverBgColor,
                    }}
                  >
                    <Stack
                      justify="space-between"
                      direction={{ base: "column", sm: "row" }}
                    >
                      <Box>
                        <Text fontWeight="bold">{membership.plan.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(membership.startedAt)} ~{" "}
                          {formatDate(membership.expiresAt)}
                        </Text>
                        <Text fontSize="sm" mt={1}>
                          채팅 {formatUsageCount(membership.remainingChatUses)}{" "}
                          / 분석{" "}
                          {formatUsageCount(membership.remainingAnalysisUses)}
                        </Text>
                      </Box>
                      <VStack align="end" spacing={1}>
                        {membership.grantedByAdmin && (
                          <Badge colorScheme="purple">관리자 할당</Badge>
                        )}
                        {isExpired && (
                          <Badge
                            colorScheme="red"
                            color="red.400"
                            variant="subtle"
                            borderRadius={4}
                          >
                            만료됨
                          </Badge>
                        )}
                      </VStack>
                    </Stack>
                  </Box>
                );
              })
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>취소</Button>
          <Button
            colorScheme="purple"
            onClick={handleConfirm}
            isDisabled={!selectedId}
          >
            선택 완료
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
