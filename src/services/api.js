const API_BASE_URL = 'https://drefootball-backend.onrender.com/api';

class ApiService {
  // دالة لجلب جميع اللاعبين
  static async getPlayers() {
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  // دالة لإضافة لاعب جديد
  static async addPlayer(player) {
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add player');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  }

  // دالة لتحديث لاعب
  static async updatePlayer(id, player) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update player');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  // دالة لحذف لاعب
  static async deletePlayer(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete player');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }

  // دالة لرفع صورة
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // دالة للتحقق من كلمة المرور
  static async authenticate(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error authenticating:', error);
      throw error;
    }
  }
}

export default ApiService;


