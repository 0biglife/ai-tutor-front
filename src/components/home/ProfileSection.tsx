"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { formatDate, formatUsageCount } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

interface ProfileSectionProps {
  onEnterMembership?: () => void;
}

export default function ProfileSection({
  onEnterMembership,
}: ProfileSectionProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.100", "gray.700");

  const handleEnterMemebership = () => router.push("/membership");

  return (
    <Box w={{ base: "100%", md: "300px" }}>
      {/* 프로필 */}
      <Flex
        borderWidth="1px"
        borderRadius="xl"
        p={5}
        gap={4}
        align="center"
        borderColor={borderColor}
        mb={4}
        userSelect={"none"}
      >
        <Avatar
          name={user?.name}
          src={user?.profileImage}
          size="md"
          borderWidth={1}
          borderColor={borderColor}
        />
        <VStack spacing={1} align="start">
          <Heading size="sm">안녕하세요 {user?.name ?? "회원"}님!</Heading>
          <Text fontSize="sm" color="gray.500">
            {user?.region ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
          </Text>
        </VStack>
      </Flex>

      {/* 멤버십 */}
      <Box>
        <Flex align="center" justify="space-between" pb={3}>
          <Heading size="md" pl={2} isTruncated>
            보유 멤버십
          </Heading>
          <HStack>
            <Button
              size="sm"
              colorScheme="gray"
              variant="ghost"
              bg="gray.200"
              _dark={{ bg: "gray.600" }}
              _hover={{
                bg: useColorModeValue("gray.100", "gray.700"),
                _dark: { bg: "gray.500" },
              }}
              onClick={handleEnterMemebership}
            >
              구매
            </Button>
            <Button
              size="sm"
              colorScheme="gray"
              variant="ghost"
              bg="gray.200"
              _dark={{ bg: "gray.600" }}
              _hover={{
                bg: useColorModeValue("gray.100", "gray.700"),
                _dark: { bg: "gray.500" },
              }}
              onClick={onEnterMembership}
            >
              보기
            </Button>
          </HStack>
        </Flex>
        <VStack spacing={4} align="start" h="320px" overflowY="auto">
          {!user || !user.memberships || user.memberships.length === 0 ? (
            <Box
              w="full"
              borderWidth="1px"
              borderRadius="xl"
              p={4}
              userSelect={"none"}
              borderColor={borderColor}
            >
              <Flex align="center" justify="center" minH="80px">
                <Text fontSize="sm" color="gray.500">
                  보유한 멤버십이 없습니다.
                </Text>
              </Flex>
            </Box>
          ) : (
            <>
              {user?.memberships?.map((membership) => {
                const isExpired = membership.isExpired;
                const bg = isExpired ? bgColor : "";
                const textColor = isExpired ? "gray.400" : "inherit";

                return (
                  <Box
                    key={membership.id}
                    w="full"
                    borderWidth="1px"
                    borderRadius="xl"
                    p={4}
                    userSelect={"none"}
                    borderColor={borderColor}
                    bg={bg}
                  >
                    <Stack
                      justify="space-between"
                      direction={{ base: "column", sm: "row" }}
                      align="start"
                    >
                      <Box color={textColor}>
                        <Text fontWeight="bold">{membership.plan.name}</Text>

                        {membership.remainingChatUses === null &&
                        membership.remainingAnalysisUses === null ? (
                          <Text
                            mt={2}
                            fontSize="sm"
                            color={textColor}
                            fontWeight={600}
                          >
                            만료 예정 {formatDate(membership.expiresAt)}
                          </Text>
                        ) : (
                          <Text mt={1} fontSize="sm" color={textColor}>
                            {formatDate(membership.startedAt)} ~{" "}
                            {formatDate(membership.expiresAt)}
                          </Text>
                        )}

                        {!(
                          membership.remainingChatUses === null &&
                          membership.remainingAnalysisUses === null
                        ) && (
                          <Text
                            fontSize="sm"
                            mt={1}
                            fontWeight={600}
                            color={textColor}
                          >
                            채팅{" "}
                            {formatUsageCount(membership.remainingChatUses)} /
                            분석{" "}
                            {formatUsageCount(membership.remainingAnalysisUses)}
                          </Text>
                        )}
                      </Box>

                      <VStack spacing={1} align="end">
                        {membership.grantedByAdmin && (
                          <Badge colorScheme="purple" alignSelf="start">
                            관리자 할당
                          </Badge>
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
              })}
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
