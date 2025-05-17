<template>
  <div>
    <MainHeading
      :title="t('components.section.security.title')"
      :subtitle="t('components.section.security.subtitle')"
    />
    <section id="security" class="bg-white">
      <div class="max-w-4xl mx-auto text-center px-4 py-0">
        <div class="grid grid-cols-2 md:grid-cols-4">
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="expertIcon" width="48" height="48" alt="Expert" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              {{ t('components.section.security.feature1') }}
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="cardIcon" width="48" height="48" alt="Card" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              {{ t('components.section.security.feature2') }}
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="shieldIcon" width="48" height="48" alt="Shield" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              {{ t('components.section.security.feature3') }}
            </h3>
          </div>
          <div class="px-4 py-6">
            <div class="inline-block rounded-full bg-primary p-3">
              <img :src="securityIcon" width="48" height="48" alt="Security" />
            </div>
            <h3 class="font-medium text-sm leading-4 pt-4">
              {{ t('components.section.security.feature4') }}
            </h3>
          </div>
        </div>
        <p class="py-6 text-sm max-w-md mx-auto">
          {{ t('components.section.security.description') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "@/i18n/useI18n";
import MainHeading from "@/components/Layout/Heading/MainHeading.vue";
import expertIcon from "@/assets/images/expert.svg";
import cardIcon from "@/assets/images/card.svg";
import shieldIcon from "@/assets/images/shield.svg";
import securityIcon from "@/assets/images/security.svg";

const { t } = useI18n();
</script>

<style scoped>
/* Không cần thêm styles */
</style>
