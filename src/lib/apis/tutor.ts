import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";

// AI 튜터 시작 음성 요청
export async function getInitialTutorText(
  text: string
): Promise<{ ttsUrl: string }> {
  const res = await axiosInstance.post(ENDPOINTS.TUTOR_INIT, { text });
  return res.data;
}

// 사용자 음성 전송
export async function submitAudio(formData: FormData): Promise<{
  userText: string;
  assistantText: string;
  ttsUrl: string;
  userAudioUrl: string;
  membershipId: string;
  chatUses: number;
}> {
  const res = await axiosInstance.post(ENDPOINTS.TUTOR_CHAT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
