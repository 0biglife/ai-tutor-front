"use client";

import { ChatMessage } from "@/types";
import {
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";

interface ChatSectionProps {
  messages: ChatMessage[];
}

export default function ChatSection({ messages }: ChatSectionProps) {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const userBg = useColorModeValue("gray.500", "gray.400");
  const userColor = useColorModeValue("white", "gray.900");
  const otherBg = useColorModeValue(
    "rgba(255, 255, 255, 0.15)",
    "rgba(255, 255, 255, 0.05)"
  );
  const otherColor = useColorModeValue("gray.800", "gray.100");
  const otherBorder = `1px solid ${useColorModeValue(
    "rgba(255,255,255,0.4)",
    "rgba(255,255,255,0.15)"
  )}`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTogglePlay = (idx: number, msg: ChatMessage) => {
    if (playingIndex === idx) {
      stopPlayback();
      setPlayingIndex(null);
      return;
    }

    stopPlayback();

    if (msg.audioUrl) {
      const audio = new Audio(
        `${process.env.NEXT_PUBLIC_ROOT_URL}${msg.audioUrl}`
      );
      currentAudioRef.current = audio;

      audio.onended = () => {
        setPlayingIndex(null);
        currentAudioRef.current = null;
      };

      audio.play().catch(console.error);
      setPlayingIndex(idx);
    }
  };

  const stopPlayback = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    speechSynthesis.cancel();
  };

  return (
    <VStack align="stretch" spacing={4}>
      {messages.map((msg, idx) => {
        const isUser = msg.role === "user";
        const bg = isUser ? userBg : otherBg;
        const color = isUser ? userColor : otherColor;
        const border = isUser ? "none" : otherBorder;
        const boxShadow = isUser ? "md" : "0 4px 12px rgba(0,0,0,0.08)";

        const isPlayable =
          (msg.role === "assistant" && msg.content) || msg.role === "user";

        return (
          <Box key={idx} alignSelf={isUser ? "flex-end" : "flex-start"}>
            <Box
              bg={bg}
              color={color}
              px={4}
              py={2.5}
              borderRadius="xl"
              border={border}
              boxShadow={boxShadow}
              backdropFilter={isUser ? undefined : "blur(10px)"}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              fontSize="md"
            >
              <Text>{msg.content}</Text>
              <Divider
                width="full"
                height="0.5px"
                bg="gray.200"
                _dark={{ bg: "gray.600" }}
                mt={4}
              />
              {isPlayable && (
                <HStack mt={3} mb={1} ml="2px">
                  <IconButton
                    size="sm"
                    borderRadius={20}
                    bg="gray.200"
                    _dark={{ bg: "gray.700" }}
                    aria-label="Play audio"
                    icon={
                      playingIndex === idx ? (
                        <FaStop size={12} />
                      ) : (
                        <FaPlay size={12} />
                      )
                    }
                    onClick={() => handleTogglePlay(idx, msg)}
                    variant="ghost"
                  />
                </HStack>
              )}
            </Box>
          </Box>
        );
      })}
      <Box ref={bottomRef} />
    </VStack>
  );
}
