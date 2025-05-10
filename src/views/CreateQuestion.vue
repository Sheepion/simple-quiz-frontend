<script setup>
/**
 * 题目创建页面
 * 用于批量添加题目到指定题库
 * 支持添加完一个题目后继续添加新题目
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getQuizBankById } from '../api/quiz-bank';
import ErrorAlert from '../components/common/ErrorAlert.vue';
import LoadingIndicator from '../components/common/LoadingIndicator.vue';
import QuestionCreateForm from '../components/quiz-bank/QuestionCreateForm.vue';

const route = useRoute();
const router = useRouter();
const quizBankId = ref(null);
const quizBankInfo = ref(null);
const loading = ref(true);
const error = ref('');
const submittedCount = ref(0);

// 获取题库信息
const fetchQuizBankInfo = async (id) => {
  try {
    const res = await getQuizBankById(id);
    if (res.data && res.data.code === 200) {
      quizBankInfo.value = res.data.data;
    } else {
      error.value = res.data?.message || '获取题库信息失败';
    }
  } catch (err) {
    console.error('获取题库信息错误:', err);
    error.value = '网络错误，无法获取题库信息';
  } finally {
    loading.value = false;
  }
};

// 处理题目保存
const handleSaveQuestion = () => {
  submittedCount.value += 1;
};

// 返回题库管理页面
const goBackToQuestionManagement = () => {
  router.push(`/quizbank/${quizBankId.value}/management`);
};

// 监听路由参数变化
onMounted(() => {
  const id = route.params.id;
  
  if (id) {
    quizBankId.value = id;
    fetchQuizBankInfo(id);
  } else {
    error.value = '题库ID不存在';
    loading.value = false;
  }
});
</script>

<template>
  <div class="h-screen bg-base-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-100 shadow z-10">
      <div class="navbar-start">
        <button class="btn btn-sm btn-circle mr-2" @click="goBackToQuestionManagement">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold truncate">
          {{ quizBankInfo?.name ? `添加题目到「${quizBankInfo.name}」` : '添加题目' }}
        </h1>
      </div>
      <div class="navbar-end">
        <div v-if="submittedCount > 0" class="badge badge-success mr-2">
          已添加 {{ submittedCount }} 题
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="flex-1 p-4 overflow-auto">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-full">
        <LoadingIndicator />
      </div>
      
      <!-- 错误提示 -->
      <ErrorAlert v-if="error" :message="error" class="mb-4" />
      
      <!-- 题目创建表单 -->
      <div v-if="!loading && !error" class="max-w-3xl mx-auto">
        <QuestionCreateForm 
          :quiz-bank-id="quizBankId" 
          @save="handleSaveQuestion"
        />
      </div>
    </div>
  </div>
</template> 