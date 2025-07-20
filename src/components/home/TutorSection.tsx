"use client";

import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import { FaMicrophone } from "react-icons/fa";

const TITLE = "Start AI Tutor";

interface TutorSectionProps {
  onEnterTutor: () => void;
}

export default function TutorSection({ onEnterTutor }: TutorSectionProps) {
  return (
    <Flex
      p={4}
      w={{ base: "100%", md: "700px" }}
      borderWidth="1px"
      borderRadius="xl"
    >
      <VStack spacing={4} align="stretch" w="full">
        <Heading size="md" fontStyle="italic">
          {TITLE}
        </Heading>

        <Box
          position="relative"
          w="100%"
          h="380px"
          overflow="hidden"
          borderRadius="lg"
          bg="gray.100"
          _dark={{ bg: "gray.700" }}
        >
          <Image
            src="/images/chat-preview-blur.jpg"
            alt="chat preview"
            objectFit="cover"
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            style={{ filter: "blur(8px)" }}
          />

          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="80px"
            h="80px"
            bg="purple.300"
            opacity={0.5}
            borderRadius="full"
            animation="pulse 2s infinite"
            zIndex={1}
            sx={{
              "@keyframes pulse": {
                "0%": {
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 0.5,
                },
                "50%": {
                  transform: "translate(-50%, -50%) scale(1.5)",
                  opacity: 0.1,
                },
                "100%": {
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 0.5,
                },
              },
            }}
          />

          <IconButton
            icon={<FaMicrophone size={20} />}
            aria-label="Start AI Tutor"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            borderRadius="full"
            size="lg"
            colorScheme="purple"
            boxShadow="lg"
            zIndex={2}
            _hover={{
              transform: "translate(-50%, -50%) scale(1.1)",
              boxShadow: "xl",
            }}
            transition="all 0.2s ease"
            onClick={onEnterTutor}
          />
        </Box>
      </VStack>
    </Flex>
  );
}
