// API service for communicating with the backend
const API_BASE_URL = "https://drefootball-backend.onrender.com";

class ApiService {
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
  async addPlayer(playerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
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
  async updatePlayer(playerId, playerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
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
  async deletePlayer(playerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players/${playerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed"
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
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("password", "killer8speed");

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

  // Save notification token
  async saveNotificationToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/save-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
          token: token,
          timestamp: Date.now()
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save notification token");
      }
      return await response.json();
    } catch (error) {
      console.error("Error saving notification token:", error);
      throw error;
    }
  }

  // Get all notification tokens
  async getNotificationTokens() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/tokens`, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error("Failed to get notification tokens");
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting notification tokens:", error);
      throw error;
    }
  }

  // Send notification to all subscribers
  async sendNotificationToSubscribers(notificationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/send-to-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
          title: notificationData.title || "eFootball Mobile",
          message: notificationData.message,
          icon: notificationData.icon || "/favicon.ico",
          url: notificationData.url || window.location.origin
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send notification to subscribers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending notification to subscribers:", error);
      throw error;
    }
  }

  // Increment notification subscribers count
  async incrementNotificationSubscribers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/increment-subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to increment notification subscribers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error incrementing notification subscribers:", error);
      throw error;
    }
  }

  // Get notification subscribers count
  async getNotificationSubscribers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/subscribers`);
      if (!response.ok) {
        throw new Error("Failed to get notification subscribers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting notification subscribers:", error);
      throw error;
    }
  }

  // Send manual notification
  async sendManualNotification(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "killer8speed",
          message: message
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

export default new ApiService();
