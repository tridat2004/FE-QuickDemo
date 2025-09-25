<!-- pages/index.vue -->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard Tin Tức</h1>
      <p class="dashboard-subtitle">Quản lý và xem tin tức theo danh mục</p>
    </div>

    <!-- Category Statistics -->
    <CategoryStats
      :articles="allArticles"
      :selectedCategory="filters.category"
      @categorySelected="updateCategory"
    />

    <!-- Search and Filters -->
    <SearchFilter
      v-model:searchQuery="filters.search"
      v-model:selectedCategory="filters.category"
      v-model:dateFrom="filters.dateFrom"
      v-model:dateTo="filters.dateTo"
      :categories="availableCategories"
    />

    <!-- Results Summary -->
    <div class="results-summary" v-if="filteredArticles.length > 0">
      <p>Tổng số bài viết: <strong>{{ totalArticles }}</strong> - Tìm thấy <strong>{{ filteredArticles.length }}</strong> bài viết</p>
    </div>

    <!-- No Results -->
    <div class="no-results" v-if="filteredArticles.length === 0">
      <div class="no-results-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h3>Không tìm thấy kết quả</h3>
      <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
    </div>

    <!-- Articles Grid -->
    <div class="articles-grid" v-if="paginatedArticles.length > 0">
      <ArticleCard
        v-for="article in paginatedArticles"
        :key="article.id"
        :article="article"
      />
    </div>

    <!-- Pagination -->
    <Pagination
  v-if="filteredArticles.length > 0"
  :currentPage="pagination.currentPage"
  :itemsPerPage="pagination.itemsPerPage"
  :totalItems="filteredArticles.length"
  @update:currentPage="pagination.currentPage = $event"
  @update:itemsPerPage="pagination.itemsPerPage = $event"
/>

    <!-- Loading State -->
    <div class="loading" v-if="isLoading">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import { useHead } from '#app'
// SEO Meta
useHead({
  title: 'Dashboard Tin Tức',
  meta: [
    { name: 'description', content: 'Dashboard quản lý và xem tin tức theo danh mục với tính năng tìm kiếm và lọc' }
  ]
})

// State
const isLoading = ref(false)
const allArticles = ref([])
const totalArticles = ref(0)
const filters = ref({
  search: '',
  category: '',
  dateFrom: '',
  dateTo: ''
})

const pagination = ref({
  currentPage: 1,
  itemsPerPage: 100   
})



const { $api } = useNuxtApp() // Lấy instance axios từ plugin

const loadTotal = async () => {
  isLoading.value = true
  console.log('Starting axios request...'); // Debug: Xác nhận hàm chạy
  try {
    const response = await $api.get('/crawl_data/total') // Gọi trực tiếp đến cổng 3001
    console.log('Axios response:', response.data); // Debug: Dữ liệu từ API
    totalArticles.value = response.data.total || 0
  } catch (error) {
    console.error('Error loading total:', error); // Debug: Xem lỗi cụ thể
    totalArticles.value = 0
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const availableCategories = computed(() => {
  const categories = [...new Set(allArticles.value.map(article => article.category))]
  return categories.sort()
})

const parseVietnameseDate = (dateString) => {
  try {
    // Format: "Thứ ba, 23/9/2025, 10:31 (GMT+7)"
    const dateMatch = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (!dateMatch) return null

    const [, day, month, year] = dateMatch
    
    // Tách lấy phần thời gian nếu có
    const timeMatch = dateString.match(/(\d{1,2}):(\d{2})/)
    let hour = 0, minute = 0
    if (timeMatch) {
      [, hour, minute] = timeMatch.map(Number)
    }

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour, minute)
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return null
  }
}
const formatDateForDisplay = (dateString) => {
  const date = parseVietnameseDate(dateString)
  if (!date) return dateString

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}
const filteredArticles = computed(() => {
  let filtered = allArticles.value

  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm)
    )
  }

  // Category filter
  if (filters.value.category) {
    filtered = filtered.filter(article => article.category === filters.value.category)
  }

  // Date filters với xử lý Vietnamese date format
  if (filters.value.dateFrom) {
    filtered = filtered.filter(article => {
      const articleDate = parseVietnameseDate(article.published_time)
      if (!articleDate) return false
      
      const fromDate = new Date(filters.value.dateFrom)
      return articleDate >= fromDate
    })
  }

  if (filters.value.dateTo) {
    filtered = filtered.filter(article => {
      const articleDate = parseVietnameseDate(article.published_time)
      if (!articleDate) return false
      
      const toDate = new Date(filters.value.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      return articleDate <= toDate
    })
  }

  return filtered
})

const paginatedArticles = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredArticles.value.slice(start, end)
})

// Methods
const updateCategory = (category) => {
  filters.value.category = category
  pagination.value.currentPage = 1
}

const loadArticles = async () => {
  isLoading.value = true
  try {
    const res = await $api.get('/crawl_data/list') // 👈 gọi endpoint mới
    console.log('Articles from API:', res.data.articles)
    allArticles.value = res.data.articles || []
  } catch (error) {
    console.error('Error loading articles:', error)
  } finally {
    isLoading.value = false
  }
}

const loadFilteredArticles = async () => {
  isLoading.value = true
  try {
    const params = {
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      dateFrom: filters.value.dateFrom || undefined,
      dateTo: filters.value.dateTo || undefined,
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage,
    }

    const res = await $api.get('/crawl_data/filter', { params })

    if (res && res.data) {
      allArticles.value = res.data.articles || []
      pagination.value.total = res.data.total || 0
    } else {
      console.error("API returned empty response:", res)
      allArticles.value = []
    }
  } catch (error) {
    console.error('Error loading filtered articles:', error)
    allArticles.value = []
  } finally {
    isLoading.value = false
  }
}




// Watchers
watch(() => filters.value, () => {
  pagination.value.currentPage = 1

  if (!filters.value.search && !filters.value.category && !filters.value.dateFrom && !filters.value.dateTo) {
    loadArticles() // lấy toàn bộ bài viết
  } else {
    loadFilteredArticles()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadArticles(),loadTotal()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 28px;
  }
}

.dashboard-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.results-summary {
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  text-align: center;
}

.results-summary p {
  margin: 0;
  color: #4a5568;
  font-size: 16px;
}

.no-results {
  background: white;
  padding: 48px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 24px;
}

.no-results-icon {
  color: #a0aec0;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.no-results p {
  color: #718096;
  margin: 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}

.loading {
  background: white;
  padding: 48px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 24px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-left-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #718096;
  margin: 0;
  font-size: 16px;
}
</style>