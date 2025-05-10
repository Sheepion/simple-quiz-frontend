<script setup>
/**
 * 题目管理页面
 * 用于管理题库中的题目，支持查看、新增、编辑题目
 * 页面左侧是题目列表，右侧是题目详情
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getQuestionsByBankId } from '../api/question';
import { getQuizBankById } from '../api/quiz-bank';
import ErrorAlert from '../components/common/ErrorAlert.vue';
import LoadingIndicator from '../components/common/LoadingIndicator.vue';
import QuestionCreateForm from '../components/quiz-bank/QuestionCreateForm.vue';
import QuestionDetail from '../components/quiz-bank/QuestionDetail.vue';
import QuestionList from '../components/quiz-bank/QuestionList.vue';

const route = useRoute();
const router = useRouter();
const quizBankId = ref(null);
const quizBankInfo = ref(null);
const questions = ref([]);
const loading = ref(true);
const error = ref('');
const selectedQuestion = ref(null);
const isCreating = ref(false);
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

// 返回题库列表
const goBackToQuizBanks = () => {
  router.push('/quizbank');
};

// 显示添加题目表单
const handleCreateQuestion = () => {
  selectedQuestion.value = null;
  isCreating.value = true;
};

// 取消创建题目
const handleCancelCreate = () => {
  isCreating.value = false;
  selectedQuestion.value = null;
};

// 查看题目详情
const handleViewQuestion = (question) => {
  isCreating.value = false;
  selectedQuestion.value = question;
};

// 编辑题目
const handleEditQuestion = (question) => {
  isCreating.value = false;
  selectedQuestion.value = question;
};

// 保存题目
const handleSaveQuestion = (questionData) => {
  fetchQuestions(); // 刷新题目列表
  submittedCount.value += 1;
  // 不关闭创建模式，允许用户继续添加
};

// 处理筛选变化
const handleFilter = () => {
  // 实际上筛选逻辑已经在 QuestionList 组件内部处理了
  // 此处只需保留函数接口
};

// 监听路由参数变化
onMounted(() => {
  console.log('QuestionManagement 组件挂载，路由参数:', route.params);
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
  <div class="h-screen bg-base-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-100 shadow z-10">
      <div class="navbar-start">
        <button class="btn btn-sm btn-circle mr-2" @click="goBackToQuizBanks">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold truncate">
          {{ quizBankInfo?.name || '题目管理' }}
        </h1>
      </div>
      <div class="navbar-end">
        <button class="btn btn-primary" @click="handleCreateQuestion">
          添加题目
        </button>
        <div v-if="isCreating && submittedCount > 0" class="badge badge-success ml-2">
          已添加 {{ submittedCount }} 题
        </div>
      </div>
    </div>
    
    <!-- 主内容区：使用网格布局替代抽屉布局 -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
      <!-- 左侧题目列表区域 (占据1/3到1/4宽度) -->
      <div class="bg-base-200 overflow-hidden border-r border-base-300 flex flex-col md:col-span-1">
        <!-- 题库信息区域 -->
        <div class="p-4 border-b border-base-300">
          <h2 class="text-lg font-bold mb-2">题目列表</h2>
          
          <!-- 题库描述 -->
          <div v-if="quizBankInfo?.description" class="text-sm mb-2 text-base-content/70">
            {{ quizBankInfo.description }}
          </div>
          
          <!-- 错误提示 -->
          <ErrorAlert v-if="error" :message="error" class="mt-2" />
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center flex-1">
          <LoadingIndicator />
        </div>
        
        <!-- 题目列表 -->
        <div v-else class="overflow-y-auto flex-1">
          <QuestionList
            :questions="questions"
            @refresh="fetchQuestions"
            @edit="handleEditQuestion"
            @view="handleViewQuestion"
            @filter="handleFilter"
          />
        </div>
      </div>
      
      <!-- 右侧题目详情区域 (占据2/3到3/4宽度) -->
      <div class="p-0 md:p-4 overflow-y-auto md:col-span-2 lg:col-span-3">
        <!-- 题目详情组件 -->
        <QuestionDetail 
          v-if="selectedQuestion && !isCreating"
          :question="selectedQuestion"
          :is-new="false"
          :quiz-bank-id="quizBankId"
          @save="handleSaveQuestion"
          @cancel="handleCancelCreate"
          class="h-full"
        />
        
        <!-- 添加题目表单 -->
        <div v-else-if="isCreating" class="h-full">
          <div class="flex justify-between items-center mb-4">
          </div>
          <QuestionCreateForm 
            :quiz-bank-id="quizBankId" 
            @save="handleSaveQuestion"
          />
        </div>
        
        <!-- 未选中题目状态 -->
        <div v-else class="flex flex-col justify-center items-center h-full p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-base-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-lg text-base-content/70">请从左侧列表选择一个题目，或点击添加题目按钮</p>
        </div>
      </div>
    </div>
  </div>
</template>