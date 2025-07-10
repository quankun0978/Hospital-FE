<template>
  <div class="home-page">
    <!-- Main Search Section -->
    <MainSearch />
    <MainHeading
      title="Đặt khám trực tuyến"
      subtitle="Nhanh chóng, tiện lợi, an toàn với hệ thống đặt lịch khám hiện đại"
    />
    <main class="container-full mx-auto py-8">
      <!-- Booking Section for Doctors -->
      <Booking
        id="booking-doctors"
        title="Đặt khám bác sĩ"
        description="Phiếu khám kèm số thứ tự và thời gian của bạn được xác nhận."
        viewMoreLink="/doctors"
        isFirst
        itemsContainerClass="doctor-cards"
      >
        <DoctorCardsContainer :limit="8" />
      </Booking>

      <!-- Booking Section for Hospitals -->
      <Booking
        id="booking-hospitals"
        title="Đặt khám bệnh viện"
        description="Đặt khám và thanh toán để có phiếu khám trước khi đi khám."
        viewMoreLink="/clinics?type=hospital"
        itemsContainerClass="hospital-cards"
      >
        <ClinicCardsContainer :limit="8" :showOnlyHospitals="true" />
      </Booking>

      <!-- Booking Section for Clinics -->
      <Booking
        id="booking-clinics"
        title="Đặt khám phòng khám"
        description="Đa dạng phòng khám với nhiều chuyên khoa khác nhau."
        viewMoreLink="/clinics?type=clinic"
        itemsContainerClass="clinic-cards"
      >
        <ClinicCardsContainer :limit="8" :showOnlyClinics="true" />
      </Booking>

      <Booking
        id="booking-specialties"
        title="Đặt lịch theo Chuyên khoa"
        description="Danh sách bác sĩ, bệnh viện, phòng khám theo chuyên khoa"
        viewMoreLink="/clinics"
        :useDetailsView="true"
        itemsContainerClass="hospital-cards"
      >
        <SpecialtyContainer />
      </Booking>

      <!-- News Section -->
      <MainHeading
        title="Tin tức y tế"
        subtitle="Cập nhật những thông tin y tế mới nhất, hữu ích cho sức khỏe của bạn"
      />
      <NewsSection />
    </main>

    <!-- About Section -->
    <AboutSection />
    <!-- Security Section -->
    <SecuritySection />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MainSearch from "@/components/Layout/Section/MainSearch/MainSearch.vue";
import Booking from "@/components/Layout/Section/Booking/Booking.vue";
import DoctorCardsContainer from "@/components/Layout/Section/Booking/DoctorCardsContainer.vue";
import ClinicCardsContainer from "@/components/Layout/Section/Booking/ClinicCardsContainer.vue";
import NewsSection from "@/components/Layout/Section/News/NewsSection.vue";
import AboutSection from "@/components/Layout/Section/About/AboutSection.vue";
import SecuritySection from "@/components/Layout/Section/Security/SecuritySection.vue";
import MainHeading from "@/components/Layout/Heading/MainHeading.vue";
import SpecialtyContainer from "../components/Layout/Section/Booking/SpecialtyContainer.vue";
</script>

<style scoped>
.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

.hover\:bg-primary-dark:hover {
  background-color: #1d4ed8;
}
</style>
