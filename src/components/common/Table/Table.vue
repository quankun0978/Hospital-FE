<template>
  <div class="bg-white rounded-lg shadow">
    <a-table
      :columns="tableColumns"
      :data-source="data"
      :loading="loading"
      :pagination="paginationConfig"
      :scroll="scroll || { y: 400 }"
      :size="size"
      :row-key="rowKey"
      @change="handleTableChange"
      :locale="{ emptyText: loading ? '' : (emptyText || 'Không có dữ liệu') }"
    >
      <!-- Custom slots for each column -->
      <template #bodyCell="{ column, record, index }">
        <slot
          :name="`cell-${column.key}`"
          :record="record"
          :value="getNestedValue(record, column.key)"
          :index="index"
          :column="column"
        >
          <!-- Default cell content -->
          <span
            v-if="getColumnRender(column.key)"
            v-html="getColumnRender(column.key)(getNestedValue(record, column.key), record, index)"
          ></span>
          <span v-else>
            {{ getNestedValue(record, column.key) }}
          </span>
        </slot>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'Không có dữ liệu'
  },
  // Pagination props
  pagination: {
    type: [Object, Boolean],
    default: () => ({})
  },
  // Table props
  scroll: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: String,
    default: 'middle'
  },
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits(['change', 'paginationChange'])

// Convert columns to Ant Design format
const tableColumns = computed(() => {
  return props.columns.map(column => ({
    title: column.title,
    dataIndex: column.key,
    key: column.key,
    align: column.align || 'left',
    width: column.width,
    fixed: column.fixed,
    sorter: column.sorter,
    filters: column.filters,
    ellipsis: column.ellipsis
  }))
})

// Get column render function
const getColumnRender = (columnKey) => {
  const column = props.columns.find(col => col.key === columnKey)
  return column?.render
}

// Pagination configuration
const paginationConfig = computed(() => {
  if (props.pagination === false) {
    return false
  }
  
  const defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `Trang ${Math.ceil(range[0] / props.pagination.pageSize || 10)} đến ${Math.ceil(range[1] / props.pagination.pageSize || 10)}`,
    pageSizeOptions: ['10', '20', '50', '100'],
    size: 'default',
    position: ['bottomCenter']
  }
  
  return {
    ...defaultPagination,
    ...props.pagination
  }
})

// Handle table change (pagination, filters, sorter)
const handleTableChange = (pagination, filters, sorter) => {
  emit('change', {
    pagination,
    filters,
    sorter
  })
  
  // Emit specific pagination change
  emit('paginationChange', {
    pageNumber: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total
  })
}

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj)
}
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f5f5f5;
}

:deep(.ant-pagination) {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-pagination .ant-pagination-total-text) {
  order: -1;
  margin-right: auto;
}

:deep(.ant-pagination .ant-pagination-options) {
  margin-left: 16px;
}
:deep(.ant-pagination-total-text) {
  padding-left: 10px;
}
</style> 