<script setup>
/**
 * 题目选项组件
 * 用于展示不同类型题目的选项，并处理用户选择
 * @props {Object} question - 题目对象
 * @props {String} userAnswer - 用户当前的答案
 * @props {Boolean} readonly - 是否为只读模式
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
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['answer-change']);

// 处理单选题选项变化
const handleSingleChoiceChange = (value) => {
  if (props.readonly) return;
  emit('answer-change', value);
};

// 处理多选题选项变化
const handleMultipleChoiceChange = (key) => {
  if (props.readonly) return;
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
  if (props.readonly) return;
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
  set: (value) => {
    if (!props.readonly) emit('answer-change', value);
  }
});

// 当前选中的判断题答案
const judgmentAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => {
    if (!props.readonly) emit('answer-change', value);
  }
});

// 当前填空/简答题答案
const textAnswer = computed({
  get: () => props.userAnswer,
  set: (value) => {
    if (!props.readonly) emit('answer-change', value);
  }
});

// 检查某个选项是否为正确答案（适用于单选和多选题）
const isCorrectOption = computed(() => (key) => {
  if (!props.question.answer || !props.readonly) return false;
  
  if (Array.isArray(props.question.answer)) {
    return props.question.answer.includes(key);
  }
  
  return props.question.answer === key;
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
        class="p-3 rounded-lg flex items-center"
        :class="{
          'bg-base-200': !readonly || (!isCorrectOption(key) && userAnswer !== key),
          'bg-success/20': readonly && isCorrectOption(key),
          'bg-error/20': readonly && !isCorrectOption(key) && userAnswer === key
        }"
      >
        <input 
          type="radio" 
          :id="'question_' + question.id + '_' + key"
          :name="'question_' + question.id"
          :value="key"
          v-model="singleChoiceAnswer"
          class="radio mr-2"
          :class="{ 
            'radio-primary': !readonly || (!isCorrectOption(key) && userAnswer !== key), 
            'radio-success': readonly && isCorrectOption(key),
            'radio-error': readonly && !isCorrectOption(key) && userAnswer === key
          }"
          :disabled="readonly"
        />
        <label :for="'question_' + question.id + '_' + key" class="flex-1" :class="{ 'cursor-pointer': !readonly }">
          <span class="font-bold w-8 inline-block">{{ key }}.</span>
          <span>{{ value }}</span>
        </label>
        <div v-if="readonly && isCorrectOption(key)" class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
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
        class="p-3 rounded-lg flex items-center"
        :class="{
          'bg-base-200': !readonly || (!isCorrectOption(key) && !selectedMultipleOptions.includes(key)),
          'bg-success/20': readonly && isCorrectOption(key),
          'bg-error/20': readonly && !isCorrectOption(key) && selectedMultipleOptions.includes(key)
        }"
      >
        <input 
          type="checkbox" 
          :id="'question_' + question.id + '_' + key"
          :checked="selectedMultipleOptions.includes(key)"
          @change="handleMultipleChoiceChange(key)"
          class="checkbox mr-2"
          :class="{ 
            'checkbox-primary': !readonly || (!isCorrectOption(key) && !selectedMultipleOptions.includes(key)), 
            'checkbox-success': readonly && isCorrectOption(key),
            'checkbox-error': readonly && !isCorrectOption(key) && selectedMultipleOptions.includes(key)
          }"
          :disabled="readonly"
        />
        <label :for="'question_' + question.id + '_' + key" class="flex-1" :class="{ 'cursor-pointer': !readonly }">
          <span class="font-bold w-8 inline-block">{{ key }}.</span>
          <span>{{ value }}</span>
        </label>
        <div v-if="readonly && isCorrectOption(key)" class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 判断题选项 -->
  <div v-else-if="question.type === QuestionType.JUDGMENT">
    <h3 class="text-lg font-semibold mb-2">请选择</h3>
    <div class="grid gap-2">
      <div 
        class="p-3 rounded-lg flex items-center"
        :class="{
          'bg-base-200': !readonly || (!isCorrectOption('T') && userAnswer !== 'T'),
          'bg-success/20': readonly && isCorrectOption('T'),
          'bg-error/20': readonly && !isCorrectOption('T') && userAnswer === 'T'
        }"
      >
        <input 
          type="radio" 
          id="judgment_T"
          :name="'judgment_' + question.id"
          value="T"
          v-model="judgmentAnswer"
          class="radio mr-2"
          :class="{ 
            'radio-primary': !readonly || (!isCorrectOption('T') && userAnswer !== 'T'), 
            'radio-success': readonly && isCorrectOption('T'),
            'radio-error': readonly && !isCorrectOption('T') && userAnswer === 'T'
          }"
          :disabled="readonly"
        />
        <label for="judgment_T" class="flex-1" :class="{ 'cursor-pointer': !readonly }">
          <span class="font-bold w-8 inline-block">T.</span>
          <span>正确</span>
        </label>
        <div v-if="readonly && isCorrectOption('T')" class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div 
        class="p-3 rounded-lg flex items-center"
        :class="{
          'bg-base-200': !readonly || (!isCorrectOption('F') && userAnswer !== 'F'),
          'bg-success/20': readonly && isCorrectOption('F'),
          'bg-error/20': readonly && !isCorrectOption('F') && userAnswer === 'F'
        }"
      >
        <input 
          type="radio" 
          id="judgment_F"
          :name="'judgment_' + question.id"
          value="F"
          v-model="judgmentAnswer"
          class="radio mr-2"
          :class="{ 
            'radio-primary': !readonly || (!isCorrectOption('F') && userAnswer !== 'F'), 
            'radio-success': readonly && isCorrectOption('F'),
            'radio-error': readonly && !isCorrectOption('F') && userAnswer === 'F'
          }"
          :disabled="readonly"
        />
        <label for="judgment_F" class="flex-1" :class="{ 'cursor-pointer': !readonly }">
          <span class="font-bold w-8 inline-block">F.</span>
          <span>错误</span>
        </label>
        <div v-if="readonly && isCorrectOption('F')" class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
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
      :disabled="readonly"
    ></textarea>
    
    <!-- 显示正确答案（仅在只读模式下） -->
    <div v-if="readonly && question.answer" class="mt-4">
      <h3 class="font-semibold mb-2">参考答案</h3>
      <div class="p-3 bg-success/20 rounded-lg whitespace-pre-wrap">
        {{ Array.isArray(question.answer) ? question.answer.join('\n') : question.answer }}
      </div>
    </div>
  </div>
</template> 