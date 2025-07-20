"use client";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

/**
 * @memo
 * 외부 라이브러리 사용 시 버그, 버전 충돌 및 렌더링 문제 발생으로 인해 시간이 부족하여 직접 구현하였습니다.
 * 실시간 볼륨을 시각화하며, 좌우 대칭 형태로 구성하였습니다.
 */

export default function Waveform() {
  const barColor = useColorModeValue("gray.800", "gray.200");
  const [volumes, setVolumes] = useState<number[]>(Array(100).fill(0));

  const rafId = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      analyserRef.current = analyser;

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const raw = Array.from(dataArray.slice(0, 100)).map((v) =>
          Math.max(2, Math.min(32, v / 4))
        );
        const mirrored = [...raw.slice().reverse(), ...raw];
        setVolumes(mirrored);
        rafId.current = requestAnimationFrame(tick);
      };

      tick();
    });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      h="64px"
      w="100%"
      overflow="hidden"
      px={2}
      gap={1}
    >
      {volumes.map((v, i) => (
        <Box
          key={i}
          w="1px"
          h={`${v}px`}
          bgGradient={`linear(to-t, ${barColor}, transparent, ${barColor})`}
          borderRadius="full"
          transition="all 0.1s ease"
        />
      ))}
    </Flex>
  );
}
