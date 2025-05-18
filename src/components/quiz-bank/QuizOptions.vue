<script setup>
/**
 * 题目选项组件
 * 用于展示不同类型题目的选项，并处理用户选择
 * @props {Object} question - 题目对象
 * @props {String} userAnswer - 用户当前的答案
 * @emits answer-change - 当用户选择答案时触发，传递新答案
 */
import { computed } from 'vue';
import { QuestionType } from '../../models/question';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  userAnswer: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['answer-change']);

// 处理单选题选项变化
const handleSingleChoiceChange = (value) => {
  emit('answer-change', value);
};

// 处理多选题选项变化
const handleMultipleChoiceChange = (key) => {
  const currentAnswers = props.userAnswer ? props.userAnswer.split(',').filter(Boolean) : [];
  let newAnswers;
  
  if (currentAnswers.includes(key)) {
    // 如果已选中，则取消选中
    newAnswers = currentAnswers.filter(item => item !== key);
  } else {
    // 如果未选中，则添加选中
    newAnswers = [...currentAnswers, key];
  }
  
  emit('answer-change', newAnswers.join(','));
};

// 处理判断题选项变化
const handleJudgmentChange = (value) => {
  emit('answer-change', value);
};

// 计算当前多选题选中的选项
const selectedMultipleOptions = computed(() => {
  if (!props.userAnswer) return [];
  return props.userAnswer.split(',').filter(Boolean);
});

// 当前选中的单选答案
const singleChoiceAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => emit('answer-change', value)
});

// 当前选中的判断题答案
const judgmentAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => emit('answer-change', value)
});

// 当前填空/简答题答案
const textAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => emit('answer-change', value)
});
</script>

<template>
  <!-- 单选题选项 -->
  <div v-if="question.options && question.type === QuestionType.SINGLE_CHOICE">
    <h3 class="text-lg font-semibold mb-2">选项</h3>
    <div class="grid gap-2">
      <div 
        v-for="(value, key) in question.options" 
        :key="key"
        class="p-3 bg-base-200 rounded-lg flex items-center"
      >
        <input 
          type="radio" 
          :id="'question_' + question.id + '_' + key"
          :name="'question_' + question.id"
          :value="key"
          v-model="singleChoiceAnswer"
          class="radio radio-primary mr-2"
        />
        <label :for="'question_' + question.id + '_' + key" class="flex-1 cursor-pointer">
          <span class="font-bold w-8 inline-block">{{ key }}.</span>
          <span>{{ value }}</span>
        </label>
      </div>
    </div>
  </div>
  
  <!-- 多选题选项 -->
  <div v-else-if="question.options && question.type === QuestionType.MULTIPLE_CHOICE">
    <h3 class="text-lg font-semibold mb-2">选项</h3>
    <div class="grid gap-2">
      <div 
        v-for="(value, key) in question.options" 
        :key="key"
        class="p-3 bg-base-200 rounded-lg flex items-center"
      >
        <input 
          type="checkbox" 
          :id="'question_' + question.id + '_' + key"
          :checked="selectedMultipleOptions.includes(key)"
          @change="handleMultipleChoiceChange(key)"
          class="checkbox checkbox-primary mr-2"
        />
        <label :for="'question_' + question.id + '_' + key" class="flex-1 cursor-pointer">
          <span class="font-bold w-8 inline-block">{{ key }}.</span>
          <span>{{ value }}</span>
        </label>
      </div>
    </div>
  </div>
  
  <!-- 判断题选项 -->
  <div v-else-if="question.type === QuestionType.JUDGMENT">
    <h3 class="text-lg font-semibold mb-2">请选择</h3>
    <div class="grid gap-2">
      <div class="p-3 bg-base-200 rounded-lg flex items-center">
        <input 
          type="radio" 
          id="judgment_A"
          :name="'judgment_' + question.id"
          value="A"
          v-model="judgmentAnswer"
          class="radio radio-primary mr-2"
        />
        <label for="judgment_A" class="flex-1 cursor-pointer">
          <span class="font-bold w-8 inline-block">A.</span>
          <span>正确</span>
        </label>
      </div>
      <div class="p-3 bg-base-200 rounded-lg flex items-center">
        <input 
          type="radio" 
          id="judgment_B"
          :name="'judgment_' + question.id"
          value="B"
          v-model="judgmentAnswer"
          class="radio radio-primary mr-2"
        />
        <label for="judgment_B" class="flex-1 cursor-pointer">
          <span class="font-bold w-8 inline-block">B.</span>
          <span>错误</span>
        </label>
      </div>
    </div>
  </div>
  
  <!-- 填空题和简答题 -->
  <div v-else>
    <h3 class="text-lg font-semibold mb-2">请输入答案</h3>
    <textarea 
      v-model="textAnswer"
      class="textarea textarea-bordered w-full h-32" 
      placeholder="在此输入您的答案..."
    ></textarea>
  </div>
</template> 