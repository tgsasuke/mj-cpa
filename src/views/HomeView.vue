<script setup>
import { ref, onMounted, computed } from 'vue'
import { md } from '@/utils/markdown'

const createPostSchema = () => ({
  title: '',
  date: '',
  category: '',
  thumbnail: '',
  body: '',
  slug: '',
  markdownContent: '',
})

const posts = ref([])

const getAllPosts = async () => {
  const modules = import.meta.glob('/src/content/blog/*.md', { as: 'raw', eager: true })
  const tempArray = []
  
  for (const path in modules) {
    const rawContent = modules[path]
    
    const rawSlug = path.split('/').pop().replace('.md', '')
    const slug = decodeURIComponent(rawSlug)

    const post = createPostSchema()
    post.slug = slug
    
    const match = rawContent.match(/^---([\s\S]*?)---([\s\S]*)$/)

    if (match) {
      const frontmatterRaw = match[1]
      const bodyRaw = match[2]

      post.body = bodyRaw.trim()

      frontmatterRaw.split('\n').forEach(line => {
        const parts = line.split(':')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          // 考慮到 time 有可能包含多個冒號 (如 17:24:00)，所以用 join 結合回去
          const value = parts.slice(1).join(':').trim()

          // 自動對對碰：如果 key 存在於 schema 中就寫入
          if (key in post) {
            post[key] = value
          }
        }
      })
    }else{
      post.body = rawContent.trim()
    }
    post.markdownContent = md.render(post.body)
    tempArray.push(post)
  }
  // 依日期排序
  posts.value = tempArray.sort((a, b) => new Date(b.date) - new Date(a.date))

  console.log(posts.value)
}



onMounted(() => {
  getAllPosts()
})

</script>

<template>
  <div>
    <h1>Home</h1>
    <div class="flex gap-2">
      <RouterLink to="/admin">Admin</RouterLink>
      <a href="/admin/index.html">Admin</a>
    </div>

    <div>
      <div class="prose prose-sm max-w-none" v-for="post in posts" :key="post.slug">
        <h2>{{ post.title }}</h2>
        <div v-html="post.markdownContent" class="markdown-text-block"></div>
      </div>
    </div>


  </div>
</template>

<style scoped>
.markdown-text-block :first-child {
  margin-top: 0;
}
.markdown-text-block :last-child {
  margin-bottom: 0;
}
</style>