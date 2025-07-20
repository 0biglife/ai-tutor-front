"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  ChatSection,
  ExpirationModal,
  MicSection,
  WelcomeModal,
} from "@/components";
import { getInitialTutorText, submitAudio } from "@/lib/apis/tutor";
import { useOpenModal } from "@/hooks";
import { ChatMessage } from "@/types";
import { useUserStore } from "@/store/useUserStore";

/**
 * @memo
 * 브라우저의 자동 음성 재생 차단 정책으로 인해,
 * AI의 첫 음성 응답은 컴포넌트 마운트 시 바로 재생할 수 없었습니다.
 *
 * 따라서 "시작하기" 모달(WelcomeModal)을 띄운 뒤,
 * 유저의 명시적 인터랙션(버튼 클릭)을 통해 TTS를 재생하도록 구현하였습니다.
 */

const WELCOME_TEXT =
  "Hello! I'm your English tutor today. Let's practice together.";

export default function TutorContainer() {
  const mountRef = useRef(false);
  // 선택된 멤버십 id 스토어 조회
  const { user, selectedMembershipId, updateChatUses } = useUserStore();
  const selectedMembership = user?.memberships.find(
    (m) => m.id === selectedMembershipId
  );
  // 만료 여부 판별 변수
  const isExpired =
    selectedMembership?.remainingChatUses !== undefined &&
    selectedMembership?.remainingChatUses !== null &&
    selectedMembership.remainingChatUses <= 0;
  const [isLoading, setIsLoading] = useState<boolean>(false); // 음성 요청 로딩 변수
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // 음성 실행중 로딩 변수
  const [initialTTSUrl, setInitialTTSUrl] = useState<string | null>(null);
  // 시작하기 모달
  const {
    isOpen: isWelcomeOpen,
    onOpen: openWelcomeModal,
    onClose: closeWelcomeModal,
  } = useOpenModal();
  // 멤버십 채팅 소진 모달
  const {
    isOpen: isExpiredOpen,
    onOpen: openExpiredModal,
    onClose: closeExpiredModal,
  } = useOpenModal();

  // 페이지 마운트 시 GPT 시작 음성 요청
  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;
    openWelcomeModal();

    const fetchInitialText = async () => {
      try {
        setIsLoading(true);
        const { ttsUrl } = await getInitialTutorText(WELCOME_TEXT);
        setInitialTTSUrl(ttsUrl);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: WELCOME_TEXT,
            audioUrl: ttsUrl,
          },
        ]);
      } catch (e) {
        console.error("초기 TTS 요청 실패:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialText();
  }, []);

  // 시작하기 모달 종료 시 음성 재생
  const handleStart = async () => {
    closeWelcomeModal();
    try {
      setIsSpeaking(true);
      const audio = new Audio(
        `${process.env.NEXT_PUBLIC_ROOT_URL}${initialTTSUrl}`
      );
      await audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (e) {
      console.warn("재생 실패 (브라우저 차단일 수 있음):", e);
      setIsSpeaking(false);
    }
  };

  // 사용자 녹음 전송
  const handleAudioSubmit = async (audioBlob: Blob) => {
    setIsLoading(true);
    const form = new FormData();
    form.append("audio", audioBlob, "voice.webm");
    form.append("membershipId", selectedMembershipId!);

    try {
      const {
        userText,
        assistantText,
        ttsUrl,
        userAudioUrl,
        membershipId,
        chatUses,
      } = await submitAudio(form);
      updateChatUses(membershipId, chatUses);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userText,
          audioUrl: userAudioUrl,
        },
        {
          role: "assistant",
          content: assistantText,
          audioUrl: ttsUrl,
        },
      ]);
      setIsSpeaking(true);
      const audio = new Audio(`${process.env.NEXT_PUBLIC_ROOT_URL}${ttsUrl}`);
      audio.play().catch(console.error);
      audio.onended = () => setIsSpeaking(false); // AI 음성 마칠 뒤 마이크 접근 가능

      // 음성 요청 결과 채팅 횟수 검증
      if (chatUses <= 0) openExpiredModal();
    } catch (e) {
      console.error("오디오 처리 오류:", e);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WelcomeModal
        isOpen={isWelcomeOpen}
        isLoading={isLoading}
        onStart={handleStart}
      />
      <Flex
        position="relative"
        direction="column"
        w={{ base: "100%", md: "640px" }}
        justifySelf="center"
      >
        {/* 채팅 섹션 */}
        <Box flex="1" overflowY="auto" pb={10}>
          <ChatSection messages={messages} />
        </Box>

        {/* 마이크 섹션 */}
        <Box
          position="fixed"
          bottom={4}
          left="20px"
          right="20px"
          maxW="container.xl"
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={4}
          zIndex={10}
          borderRadius="xl"
        >
          <MicSection
            onSubmit={handleAudioSubmit}
            isLoading={isWelcomeOpen ? false : isLoading}
            isDisabled={isSpeaking}
            isExpired={isExpired}
          />
        </Box>
      </Flex>

      {/* 모달 */}
      <ExpirationModal isOpen={isExpiredOpen} onClose={closeExpiredModal} />
    </>
  );
}
