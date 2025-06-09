import { message } from 'ant-design-vue';
import type { MessageArgsProps } from 'ant-design-vue';

// Cấu hình message global
message.config({
  top: '20px',
  duration: 3,
  maxCount: 3,
});

// Interface cho message options
interface MessageOptions extends Omit<MessageArgsProps, 'content'> {
  content: string;
}

// Class Message với các phương thức tiện ích
class Message {
  // Success message
  static success(content: string, options?: Partial<MessageOptions>) {
    return message.success({
      content,
      ...options,
    });
  }

  // Error message
  static error(content: string, options?: Partial<MessageOptions>) {
    return message.error({
      content,
      ...options,
    });
  }

  // Warning message
  static warning(content: string, options?: Partial<MessageOptions>) {
    return message.warning({
      content,
      ...options,
    });
  }

  // Info message
  static info(content: string, options?: Partial<MessageOptions>) {
    return message.info({
      content,
      ...options,
    });
  }

  // Loading message
  static loading(content: string, duration?: number) {
    return message.loading({
      content,
      duration: duration || 0, // 0 = không tự động tắt
    });
  }

  // Destroy all messages
  static destroy() {
    message.destroy();
  }

  // Custom message với icon
  static custom(content: string, icon?: string, options?: Partial<MessageOptions>) {
    return message.open({
      content,
      icon: icon ? `<i class="${icon}"></i>` : undefined,
      ...options,
    });
  }

  // Message cho đặt lịch thành công
  static appointmentSuccess(patientName?: string, appointmentDate?: string) {
    return this.success(
      `Đặt lịch khám thành công${patientName ? ` cho ${patientName}` : ''}${appointmentDate ? ` vào ${appointmentDate}` : ''}! Email xác nhận đã được gửi.`,
      {
        duration: 5
      }
    );
  }

  // Message cho các thao tác thành công khác
  static operationSuccess(operation: string) {
    return this.success(`${operation} thành công!`);
  }

  // Message cho các lỗi API
  static apiError(error?: string) {
    return this.error(error || 'Có lỗi xảy ra, vui lòng thử lại sau!');
  }

  // Message cho validation
  static validationError(field: string) {
    return this.error(`Vui lòng nhập ${field}!`);
  }

  // Message cho network error
  static networkError() {
    return this.error('Lỗi kết nối mạng, vui lòng kiểm tra và thử lại!');
  }

  // Message cho unauthorized
  static unauthorized() {
    return this.error('Bạn không có quyền thực hiện thao tác này!');
  }
}

export default Message; 