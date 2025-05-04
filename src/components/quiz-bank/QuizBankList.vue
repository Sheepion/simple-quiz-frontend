<script setup>
import { onMounted, ref, watch } from 'vue'
import { getQuizBankList, searchQuizBanks } from '../../api/quiz-bank'
import EmptyState from '../common/EmptyState.vue'
import ErrorAlert from '../common/ErrorAlert.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import QuizBankCard from './QuizBankCard.vue'

const quizBanks = ref([])
const loading = ref(true)
const error = ref(null)
const searchKeyword = ref('')

// 定义emit以便向父组件传递事件
const emit = defineEmits(['edit-quiz-bank', 'enter-quiz-bank'])

// defineProps接收来自父组件的数据
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  keyword: {
    type: String,
    default: ''
  }
})

// 监听搜索关键词变化
watch(() => props.keyword, (newValue) => {
  searchKeyword.value = newValue
  fetchQuizBanks()
})

// 监听页码变化
watch(() => props.currentPage, () => {
  fetchQuizBanks()
})

onMounted(async () => {
  await fetchQuizBanks()
})

/**
 * 获取题库列表数据
 * 如果有搜索关键词则调用搜索接口，否则调用获取全部列表接口
 */
const fetchQuizBanks = async () => {
  try {
    loading.value = true
    
    let res
    if (searchKeyword.value) {
      // 有搜索关键词时调用搜索接口
      res = await searchQuizBanks({ name: searchKeyword.value })
    } else {
      // 没有搜索关键词时调用获取全部列表接口
      res = await getQuizBankList()
    }
    
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

const handleEditQuizBank = (id) => {
  emit('edit-quiz-bank', id)
}

const handleEnterQuizBank = (id) => {
  emit('enter-quiz-bank', id)
}
</script>

<template>
  <div>
    <!-- 加载状态 -->
    <LoadingIndicator v-if="loading" />

    <!-- 错误提示 -->
    <ErrorAlert v-else-if="error" :message="error" />

    <!-- 空数据提示 -->
    <EmptyState 
      v-else-if="quizBanks.length === 0" 
      :message="searchKeyword ? `未找到与 '${searchKeyword}' 相关的题库` : '暂无题库数据'"
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
  </div>
</template> 