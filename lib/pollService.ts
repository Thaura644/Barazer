import axios from "axios";

// Base URL for your API
const API_BASE_URL = "https://your-backend-api.com/api";

interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  userId: string;
}

interface VoteData {
  pollId: string;
  optionId: string;
  userId: string;
}

const pollService = {
  /**
   * Fetch all polls.
   */
  getAllPolls: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/polls`);
      return response.data;
    } catch (error) {
      console.error("Error fetching polls:", error);
      throw error;
    }
  },

  /**
   * Fetch details of a specific poll.
   * @param pollId ID of the poll to fetch.
   */
  getPollById: async (pollId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/polls/${pollId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching poll with ID ${pollId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new poll.
   * @param data Data for creating the poll.
   */
  createPoll: async (data: CreatePollData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/polls`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  },

  /**
   * Submit a vote for a poll option.
   * @param data Data for voting.
   */
  vote: async (data: VoteData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/polls/vote`, data);
      return response.data;
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  },

  /**
   * Fetch statistics for a poll.
   * @param pollId ID of the poll to fetch statistics for.
   */
  getPollStatistics: async (pollId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/polls/${pollId}/statistics`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching statistics for poll with ID ${pollId}:`,
        error
      );
      throw error;
    }
  },
};

export default pollService;
