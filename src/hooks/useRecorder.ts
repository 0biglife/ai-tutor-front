import { useEffect, useRef, useState } from "react";

/**
 * @memo
 * 음성 입력 기반 AI 튜터 기능 구현을 위해 제작한 커스텀 훅입니다
 *
 * - 녹음 시작/중지 및 Blob 반환, 재생 기능 지원
 * - 실시간 마이크 입력 음량 추적 (volume 값으로 시각화 가능)
 * - React 마운트/언마운트 시 자원 정리 포함
 * - 브라우저 권한 및 MediaRecorder API 기반으로 동작
 *
 */

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [audioUrl]);

  const processVolume = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      animationFrameId.current = requestAnimationFrame(tick);
    };

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    tick();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    processVolume(stream);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve(new Blob());

      const stream = mediaRecorderRef.current.stream;
      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);

        stream.getTracks().forEach((track) => track.stop());

        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        resolve(blob);
      };

      mediaRecorder.stop();
    });
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setIsRecording(false);
    audioChunks.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
