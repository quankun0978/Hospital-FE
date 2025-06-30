import axios from './axios'

interface UploadImageResponse {
  succeeded: boolean
  data?: {
    imageUrl: string
  }
  message?: string
}

export const imageApi = {
  // Upload image cho clinics
  uploadClinicImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/clinic/upload-image?folder=clinics', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải ảnh lên'
      }
    }
  },

  // Upload logo cho clinics
  uploadClinicLogo: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/clinic/upload-image?folder=logos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải logo lên'
      }
    }
  },

  // Upload image for users
  uploadUserImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/clinic/upload-image?folder=users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải ảnh lên'
      }
    }
  },

  // Upload image for doctors
  uploadDoctorImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/clinic/upload-image?folder=doctors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải ảnh lên'
      }
    }
  },

  // Upload image for specialties
  uploadSpecialtyImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/specialty/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải ảnh chuyên khoa lên'
      }
    }
  },

  // Upload medical image (prescription, test results)
  uploadMedicalImage: async (file: File): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/clinic/upload-image?folder=medical', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tải ảnh y tế lên'
      }
    }
  }
}

export default imageApi 