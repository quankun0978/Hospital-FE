<template>
  <footer class="relative site-footer bg-gray-50 py-3">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:pt-10">
      <div class="px-4 py-6 text-sm col-span-12 sm:col-span-6 lg:col-span-4 space-y-2">
        <p class="font-semibold">Công ty TNHH YouMed</p>
        <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
        <p>
          <strong>Hotline:</strong> <a href="tel:19002805" class="font-medium hover:underline">1900-2805</a> (8:00 - 17:30 từ T2 đến T7)
        </p>
        <p>Giấy phép kinh doanh số: 0123456789</p>
        <p>
          Chịu trách nhiệm nội dung:
          <a href="#" class="hover:underline underline-offset-2 hover:text-primary font-medium">
            Nguyễn Văn A</a>.
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
          <li class="menu-item hover:underline"><a href="#">Giới thiệu</a></li>
          <li class="menu-item hover:underline"><a href="#">Ban lãnh đạo</a></li>
          <li class="menu-item hover:underline"><a href="#">Tuyển dụng</a></li>
          <li class="menu-item hover:underline"><a href="#">Liên hệ</a></li>
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
          <li class="menu-item hover:underline"><a href="#">Đặt khám bác sĩ</a></li>
          <li class="menu-item hover:underline"><a href="#">Đặt khám bệnh viện</a></li>
          <li class="menu-item hover:underline"><a href="#">Đặt khám phòng khám</a></li>
          <li class="menu-item hover:underline"><a href="#">Cửa hàng YouMed</a></li>
          <li class="menu-item hover:underline"><a href="#" target="_blank">Y tế 360</a></li>
          <li class="menu-item hover:underline"><a href="#">Phòng khám YouMed</a></li>
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
          <li class="menu-item hover:underline"><a href="#">Điều khoản sử dụng</a></li>
          <li class="menu-item hover:underline"><a href="#">Chính sách bảo mật</a></li>
          <li class="menu-item hover:underline"><a href="#">Chính sách khiếu nại</a></li>
          <li>Hỗ trợ khách hàng: <a href="mailto:support@youmed.vn" class="hover:underline">support@youmed.vn</a></li>
        </ul>
      </div>
      <div class="px-4 py-6 md:py-0 text-sm col-span-12 md:col-span-4 space-y-2">
        <div class="flex justify-center md:justify-start items-center text-sm font-semibold">
          Kết nối với chúng tôi
        </div>
        <ul class="flex space-x-3 items-center justify-center md:justify-start">
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/facebook.svg" width="24" height="24"
                loading="lazy" alt="Facebook">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/youtube.svg" width="24" height="24"
                loading="lazy" alt="Youtube">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/linkedin.svg" width="24" height="24"
                loading="lazy" alt="LinkedIn">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/zalo.svg" width="36" height="16" loading="lazy"
                alt="Zalo">
            </a>
          </li>
        </ul>
      </div>
      <div class="col-span-12 md:col-span-8 px-4 py-6 md:p-6">
        <ul class="flex space-x-4 items-center justify-center md:justify-end">
          <li>
            <a href="#" target="_blank"
              title="Đã đăng ký với Bộ Công Thương">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/dadangky.svg" width="79" height="30"
                loading="lazy" alt="Đã đăng ký với Bộ Công Thương" />
            </a>
          </li>
          <li>
            <a href="#"
              target="_blank" title="Bảo vệ bản quyền DMCA">
              <img src="https://images.dmca.com/Badges/dmca-badge-w250-2x1-04.png?ID=a74b3497-ddcd-4860-89c3-fce83c39f12a"
                loading="lazy" width="60" height="30" alt="Bảo vệ bản quyền DMCA" />
            </a>
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
        © {{ new Date().getFullYear() }} YouMed. Tất cả quyền được bảo lưu.
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
