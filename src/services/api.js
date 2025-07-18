// API service for communicating with the backend
const API_BASE_URL = "https://drefootball-backend.onrender.com";

class ApiService {
  // Get all players
  async getPlayers() {
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  }

  // Add a new player
  async addPlayer(playerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });
      if (!response.ok) {
        throw new Error("Failed to add player");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding player:", error);
      throw error;
    }
  }

  // Update a player
  async updatePlayer(playerId, playerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });
      if (!response.ok) {
        throw new Error("Failed to update player");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating player:", error);
      throw error;
    }
  }

  // Delete a player
  async deletePlayer(playerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${playerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete player");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting player:", error);
      throw error;
    }
  }

  // Upload image
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
}

export default new ApiService();


