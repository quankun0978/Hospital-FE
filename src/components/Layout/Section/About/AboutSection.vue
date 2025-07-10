<template>
  <div>
    <!-- Promise Section -->
    <section id="promise" class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div class="grid grid-cols-12 gap-px p-6 md:p-8 bg-primary rounded-2xl">
          <div class="col-span-12 lg:col-span-4 flex items-center">
            <p class="font-bold font-serif md:text-xl text-white mb-6 md:mb-0">
              Tạo nên một nguồn thông tin sức khoẻ đáng tin cậy, dễ đọc, dễ hiểu
              cho mọi đối tượng độc giả
            </p>
          </div>
          <a
            href="#"
            class="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
          >
            <img
              width="100"
              height="100"
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis.svg"
              alt="Biên soạn bởi Bác sĩ và Dược sĩ"
            />
            <h3 class="font-medium text-base text-white md:text-center">
              Biên soạn bởi Bác sĩ và Dược sĩ
            </h3>
          </a>
          <a
            href="#"
            class="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
          >
            <img
              width="100"
              height="100"
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-2.svg"
              alt="Chính sách biên tập nội dung minh bạch"
            />
            <h3 class="font-medium text-base text-white md:text-center">
              Chính sách biên tập minh bạch
            </h3>
          </a>
          <a
            href="#"
            class="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
          >
            <img
              width="100"
              height="100"
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-3.svg"
              alt="Chính sách quảng cáo"
            />
            <h3 class="font-medium text-base text-white md:text-center">
              Chính sách quảng cáo
            </h3>
          </a>
          <a
            href="#"
            class="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
          >
            <img
              width="100"
              height="100"
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-4.svg"
              alt="Chính sách bảo mật"
            />
            <h3 class="font-medium text-base text-white md:text-center">
              Chính sách bảo mật
            </h3>
          </a>
        </div>
      </div>
    </section>

    <!-- Video & Press Section -->
    <section class="bg-white">
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 px-4 py-3 md:py-4 gap-4"
      >
        <div
          class="cols-span-1 lg:col-span-2 flex flex-col bg-slate-100 rounded-xl"
        >
          <div
            class="bg-slate-200 rounded-lg w-full aspect-video relative overflow-hidden"
          >
            <!-- Sử dụng iframe để nhúng video trực tiếp -->
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/MftRcZCHbwI"
              title="Giới thiệu Hospital"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="absolute inset-0"
            ></iframe>
          </div>
          <h2 class="font-semibold p-4 m-0 text-xl">Giới thiệu Hospital</h2>
        </div>
        <div class="cols-span-1 lg:col-span-3 relative flex flex-col">
          <h2 class="text-xl font-semibold px-4 mb-0">
            Báo chí nói về chúng tôi
          </h2>
          <div class="flex-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100">
              <a
                v-for="(press, index) in pressReferences"
                :key="index"
                :href="press.link"
                target="_blank"
                rel="noopener noreferrer"
                class="flex gap-3 p-4 bg-white"
              >
                <div class="flex-1">
                  <img
                    class="h-5 w-auto"
                    :src="press.logo"
                    :alt="press.source"
                  />
                  <h3
                    class="font-medium text-sm line-clamp-3 mt-2 hover:underline"
                  >
                    {{ press.title }}
                  </h3>
                </div>
                <div
                  class="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-200"
                >
                  <img
                    class="absolute aspect-square inset-0 object-cover"
                    :src="press.image"
                    :alt="press.title"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download App Section -->
    <section id="download" class="bg-primary">
      <div class="max-w-7xl mx-auto md:grid md:grid-cols-12">
        <div
          class="px-4 py-6 lg:py-12 text-white space-y-6 md:col-span-5 lg:col-span-4"
        >
          <h2 class="text-2xl md:text-4xl font-bold">Tải app Hospital ngay</h2>
          <ul class="space-y-4">
            <li class="flex items-center">
              <img :src="hospitalIcon" class="mr-1" alt="Hospital Icon" />
              Đặt lịch khám nhanh chóng, tiện lợi
            </li>
            <li class="flex items-center">
              <img :src="thumbsUpIcon" class="mr-1" alt="Thumbs Up Icon" />
              Chất lượng dịch vụ đảm bảo
            </li>
            <li class="flex items-center">
              <img
                :src="shieldSecurityIcon"
                class="mr-1"
                alt="Shield Security Icon"
              />
              Bảo mật thông tin tuyệt đối
            </li>
            <li class="flex items-center">
              <img :src="walletIcon" class="mr-1" alt="Wallet Icon" />
              Thanh toán an toàn, đa dạng
            </li>
          </ul>
          <div class="flex gap-4 justify-center md:justify-start">
            <a href="#" title="Tải về từ Google Play">
              <img
                width="135"
                height="40"
                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/google-play.svg"
                alt="Google Play"
              />
            </a>
            <a href="#" title="Tải về từ App Store">
              <img
                width="120"
                height="40"
                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/apple-store.svg"
                alt="Apple Store"
              />
            </a>
          </div>
        </div>
        <div
          class="md:col-span-7 lg:col-span-8 relative overflow-hidden flex items-end justify-center"
        >
          <img
            class="absolute top-0 lg:-top-1/2"
            width="734"
            height="734"
            src="https://cdn.youmed.vn/wp-content/themes/youmed/images/circle.svg"
            alt="Decor"
          />
          <div class="relative mx-auto">
            <img
              class="mx-auto"
              width="650"
              height="420"
              src="https://cdn.youmed.vn/wp-content/themes/youmed/images/app-download.svg"
              alt="iPhone"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import hospitalIcon from "@/assets/images/hospital.svg";
import thumbsUpIcon from "@/assets/images/thumbs-up.svg";
import shieldSecurityIcon from "@/assets/images/shield-security.svg";
import walletIcon from "@/assets/images/wallet.svg";

const pressReferences = [
  {
    source: "Thanh Niên",
    logo: "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2022/08/logo-bao-thanh-nien-scaled.jpg?width=60",
    title: "Ứng dụng smartphone YouMed giúp đặt lịch khám bệnh",
    image:
      "https://images2.thanhnien.vn/zoom/600_315/Uploaded/nthanhluan/2019_06_16/2_NERS.jpg",
    link: "https://thanhnien.vn/ung-dung-smartphone-youmed-giup-dat-lich-kham-benh-185859083.htm",
  },
  {
    source: "Sức khỏe đời sống",
    logo: "https://static.mediacdn.vn/suckhoedoisong/image/logo.svg",
    title:
      '"Chuyển đổi số y tế - xu hướng không thể đi ngược trong thời đại 4.0"',
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2022/5/16/1-1652672040175585266435.jpg",
    link: "https://suckhoedoisong.vn/chuyen-doi-so-y-te-xu-huong-khong-the-di-nguoc-trong-thoi-dai-40-169220516103512466.htm",
  },
  {
    source: "Bệnh viện Quân y 175",
    logo: "https://cdn.youmed.vn/photos/186f542e-45e0-416b-9050-b258bfd2317b.png?width=60",
    title: "Bệnh viện Quân y 175 ra mắt ứng dụng đặt khám trực tuyến",
    image:
      "https://cdn.youmed.vn/wp-content/uploads/2023/05/bv-quan-y-175.jpg?width=120",
    link: "https://bvranghammat.com/tin-tuc-thong-bao/benh-vien-rang-ham-mat-tphcm-phoi-hop-cung-youmed-trien-khai-dat-lich-online/",
  },
  {
    source: "Y học cổ truyền",
    logo: "https://cdn.youmed.vn/photos/fb4179f1-d0e9-4e2a-98a2-26e6efe7add8.png?width=40&height=40",
    title: "Bệnh viện Y Học Cổ Truyền có mặt trên ứng dụng YouMed",
    image:
      "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2021/08/leaflet-01-e1634787653628.png",
    link: "https://www.yhct.vn/ChiTiet_BV.aspx?.=424",
  },
];
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
