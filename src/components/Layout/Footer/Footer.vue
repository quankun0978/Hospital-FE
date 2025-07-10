<template>
  <footer class="relative site-footer bg-gray-50 py-3">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:pt-10">
      <div class="px-4 py-6 text-sm col-span-12 sm:col-span-6 lg:col-span-4 space-y-2">
        <p class="font-semibold">Hospital Management System</p>
        <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
        <p>
          <strong>Hotline:</strong> <span class="font-medium">1900-2805</span> (8:00 - 17:30 từ T2 đến T7)
        </p>
        <p>Giấy phép kinh doanh số: 0123456789</p>
        <p>
          Chịu trách nhiệm nội dung:
          <span class="font-medium">
            Nguyễn Văn A</span>.
        </p>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-2">
        <label for="checkbox-about-us"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          Về chúng tôi
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="checkbox-about-us" id="checkbox-about-us" class="check-button" />
        <ul id="footer-1" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item"><span>Giới thiệu</span></li>
          <li class="menu-item"><span>Ban lãnh đạo</span></li>
          <li class="menu-item"><span>Tuyển dụng</span></li>
          <li class="menu-item"><span>Liên hệ</span></li>
        </ul>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
        <label for="check-services"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          Dịch vụ
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="check-services" id="check-services" class="check-button" />
        <ul id="footer-2" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item"><span>Đặt khám bác sĩ</span></li>
          <li class="menu-item"><span>Đặt khám bệnh viện</span></li>
          <li class="menu-item"><span>Đặt khám phòng khám</span></li>
          <li class="menu-item"><span>Dịch vụ y tế</span></li>
          <li class="menu-item"><span>Y tế 360</span></li>
          <li class="menu-item"><span>Phòng khám</span></li>
        </ul>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
        <label for="check-more"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          Hỗ trợ
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="check-more" id="check-more" class="check-button" />
        <ul id="footer-3" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item"><span>Điều khoản sử dụng</span></li>
          <li class="menu-item"><span>Chính sách bảo mật</span></li>
          <li class="menu-item"><span>Chính sách khiếu nại</span></li>
          <li>Hỗ trợ khách hàng: <span>support@hospital.vn</span></li>
        </ul>
      </div>
      <div class="px-4 py-6 md:py-0 text-sm col-span-12 md:col-span-4 space-y-2">
        <div class="flex justify-center md:justify-start items-center text-sm font-semibold">
          Kết nối với chúng tôi
        </div>
        <ul class="flex space-x-3 items-center justify-center md:justify-start">
          <li>
            <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/facebook.svg" width="24" height="24"
              loading="lazy" alt="Facebook">
          </li>
          <li>
            <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/youtube.svg" width="24" height="24"
              loading="lazy" alt="Youtube">
          </li>
          <li>
            <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/linkedin.svg" width="24" height="24"
              loading="lazy" alt="LinkedIn">
          </li>
          <li>
            <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/zalo.svg" width="36" height="16" loading="lazy"
              alt="Zalo">
          </li>
        </ul>
      </div>
      <div class="col-span-12 md:col-span-8 px-4 py-6 md:p-6">
        <ul class="flex space-x-4 items-center justify-center md:justify-end">
          <li>
            <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/dadangky.svg" width="79" height="30"
              loading="lazy" alt="Đã đăng ký với Bộ Công Thương" title="Đã đăng ký với Bộ Công Thương" />
          </li>
          <li>
            <img src="https://images.dmca.com/Badges/dmca-badge-w250-2x1-04.png?ID=a74b3497-ddcd-4860-89c3-fce83c39f12a"
              loading="lazy" width="60" height="30" alt="Bảo vệ bản quyền DMCA" title="Bảo vệ bản quyền DMCA" />
          </li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl text-xs text-center mx-auto md:border-t border-slate-100 py-6 px-4">
      <p>
        Thông tin trên website chỉ dành cho mục đích tham khảo, tra cứu.<br class="hidden lg:block" />
        Vui lòng không sử dụng thông tin này để tự chẩn đoán và điều trị.
      </p>
      <p class="mt-1">
        © {{ new Date().getFullYear() }} Hospital Management System. Tất cả quyền được bảo lưu.
      </p>
    </div>
  </footer>
</template>

<script setup>
import chevronDownIcon from '@/assets/images/chevron-down.svg';
</script>

<style scoped>
.check-button {
  display: none;
}

@media (max-width: 767px) {
  .check-button:not(:checked) + ul {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
  
  .check-button:checked + ul {
    max-height: 500px;
    opacity: 1;
    padding-bottom: 1rem;
  }
}
</style>
