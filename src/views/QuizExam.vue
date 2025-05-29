<script setup>
/**
 * 答题页面
 * 用于用户进行答题活动，支持查看题目、提交答案，使用方向键切换题目
 * 页面左侧是题目列表，右侧是题目详情和答题区域
 */
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ErrorAlert from '../components/common/ErrorAlert.vue';
import LoadingIndicator from '../components/common/LoadingIndicator.vue';
import QuestionList from '../components/quiz-bank/QuestionList.vue';
import QuizAnswer from '../components/quiz-bank/QuizAnswer.vue';
import useQuizExam from '../composables/useQuizExam';

// 路由相关
const route = useRoute();
const router = useRouter();
const quizBankId = ref(null);

// 处理筛选变化
const handleFilter = () => {
  // 实际上筛选逻辑已经在 QuestionList 组件内部处理了
  // 此处只需保留函数接口
};

// 返回题目列表
const goBackToQuizQuestions = () => {
  router.push(`/quizbank/${quizBankId.value}/questions`);
};

// 监听路由参数变化
onMounted(() => {
  console.log('QuizExam 组件挂载，路由参数:', route.params);
  const id = route.params.id;
  console.log('获取到的题库 ID:', id);
  
  if (id) {
    quizBankId.value = id;
    // 初始化答题功能
    initQuizExam();
  } else {
    error.value = '题库ID不存在';
    console.error('题库ID不存在，路由参数:', route.params);
  }
});

// 使用答题组合式函数
const {
  questions,
  quizBankInfo,
  loading,
  error,
  selectedQuestion,
  currentQuestionIndex,
  userAnswers,
  answerResults,
  getUserAnswer,
  getCurrentResult,
  initQuizExam,
  selectQuestion,
  saveUserAnswer,
  submitAnswer,
  goToPrevQuestion,
  goToNextQuestion
} = useQuizExam(quizBankId);

// 处理用户选择题目
const handleViewQuestion = (question) => {
  selectQuestion(question);
};

// 处理答案变化
const handleAnswerChange = (answer) => {
  console.log('保存答案:', selectedQuestion.value?.id, answer);
  saveUserAnswer(answer);
};

// 提交当前题目答案
const handleSubmitAnswer = () => {
  if (!selectedQuestion.value) return;
  
  const answer = userAnswers.value[selectedQuestion.value.id];
  if (!answer) {
    alert('请填写答案！');
    return;
  }
  
  // 使用提交答案功能检查答案
  const success = submitAnswer();
  if (!success) {
    alert('请填写答案！');
    return;
  }
  
  console.log('提交答案完成，结果:', getCurrentResult.value);
};
</script>

<template>
  <div class="h-screen bg-base-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <div class="navbar bg-base-100 shadow z-10">
      <div class="navbar-start">
        <button class="btn btn-sm btn-circle mr-2" @click="goBackToQuizQuestions">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold truncate">
          {{ quizBankInfo?.name || '答题页面' }}
        </h1>
      </div>
      <div class="navbar-end">
        <div class="badge badge-info mr-2">
          {{ currentQuestionIndex + 1 }} / {{ questions.length }}
        </div>
        <div class="flex items-center text-sm mr-2">
          <span class="mr-1">使用</span>
          <kbd class="kbd kbd-sm">←</kbd>
          <span class="mx-1">和</span>
          <kbd class="kbd kbd-sm">→</kbd>
          <span class="ml-1">切换题目</span>
        </div>
      </div>
    </div>
    
    <!-- 主内容区：使用网格布局 -->
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
          
          <!-- 进度统计 -->
          <div class="stats stats-vertical shadow w-full mt-2">
            <div class="stat">
              <div class="stat-title">已答题数</div>
              <div class="stat-value text-primary">{{ Object.keys(userAnswers).length }}</div>
              <div class="stat-desc">总题数 {{ questions.length }}</div>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center flex-1">
          <LoadingIndicator />
        </div>
        
        <!-- 题目列表 -->
        <div v-else class="overflow-y-auto flex-1">
          <QuestionList
            :questions="questions"
            @view="handleViewQuestion"
            @filter="handleFilter"
          />
        </div>
      </div>
      
      <!-- 右侧题目详情区域 (占据2/3到3/4宽度) -->
      <div class="p-4 overflow-y-auto md:col-span-2 lg:col-span-3">
        <!-- 题目答题区域 -->
        <div v-if="selectedQuestion" class="h-full">
          <QuizAnswer
            :question="selectedQuestion"
            :userAnswer="getUserAnswer"
            :is-prev-disabled="currentQuestionIndex <= 0"
            :is-next-disabled="currentQuestionIndex >= questions.length - 1"
            :showResult="getCurrentResult.showResult"
            :isCorrect="getCurrentResult.isCorrect"
            @answer-change="handleAnswerChange"
            @answer-submit="handleSubmitAnswer"
            @prev-question="goToPrevQuestion"
            @next-question="goToNextQuestion"
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
          <p class="text-lg text-base-content/70">请从左侧列表选择一个题目开始答题</p>
        </div>
      </div>
    </div>
  </div>
</template> 