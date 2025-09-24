<!-- components/SearchFilter.vue -->
<template>
  <div class="search-filter">
    <div class="filter-container">
      <!-- Search Input -->
      <div class="search-box">
        <input
          v-model="localSearch"
          @input="handleSearchChange"
          type="text"
          placeholder="Tìm kiếm bài viết..."
          class="search-input"
        >
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">Danh mục:</label>
        <select 
          v-model="localCategory"
          @change="handleCategoryChange"
          class="filter-select"
        >
          <option value="">Tất cả danh mục</option>
          <option 
            v-for="category in categories" 
            :key="category" 
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Date Filter -->
      <div class="filter-group">
        <label class="filter-label">Từ ngày:</label>
        <input
          v-model="localDateFrom"
          @change="handleDateChange"
          type="date"
          class="filter-date"
        >
      </div>

      <div class="filter-group">
        <label class="filter-label">Đến ngày:</label>
        <input
          v-model="localDateTo"
          @change="handleDateChange"
          type="date"
          class="filter-date"
        >
      </div>

      <!-- Clear Filters -->
      <button 
        @click="clearFilters" 
        class="clear-btn"
        :class="{ active: hasActiveFilters }"
      >
        Xóa bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  dateFrom: {
    type: String,
    default: ''
  },
  dateTo: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:searchQuery', 'update:selectedCategory', 'update:dateFrom', 'update:dateTo'])

const localSearch = ref(props.searchQuery)
const localCategory = ref(props.selectedCategory)
const localDateFrom = ref(props.dateFrom)
const localDateTo = ref(props.dateTo)

const hasActiveFilters = computed(() => {
  return localSearch.value || localCategory.value || localDateFrom.value || localDateTo.value
})

const handleSearchChange = () => {
  emit('update:searchQuery', localSearch.value)
}

const handleCategoryChange = () => {
  emit('update:selectedCategory', localCategory.value)
}

const handleDateChange = () => {
  emit('update:dateFrom', localDateFrom.value)
  emit('update:dateTo', localDateTo.value)
}

const clearFilters = () => {
  localSearch.value = ''
  localCategory.value = ''
  localDateFrom.value = ''
  localDateTo.value = ''
  emit('update:searchQuery', '')
  emit('update:selectedCategory', '')
  emit('update:dateFrom', '')
  emit('update:dateTo', '')
}

// Watch for prop changes
watch(() => props.searchQuery, (newVal) => localSearch.value = newVal)
watch(() => props.selectedCategory, (newVal) => localCategory.value = newVal)
watch(() => props.dateFrom, (newVal) => localDateFrom.value = newVal)
watch(() => props.dateTo, (newVal) => localDateTo.value = newVal)
</script>

<style scoped>
.search-filter {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filter-container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

@media (max-width: 768px) {
  .filter-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
}

.filter-select,
.filter-date {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  background: white;
}

.filter-select:focus,
.filter-date:focus {
  border-color: #667eea;
}

.clear-btn {
  padding: 12px 24px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.clear-btn:hover,
.clear-btn.active {
  background: #fed7d7;
  border-color: #fc8181;
  color: #c53030;
}
</style>