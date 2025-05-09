<script setup>
/**
 * 题目列表组件
 * 用于展示题目列表，支持表格形式展示，提供题目类型筛选和搜索
 * @props {Array<import('../../models/question').Question>} questions - 题目列表数据
 * @emits refresh - 当需要刷新列表时触发
 * @emits edit - 当点击编辑按钮时触发
 * @emits delete - 当点击删除按钮时触发
 * @emits view - 当点击查看按钮时触发
 * @emits filter - 当筛选条件变化时触发
 * 使用示例：<QuestionList :questions="questionsList" @refresh="fetchQuestions" @filter="handleFilter" />
 */
import { computed, ref } from 'vue';
import { deleteQuestion } from '../../api/question';
import { QuestionType } from '../../models/question';
import EmptyState from '../common/EmptyState.vue';

// 定义属性
const props = defineProps({
  questions: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 定义事件
const emit = defineEmits(['refresh', 'edit', 'delete', 'view', 'filter']);

// 状态
const loading = ref(false);
const error = ref('');
const searchKeyword = ref('');
const selectedType = ref('');

// 题目类型映射表
const questionTypeMap = {
  [QuestionType.SINGLE_CHOICE]: '单选题',
  [QuestionType.MULTIPLE_CHOICE]: '多选题',
  [QuestionType.JUDGMENT]: '判断题',
  [QuestionType.FILL_BLANK]: '填空题',
  [QuestionType.SHORT_ANSWER]: '简答题'
};

// 题目类型选项列表
const typeOptions = [
  { value: '', label: '全部类型' },
  { value: QuestionType.SINGLE_CHOICE, label: '单选题' },
  { value: QuestionType.MULTIPLE_CHOICE, label: '多选题' },
  { value: QuestionType.JUDGMENT, label: '判断题' },
  { value: QuestionType.FILL_BLANK, label: '填空题' },
  { value: QuestionType.SHORT_ANSWER, label: '简答题' }
];

// 获取题目类型中文名
const getQuestionTypeName = (type) => {
  return questionTypeMap[type] || '未知类型';
};

// 获取题目类型对应的样式类
const getQuestionTypeClass = (type) => {
  const classMap = {
    [QuestionType.SINGLE_CHOICE]: 'badge-primary',
    [QuestionType.MULTIPLE_CHOICE]: 'badge-secondary',
    [QuestionType.JUDGMENT]: 'badge-accent',
    [QuestionType.FILL_BLANK]: 'badge-info',
    [QuestionType.SHORT_ANSWER]: 'badge-warning'
  };
  return `badge ${classMap[type] || 'badge-ghost'} badge-md`;
};

// 本地筛选（实际项目中应通过API筛选）
const filteredQuestions = computed(() => {
  return props.questions.filter(question => {
    // 按类型筛选
    if (selectedType.value && question.type !== selectedType.value) {
      return false;
    }
    
    // 按关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      return question.title.toLowerCase().includes(keyword) || 
             (question.content && question.content.toLowerCase().includes(keyword));
    }
    
    return true;
  });
});

// 处理搜索
const handleSearch = () => {
  // 实际项目中应发送请求到后端进行搜索
  console.log('搜索关键词:', searchKeyword.value);
  emit('filter', { keyword: searchKeyword.value, type: selectedType.value });
};

// 处理类型筛选变化
const handleTypeChange = () => {
  console.log('选择类型:', selectedType.value);
  emit('filter', { keyword: searchKeyword.value, type: selectedType.value });
};

// 处理编辑题目
const handleEdit = (question) => {
  emit('edit', question);
};

// 处理删除题目
const handleDelete = async (question) => {
  if (!confirm(`确定要删除题目 "${question.title}" 吗？`)) {
    return;
  }
  
  try {
    loading.value = true;
    error.value = '';
    
    const res = await deleteQuestion(question.id);
    
    if (res.data && res.data.code === 200) {
      // 删除成功，通知父组件刷新列表
      emit('refresh');
    } else {
      error.value = res.data?.message || '删除题目失败';
    }
  } catch (err) {
    console.error('删除题目错误:', err);
    error.value = '网络错误，无法删除题目';
  } finally {
    loading.value = false;
  }
};

// 处理查看题目
const handleView = (question) => {
  emit('view', question);
};
</script>

<template>
  <div>
    <!-- 搜索和筛选区域 -->
    <div class="mb-6 bg-base-200 p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-4">
        <!-- 搜索框 -->
        <div class="form-control flex-1">
          <div class="join w-full">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="搜索题目..." 
              class="input input-bordered join-item w-full"
              @keyup.enter="handleSearch"
            />
            <button class="btn join-item" @click="handleSearch">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 类型筛选 -->
        <div class="w-52">
          <select 
            v-model="selectedType" 
            class="select select-bordered w-full" 
            @change="handleTypeChange"
          >
            <option v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="alert alert-error mb-4">
      {{ error }}
    </div>
    
    <!-- 空状态展示 -->
    <EmptyState v-if="filteredQuestions.length === 0" message="暂无题目数据" />
    
    <!-- 题目表格 -->
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <!-- 表头 -->
        <thead>
          <tr>
            <th class="w-16">序号</th>
            <th class="w-28">类型</th>
            <th>题目标题</th>
            <th class="w-36 text-center">操作</th>
          </tr>
        </thead>
        
        <!-- 表格内容 -->
        <tbody>
          <tr v-for="(question, index) in filteredQuestions" :key="question.id" class="hover">
            <td>{{ index + 1 }}</td>
            <td>
              <span :class="getQuestionTypeClass(question.type)" class="px-3 py-1">
                {{ getQuestionTypeName(question.type) }}
              </span>
            </td>
            <td class="font-medium">{{ question.title }}</td>
            <td>
              <div class="flex justify-center space-x-2">
                <button 
                  @click="handleView(question)" 
                  class="btn btn-sm btn-ghost"
                  title="查看题目"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  @click="handleEdit(question)" 
                  class="btn btn-sm btn-ghost"
                  title="编辑题目"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  @click="handleDelete(question)" 
                  class="btn btn-sm btn-ghost"
                  title="删除题目"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 