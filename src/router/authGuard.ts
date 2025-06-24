import { useAuthStore } from "../store/auth";
import authApi from "../api/authApi";
import Message from "../plugins/message";
import { constants } from "../constants/constants";
import userApi from "../api/userApi";

// Route guard cho authentication
export const authGuard = async (to: any, from: any, next: any) => {
  try {
    // Kiểm tra xem có access token không
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const authStore = useAuthStore();

    // Nếu không có cả hai token, yêu cầu đăng nhập
    if (!accessToken && !refreshToken) {
      if (constants.ROUTE_PERMISSION.includes(to.path) || to.path.startsWith('/admin')) {
        Message.error("Vui lòng đăng nhập để tiếp tục");
        authStore.logout();
        next("/login");
        return;
      }
    }

    // Nếu có refresh token nhưng không có access token, thử refresh
    if (!accessToken && refreshToken) {
      try {
        const refreshResult = await authApi.refreshToken({ refreshToken });

        if (refreshResult.success && refreshResult.data) {
          // Lưu token mới
          localStorage.setItem("accessToken", refreshResult.data.accessToken);
          if (refreshResult.data.refreshToken) {
            localStorage.setItem(
              "refreshToken",
              refreshResult.data.refreshToken
            );
          }

          // Cập nhật auth store
          authStore.setTokens(
            refreshResult.data.accessToken,
            refreshResult.data.refreshToken
          );

          // Kiểm tra quyền truy cập sau khi refresh token
          await checkRoutePermission(to, next, authStore);
          return;
        } else {
          // Refresh token hết hạn hoặc không hợp lệ
          authStore.logout();
          Message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          next("/login");
          return;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        authStore.logout();
        Message.error("Lỗi xác thực, vui lòng đăng nhập lại");
        next("/login");
        return;
      }

      // Nếu có access token, cho phép đi tiếp
    } else {
      // await handleGetInfoUser();
      // Kiểm tra quyền truy cập
      await checkRoutePermission(to, next, authStore);
    }
  } catch (error) {
    console.error("Auth guard error:", error);
    const authStore = useAuthStore();
    authStore.logout();
    Message.error("Lỗi xác thực, vui lòng đăng nhập lại");
    next("/login");
  }
};

// Hàm kiểm tra quyền truy cập route
const checkRoutePermission = async (to: any, next: any, authStore: any) => {
  // Kiểm tra nếu route yêu cầu quyền đặc biệt
  if (to.meta?.requiresRole) {
       
    
    const requiredRoles = to.meta.requiresRole;
    const currentUserRole = localStorage.getItem('userRole');
    
    // Kiểm tra quyền
    if (!requiredRoles.includes(currentUserRole)) {
      Message.error("Bạn không có quyền truy cập trang này");
      
      // Redirect dựa trên role
      if (currentUserRole === 'R3') {
        next("/"); // Bệnh nhân về trang chủ
      } else if (currentUserRole === 'R2' || currentUserRole === 'R1') {
        next("/admin"); // Bác sĩ về dashboard admin
      } else {
        next("/");
      }
      return;
    }
  }
  
  next();
};

const handleGetInfoUser = async () => {
  try {
    const authStore = useAuthStore();
    const response = await userApi.getProfile();
    if (response.succeeded && response.data) {
      authStore.setUser(response.data);
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
};

// Route guard để ngăn user đã login vào trang login
export const guestGuard = (to: any, from: any, next: any) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // Nếu đã đăng nhập, chuyển về trang chủ
    next("/");
  } else {
    next();
  }
};
