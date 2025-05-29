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
  
  // 答题结果相关状态
  const answerResults = ref({});  // 保存每个题目的答题结果：{ questionId: { showResult: boolean, isCorrect: boolean } }

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
   * 检查答案是否正确
   * @param {string} userAnswer - 用户答案
   * @param {Array|string} correctAnswer - 正确答案
   * @param {string} questionType - 题目类型
   * @returns {boolean} 是否正确
   */
  const checkAnswer = (userAnswer, correctAnswer, questionType) => {
    if (!userAnswer || !correctAnswer) return false;
    
    // 对于单选题和判断题，直接比较答案
    if (questionType === 'SINGLE_CHOICE' || questionType === 'JUDGMENT') {
      // 确保正确答案是数组，且只取第一个元素进行比较
      let answerToCheck = correctAnswer;
      if (Array.isArray(correctAnswer)) {
        answerToCheck = correctAnswer[0];
      }
      
      // 如果是判断题，需要处理答案格式转换（后端可能使用A/B，前端使用T/F）
      if (questionType === 'JUDGMENT') {
        // 将后端的A/B转换为前端的T/F
        if (answerToCheck === 'A') answerToCheck = 'T';
        if (answerToCheck === 'B') answerToCheck = 'F';
        
        // 将前端的T/F转换为后端的A/B用于比较
        if (userAnswer === 'T') return answerToCheck === 'T' || answerToCheck === 'A';
        if (userAnswer === 'F') return answerToCheck === 'F' || answerToCheck === 'B';
      }
      
      return userAnswer === answerToCheck;
    }
    
    // 对于多选题，需要比较数组
    if (questionType === 'MULTIPLE_CHOICE') {
      // 将用户答案转换为数组
      const userAnswerArray = userAnswer.split(',').filter(Boolean).sort();
      
      // 确保正确答案是数组
      let correctAnswerArray = correctAnswer;
      if (!Array.isArray(correctAnswer)) {
        correctAnswerArray = [correctAnswer];
      }
      
      // 排序以确保顺序不影响比较
      const sortedCorrectAnswer = [...correctAnswerArray].sort();
      
      // 检查长度是否相同
      if (userAnswerArray.length !== sortedCorrectAnswer.length) {
        return false;
      }
      
      // 检查每个选项是否匹配
      return userAnswerArray.every((item, index) => item === sortedCorrectAnswer[index]);
    }
    
    // 对于填空题和简答题，简单比较即可（可能需要更复杂的逻辑）
    if (questionType === 'FILL_BLANK' || questionType === 'SHORT_ANSWER') {
      if (Array.isArray(correctAnswer)) {
        // 如果有多个可能的正确答案，任一匹配即可
        return correctAnswer.includes(userAnswer);
      }
      return userAnswer === correctAnswer;
    }
    
    return false;
  };

  /**
   * 提交当前题目答案
   */
  const submitAnswer = () => {
    if (!selectedQuestion.value) return;
    
    const questionId = selectedQuestion.value.id;
    const userAnswer = userAnswers.value[questionId];
    
    if (!userAnswer) {
      // 没有填写答案
      return false;
    }
    
    // 检查答案是否正确
    const correctAnswer = selectedQuestion.value.answer;
    const isCorrect = checkAnswer(userAnswer, correctAnswer, selectedQuestion.value.type);
    
    // 保存结果
    answerResults.value[questionId] = {
      showResult: true,
      isCorrect
    };
    
    console.log(`题目 ${questionId} 的答题结果:`, isCorrect ? '正确' : '错误');
    
    return true;
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
   * 获取当前题目的答题结果
   */
  const getCurrentResult = computed(() => {
    if (!selectedQuestion.value) return { showResult: false, isCorrect: false };
    const questionId = selectedQuestion.value.id;
    return answerResults.value[questionId] || { showResult: false, isCorrect: false };
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
    answerResults,
    getUserAnswer,
    getCurrentResult,
    
    // 方法
    initQuizExam,
    selectQuestion,
    saveUserAnswer,
    submitAnswer,
    goToPrevQuestion,
    goToNextQuestion,
    
    // 工具方法
    fetchQuizBankInfo,
    fetchQuestions,
  };
} 