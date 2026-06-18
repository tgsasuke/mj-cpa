<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div v-if="post.title" class="post-detail-container">
    <RouterLink to="/" class="text-gray-500 text-sm">← 返回首頁</RouterLink>
    
    <h2 class="text-3xl font-bold mt-4">{{ post.title }}</h2>
    <div class="text-sm text-gray-500 my-2 flex gap-4">
      <span>發布日期: {{ post.date }}</span>
      <span>分類: {{ post.category }}</span>
    </div>

    <hr class="my-4" />

    <div v-html="post.markdownContent" class="markdown-text-block"></div>
  </div>
  
  <div v-else class="p-6 text-center text-gray-500">
    文章載入中，或該文章不存在...
    <br />
    <RouterLink to="/" class="text-blue-500 underline mt-4 inline-block">返回首頁</RouterLink>
  </div>
</template>

<style scoped>
.post-detail-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}
.markdown-text-block :first-child {
  margin-top: 0;
}
.markdown-text-block :last-child {
  margin-bottom: 0;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.my-2 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>