<script setup>
defineProps({
  postlist: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="!postlist.length" class="text-gray-400 py-8 text-center text-sm bg-gray-50 rounded-lg border border-dashed">
      目前此分類尚無文章...
    </div>

    <div
      v-for="post in postlist"
      :key="post.slug"
      class="p-5 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white"
    >
      <h3 class="text-lg font-bold text-gray-800 line-clamp-2">{{ post.title }}</h3>
      <div class="flex gap-4 text-xs text-gray-400 mt-1.5 mb-3">
        <span>📅 {{ post.date }}</span>
      </div>

      <RouterLink 
        :to="`/${post.category}/${encodeURIComponent(post.slug)}`" 
        class="text-blue-500 hover:text-blue-600 text-sm font-semibold inline-block"
      >
        閱讀全文 →
      </RouterLink>
    </div>
  </div>
</template>