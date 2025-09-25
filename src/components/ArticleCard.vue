<!-- components/ArticleCard.vue -->
<template>
  <div class="article-card">
    <div class="article-thumbnail">
      <img 
        :src="article.thumbnail || '/placeholder-image.jpg'" 
        :alt="article.title"
        class="thumbnail-img"
      >
    </div>
    <div class="article-content">
      <div class="article-category">
        <span class="category-badge">{{ article.category }}</span>
      </div>
      <h3 class="article-title">{{ article.title }}</h3>
      <div class="article-meta">
        <span class="published-time">{{ formatDate(article.published_time) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa có ngày'

  // Regex: bắt "24/9/2025, 14:35"
  const match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})/)
  if (!match) return dateString // fallback: nếu không khớp thì trả nguyên văn

  const [ , day, month, year, hour, minute ] = match
  const date = new Date(year, month - 1, day, hour, minute)

  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.article-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.article-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .thumbnail-img {
  transform: scale(1.05);
}

.article-content {
  padding: 16px;
}

.article-category {
  margin-bottom: 8px;
}

.category-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.article-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.published-time {
  color: #718096;
  font-size: 14px;
}
</style>