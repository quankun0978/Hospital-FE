import { fetchData, fetchDataWithParams } from './commonFunction';
import axios from './axios';

// Interface cho request thống kê doanh thu
export interface RevenueStatisticsRequestDto {
  fromDate: string; // ISO date string
  toDate: string;   // ISO date string
}

// Interface cho doanh thu theo ngày
export interface DailyRevenueDto {
  date: string; // ISO date string
  totalRevenue: number;
  appointmentCount: number;
  doctorRevenues: DoctorRevenueDto[];
}

// Interface cho doanh thu của từng bác sĩ
export interface DoctorRevenueDto {
  doctorId: string;
  doctorName: string;
  revenue: number;
  appointmentCount: number;
  consultationFee: number;
}

// Interface cho tổng hợp thống kê doanh thu
export interface RevenueStatisticsDto {
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  totalAppointments: number;
  averageRevenuePerDay: number;
  dailyRevenues: DailyRevenueDto[];
  topDoctors: DoctorRevenueDto[];
}

// Interface cho biểu đồ doanh thu
export interface RevenueChartDto {
  labels: string[];
  data: number[];
  appointmentCounts: number[];
}

// Interface cho tổng quan thống kê
export interface StatisticsOverview {
  totalRevenue: number;
  totalAppointments: number;
  averageRevenuePerDay: number;
  topDoctors: DoctorRevenueDto[];
  period: {
    from: string;
    to: string;
  };
}

// Interface cho parameters của overview
export interface OverviewParameters {
  fromDate?: string;
  toDate?: string;
}

const statisticsApi = {
  // Lấy thống kê doanh thu theo khoảng thời gian
  getRevenueStatistics: async (request: RevenueStatisticsRequestDto) => {
    try {
      console.log('Getting revenue statistics with data:', request);
      
      const response = await axios.post('/statistics/revenue', request, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'utf-8'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data as RevenueStatisticsDto,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get revenue statistics error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi lấy thống kê doanh thu'
      };
    }
  },

  // Lấy dữ liệu biểu đồ doanh thu
  getRevenueChartData: async (request: RevenueStatisticsRequestDto) => {
    try {
      console.log('Getting revenue chart data with:', request);
      
      const response = await axios.post('/statistics/revenue/chart', request, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'utf-8'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data as RevenueChartDto,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get revenue chart data error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi lấy dữ liệu biểu đồ'
      };
    }
  },

  // Xuất báo cáo doanh thu ra file Excel
  exportRevenueReport: async (request: RevenueStatisticsRequestDto) => {
    try {
      console.log('Exporting revenue report with:', request);
      
      const response = await axios.post('/statistics/revenue/export', request, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'utf-8'
        },
        responseType: 'blob' // Quan trọng cho file download
      });

      // Tạo URL để download file
      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8;'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BaoCaoDoanhThu_${request.fromDate}_${request.toDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        succeeded: true,
        message: 'Xuất báo cáo thành công'
      };
    } catch (error: any) {
      console.error('Export revenue report error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi xuất báo cáo'
      };
    }
  },

  // Lấy thống kê tổng quan (cho dashboard)
  getStatisticsOverview: (params: OverviewParameters = {}) => {
    return fetchDataWithParams<StatisticsOverview>('/statistics/overview', params);
  },
};

export default statisticsApi; 