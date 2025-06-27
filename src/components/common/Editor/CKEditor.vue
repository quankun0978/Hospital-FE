<template>
  <div class="ck-editor-wrapper">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div 
      ref="editorElement" 
      class="min-h-[300px] border border-gray-300 rounded-md"
      :class="{ 'border-red-500': error }"
    ></div>
    <div v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </div>
    <div v-if="showCharCount" class="text-right text-xs text-gray-500 mt-1">
      {{ characterCount }} ký tự
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Nhập nội dung...'
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showCharCount: {
    type: Boolean,
    default: true
  },
  minHeight: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'ready', 'change'])

const editorElement = ref(null)
let editorInstance = null
const characterCount = ref(0)

// Load CKEditor từ CDN
const loadCKEditor = () => {
  return new Promise((resolve, reject) => {
    if (window.ClassicEditor) {
      resolve(window.ClassicEditor)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js'
    script.onload = () => {
      if (window.ClassicEditor) {
        resolve(window.ClassicEditor)
      } else {
        reject(new Error('CKEditor không load được'))
      }
    }
    script.onerror = () => reject(new Error('Không thể load CKEditor'))
    document.head.appendChild(script)
  })
}

// Khởi tạo editor
const initEditor = async () => {
  try {
    const ClassicEditor = await loadCKEditor()
    
    editorInstance = await ClassicEditor.create(editorElement.value, {
      placeholder: props.placeholder,
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Tiêu đề 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Tiêu đề 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Tiêu đề 3', class: 'ck-heading_heading3' }
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells'
        ]
      }
    })

    // Set initial content
    if (props.modelValue) {
      console.log('CKEditor setting initial content:', props.modelValue.substring(0, 100) + '...')
      console.log('Initial content has Vietnamese:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(props.modelValue))
      editorInstance.setData(props.modelValue)
    }

    // Listen for changes - đảm bảo encoding UTF-8
    editorInstance.model.document.on('change:data', () => {
      const data = editorInstance.getData()
      
      console.log('CKEditor data changed:', data.substring(0, 100) + '...')
      console.log('Changed data has Vietnamese:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(data))
      
      emit('update:modelValue', data)
      
      // Update character count
      characterCount.value = data.replace(/<[^>]*>/g, '').length
      
      emit('change', data)
    })

    // Listen for focus out to ensure data is synced
    editorInstance.editing.view.document.on('blur', () => {
      const data = editorInstance.getData()
      console.log('CKEditor blur, syncing data:', data.substring(0, 100) + '...')
      emit('update:modelValue', data)
    })

    // Force initial sync after a short delay
    setTimeout(() => {
      if (editorInstance) {
        const data = editorInstance.getData()
        console.log('CKEditor initial sync:', data.substring(0, 100) + '...')
        emit('update:modelValue', data)
      }
    }, 100)

    emit('ready', editorInstance)
  } catch (error) {
    console.error('Lỗi khởi tạo CKEditor:', error)
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editorInstance && editorInstance.getData() !== newValue) {
    console.log('CKEditor external change:', newValue?.substring(0, 100) + '...')
    console.log('External data has Vietnamese:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(newValue || ''))
    editorInstance.setData(newValue || '')
  }
})

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.destroy()
  }
})

// Expose methods
defineExpose({
  getEditor: () => editorInstance,
  focus: () => editorInstance?.editing.view.focus(),
  getData: () => editorInstance?.getData() || '',
  setData: (data) => editorInstance?.setData(data || '')
})
</script>

<style scoped>
.ck-editor-wrapper :deep(.ck-editor__editable) {
  min-height: 300px;
}

.ck-editor-wrapper :deep(.ck-content) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.ck-editor-wrapper :deep(.ck-content h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.ck-editor-wrapper :deep(.ck-content h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.83em 0;
}

.ck-editor-wrapper :deep(.ck-content h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
}

.ck-editor-wrapper :deep(.ck-content p) {
  margin: 1em 0;
}

.ck-editor-wrapper :deep(.ck-content ul),
.ck-editor-wrapper :deep(.ck-content ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.ck-editor-wrapper :deep(.ck-content blockquote) {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding-left: 1em;
  font-style: italic;
}

.ck-editor-wrapper :deep(.ck-content table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ck-editor-wrapper :deep(.ck-content table td),
.ck-editor-wrapper :deep(.ck-content table th) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.ck-editor-wrapper :deep(.ck-content table th) {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style> 