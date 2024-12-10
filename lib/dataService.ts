import axios from "axios";

const API_URL = "https://your-backend-api.com"; // Replace with your backend URL

export const fetchDynamicData = async () => {
  try {
    const response = await axios.get(`${API_URL}/engagements`);
    return response.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic data:", error);
    throw error;
  }
};
