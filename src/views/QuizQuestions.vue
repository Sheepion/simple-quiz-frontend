<script setup>
/**
 * 题目列表页面
 * 用于展示特定题库内的题目列表
 * 支持题目搜索、筛选和分页
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getQuestionsByBankId } from '../api/question';
import { getQuizBankById } from '../api/quiz-bank';
import ErrorAlert from '../components/common/ErrorAlert.vue';
import LoadingIndicator from '../components/common/LoadingIndicator.vue';
import Pagination from '../components/common/Pagination.vue';
import QuestionList from '../components/quiz-bank/QuestionList.vue';

const route = useRoute();
const router = useRouter();
const quizBankId = ref(null);
const quizBankInfo = ref(null);
const questions = ref([]);
const loading = ref(true);
const error = ref('');
const currentPage = ref(1);
const totalPages = ref(1); // 实际应用中应从后端获取总页数
const filterParams = ref({
  keyword: '',
  type: ''
});

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
  }
};

// 获取题目列表数据
const fetchQuestions = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    if (!quizBankId.value) {
      error.value = '题库ID无效';
      return;
    }
    
    // 实际项目中，应该将筛选参数传递给后端API
    // 这里模拟前端接收所有数据后再本地筛选
    const res = await getQuestionsByBankId(quizBankId.value);
    
    if (res.data && res.data.code === 200) {
      questions.value = res.data.data || [];
    } else {
      error.value = res.data?.message || '获取题目列表失败';
      questions.value = [];
    }
  } catch (err) {
    console.error('获取题目列表错误:', err);
    error.value = '网络错误，无法获取题目列表';
    questions.value = [];
  } finally {
    loading.value = false;
  }
};

// 处理筛选变化
const handleFilter = (params) => {
  console.log('筛选参数变化:', params);
  filterParams.value = params;
  currentPage.value = 1; // 重置到第一页
  
  // 实际项目中应重新调用API获取筛选后的数据
  // 这里暂时不需要重新获取，因为筛选逻辑在组件内部实现
  // fetchQuestions();
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchQuestions();
};

// 返回题库列表
const goBackToQuizBanks = () => {
  router.push('/quizbank');
};

// 新建题目
const handleCreateQuestion = () => {
  // 此处可以跳转到新建题目页面或打开新建题目对话框
  console.log('新建题目', quizBankId.value);
};

// 监听路由参数变化
onMounted(() => {
  console.log('QuizQuestions 组件挂载，路由参数:', route.params);
  const id = route.params.id;
  console.log('获取到的题库 ID:', id);
  
  if (id) {
    quizBankId.value = id;
    fetchQuizBankInfo(id);
    fetchQuestions();
  } else {
    error.value = '题库ID不存在';
    console.error('题库ID不存在，路由参数:', route.params);
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 标题栏 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button class="btn btn-sm btn-circle mr-2" @click="goBackToQuizBanks">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold">
          {{ quizBankInfo?.name || '题目列表' }}
        </h1>
      </div>
      <button class="btn btn-primary" @click="handleCreateQuestion">新建题目</button>
    </div>
    
    <!-- 题库描述 -->
    <div v-if="quizBankInfo?.description" class="mb-6 p-4 bg-base-200 rounded-lg">
      <p>{{ quizBankInfo.description }}</p>
    </div>
    
    <!-- 错误提示 -->
    <ErrorAlert v-if="error" :message="error" class="mb-4" />
    
    <!-- 加载指示器 -->
    <div v-if="loading" class="flex justify-center my-8">
      <LoadingIndicator />
    </div>
    
    <!-- 题目列表 -->
    <QuestionList 
      v-else
      :questions="questions" 
      @refresh="fetchQuestions"
      @filter="handleFilter"
    />
    
    <!-- 分页组件 -->
    <Pagination
      v-if="!loading && questions.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
      class="mt-6"
    />
  </div>
</template> 