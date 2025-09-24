<temple>
    
</temple>

<script setup>

</script>

<style scoped>
.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.search-glow:focus-within {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>