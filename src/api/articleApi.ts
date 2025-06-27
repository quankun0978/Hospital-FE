import { fetchData, fetchDataWithParams, postData, updateData, deleteData } from './commonFunction';
import axios from './axios';

// Interface cho Article
export interface Article {
  articleId: string;
  title: string;
  slug?: string;
  description?: string;
  contentHtml?: string;
  content?: string;
  authorId: string;
  authorName?: string;
  publishedAt: string;
  updatedAt?: string;
}

// Interface cho tạo article mới
export interface CreateArticleDto {
  title: string;
  slug?: string;
  description?: string;
  contentHtml?: string;
  content?: string;
  authorId: string;
}

// Interface cho cập nhật article
export interface UpdateArticleDto {
  title: string;
  slug?: string;
  description?: string;
  contentHtml?: string;
  content?: string;
}

// Interface cho phân trang
export interface QueryParameters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface cho kết quả phân trang
export interface PaginatedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  currentPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const articleApi = {
  // Lấy article có phân trang
  getArticles: (params: QueryParameters) => fetchDataWithParams<PaginatedResult<Article>>('/article', params),
  
  // Lấy article theo ID (admin only)
  getArticleById: (id: string) => fetchData<Article>(`/article/id/${id}`),
  
  // Lấy article theo slug
  getArticleBySlug: (slug: string) => fetchData<Article>(`/article/slug/${slug}`),
  
  // Lấy article theo category
  getArticlesByCategory: (category: string, params?: QueryParameters) => 
    fetchDataWithParams<Article[]>(`/article/category/${category}`, params || {}),
  
  // Lấy các bài viết nổi bật
  getFeaturedArticles: (count: number = 5) => fetchData<Article[]>(`/article/featured?count=${count}`),
  
  // Tạo article mới với JSON
  createArticle: async (data: CreateArticleDto) => {
    try {
      // Đảm bảo data được xử lý đúng encoding UTF-8
      const encodedData = {
        ...data,
        title: data.title?.trim() || '',
        description: data.description?.trim() || '',
        content: data.content?.trim() || '',
        contentHtml: data.contentHtml || '',
        slug: data.slug?.trim() || ''
      }

      console.log('=== CREATE ARTICLE DEBUG ===')
      console.log('Original data:', data)
      console.log('Encoded data:', encodedData)
      console.log('ContentHtml has Vietnamese:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(encodedData.contentHtml))
      console.log('============================')

      const response = await axios.post('/article', encodedData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Create article error:', error.response?.data || error.message)
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tạo bài viết'
      };
    }
  },
  
  // Cập nhật article với JSON
  updateArticle: async (id: string, data: UpdateArticleDto) => {
    try {
      // Đảm bảo data được xử lý đúng encoding UTF-8
      const encodedData = {
        ...data,
        title: data.title?.trim() || '',
        description: data.description?.trim() || '',
        content: data.content?.trim() || '',
        contentHtml: data.contentHtml || '',
        slug: data.slug?.trim() || ''
      }

      console.log('=== UPDATE ARTICLE DEBUG ===')
      console.log('Article ID:', id)
      console.log('Original data:', data)
      console.log('Encoded data:', encodedData)
      console.log('ContentHtml has Vietnamese:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(encodedData.contentHtml))
      console.log('============================')

      const response = await axios.put(`/article/${id}`, encodedData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Update article error:', error.response?.data || error.message)
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật bài viết'
      };
    }
  },
  
  // Xóa article
  deleteArticle: (id: string) => deleteData(`/article/${id}`),
  
  // Tạo slug từ tiêu đề
  generateSlug: async (title: string, excludeId?: string) => {
    try {
      const response = await axios.post('/article/generate-slug', {
        title,
        excludeId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tạo slug'
      };
    }
  }
};

export default articleApi; 