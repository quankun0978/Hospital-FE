import axios from './axios';

export interface CozeChatRequest {
  user?: string;
  query: string;
}

export interface CozeChatResponse {
  succeeded: boolean;
  data?: {
    answer: string;
    followUp: string[];
    conversationId: string;
  };
  debug?: {
    originalQuery: string;
    enrichedQuery: string;
  };
  message?: string;
  error?: string;
}

const cozeApi = {
  chat: async (data: CozeChatRequest): Promise<CozeChatResponse> => {
    try {
      const response = await axios.post('/coze/chat', {
        user: data.user || 'user-123',
        query: data.query
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 45000 // Tăng timeout lên 45 giây
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Coze chat error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi chat với Coze',
        error: error.response?.data?.error
      };
    }
  }
};

export default cozeApi; 