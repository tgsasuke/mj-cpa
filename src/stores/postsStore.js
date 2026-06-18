import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { md } from '@/utils/markdown'

export const usePostsStore = defineStore('posts', () => {
  const CATEGORY_OPTIONS = [
    { label: '讀書雜記', value: 'reading' },
    { label: '最近稅法規定與新聞', value: 'tax-news' },
    { label: '稅法雜記', value: 'tax-notes' },
    { label: '公司法與勞動法雜記', value: 'law-notes' },
  ]

  const currentCategory = ref('all') // all 代表全部，其他代表特定分類
  const posts = ref([])

  const currentCategoryPosts = computed(() => {
    if (currentCategory.value === 'all') {
      return posts.value
    }
    return posts.value.filter(post => post.category === currentCategory.value)
  })

  const createPostSchema = () => ({
    title: '',
    date: '',
    category: '',
    thumbnail: '',
    body: '',
    slug: '',
    markdownContent: '',
  })

  const getAllPosts = async () => {
    const modules = import.meta.glob('/public/content/blog/*.md')
    const tempArray = []
    
    for (const path in modules) {
      const cleanPath = path.replace('/public', '')
      const fetchUrl = import.meta.env.BASE_URL + cleanPath.replace(/^\//, '')
      const slug = path.split('/').pop().replace('.md', '')

      try {
        // 3. 透過 fetch 非同步抓取靜態 Markdown 內容
        const response = await fetch(fetchUrl)
        if (!response.ok) continue
        const rawContent = await response.text()
  
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
              const value = parts.slice(1).join(':').trim()
    
              // 去除可能包在欄位兩端的引號 (例如 title: "123456")
              const cleanValue = value.replace(/^["']|["']$/g, '')

              if (key in post) {
                post[key] = cleanValue
              }
            }
          })
        } else {
          post.body = rawContent.trim()
        }
        post.markdownContent = md.render(post.body)
        tempArray.push(post)
      } catch (error) {
        console.error(`無法載入文章: ${path}`, error)
      }
    }
    // 依日期排序
    posts.value = tempArray.sort((a, b) => new Date(b.date) - new Date(a.date))
    console.log(posts.value)
  }

  const setCurrentCategory = (category) => {
    currentCategory.value = category
  }

  return { 
    CATEGORY_OPTIONS,
    
    posts, 
    currentCategory, 
    currentCategoryPosts, 
    
    getAllPosts, 
    setCurrentCategory,
  }
})