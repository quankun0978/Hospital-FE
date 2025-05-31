import axiosInstance from './axios';
import type { AxiosResponse } from 'axios';
import { BaseEntity } from '../model/BaseEntity';
import { User } from '../model/User';
import { Doctor } from '../model/Doctor';
import { Patient } from '../model/Patient';
import type { ApiResponse } from '../model/ApiResponse';
import type { QueryParameters } from '../model/QueryParameters';
import type { PaginatedResponse } from '../model/PaginatedResponse';
import type { DoctorInfo } from '../model/DoctorInfo';
import type { Clinic } from '../model/Clinic';


// =============== PHƯƠNG THỨC API CHUNG ===============

// Phương thức GET chung
export const fetchData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức GET với tham số
export const fetchDataWithParams = async <T>(url: string, params: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức POST chung
export const postData = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(url, data);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức PUT chung
export const updateData = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức DELETE chung
export const deleteData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(url);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Hàm xử lý lỗi chung
export const handleApiError = <T>(error: any): ApiResponse<T> => {
  if (error.response) {
    // Máy chủ trả về lỗi (status code không phải 2xx)
    return {
      success: false,
      message: error.response.data.errors[0] || 'Lỗi từ máy chủ',
      errors: error.response.data.errors,
    };
  } else if (error.request) {
    // Không nhận được phản hồi từ máy chủ
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ',
    };
  } else {
    // Lỗi khi thiết lập request
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi',
    };
  }
};

// =============== API CỤ THỂ ===============

// Đã tách các api sang file riêng
