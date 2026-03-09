// Simple API helper for your AI Companion app

const API_BASE_URL = "http://localhost:5173/"; // change later if you deploy

export const apiClient = {
  async sendMessage(message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("API request failed");
    return response.json();
  },

  // Add entities for MoodCheckIn
  entities: {
    MoodCheckIn: {
      create: async ({ mood, energy_level, note }) => {
        // Temporary mock: simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Mood saved:", { mood, energy_level, note });
        // If you had a real API, you could do:
        // return fetch(`${API_BASE_URL}/mood-checkin`, { ... })
        return { success: true };
      },
    },
  },
};