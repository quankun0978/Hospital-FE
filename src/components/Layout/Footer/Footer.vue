<template>
  <footer class="relative site-footer bg-gray-50 py-3">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:pt-10">
      <div class="px-4 py-6 text-sm col-span-12 sm:col-span-6 lg:col-span-4 space-y-2">
        <p class="font-semibold">{{ t('components.footer.company.name') }}</p>
        <p><strong>{{ t('components.footer.company.address').split(':')[0] }}:</strong> {{ t('components.footer.company.address').split(':')[1] }}</p>
        <p>
          <strong>{{ t('components.footer.company.hotline').split(':')[0] }}:</strong> <a href="tel:19002805" class="font-medium hover:underline">1900-2805</a> (8:00 - 17:30 từ T2 đến T7)
        </p>
        <p>{{ t('components.footer.company.license') }}</p>
        <p>
          {{ t('components.footer.company.contentResponsible') }}
          <a href="#" class="hover:underline underline-offset-2 hover:text-primary font-medium">
            {{ t('components.footer.company.contentManager') }}</a>.
        </p>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-2">
        <label for="checkbox-about-us"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          {{ t('components.footer.sections.aboutUs.title') }}
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="checkbox-about-us" id="checkbox-about-us" class="check-button" />
        <ul id="footer-1" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.aboutUs.links.intro') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.aboutUs.links.management') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.aboutUs.links.recruitment') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.aboutUs.links.contact') }}</a></li>
        </ul>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
        <label for="check-services"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          {{ t('components.footer.sections.services.title') }}
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="check-services" id="check-services" class="check-button" />
        <ul id="footer-2" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.services.links.bookDoctor') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.services.links.bookHospital') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.services.links.bookClinic') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.services.links.youmedStore') }}</a></li>
          <li class="menu-item hover:underline"><a href="#" target="_blank">{{ t('components.footer.sections.services.links.y360') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.services.links.youmedClinic') }}</a></li>
        </ul>
      </div>
      <div class="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
        <label for="check-more"
          class="flex items-center justify-between cursor-pointer sm:cursor-auto py-6 text-sm font-semibold">
          {{ t('components.footer.sections.support.title') }}
          <img :src="chevronDownIcon" class="block md:hidden opacity-40" alt="Mở rộng" />
        </label>
        <input type="checkbox" name="check-more" id="check-more" class="check-button" />
        <ul id="footer-3" class="list-none p-0 block text-sm space-y-2 transition-all">
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.support.links.termsOfUse') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.support.links.privacyPolicy') }}</a></li>
          <li class="menu-item hover:underline"><a href="#">{{ t('components.footer.sections.support.links.complaintPolicy') }}</a></li>
          <li>{{ t('components.footer.sections.support.links.customerSupport') }} <a href="mailto:support@youmed.vn" class="hover:underline">support@youmed.vn</a></li>
        </ul>
      </div>
      <div class="px-4 py-6 md:py-0 text-sm col-span-12 md:col-span-4 space-y-2">
        <div class="flex justify-center md:justify-start items-center text-sm font-semibold">
          {{ t('components.footer.sections.connect.title') }}
        </div>
        <ul class="flex space-x-3 items-center justify-center md:justify-start">
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/facebook.svg" width="24" height="24"
                loading="lazy" alt="{{ t('components.footer.sections.connect.socials.facebook') }}">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/youtube.svg" width="24" height="24"
                loading="lazy" alt="{{ t('components.footer.sections.connect.socials.youtube') }}">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/linkedin.svg" width="24" height="24"
                loading="lazy" alt="{{ t('components.footer.sections.connect.socials.linkedin') }}">
            </a>
          </li>
          <li>
            <a href="#" target="_blank">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/zalo.svg" width="36" height="16" loading="lazy"
                alt="{{ t('components.footer.sections.connect.socials.zalo') }}">
            </a>
          </li>
        </ul>
      </div>
      <div class="col-span-12 md:col-span-8 px-4 py-6 md:p-6">
        <ul class="flex space-x-4 items-center justify-center md:justify-end">
          <li>
            <a href="#" target="_blank"
              :title="t('components.footer.sections.certification.bct')">
              <img src="https://cdn.youmed.vn/wp-content/themes/youmed/images/dadangky.svg" width="79" height="30"
                loading="lazy" :alt="t('components.footer.sections.certification.bct')" />
            </a>
          </li>
          <li>
            <a href="#"
              target="_blank" :title="t('components.footer.sections.certification.dmca')">
              <img src="https://images.dmca.com/Badges/dmca-badge-w250-2x1-04.png?ID=a74b3497-ddcd-4860-89c3-fce83c39f12a"
                loading="lazy" width="60" height="30" :alt="t('components.footer.sections.certification.dmca')" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl text-xs text-center mx-auto md:border-t border-slate-100 py-6 px-4">
      <p>
        {{ t('components.footer.disclaimer.usage') }}<br class="hidden lg:block" />
        {{ t('components.footer.disclaimer.warning') }}
      </p>
      <p class="mt-1">
        {{ t('components.footer.disclaimer.copyright').replace('{year}', new Date().getFullYear()) }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from '@/i18n/useI18n';
import chevronDownIcon from '@/assets/images/chevron-down.svg';

const { t } = useI18n();
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
