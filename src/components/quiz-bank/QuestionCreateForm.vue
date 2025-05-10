<script setup>
/**
 * 题目创建表单组件
 * 用于添加新题目，支持添加完一个题目后继续添加新题目
 * @props {Number|String} quizBankId - 题库ID
 * @emits save - 保存题目后触发
 */
import { computed, reactive, ref } from 'vue';
import { createQuestion } from '../../api/question';
import { QuestionType } from '../../models/question';

const props = defineProps({
  quizBankId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['save']);

// 题目类型选项
const questionTypeOptions = [
  { value: QuestionType.SINGLE_CHOICE, label: '单选题' },
  { value: QuestionType.MULTIPLE_CHOICE, label: '多选题' },
  { value: QuestionType.JUDGMENT, label: '判断题' },
  { value: QuestionType.FILL_BLANK, label: '填空题' },
  { value: QuestionType.SHORT_ANSWER, label: '简答题' }
];

// 状态
const loading = ref(false);
const error = ref('');
const success = ref('');
const lastSavedQuestion = ref(null);

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  type: QuestionType.SINGLE_CHOICE,
  options: {},
  answer: '',
  analysis: ''
});

// 用于多选题选项的临时数组
const optionsArray = ref([
  { key: 'A', value: '' },
  { key: 'B', value: '' },
  { key: 'C', value: '' },
  { key: 'D', value: '' }
]);

// 是否显示选项的表单
const showOptionsForm = computed(() => {
  return formData.type === QuestionType.SINGLE_CHOICE || 
         formData.type === QuestionType.MULTIPLE_CHOICE;
});

// 是否显示判断题的表单
const showJudgmentForm = computed(() => {
  return formData.type === QuestionType.JUDGMENT;
});

// 重置表单为空
const resetForm = () => {
  formData.title = '';
  formData.content = '';
  formData.type = QuestionType.SINGLE_CHOICE;
  formData.options = {};
  formData.answer = '';
  formData.analysis = '';
  
  // 重置选项数组
  optionsArray.value = [
    { key: 'A', value: '' },
    { key: 'B', value: '' },
    { key: 'C', value: '' },
    { key: 'D', value: '' }
  ];
  
  error.value = '';
  success.value = '';
};

// 添加选项
const addOption = () => {
  const nextKey = String.fromCharCode(65 + optionsArray.value.length); // A, B, C...
  optionsArray.value.push({ key: nextKey, value: '' });
};

// 删除选项
const removeOption = (index) => {
  if (optionsArray.value.length > 2) {
    optionsArray.value.splice(index, 1);
  }
};

// 更新选项对象
const updateOptionsObject = () => {
  const options = {};
  optionsArray.value.forEach(opt => {
    if (opt.key && opt.value) {
      options[opt.key] = opt.value;
    }
  });
  return options;
};

// 保存题目
const saveQuestion = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    // 对于选择题类型，需要更新选项对象
    if (showOptionsForm.value) {
      formData.options = updateOptionsObject();
      
      // 验证选项
      if (Object.keys(formData.options).length < 2) {
        error.value = '至少需要两个选项';
        loading.value = false;
        return;
      }
    } else if (showJudgmentForm.value) {
      formData.options = {
        A: '正确',
        B: '错误'
      };
      
      // 判断题的答案只能是 A 或 B
      if (formData.answer !== 'A' && formData.answer !== 'B') {
        error.value = '判断题答案只能是 A(正确) 或 B(错误)';
        loading.value = false;
        return;
      }
    }
    
    // 验证答案
    if (formData.type === QuestionType.SINGLE_CHOICE) {
      if (!formData.answer || !formData.options[formData.answer]) {
        error.value = '请选择正确的单选答案';
        loading.value = false;
        return;
      }
    } else if (formData.type === QuestionType.MULTIPLE_CHOICE) {
      const answers = formData.answer.split(',').map(a => a.trim()).filter(Boolean);
      if (answers.length < 1) {
        error.value = '请至少选择一个正确答案';
        loading.value = false;
        return;
      }
      
      // 检查每个答案是否都是有效的选项
      const invalidAnswers = answers.filter(a => !formData.options[a]);
      if (invalidAnswers.length > 0) {
        error.value = `答案 ${invalidAnswers.join(',')} 不是有效的选项`;
        loading.value = false;
        return;
      }
    }
    
    const response = await createQuestion({
      quizBankId: props.quizBankId,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      options: formData.options,
      answer: formData.answer,
      analysis: formData.analysis
    });
    
    if (response.data && response.data.code === 200) {
      success.value = '题目保存成功！';
      lastSavedQuestion.value = response.data.data;
      emit('save', response.data.data);
      resetForm(); // 重置表单，准备添加下一个题目
    } else {
      error.value = response.data?.message || '保存题目失败';
    }
  } catch (err) {
    console.error('保存题目错误:', err);
    error.value = err.message || '网络错误，无法保存题目';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <!-- 成功提示 -->
    <div v-if="success" class="alert alert-success shadow-lg mb-4">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ success }}</span>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error shadow-lg mb-4">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>
    
    <div class="card-body">
      <h2 class="card-title text-xl mb-4">添加新题目</h2>
      
      <form @submit.prevent="saveQuestion" class="space-y-6">
        <!-- 标题输入 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">题目标题</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="input input-bordered w-full"
            placeholder="例如：Java基本数据类型"
            required
          />
        </div>
        
        <!-- 题目类型选择 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">题目类型</span>
          </label>
          <select v-model="formData.type" class="select select-bordered w-full">
            <option
              v-for="option in questionTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- 题目内容 -->
        <div class="form-control">
          <label class="label block">
            <span class="label-text font-medium">题目内容</span>
          </label>
          <div class="w-full">
            <textarea
              v-model="formData.content"
              class="textarea textarea-bordered w-full h-32 max-h-64 overflow-y-auto"
              placeholder="请输入题目内容，例如：下列哪些是Java的基本数据类型？"
              required
            ></textarea>
          </div>
        </div>
        
        <!-- 选择题选项 -->
        <div v-if="showOptionsForm" class="space-y-3">
          <label class="label block">
            <span class="label-text font-medium">选项</span>
          </label>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="(option, index) in optionsArray" :key="index" class="flex gap-2">
              <div class="w-12 flex-shrink-0">
                <input
                  v-model="option.key"
                  type="text"
                  class="input input-bordered w-full"
                  maxlength="1"
                />
              </div>
              <input
                v-model="option.value"
                type="text"
                class="input input-bordered flex-1"
                :placeholder="`选项${option.key}`"
              />
              <button
                type="button"
                class="btn btn-square btn-outline btn-error"
                @click="removeOption(index)"
                :disabled="optionsArray.length <= 2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <button
            type="button"
            class="btn btn-outline btn-sm w-full"
            @click="addOption"
          >
            添加选项
          </button>
        </div>
        
        <!-- 判断题选项信息 -->
        <div v-if="showJudgmentForm" class="alert alert-info">
          <span>判断题答案：A 表示"正确"，B 表示"错误"</span>
        </div>
        
        <!-- 答案 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">正确答案</span>
          </label>
          <input
            v-model="formData.answer"
            type="text"
            class="input input-bordered w-full"
            :placeholder="formData.type === QuestionType.MULTIPLE_CHOICE ? '多选题答案用逗号分隔，如：A,B,C' : '例如：A'"
            required
          />
        </div>
        
        <!-- 解析 -->
        <div class="form-control">
          <label class="label block">
            <span class="label-text font-medium">题目解析（可选）</span>
          </label>
          <div class="w-full">
            <textarea
              v-model="formData.analysis"
              class="textarea textarea-bordered w-full h-28 max-h-64 overflow-y-auto"
              placeholder="解释答案原理，帮助学习者理解"
            ></textarea>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="form-control mt-8">
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            保存并继续添加
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 