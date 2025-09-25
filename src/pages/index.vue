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

const mockArticles = [
  {
    id: 1,
    title: 'Công nghệ AI sẽ thay đổi thế giới như thế nào?',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    category: 'Công nghệ',
    published_time: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Khám phá ẩm thực Việt Nam qua các món đặc sản',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    category: 'Ẩm thực',
    published_time: '2024-01-14T08:15:00Z'
  },
  {
    id: 3,
    title: 'Du lịch Hà Nội - Top 10 địa điểm không thể bỏ qua',
    thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
    category: 'Du lịch',
    published_time: '2024-01-13T14:20:00Z'
  },
  {
    id: 4,
    title: 'Thể thao Việt Nam tại SEA Games 2024',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
    category: 'Thể thao',
    published_time: '2024-01-12T16:45:00Z'
  },
  {
    id: 5,
    title: 'Kinh tế Việt Nam phục hồi mạnh mẽ sau đại dịch',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    category: 'Kinh tế',
    published_time: '2024-01-11T09:30:00Z'
  },
  {
    id: 6,
    title: 'Giáo dục số hóa - Xu hướng tương lai',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    category: 'Giáo dục',
    published_time: '2024-01-10T11:00:00Z'
  },
  {
    id: 7,
    title: 'Y học hiện đại và những đột phá mới',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    category: 'Y tế',
    published_time: '2024-01-09T13:15:00Z'
  },
  {
    id: 8,
    title: 'Bảo vệ môi trường - Trách nhiệm của mỗi người',
    thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400',
    category: 'Môi trường',
    published_time: '2024-01-08T07:45:00Z'
  },
  {
    id: 9,
    title: 'Startup Việt Nam và câu chuyện thành công',
    thumbnail: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400',
    category: 'Công nghệ',
    published_time: '2024-01-07T15:30:00Z'
  },
  {
    id: 10,
    title: 'Văn hóa truyền thống trong thời đại hiện đại',
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
    category: 'Văn hóa',
    published_time: '2024-01-06T10:20:00Z'
  },
  {
    id: 11,
    title: 'Phát triển bền vững trong nông nghiệp',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
    category: 'Nông nghiệp',
    published_time: '2024-01-05T12:10:00Z'
  },
  {
    id: 12,
    title: 'Công nghệ Blockchain và ứng dụng thực tế',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400',
    category: 'Công nghệ',
    published_time: '2024-01-04T14:55:00Z'
  }
]

// Computed properties
const availableCategories = computed(() => {
  const categories = [...new Set(allArticles.value.map(article => article.category))]
  return categories.sort()
})

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

  // Date filters
  if (filters.value.dateFrom) {
    filtered = filtered.filter(article => {
      const articleDate = new Date(article.published_time)
      const fromDate = new Date(filters.value.dateFrom)
      return articleDate >= fromDate
    })
  }

  if (filters.value.dateTo) {
    filtered = filtered.filter(article => {
      const articleDate = new Date(article.published_time)
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
    allArticles.value = res.data.articles || []
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