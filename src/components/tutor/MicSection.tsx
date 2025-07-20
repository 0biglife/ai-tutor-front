"use client";

import {
  Flex,
  IconButton,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMicrophone, FaCheck, FaTrash } from "react-icons/fa";
import { useRecorder } from "@/hooks";
import Waveform from "./Waveform";

interface MicSectionProps {
  isLoading: boolean;
  isDisabled: boolean;
  isExpired: boolean;
  onSubmit: (audioBlob: Blob) => void;
}

export default function MicSection({
  onSubmit,
  isLoading = false,
  isDisabled = false,
  isExpired = false,
}: MicSectionProps) {
  const { isRecording, startRecording, stopRecording, resetRecording } =
    useRecorder();

  const bgColor = useColorModeValue(
    "rgba(255,255,255,0.3)",
    "rgba(32,32,35,0.3)"
  );
  const borderColor = useColorModeValue(
    "rgba(255,255,255,0.4)",
    "rgba(255,255,255,0.1)"
  );

  const handleStopAndSubmit = async () => {
    const blob = await stopRecording();
    onSubmit(blob);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      w="100%"
      maxW="640px"
      h="72px"
      px={3}
      bg={bgColor}
      borderRadius="35px"
      mx="auto"
      backdropFilter="blur(16px)"
      border={`1px solid ${borderColor}`}
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
      transition="all 0.3s ease-in-out"
    >
      <Flex flex="1" justify="center" align="center">
        {isRecording ? (
          <>
            <IconButton
              aria-label="Cancel"
              icon={<FaTrash />}
              onClick={resetRecording}
              variant="ghost"
              color="red.300"
              bg="red.100"
              _hover={{ bg: "red.200" }}
              borderRadius="full"
              size="lg"
            />
            <Waveform />
          </>
        ) : isLoading ? (
          <>
            <Spinner size="sm" mr={2} />
            <Text fontSize="sm" color="gray.400" ml={4}>
              AI is thinking...
            </Text>
          </>
        ) : (
          <Text
            fontSize="sm"
            color={isExpired ? "red.400" : "gray.500"}
            ml={10}
            fontWeight={isExpired ? "bold" : "normal"}
          >
            {isExpired
              ? "Chat limit reached. Please purchase a new plan."
              : "Say anything! The AI tutor is here for you."}
          </Text>
        )}
      </Flex>

      {isRecording ? (
        <Flex gap={2}>
          <IconButton
            aria-label="Submit recording"
            icon={<FaCheck />}
            onClick={handleStopAndSubmit}
            colorScheme="gray"
            borderRadius="full"
            size="lg"
          />
        </Flex>
      ) : (
        <IconButton
          aria-label="Start recording"
          icon={<FaMicrophone color="black" />}
          onClick={startRecording}
          bg="whiteAlpha.800"
          _hover={{
            bg: "gray.100",
            boxShadow: "0 0 12px rgba(255, 255, 255, 1)",
            transform: "scale(1.1)",
          }}
          boxShadow="0 0 8px rgba(0, 0, 0, 0.2)"
          borderRadius="full"
          fontSize="20px"
          size="lg"
          isDisabled={isLoading || isDisabled || isExpired}
        />
      )}
    </Flex>
  );
}
