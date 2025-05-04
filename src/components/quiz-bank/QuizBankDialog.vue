<script setup>
import { onMounted, ref, watch } from 'vue';

/**
 * 题库对话框组件
 * 用于新增和编辑题库
 * @props {Boolean} show - 控制对话框显示状态
 * @props {Object} quizBank - 题库对象，如果是编辑模式则传入
 * @emits submit - 当用户提交表单时触发，传递表单数据
 * @emits close - 当用户关闭对话框时触发
 * 使用示例：<QuizBankDialog :show="dialogVisible" :quiz-bank="currentQuizBank" @submit="handleSubmit" @close="dialogVisible = false" />
 */

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  quizBank: {
    type: Object,
    default: () => ({
      name: '',
      description: ''
    })
  }
});

const emit = defineEmits(['submit', 'close']);

const formData = ref({
  name: '',
  description: ''
});

const modalRef = ref(null);

// 当打开对话框时初始化表单数据
watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      name: props.quizBank?.name || '',
      description: props.quizBank?.description || ''
    };
    
    // 如果组件已加载，打开模态框
    if (modalRef.value) {
      modalRef.value.showModal();
    }
  } else {
    // 关闭模态框
    if (modalRef.value) {
      modalRef.value.close();
    }
  }
});

// 当编辑的题库变化时更新表单数据
watch(() => props.quizBank, (newValue) => {
  if (props.show && newValue) {
    formData.value = {
      name: newValue.name || '',
      description: newValue.description || ''
    };
  }
});

// 表单验证状态
const nameError = ref('');

// 验证表单
const validateForm = () => {
  // 重置错误
  nameError.value = '';
  
  // 验证名称
  if (!formData.value.name.trim()) {
    nameError.value = '题库名称不能为空';
    return false;
  }
  
  return true;
};

// 提交表单
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {...formData.value});
  }
};

// 关闭对话框
const handleClose = () => {
  emit('close');
};

// 处理模态框关闭事件
const handleModalClose = () => {
  emit('close');
};

// 组件挂载时，如果show为true，打开模态框
onMounted(() => {
  if (props.show && modalRef.value) {
    modalRef.value.showModal();
  }
});
</script>

<template>
  <dialog ref="modalRef" class="modal modal-middle">
    <div class="modal-box w-11/12 max-w-md">
      <h3 class="font-bold text-lg mb-4">{{ props.quizBank?.id ? '编辑题库' : '新增题库' }}</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 题库名称 -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">题库名称</span>
          </label>
          <input 
            v-model="formData.name" 
            type="text" 
            placeholder="请输入题库名称" 
            class="input input-bordered w-full" 
            :class="{'input-error': nameError}"
          />
          <label v-if="nameError" class="label">
            <span class="label-text-alt text-error">{{ nameError }}</span>
          </label>
        </div>
        
        <!-- 题库描述 -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">题库描述 (选填)</span>
          </label>
          <textarea 
            v-model="formData.description" 
            placeholder="请输入题库描述" 
            class="textarea textarea-bordered w-full h-24"
          ></textarea>
        </div>
        
        <!-- 操作按钮 -->
        <div class="modal-action">
          <button 
            type="button" 
            class="btn btn-outline" 
            @click="handleClose"
          >取消</button>
          <button 
            type="submit" 
            class="btn btn-primary"
          >确定</button>
        </div>
      </form>
    </div>
    
    <!-- 点击背景关闭模态框 -->
    <form method="dialog" class="modal-backdrop">
      <button>关闭</button>
    </form>
  </dialog>
</template> 