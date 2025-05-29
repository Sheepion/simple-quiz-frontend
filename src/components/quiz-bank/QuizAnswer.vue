<script setup>
/**
 * 题目答题组件
 * 用于展示题目内容和答题区域，包括题目内容、选项和提交按钮
 * @props {Object} question - 题目对象
 * @props {String} userAnswer - 用户当前的答案
 * @props {Boolean} isPrevDisabled - 上一题按钮是否禁用
 * @props {Boolean} isNextDisabled - 下一题按钮是否禁用
 * @props {Boolean} showResult - 是否显示答题结果
 * @props {Boolean} isCorrect - 用户答案是否正确
 * @emits answer-submit - 提交答案时触发
 * @emits answer-change - 答案变化时触发
 * @emits prev-question - 切换到上一题时触发
 * @emits next-question - 切换到下一题时触发
 */
import { computed, watch } from 'vue';
import { QuestionType } from '../../models/question';
import QuizOptions from './QuizOptions.vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  userAnswer: {
    type: String,
    default: ''
  },
  isPrevDisabled: {
    type: Boolean,
    default: false
  },
  isNextDisabled: {
    type: Boolean,
    default: false
  },
  showResult: {
    type: Boolean,
    default: false
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['answer-submit', 'answer-change', 'prev-question', 'next-question']);

// 监听答案变化，用于调试
watch(() => props.userAnswer, (newVal) => {
  console.log('QuizAnswer - 用户答案已更新:', newVal);
});

// 监听题目变化，用于调试
watch(() => props.question, (newVal) => {
  if (newVal) {
    console.log('QuizAnswer - 题目已切换:', newVal.id, newVal.title);
    console.log('QuizAnswer - 当前答案:', props.userAnswer);
  }
}, { immediate: true });

// 处理答案变化
const handleAnswerChange = (answer) => {
  console.log('QuizAnswer - 答案变化:', answer);
  emit('answer-change', answer);
};

// 提交答案
const handleSubmit = () => {
  if (!props.userAnswer) {
    alert('请填写答案！');
    return;
  }
  
  emit('answer-submit', props.userAnswer);
};

// 获取题目类型名称
const getQuestionTypeName = (type) => {
  const typeMap = {
    [QuestionType.SINGLE_CHOICE]: '单选题',
    [QuestionType.MULTIPLE_CHOICE]: '多选题',
    [QuestionType.JUDGMENT]: '判断题',
    [QuestionType.FILL_BLANK]: '填空题',
    [QuestionType.SHORT_ANSWER]: '简答题'
  };
  
  return typeMap[type] || '未知类型';
};

// 将正确答案数组格式化为字符串
const formattedCorrectAnswer = computed(() => {
  if (!props.question || !props.question.answer) return '';
  
  // 如果答案是数组，将其转换为逗号分隔的字符串
  if (Array.isArray(props.question.answer)) {
    return props.question.answer.join(', ');
  }
  
  return props.question.answer;
});
</script>

<template>
  <div class="card bg-base-100 shadow-sm h-full">
    <div class="card-body">
      <!-- 题目标题和导航 -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="card-title text-xl mb-1">{{ question.title }}</h2>
          <div class="badge badge-primary">
            {{ getQuestionTypeName(question.type) }}
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            class="btn btn-outline btn-sm" 
            @click="emit('prev-question')"
            :disabled="isPrevDisabled"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            上一题
          </button>
          <button 
            class="btn btn-outline btn-sm" 
            @click="emit('next-question')"
            :disabled="isNextDisabled"
          >
            下一题
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 题目内容 -->
      <div class="space-y-6">
        <!-- 题目内容 -->
        <div>
          <h3 class="text-lg font-semibold mb-2">题目内容</h3>
          <div class="p-4 bg-base-200 rounded-lg whitespace-pre-wrap">{{ question.content }}</div>
        </div>
        
        <!-- 题目选项 -->
        <QuizOptions 
          :question="question" 
          :userAnswer="userAnswer"
          :readonly="showResult"
          @answer-change="handleAnswerChange"
        />
        
        <!-- 当前答案(调试用) -->
        <div class="text-sm mt-4 p-2 bg-base-200 rounded-lg" v-if="userAnswer && !showResult">
          <p class="font-semibold">当前已选答案:</p>
          <p>{{ userAnswer }}</p>
        </div>
        
        <!-- 答题结果展示 -->
        <div v-if="showResult" class="mt-4">
          <div class="alert" :class="isCorrect ? 'alert-success' : 'alert-error'">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path v-if="isCorrect" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ isCorrect ? '回答正确！' : '回答错误！' }}</span>
          </div>
          
          <div class="mt-4 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-lg mb-2">正确答案</h3>
            <p>{{ formattedCorrectAnswer }}</p>
          </div>
          
          <!-- 解析 -->
          <div v-if="question.analysis" class="mt-4 p-4 bg-base-200 rounded-lg">
            <h3 class="font-semibold text-lg mb-2">题目解析</h3>
            <p class="whitespace-pre-wrap">{{ question.analysis }}</p>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="flex justify-end mt-6">
          <button 
            class="btn btn-primary" 
            @click="handleSubmit"
            v-if="!showResult"
          >
            提交答案
          </button>
          <button 
            class="btn btn-outline" 
            @click="emit('next-question')"
            v-else-if="!isNextDisabled"
          >
            下一题
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 