<script setup>
import { ref, watch } from 'vue';

/**
 * 搜索输入组件
 * 用于提供搜索框功能
 * @props {String} placeholder - 搜索框占位文本
 * @props {String} value - 搜索框初始值
 * @emits search - 当用户输入搜索词并按下回车或点击搜索按钮时触发
 * 使用示例：<SearchInput placeholder="搜索题库..." @search="handleSearch" />
 */

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索...'
  },
  value: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search']);

const searchValue = ref(props.value);

// 监听外部value变化
watch(() => props.value, (newValue) => {
  searchValue.value = newValue;
});

// 搜索处理函数
const handleSearch = () => {
  emit('search', searchValue.value);
};

// 按下回车触发搜索
const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
</script>

<template>
  <div class="flex w-full max-w-md">
    <input 
      v-model="searchValue"
      type="text" 
      :placeholder="placeholder"
      class="input input-bordered flex-grow"
      @keydown="handleKeyDown"
    />
    <button 
      class="btn btn-primary ml-2"
      @click="handleSearch"
    >
      搜索
    </button>
  </div>
</template> 