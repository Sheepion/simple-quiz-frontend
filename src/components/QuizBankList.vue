<script setup>
import { ref, onMounted } from 'vue'
import { getQuizBankList } from '../api/quiz-bank'

const quizBanks = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
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
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">题库列表</h1>
      <button class="btn btn-primary">新建题库</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center my-8">
      <progress class="progress progress-primary w-56"></progress>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="alert alert-error my-4">
      <span>{{ error }}</span>
    </div>

    <!-- 空数据提示 -->
    <div v-else-if="quizBanks.length === 0" class="text-center my-8">
      <div class="text-lg text-gray-500">暂无题库数据</div>
    </div>

    <!-- 题库列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="quizBank in quizBanks" 
        :key="quizBank.id" 
        class="card card-bordered bg-base-100 shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title">{{ quizBank.name }}</h2>
          <p v-if="quizBank.description">{{ quizBank.description }}</p>
          <p v-else class="text-gray-400">暂无描述</p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-outline btn-sm">编辑</button>
            <button class="btn btn-primary btn-sm">进入</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-8">
      <div class="join">
        <button class="join-item btn">«</button>
        <button class="join-item btn btn-active">1</button>
        <button class="join-item btn">2</button>
        <button class="join-item btn">3</button>
        <button class="join-item btn">»</button>
      </div>
    </div>
  </div>
</template> 