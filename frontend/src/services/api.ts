interface TutorChatPayload {
  message: string;
  modality?: string;
  feynman_level?: string;
  username?: string;
  egyptian_dialect?: boolean;
  language?: string;
}

interface TutorChatResponse {
  sender: string;
  text: string;
  feynman_level: string;
  modality: string;
  language: string;
  status: string;
}

// Dynamic API Base URL resolution (Uses environment variable or local backend fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class ApiService {
  /**
   * Send chat prompt to FastAPI tutor endpoint
   */
  static async sendTutorMessage(payload: TutorChatPayload): Promise<TutorChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API connection offline, using fallback client response generation:', error);
      throw error;
    }
  }

  /**
   * Check backend service health status
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
