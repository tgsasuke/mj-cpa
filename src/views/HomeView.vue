<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostsStore } from "@/stores/postsStore";
import PostList from "@/components/PostList.vue";

// 接收從 router 傳過來的當前文章物件
const props = defineProps({
  post: {
    type: Object,
    default: null
  }
})

const postsStore = usePostsStore();
const route = useRoute();
const router = useRouter();

// 💡 修正導覽列清單未更新的問題：精準監聽網址上的 category 變化
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      postsStore.setCurrentCategory(newCategory);
    }
  },
  { immediate: true }
);

onMounted(() => {
  postsStore.getAllPosts();
});
</script>

<template>
  <div class="max-w-[800px] mx-auto p-5">
    
    <div class="flex justify-between items-center border-b pb-4 mb-6">
      <h1 class="text-xl font-black text-gray-800 tracking-wide">
        <RouterLink to="/">CMS 系統模板測試</RouterLink>
      </h1>
      <a href="/admin/index.html" class="px-3 py-1.5 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors">
        管理後台
      </a>
    </div>

    <nav class="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
      <RouterLink
        v-for="opt in postsStore.CATEGORY_OPTIONS"
        :key="opt.value"
        :to="`/${opt.value}`"
        class="flex-1 text-center py-2 text-sm font-medium rounded-md transition-all"
        :class="route.params.category === opt.value 
          ? 'bg-white text-blue-600 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
      >
        {{ opt.label }}
      </RouterLink>
    </nav>

    <main class="bg-white rounded-xl">
      
      <div v-if="props.post" class="animation-fade">
        <RouterLink :to="`/${route.params.category}`" class="text-gray-500 text-sm inline-block mb-4 hover:text-gray-700">
          ← 返回 {{ postsStore.CATEGORY_OPTIONS.find(o => o.value === route.params.category)?.label }} 列表
        </RouterLink>
        
        <h2 class="text-3xl font-black text-gray-900 leading-tight">{{ props.post.title }}</h2>
        <div class="flex gap-4 text-xs text-gray-400 my-3">
          <span>📅 {{ props.post.date }}</span>
          <span>🏷️ {{ props.post.category }}</span>
        </div>
        
        <hr class="my-5 border-gray-100" />
        
        <div v-html="props.post.markdownContent" class="prose prose-blue max-w-none markdown-text-block"></div>
      </div>

      <div v-else>
        <div class="flex items-center gap-2 mb-4">
          <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
          <h2 class="text-lg font-bold text-gray-800">
            {{ postsStore.CATEGORY_OPTIONS.find(o => o.value === route.params.category)?.label }}
          </h2>
        </div>
        
        <PostList :postlist="postsStore.currentCategoryPosts" />
      </div>

    </main>
  </div>
</template>

<style scoped>
.markdown-text-block :first-child {
  margin-top: 0;
}
.markdown-text-block :last-child {
  margin-bottom: 0;
}
/* 轉場微動畫 */
.animation-fade {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>