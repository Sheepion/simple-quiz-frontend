<script setup>
/**
 * 题目详情组件
 * 用于展示和编辑题目详情，包括题目内容、选项和答案
 * @props {Object} question - 当前选中的题目对象
 * @props {Boolean} isNew - 是否是新增题目模式
 * @emits save - 保存题目时触发
 * @emits cancel - 取消编辑时触发
 */
import { computed, reactive, ref, watch } from 'vue';
import { createQuestion, updateQuestion } from '../../api/question';
import { QuestionType } from '../../models/question';

const props = defineProps({
  question: {
    type: Object,
    default: () => null
  },
  isNew: {
    type: Boolean,
    default: false
  },
  quizBankId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['save', 'cancel']);

// 题目类型选项
const questionTypeOptions = [
  { value: QuestionType.SINGLE_CHOICE, label: '单选题' },
  { value: QuestionType.MULTIPLE_CHOICE, label: '多选题' },
  { value: QuestionType.JUDGMENT, label: '判断题' },
  { value: QuestionType.FILL_BLANK, label: '填空题' },
  { value: QuestionType.SHORT_ANSWER, label: '简答题' }
];

// 编辑状态
const isEditing = ref(props.isNew);
const loading = ref(false);
const error = ref('');

// 表单数据
const formData = reactive({
  quizBankId: '',
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

// 判断题的选项
const judgmentOptions = [
  { key: 'A', label: '正确' },
  { key: 'B', label: '错误' }
];

// 监听题目数据变化，更新表单数据
watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    resetForm(newQuestion);
  } else if (props.isNew) {
    resetToEmpty();
  }
}, { immediate: true });

// 是否显示选项的表单
const showOptionsForm = computed(() => {
  return formData.type === QuestionType.SINGLE_CHOICE || 
         formData.type === QuestionType.MULTIPLE_CHOICE;
});

// 是否显示判断题的表单
const showJudgmentForm = computed(() => {
  return formData.type === QuestionType.JUDGMENT;
});

// 重置表单为指定的题目数据
const resetForm = (question) => {
  formData.quizBankId = question.quizBankId;
  formData.title = question.title;
  formData.content = question.content;
  formData.type = question.type;
  formData.answer = question.answer;
  formData.analysis = question.analysis || '';
  
  // 处理选项
  if (question.options && (question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.MULTIPLE_CHOICE)) {
    formData.options = { ...question.options };
    
    // 更新选项数组
    optionsArray.value = Object.keys(question.options).map(key => ({
      key,
      value: question.options[key]
    }));
    
    // 确保至少有4个选项
    while (optionsArray.value.length < 4) {
      const nextKey = String.fromCharCode(65 + optionsArray.value.length); // A, B, C...
      optionsArray.value.push({ key: nextKey, value: '' });
    }
  }
};

// 重置为空表单（用于新建）
const resetToEmpty = () => {
  formData.quizBankId = props.quizBankId;
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

// 开始编辑
const startEdit = () => {
  isEditing.value = true;
};

// 取消编辑
const cancelEdit = () => {
  error.value = '';
  isEditing.value = false;
  
  if (props.isNew) {
    emit('cancel');
  } else if (props.question) {
    resetForm(props.question);
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
    
    // 对于选择题类型，需要更新选项对象
    if (showOptionsForm.value) {
      formData.options = updateOptionsObject();
    } else if (showJudgmentForm.value) {
      formData.options = {
        A: '正确',
        B: '错误'
      };
    }
    
    let response;
    
    if (props.isNew) {
      response = await createQuestion({
        quizBankId: props.quizBankId,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        options: formData.options,
        answer: formData.answer,
        analysis: formData.analysis
      });
    } else {
      response = await updateQuestion(props.question.id, {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        options: formData.options,
        answer: formData.answer,
        analysis: formData.analysis
      });
    }
    
    if (response.data && response.data.code === 200) {
      emit('save', response.data.data);
      isEditing.value = !props.isNew; // 如果是新建，保存后继续编辑状态
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
  <div class="bg-base-100 h-full">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center items-center h-full">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <!-- 无题目选中状态 -->
    <div
      v-else-if="!question && !isNew"
      class="flex flex-col justify-center items-center h-full p-8 text-center"
    >
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
      <p class="text-lg text-base-content/70">请从左侧列表选择一个题目，或点击新建题目按钮</p>
    </div>
    
    <!-- 题目详情/编辑 -->
    <div v-else class="p-6">
      <!-- 错误提示 -->
      <div v-if="error" class="alert alert-error mb-4">
        <span>{{ error }}</span>
      </div>
      
      <!-- 题目信息卡片 -->
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <!-- 查看模式：标题区域 -->
          <div v-if="!isEditing" class="flex justify-between items-start mb-4">
            <div>
              <h2 class="card-title text-xl mb-1">{{ question.title }}</h2>
              <div class="badge badge-primary">{{ questionTypeOptions.find(t => t.value === question.type)?.label }}</div>
            </div>
            <button class="btn btn-sm btn-primary" @click="startEdit">编辑题目</button>
          </div>
          
          <!-- 编辑模式：表单 -->
          <form v-else @submit.prevent="saveQuestion" class="space-y-4">
            <!-- 标题输入 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">题目标题</span>
              </label>
              <input
                v-model="formData.title"
                type="text"
                class="input input-bordered w-full"
                placeholder="请输入题目标题"
                required
              />
            </div>
            
            <!-- 题目类型选择 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">题目类型</span>
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
              <label class="label">
                <span class="label-text">题目内容</span>
              </label>
              <textarea
                v-model="formData.content"
                class="textarea textarea-bordered h-24"
                placeholder="请输入题目内容"
                required
              ></textarea>
            </div>
            
            <!-- 选择题选项 -->
            <div v-if="showOptionsForm" class="space-y-3">
              <label class="label">
                <span class="label-text">选项</span>
              </label>
              
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
              
              <button
                type="button"
                class="btn btn-outline btn-sm"
                @click="addOption"
              >
                添加选项
              </button>
            </div>
            
            <!-- 判断题选项 -->
            <div v-if="showJudgmentForm" class="form-control">
              <label class="label">
                <span class="label-text">选项</span>
              </label>
              <div class="space-y-2">
                <div v-for="option in judgmentOptions" :key="option.key" class="flex items-center">
                  <span class="w-16">{{ option.key }}. {{ option.label }}</span>
                </div>
              </div>
            </div>
            
            <!-- 答案 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">正确答案</span>
              </label>
              <input
                v-model="formData.answer"
                type="text"
                class="input input-bordered w-full"
                placeholder="请输入正确答案，如：A 或 A,B,C"
                required
              />
            </div>
            
            <!-- 解析 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">题目解析</span>
              </label>
              <textarea
                v-model="formData.analysis"
                class="textarea textarea-bordered h-24"
                placeholder="请输入题目解析（可选）"
              ></textarea>
            </div>
            
            <!-- 表单操作按钮 -->
            <div class="flex justify-end space-x-2 pt-2">
              <button type="button" class="btn" @click="cancelEdit">取消</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                保存
              </button>
            </div>
          </form>
          
          <!-- 查看模式：题目内容 -->
          <div v-if="!isEditing" class="space-y-6 mt-4">
            <!-- 题目内容 -->
            <div>
              <h3 class="text-lg font-semibold mb-2">题目内容</h3>
              <div class="p-4 bg-base-200 rounded-lg whitespace-pre-wrap">{{ question.content }}</div>
            </div>
            
            <!-- 选项列表 -->
            <div v-if="question.options">
              <h3 class="text-lg font-semibold mb-2">选项</h3>
              <div class="grid gap-2">
                <div 
                  v-for="(value, key) in question.options" 
                  :key="key"
                  class="p-3 bg-base-200 rounded-lg flex"
                >
                  <span class="font-bold w-8">{{ key }}.</span>
                  <span>{{ value }}</span>
                </div>
              </div>
            </div>
            
            <!-- 答案 -->
            <div>
              <h3 class="text-lg font-semibold mb-2">正确答案</h3>
              <div class="p-4 bg-primary/10 text-primary rounded-lg font-medium">
                {{ question.answer }}
              </div>
            </div>
            
            <!-- 解析 -->
            <div v-if="question.analysis">
              <h3 class="text-lg font-semibold mb-2">题目解析</h3>
              <div class="p-4 bg-base-200 rounded-lg whitespace-pre-wrap">{{ question.analysis }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>