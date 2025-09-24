<!-- components/CategoryStats.vue -->
<template>
  <div class="category-stats">
    <h2 class="stats-title">Thống kê theo danh mục</h2>
    <div class="stats-grid">
      <div
        v-for="(count, category) in categoryStats"
        :key="category"
        @click="selectCategory(category)"
        class="stat-card"
        :class="{ active: selectedCategory === category }"
      >
        <div class="stat-icon">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
            </svg>
          </div>
        </div>
        <div class="stat-content">
          <h3 class="stat-category">{{ category }}</h3>
          <p class="stat-count">{{ count }} bài viết</p>
        </div>
      </div>

      <!-- Tổng kết -->
      <div
        @click="selectCategory('')"
        class="stat-card total-card"
        :class="{ active: selectedCategory === '' }"
      >
        <div class="stat-icon">
          <div class="icon-circle total-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM5 19h14V5H5v14zm2-12h10v10H7V7z"/>
            </svg>
          </div>
        </div>
        <div class="stat-content">
          <h3 class="stat-category">Tất cả</h3>
          <p class="stat-count">{{ totalArticles }} bài viết</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  articles: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['categorySelected'])

const categoryStats = computed(() => {
  const stats = {}
  props.articles.forEach(article => {
    const category = article.category || 'Khác'
    stats[category] = (stats[category] || 0) + 1
  })
  return stats
})

const totalArticles = computed(() => props.articles.length)

const selectCategory = (category) => {
  emit('categorySelected', category)
}
</script>

<style scoped>
.category-stats {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.stats-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.stat-card:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateY(-1px);
}

.stat-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.total-card {
  border-color: #38a169;
  background: #f0fff4;
}

.stat-card.total-card:hover,
.stat-card.total-card.active {
  border-color: #38a169;
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  color: white;
}

.stat-icon {
  flex-shrink: 0;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transition: all 0.2s ease;
}

.total-icon {
  background: rgba(56, 161, 105, 0.1);
  color: #38a169;
}

.stat-card.active .icon-circle,
.stat-card.total-card.active .icon-circle {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-category {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-count {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.stat-card.active .stat-count {
  opacity: 0.9;
}
</style>