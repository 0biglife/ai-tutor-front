"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";

interface WelcomeModalProps {
  isLoading: boolean;
  isOpen: boolean;
  onStart: () => void;
}

export default function WelcomeModal({
  isLoading,
  isOpen,
  onStart,
}: WelcomeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onStart}
      isCentered
      closeOnOverlayClick={!isLoading}
      closeOnEsc={!isLoading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign="center" pt={6} pb={3}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            AI Tutor에 오신 것을 환영합니다!
          </Text>
          <Image
            src="/images/tutor-welcome.gif"
            alt="Welcome"
            mx="auto"
            width="160px"
            mb={4}
            mt={4}
            borderRadius="20px"
          />
          <Text fontSize="sm" color="gray.500">
            현재는 테스트 버전이며, 대화 저장은 지원되지 않습니다.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            w="full"
            onClick={onStart}
            isDisabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "시작할게요"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
