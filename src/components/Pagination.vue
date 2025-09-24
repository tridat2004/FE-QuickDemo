<!-- components/Pagination.vue -->
<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      Hiển thị {{ startItem }} - {{ endItem }} của {{ totalItems }} kết quả
    </div>
    
    <div class="pagination-controls">
      <!-- Previous Button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn prev-btn"
        :class="{ disabled: currentPage === 1 }"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"/>
        </svg>
        Trước
      </button>

      <!-- Page Numbers -->
      <div class="page-numbers">
        <!-- First page -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          class="pagination-btn page-btn"
          :class="{ active: currentPage === 1 }"
        >
          1
        </button>

        <!-- First ellipsis -->
        <span v-if="showFirstEllipsis" class="ellipsis">...</span>

        <!-- Visible pages -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="pagination-btn page-btn"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <!-- Last ellipsis -->
        <span v-if="showLastEllipsis" class="ellipsis">...</span>

        <!-- Last page -->
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          class="pagination-btn page-btn"
          :class="{ active: currentPage === totalPages }"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn next-btn"
        :class="{ disabled: currentPage === totalPages }"
      >
        Sau
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>

    <!-- Items per page selector -->
    <div class="items-per-page">
      <label for="itemsPerPage">Hiển thị:</label>
      <select
        id="itemsPerPage"
        :value="itemsPerPage"
        @change="updateItemsPerPage($event.target.value)"
        class="items-select"
      >
        <option value="12">12</option>
        <option value="24">24</option>
        <option value="48">48</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 12
  }
})

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return end > props.totalItems ? props.totalItems : end
})

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, props.currentPage - delta);
       i <= Math.min(totalPages.value - 1, props.currentPage + delta);
       i++) {
    range.push(i)
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(2, '...')
  } else {
    rangeWithDots.push(2)
  }

  rangeWithDots.push(...range)

  if (props.currentPage + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value - 1)
  } else {
    rangeWithDots.push(totalPages.value - 1)
  }

  return range
})

const showFirstPage = computed(() => totalPages.value > 1)
const showLastPage = computed(() => totalPages.value > 1 && !visiblePages.value.includes(totalPages.value))
const showFirstEllipsis = computed(() => props.currentPage > 4)
const showLastEllipsis = computed(() => props.currentPage < totalPages.value - 3)

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const updateItemsPerPage = (newValue) => {
  emit('update:itemsPerPage', parseInt(newValue))
  emit('update:currentPage', 1)
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .pagination {
    flex-direction: row;
    justify-content: space-between;
  }
}

.pagination-info {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.pagination-btn:hover:not(.disabled) {
  border-color: #667eea;
  color: #667eea;
  background: #f7fafc;
}

.pagination-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn {
  min-width: 40px;
  justify-content: center;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ellipsis {
  padding: 8px 4px;
  color: #a0aec0;
  font-weight: bold;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
}

.items-select {
  padding: 6px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.items-select:focus {
  outline: none;
  border-color: #667eea;
}
</style>