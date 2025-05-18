/**
 * 答题功能组合式函数
 * 用于管理答题相关的状态和逻辑，与UI展示分离
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getQuestionsByBankId } from '../api/question';
import { getQuizBankById } from '../api/quiz-bank';

/**
 * 答题功能组合式函数
 * @param {string|number} quizBankId - 题库ID
 * @returns {Object} 答题相关的状态和方法
 */
export default function useQuizExam(quizBankId) {
  // 基础数据
  const questions = ref([]);
  const quizBankInfo = ref(null);
  const loading = ref(true);
  const error = ref('');
  const selectedQuestion = ref(null);
  const currentQuestionIndex = ref(0);
  const userAnswers = ref({});

  /**
   * 获取题库信息
   */
  const fetchQuizBankInfo = async () => {
    try {
      const res = await getQuizBankById(quizBankId.value);
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

  /**
   * 获取题目列表
   */
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
        // 如果有题目，设置第一题为当前选中题目
        if (questions.value.length > 0) {
          selectQuestion(questions.value[0]);
        }
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

  /**
   * 选择题目
   * @param {Object} question - 要选择的题目对象
   */
  const selectQuestion = (question) => {
    selectedQuestion.value = question;
    // 更新当前题目索引
    currentQuestionIndex.value = questions.value.findIndex(q => q.id === question.id);
  };

  /**
   * 保存用户答案
   * @param {string} answer - 用户答案
   */
  const saveUserAnswer = (answer) => {
    if (selectedQuestion.value) {
      const questionId = selectedQuestion.value.id;
      console.log(`保存题目 ${questionId} 的答案:`, answer);
      userAnswers.value[questionId] = answer;
    }
  };

  /**
   * 获取用户当前题目的答案
   */
  const getUserAnswer = computed(() => {
    if (!selectedQuestion.value) return '';
    const questionId = selectedQuestion.value.id;
    const answer = userAnswers.value[questionId];
    console.log(`获取题目 ${questionId} 的答案:`, answer);
    return answer || '';
  });

  /**
   * 转到上一题
   */
  const goToPrevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      selectQuestion(questions.value[currentQuestionIndex.value - 1]);
    }
  };

  /**
   * 转到下一题
   */
  const goToNextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      selectQuestion(questions.value[currentQuestionIndex.value + 1]);
    }
  };

  /**
   * 处理键盘事件，实现左右方向键切换题目
   */
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevQuestion();
    } else if (e.key === 'ArrowRight') {
      goToNextQuestion();
    }
  };

  // 初始化时添加键盘事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  // 组件卸载前移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  /**
   * 初始化数据加载
   */
  const initQuizExam = async () => {
    await fetchQuizBankInfo();
    await fetchQuestions();
  };

  return {
    // 状态
    questions,
    quizBankInfo,
    loading,
    error,
    selectedQuestion,
    currentQuestionIndex,
    userAnswers,
    getUserAnswer,
    
    // 方法
    initQuizExam,
    selectQuestion,
    saveUserAnswer,
    goToPrevQuestion,
    goToNextQuestion,
    
    // 工具方法
    fetchQuizBankInfo,
    fetchQuestions,
  };
} 