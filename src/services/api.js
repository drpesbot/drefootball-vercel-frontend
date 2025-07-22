const API_BASE_URL = 'https://efootball-three.vercel.app/api';

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
  static async addPlayer(password, player) {
    try {
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, player }),
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
  static async updatePlayer(id, password, player) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, player }),
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
  static async deletePlayer(id, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
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
  static async uploadImage(password, file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('password', password);

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

  // دالة لجلب الإعدادات العامة
  static async getSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  // دالة لتحديث الإعدادات العامة
  static async updateSettings(password, settings) {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, settings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}

export default ApiService;

