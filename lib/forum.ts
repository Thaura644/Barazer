import { apiRequest } from "./apiRequest"; // Assume you have a custom function to make API requests

export const forumApi = {
  // Create a new forum
  createForum: async (params: { userId?: string }) => {
    if (!params.userId)
      throw new Error("User ID is required to create a forum");

    const response = await apiRequest({
      method: "POST",
      url: "/forums/create",
      body: { userId: params.userId },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Error creating forum");
    }
  },

  // Search for similar forums on platform "X"
  searchForums: async (query: string) => {
    try {
      const response = await apiRequest({
        method: "GET",
        url: `/forums/search`,
        params: { query },
      });

      if (response.status === 200) {
        return response.data; // Return the found forums
      } else {
        throw new Error("Failed to search forums");
      }
    } catch (error) {
      throw new Error(error.message || "Error searching forums");
    }
  },
};
