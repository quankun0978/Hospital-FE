<template>
  <div class="px-4 md:px-6">
    <details class="group flex flex-row flex-wrap mt-10 [&_summary::-webkit-details-marker]:hidden" open>
      <summary class="grid grid-cols-3 lg:grid-cols-6">
        <SpecialtyCard
          v-for="item in showAll ? specialties : specialties.slice(0, 12)"
          :key="item.name"
          :name="item.name"
          :image="item.image"
          :link="item.link"
        />
        <div v-if="!showAll && specialties.length > 10" class="col-span-3 lg:col-span-6 flex flex-1 justify-center pt-4">
          <button @click.stop.prevent="showAll = true" class="bg-white cursor-pointer rounded-full px-3 py-1.5 shadow flex items-center group hover:bg-primary hover:text-white transition-all">
            <span class="text-sm font-medium mr-2">Xem thêm</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><g fill-rule="evenodd"><path stroke-width="2" stroke="currentColor" fill="none" d="M1 1l4 4-4 4"></path></g></svg>
          </button>
        </div>
        <div v-else-if="showAll && specialties.length > 10" class="col-span-3 lg:col-span-6 flex flex-1 justify-center pt-4">
          <button @click.stop.prevent="showAll = false" class="bg-white cursor-pointer rounded-full px-3 py-1.5 shadow flex items-center group hover:bg-primary hover:text-white transition-all">
            <span class="text-sm font-medium mr-2">Ẩn bớt</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style="transform: rotate(180deg)"><g fill-rule="evenodd"><path stroke-width="2" stroke="currentColor" fill="none" d="M1 1l4 4-4 4"></path></g></svg>
          </button>
        </div>
      </summary>
    </details>
  </div>
</template>

<script>
import SpecialtyCard from './SpecialtyCard.vue';

export default {
  name: 'SpecialtyContainer',
  components: { SpecialtyCard },
  data() {
    return {
      showAll: false,
      specialties: [
        { name: 'Y học cổ truyền', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Yhoccotruyen.png', link: 'https://youmed.vn/dat-kham/search?specialty=y-hoc-co-truyen' },
        { name: 'Truyền nhiễm', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/truyennhiem.png', link: 'https://youmed.vn/dat-kham/search?specialty=truyen-nhiem' },
        { name: 'Tim mạch', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/timmach.png', link: 'https://youmed.vn/dat-kham/search?specialty=tim-mach' },
        { name: 'Lão khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/laokhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=lao-khoa' },
        { name: 'Chấn thương chỉnh hình', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Chanthuongchinhhinh.png', link: 'https://youmed.vn/dat-kham/search?specialty=chan-thuong-chinh-hinh' },
        { name: 'Hồi sức - cấp cứu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/hoisuccapcuu.png', link: 'https://youmed.vn/dat-kham/search?specialty=hoi-suc-cap-cuu' },
        { name: 'Ngoại tổng quát', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/ngoaitongquat.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngoai-tong-quat' },
        { name: 'Gây mê hồi sức', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Gaymehoisuc.png', link: 'https://youmed.vn/dat-kham/search?specialty=gay-me-hoi-suc' },
        { name: 'Y học dự phòng', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/yhocduphong.png', link: 'https://youmed.vn/dat-kham/search?specialty=y-hoc-du-phong' },
        { name: 'Nội thận', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Noithan.png', link: 'https://youmed.vn/dat-kham/search?specialty=noi-than' },
        { name: 'Tai - Mũi - Họng', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/taimuihong.png', link: 'https://youmed.vn/dat-kham/search?specialty=tai-mui-hong' },
        { name: 'Nội tiết', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Noitiet.png', link: 'https://youmed.vn/dat-kham/search?specialty=noi-tiet' },
        { name: 'Tâm thần', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/tamthan.png', link: 'https://youmed.vn/dat-kham/search?specialty=tam-than' },
        { name: 'Hô hấp', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Hohap.png', link: 'https://youmed.vn/dat-kham/search?specialty=ho-hap' },
        { name: 'Xét nghiệm', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/xetnghiem.png', link: 'https://youmed.vn/dat-kham/search?specialty=xet-nghiem' },
        { name: 'Huyết học', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/huyet-hoc.png', link: 'https://youmed.vn/dat-kham/search?specialty=huyet-hoc' },
        { name: 'Tâm lý', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/tamly.png', link: 'https://youmed.vn/dat-kham/search?specialty=tam-ly' },
        { name: 'Phẫu thuật tạo hình (Thẩm mỹ)', image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/06/37_phauthuattaohinhthammy.png', link: 'https://youmed.vn/dat-kham/search?specialty=phau-thuat-tao-hinh-(tham-my)' },
        { name: 'Đa khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Noitongquat.png', link: 'https://youmed.vn/dat-kham/search?specialty=da-khoa' },
        { name: 'Ung bướu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/ungbuou.png', link: 'https://youmed.vn/dat-kham/search?specialty=ung-buou' },
        { name: 'Nội thần kinh', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Noithankinh.png', link: 'https://youmed.vn/dat-kham/search?specialty=noi-than-kinh' },
        { name: 'Lao - bệnh phổi', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/laobenhphoi.png', link: 'https://youmed.vn/dat-kham/search?specialty=lao-benh-phoi' },
        { name: 'Ngoại thần kinh', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Ngoaithankinh.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngoai-than-kinh' },
        { name: 'Y học thể thao', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/yhocthethao.png', link: 'https://youmed.vn/dat-kham/search?specialty=y-hoc-the-thao' },
        { name: 'Cơ xương khớp', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Coxuongkhop.png', link: 'https://youmed.vn/dat-kham/search?specialty=co-xuong-khop' },
        { name: 'Sản phụ khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/sanphukhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=san-phu-khoa' },
        { name: 'Nhãn khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Nhankhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=nhan-khoa' },
        { name: 'Nam khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Namkhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=nam-khoa' },
        { name: 'Vô sinh hiếm muộn', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/vosinhhiemmuon.png', link: 'https://youmed.vn/dat-kham/search?specialty=vo-sinh-hiem-muon' },
        { name: 'Ngoại tiết niệu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Ngoaitietnieu.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngoai-tiet-nieu' },
        { name: 'Nội tổng quát', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Noitongquat.png', link: 'https://youmed.vn/dat-kham/search?specialty=noi-tong-quat' },
        { name: 'Răng - Hàm - Mặt', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Ranghammat.png', link: 'https://youmed.vn/dat-kham/search?specialty=rang-ham-mat' },
        { name: 'Ngoại niệu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/ngoaitietnieu.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngoai-nieu' },
        { name: 'Dinh dưỡng', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dinhduong.png', link: 'https://youmed.vn/dat-kham/search?specialty=dinh-duong' },
        { name: 'Tiêu hoá', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/tieuhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=tieu-hoa' },
        { name: 'Nhi khoa', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Nhikhoa.png', link: 'https://youmed.vn/dat-kham/search?specialty=nhi-khoa' },
        { name: 'Da liễu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dalieu.png', link: 'https://youmed.vn/dat-kham/search?specialty=da-lieu' },
        { name: 'Ngoại lồng ngực - mạch máu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/ngoailongngucmachmau.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngoai-long-nguc-mach-mau' },
        { name: 'Chẩn đoán hình ảnh', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Chandoanhinhanh.png', link: 'https://youmed.vn/dat-kham/search?specialty=chan-doan-hinh-anh' },
        { name: 'Ngôn ngữ trị liệu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/ngonngutrilieu.png', link: 'https://youmed.vn/dat-kham/search?specialty=ngon-ngu-tri-lieu' },
        { name: 'Phục hồi chức năng - Vật lý trị liệu', image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/vatlitrilieu.png', link: 'https://youmed.vn/dat-kham/search?specialty=vat-ly-tri-lieu' },
      ]
    }
  }
}
</script>
