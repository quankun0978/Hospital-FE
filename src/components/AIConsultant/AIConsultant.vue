<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
const cozeToken = import.meta.env.VITE_COZE_TOKEN;
const botId = import.meta.env.VITE_COZE_BOT_ID;
const scripUrl = import.meta.env.VITE_COZE_SCRIPT_URL

onMounted(() => {
  const script = document.createElement('script')
  script.src = scripUrl
  script.onload = () => {
    new window.CozeWebSDK.WebChatClient({
      config: {
        bot_id: botId,
      },
      componentProps: {
        title: 'Hospital-Tư vấn',
      },
      auth: {
        type: 'token',
        token: cozeToken,
        onRefreshToken: function () {
          return 'pat_********'
        }
      }
    })
  }
  document.body.appendChild(script)
})
</script>
