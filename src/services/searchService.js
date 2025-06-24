import axiosInstance from '@/api/axios';

export const searchService = {
  // Tìm kiếm toàn cục
  async globalSearch(params) {
    const response = await axiosInstance.get('/search/global', { params });
    return response.data;
  },

  // Tìm kiếm với MeiliSearch
  async meiliSearch(params) {
    const response = await axiosInstance.get('/search/meilisearch', { params });
    return response.data;
  },

  // Lấy gợi ý tìm kiếm
  async getSuggestions(query) {
    const response = await axiosInstance.get('/search/suggestions', { 
      params: { q: query } 
    });
    return response.data;
  },

  // Index dữ liệu vào MeiliSearch (chỉ dành cho admin)
  async indexData() {
    const response = await axiosInstance.post('/search/index');
    return response.data;
  },

  // Xóa index MeiliSearch
  async clearIndex() {
    const response = await axiosInstance.delete('/search/index');
    return response.data;
  }
};

export default searchService; 