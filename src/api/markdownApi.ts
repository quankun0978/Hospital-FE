import axios from './axios';

const API_URL = '/Markdown';

const getMarkdownById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getMarkdownById,
};
