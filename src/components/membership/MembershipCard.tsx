"use client";

import {
  Box,
  Badge,
  Button,
  Heading,
  Stack,
  Text,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatUsageCount } from "@/lib/utils";
import { MembershipPlan } from "@/types";

interface MembershipCardProps {
  plan: MembershipPlan;
  isOwned: boolean;
  highlight?: "추천" | "최저가" | null;
  onBuyClick: () => void;
}

export default function MembershipCard({
  plan,
  isOwned,
  highlight,
  onBuyClick,
}: MembershipCardProps) {
  const { name, description, price, durationDays, features } = plan;
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgHover = useColorModeValue("gray.50", "gray.600");

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      p={6}
      minH="300px"
      _hover={{ bg: isOwned ? "" : bgHover }}
      transition="background-color 0.2s"
    >
      <Stack spacing={3}>
        <Flex justify="space-between" align="flex-start">
          <Heading size="md" wordBreak="break-word" flex={1}>
            {name}
          </Heading>
          {highlight && (
            <Badge
              colorScheme={highlight === "추천" ? "purple" : "green"}
              ml={2}
              whiteSpace="nowrap"
            >
              {highlight}
            </Badge>
          )}
        </Flex>

        <Text fontSize="sm" color="gray.500">
          수강기간 {durationDays}일
        </Text>

        <Stack fontSize="sm">
          <Text>1:1 수업 ({formatUsageCount(features?.chatUses ?? null)})</Text>
          <Text>
            분석 기능 ({formatUsageCount(features?.analysisUses ?? null)})
          </Text>
          <Text>{description}</Text>
        </Stack>
      </Stack>

      <Button
        colorScheme={isOwned ? "gray" : "purple"}
        mt={6}
        w="full"
        disabled={isOwned}
        onClick={() => {
          if (!isOwned) onBuyClick();
        }}
        _hover={{ bg: isOwned ? "" : "purple.600" }}
      >
        {isOwned ? "사용중" : `₩${price.toLocaleString()} 구매`}
      </Button>
    </Box>
  );
}
