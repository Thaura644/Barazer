import axios from "axios";

interface TextDataPayload {
  userId: string | undefined;
  text: string;
}

interface VoiceDataPayload {
  userId: string | undefined;
  audioUri: string;
}

const BASE_URL = "https://example.com/api"; // Replace with your backend API's base URL

export const dataApi = {
  /**
   * Donate text data to the API.
   * @param payload - An object containing the userId and the text to donate.
   * @returns A promise resolving to the API response.
   */
  donateTextData: async (payload: TextDataPayload) => {
    try {
      const response = await axios.post(`${BASE_URL}/donate-text`, payload);
      return response.data;
    } catch (error: any) {
      console.error("Error donating text data:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to donate text data."
      );
    }
  },

  /**
   * Donate voice data to the API.
   * @param payload - An object containing the userId and the URI of the recorded audio.
   * @returns A promise resolving to the API response.
   */
  donateVoiceData: async (payload: VoiceDataPayload) => {
    try {
      const formData = new FormData();
      formData.append("userId", payload.userId || "");
      formData.append("audio", {
        uri: payload.audioUri,
        name: "audio_recording.m4a",
        type: "audio/m4a",
      } as any); // `as any` is used to handle compatibility with FormData.

      const response = await axios.post(`${BASE_URL}/donate-voice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error donating voice data:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to donate voice data."
      );
    }
  },
};
