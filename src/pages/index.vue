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
    <div class="results-summary" v-if="searchResults.total > 0">
      <p>Tổng số bài viết: <strong>{{ totalArticles }}</strong> - Tìm thấy <strong>{{ searchResults.total }}</strong> bài viết</p>
    </div>

    <!-- No Results -->
    <div class="no-results" v-if="searchResults.total === 0 && !isLoading">
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
    <div class="articles-grid" v-if="searchResults.articles && searchResults.articles.length > 0">
      <ArticleCard
        v-for="article in searchResults.articles"
        :key="article.id"
        :article="article"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="searchResults.total > 0"
      :currentPage="pagination.currentPage"
      :itemsPerPage="pagination.itemsPerPage"
      :totalItems="searchResults.total"
      :totalPages="searchResults.totalPages"
      @update:currentPage="updateCurrentPage"
      @update:itemsPerPage="updateItemsPerPage"
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
const searchResults = ref({
  articles: [],
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
})

const filters = ref({
  search: '',
  category: '',
  dateFrom: '',
  dateTo: ''
})

const pagination = ref({
  currentPage: 1,
  itemsPerPage: 12  // 👈 Thay đổi từ 100 thành 12
})

const { $api } = useNuxtApp()

// Load total articles count
const loadTotal = async () => {
  try {
    const response = await $api.get('/crawl_data/total')
    console.log('Total articles:', response.data)
    totalArticles.value = response.data.totalItems || 0
  } catch (error) {
    console.error('Error loading total:', error)
    totalArticles.value = 0
  }
}

// Load all articles for category stats (không phân trang)
const loadAllArticlesForStats = async () => {
  try {
    const response = await $api.get('/crawl_data/all-for-stats')
    allArticles.value = response.data.articles || []
  } catch (error) {
    console.error('Error loading articles for stats:', error)
    allArticles.value = []
  }
}

// Computed properties
const availableCategories = computed(() => {
  const categories = [...new Set(allArticles.value.map(article => article.category))]
  return categories.sort()
})

// Methods
const updateCategory = (category) => {
  filters.value.category = category
  pagination.value.currentPage = 1
}

const updateCurrentPage = (page) => {
  pagination.value.currentPage = page
}

const updateItemsPerPage = (itemsPerPage) => {
  pagination.value.itemsPerPage = itemsPerPage
  pagination.value.currentPage = 1
}

// Load filtered articles with pagination
const loadFilteredArticles = async () => {
  isLoading.value = true
  try {
    const params = {
      searchQuery: filters.value.search || undefined,
      category: filters.value.category || undefined,
      dateFrom: filters.value.dateFrom || undefined,
      dateTo: filters.value.dateTo || undefined,
      page: pagination.value.currentPage,
      limit: pagination.value.itemsPerPage,
    }

    // Loại bỏ các params undefined
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key]
      }
    })

    console.log('API params:', params)
    const res = await $api.get('/crawl_data/filter', { params })
    console.log('API response:', res.data)

    if (res && res.data) {
      searchResults.value = {
        articles: res.data.articles || [],
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 0,
        hasNextPage: res.data.hasNextPage || false,
        hasPreviousPage: res.data.hasPreviousPage || false
      }
    } else {
      console.error("API returned empty response:", res)
      searchResults.value = {
        articles: [],
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  } catch (error) {
    console.error('Error loading filtered articles:', error)
    searchResults.value = {
      articles: [],
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(() => filters.value, () => {
  pagination.value.currentPage = 1
  loadFilteredArticles()
}, { deep: true })

watch(() => pagination.value.currentPage, () => {
  loadFilteredArticles()
})

watch(() => pagination.value.itemsPerPage, () => {
  loadFilteredArticles()
})

// Lifecycle
onMounted(() => {
  loadTotal()
  loadAllArticlesForStats() // Load tất cả articles cho category stats
  loadFilteredArticles() // Load articles với pagination
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