<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getQuizBankList } from '../../api/quiz-bank'
import EmptyState from '../common/EmptyState.vue'
import ErrorAlert from '../common/ErrorAlert.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import Pagination from '../common/Pagination.vue'
import QuizBankCard from './QuizBankCard.vue'

const router = useRouter()
const quizBanks = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1) // 实际应用中可能需要从后端获取

onMounted(async () => {
  await fetchQuizBanks()
})

const fetchQuizBanks = async () => {
  try {
    loading.value = true
    const res = await getQuizBankList()
    if (res.data.code === 200) {
      quizBanks.value = res.data.data || []
    } else {
      error.value = res.data.message || '获取题库列表失败'
    }
  } catch (err) {
    error.value = err.message || '网络错误'
  } finally {
    loading.value = false
  }
}

const handleCreateQuizBank = () => {
  // 实际应用中可能会跳转到创建题库页面或显示创建对话框
  console.log('创建新题库')
}

const handleEditQuizBank = (id) => {
  console.log('编辑题库', id)
}

const handleEnterQuizBank = (id) => {
  console.log('进入题库', id)
  // router.push(`/quiz-bank/${id}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 实际应用中可能需要重新获取数据
  // fetchQuizBanks(page)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">题库列表</h1>
      <button 
        class="btn btn-primary"
        @click="handleCreateQuizBank"
      >新建题库</button>
    </div>

    <!-- 加载状态 -->
    <LoadingIndicator v-if="loading" />

    <!-- 错误提示 -->
    <ErrorAlert v-else-if="error" :message="error" />

    <!-- 空数据提示 -->
    <EmptyState 
      v-else-if="quizBanks.length === 0" 
      message="暂无题库数据" 
    />

    <!-- 题库列表 -->
    <div 
      v-else 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <QuizBankCard
        v-for="quizBank in quizBanks"
        :key="quizBank.id"
        :quiz-bank="quizBank"
        @edit="handleEditQuizBank"
        @enter="handleEnterQuizBank"
      />
    </div>

    <!-- 分页 -->
    <Pagination
      v-if="!loading && !error && quizBanks.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template> 