<template>
  <div>
    <MainHeading
      title="An toàn & Bảo mật"
      subtitle="Cam kết bảo vệ thông tin cá nhân và dữ liệu y tế của bạn"
    />
    <section id="security" class="bg-white">
      <div class="max-w-4xl mx-auto text-center px-4 py-0">
        <div class="grid grid-cols-2 md:grid-cols-4">
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="expertIcon" width="48" height="48" alt="Expert" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              Đội ngũ chuyên gia
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="cardIcon" width="48" height="48" alt="Card" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              Thanh toán an toàn
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="shieldIcon" width="48" height="48" alt="Shield" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              Bảo mật thông tin
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="securityIcon" width="48" height="48" alt="Security" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              Hỗ trợ 24/7
            </h3>
          </div>
        </div>
        <p class="py-6 text-sm max-w-md mx-auto">
          Hospital cam kết bảo vệ thông tin cá nhân và dữ liệu y tế của bạn với các tiêu chuẩn bảo mật cao nhất.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import MainHeading from "@/components/Layout/Heading/MainHeading.vue";
import expertIcon from "@/assets/images/expert.svg";
import cardIcon from "@/assets/images/card.svg";
import shieldIcon from "@/assets/images/shield.svg";
import securityIcon from "@/assets/images/security.svg";
</script>

<style scoped>
/* Không cần thêm styles */
</style>
