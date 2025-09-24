<template>
  <div class="dashboard">
    <div class="content">
      <aside>
        <CategoryFilter @filter="applyCategoryFilter" />
        <DateFilter @filter="applyDateFilter" />
      </aside>
      <main>
        <div class="news-grid">
          <NewsItem v-for="item in filteredNews" :key="item.id" :title="item.title" :thumbnail="item.thumbnail" :category="item.category" :published_time="item.published_time" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NewsItem from './CategoryStats.vue';
import CategoryFilter from './ArticleCard.vue';
import DateFilter from './SearchFilter.vue';

const news = ref([
  { id: 1, title: 'Tin tức 1', thumbnail: 'https://via.placeholder.com/150', category: 'Thể thao', published_time: '2025-09-23' },
  { id: 2, title: 'Tin tức 2', thumbnail: 'https://via.placeholder.com/150', category: 'Công nghệ', published_time: '2025-09-22' },
]);

const filters = ref({ category: '', date: '', search: '' });

const filteredNews = computed(() => {
  return news.value.filter(item => {
    const matchesCategory = !filters.value.category || item.category === filters.value.category;
    const matchesDate = !filters.value.date || item.published_time === filters.value.date;
    const matchesSearch = !filters.value.search || item.title.toLowerCase().includes(filters.value.search.toLowerCase());
    return matchesCategory && matchesDate && matchesSearch;
  });
});

const applyCategoryFilter = (category) => {
  filters.value.category = category;
};

const applyDateFilter = (date) => {
  filters.value.date = date;
};

const applySearch = (searchQuery) => {
  filters.value.search = searchQuery;
};
</script>