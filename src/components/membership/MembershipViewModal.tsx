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
} from "@chakra-ui/react";
import { formatDate, formatUsageCount } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

interface MembershipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (membershipId: string) => void;
}

export default function MembershipViewModal({
  isOpen,
  onClose,
}: MembershipViewModalProps) {
  const { user } = useUserStore();
  const memberships = user?.memberships || [];
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.100", "gray.600");

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
        <ModalHeader>보유 멤버십 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {memberships.length === 0 ? (
              <Text>보유한 멤버십이 없습니다.</Text>
            ) : (
              memberships.map((membership) => {
                const isExpired = membership.isExpired === true;
                const bg = isExpired ? bgColor : "";
                const textColor = isExpired ? "gray.400" : "inherit";

                return (
                  <Box
                    key={membership.id}
                    borderWidth="1px"
                    borderRadius="xl"
                    p={4}
                    borderColor={borderColor}
                    bg={bg}
                  >
                    <Stack
                      justify="space-between"
                      direction={{ base: "column", sm: "row" }}
                    >
                      <Box color={textColor}>
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
                      <VStack align="end">
                        {membership.grantedByAdmin && (
                          <Badge colorScheme="purple">관리자 할당</Badge>
                        )}
                        {isExpired && (
                          <Badge
                            colorScheme="red"
                            color="red.400"
                            variant="subtle"
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
      </ModalContent>
    </Modal>
  );
}
