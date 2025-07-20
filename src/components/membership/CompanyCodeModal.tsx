"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface CompanyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
}

export default function CompanyCodeModal({
  isOpen,
  onClose,
  onConfirm,
}: CompanyCodeModalProps) {
  const [code, setCode] = useState("");

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>기업 고객 인증</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" mb={2}>
            기업 코드를 입력해주세요
          </Text>
          <Input
            placeholder="ex) COMPANY1234"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            취소
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => {
              onConfirm(code);
              setCode("");
            }}
            isDisabled={!code}
          >
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
