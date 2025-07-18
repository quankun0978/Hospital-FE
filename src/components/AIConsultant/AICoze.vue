<template>
  <div class="ai-coze-wrapper">
    <!-- Chat Toggle Icon -->
    <div class="chat-toggle-icon" @click="toggleChat" v-if="!isOpen">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <span class="chat-tooltip">AI Tư vấn</span>
    </div>

    <!-- Chat Container -->
    <div class="ai-coze-container" v-if="isOpen">
    <div class="chat-header">
      <h3>Hospital AI</h3>
      <p>Hỏi tôi bất kỳ câu hỏi nào về sức khỏe</p>
      <button class="close-button" @click="toggleChat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', message.type]"
      >
        <div class="message-content">
          <p>{{ message.content }}</p>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      
      <div v-if="isLoading" class="message ai">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <div class="input-group">
        <input
          v-model="currentMessage"
          @keypress.enter="sendMessage"
          placeholder="Nhập câu hỏi của bạn..."
          :disabled="isLoading"
          class="message-input"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading || !currentMessage.trim()"
          class="send-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import cozeApi from '../../api/cozeApi';
import  { CozeChatRequest } from '../../api/cozeApi';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

const messages = ref<Message[]>([]);
const currentMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement>();
const isOpen = ref(false);

const addMessage = (content: string, type: 'user' | 'ai') => {
  const message: Message = {
    id: Date.now().toString(),
    content,
    type,
    timestamp: new Date()
  };
  messages.value.push(message);
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = currentMessage.value.trim();
  addMessage(userMessage, 'user');
  currentMessage.value = '';
  isLoading.value = true;

  try {
    // Thêm message cho biết đang xử lý
    addMessage('Đang xử lý câu hỏi của bạn, vui lòng chờ...', 'ai');
    
    const response = await cozeApi.chat({
      query: userMessage
    });

    // Xóa message loading
    messages.value.pop();

    if (response.succeeded && response.data) {
      // Log debug info
      console.log('Debug info:', response.debug);
      
      // Hiển thị câu trả lời chính
      const aiResponse = response.data.answer || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
      addMessage(aiResponse, 'ai');
    } else {
      console.error('Chat error:', response);
      addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'ai');
    }
  } catch (error) {
    // Xóa message loading nếu có lỗi
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].content.includes('Đang xử lý')) {
      messages.value.pop();
    }
    
    console.error('Chat error:', error);
    if ((error as any).code === 'ECONNABORTED') {
      addMessage('Yêu cầu đã hết thời gian. Vui lòng thử lại với câu hỏi ngắn gọn hơn.', 'ai');
    } else {
      addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'ai');
    }
  } finally {
    isLoading.value = false;
  }
};

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && messages.value.length === 0) {
    addMessage('Xin chào! Tôi là AI tư vấn y tế. Bạn có thể hỏi tôi về các vấn đề sức khỏe.', 'ai');
  }
};
</script>

<style scoped>
.ai-coze-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.chat-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.chat-toggle-icon:hover .chat-tooltip {
  opacity: 1;
}

.ai-coze-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 350px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  position: absolute;
  bottom: 80px;
  right: 0;
}

.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.chat-header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.ai .message-content {
  background: #f1f3f4;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  background: white;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
