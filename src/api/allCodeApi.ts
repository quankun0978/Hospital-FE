import { fetchData } from './commonFunction'

export interface AllCode {
  id: number
  codeKey: string
  codeType: string
  valueEn: string
  valueVi: string
}

const allCodeApi = {
  // Lấy danh sách AllCode theo type (không phân trang) - dùng cho dropdown
  getCodeOptions: (codeType: string) => {
    return fetchData<AllCode[]>(`/AllCode/options/${codeType}`)
  },

  // Lấy tất cả code types
  getCodeTypes: () => {
    return fetchData<string[]>('/AllCode/code-types')
  }
}

export default allCodeApi 