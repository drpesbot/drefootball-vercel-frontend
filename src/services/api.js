// API service for communicating with the backend
const API_BASE_URL = "https://drefootball-backend.onrender.com";

class ApiService {
  // Authenticate user
  async authenticate(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        // If response is not ok, it means authentication failed on backend
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error during authentication:", error);
      throw error;
    }
  }

  // Get all players
  async getPlayers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players`);
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
  async addPlayer(playerData, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          player: playerData
        }),
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
  async updatePlayer(playerId, playerData, password) {
    try {
      const response = await await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          player: playerData
        }),
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
  async deletePlayer(playerId, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password
        }),
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
  async uploadImage(file, password) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
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


