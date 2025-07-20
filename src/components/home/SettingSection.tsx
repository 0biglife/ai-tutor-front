"use client";

import {
  Box,
  Flex,
  Heading,
  Select,
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TITLE = "Device Setting";

export default function SettingSection() {
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("ko-KR");
  const [tutorStyle, setTutorStyle] = useState<string>("friendly");

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        setInputDevices(audioInputs);
      })
      .catch((err) => console.error("Error fetching devices", err));
  }, []);

  return (
    <Flex w="100%" mt={4} maxW="1014px" mx="auto">
      <VStack spacing={4} align="stretch" w="full">
        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Heading size="md" fontStyle="italic">
            {TITLE}{" "}
            <Tooltip
              label="현재 데모 버전으로 해당 기능은 동작하지 않습니다"
              hasArrow
            >
              <Box
                as="span"
                fontSize="sm"
                color="gray.500"
                fontWeight="normal"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxW={{ base: "150px", md: "none" }}
                display="inline-block"
                verticalAlign="middle"
              >
                (현재 데모 버전으로 해당 기능은 동작하지 않습니다 )
              </Box>
            </Tooltip>
          </Heading>

          <Button colorScheme="purple" size="sm" mt={{ base: 2, md: 0 }}>
            테스트 녹음
          </Button>
        </Flex>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align="stretch"
          w="full"
        >
          <Box
            flex="1"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg={bgColor}
            borderColor={borderColor}
          >
            <Heading size="sm" mb={3} ml={1}>
              마이크 선택
            </Heading>
            <Select
              placeholder="사용할 마이크 선택"
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
            >
              {inputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || "이름 없는 장치"}
                </option>
              ))}
            </Select>
          </Box>

          <Box
            flex="1"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg={bgColor}
            borderColor={borderColor}
          >
            <Heading size="sm" mb={3} ml={1}>
              음성 인식 언어
            </Heading>
            <Select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
              <option value="ja-JP">일본어</option>
            </Select>
          </Box>

          <Box
            flex="1"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg={bgColor}
            borderColor={borderColor}
          >
            <Heading size="sm" mb={3} ml={1}>
              튜터 스타일
            </Heading>
            <RadioGroup
              onChange={setTutorStyle}
              value={tutorStyle}
              colorScheme="purple"
            >
              <Stack direction="row" wrap="wrap" pt={1} pl={2}>
                <Radio value="friendly">친절한</Radio>
                <Radio value="direct">직설적인</Radio>
                <Radio value="funny">유머있는</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        </Flex>
      </VStack>
    </Flex>
  );
}
