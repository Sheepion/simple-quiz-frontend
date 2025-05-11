<script setup>
defineProps({
  quizBank: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'enter', 'enter-management'])
</script>

<template>
  <div class="card card-bordered bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{{ quizBank.name }}</h2>
      <p v-if="quizBank.description">{{ quizBank.description }}</p>
      <p v-else class="text-gray-400">暂无描述</p>
      <div class="card-actions justify-end mt-4">
        <button 
          class="btn btn-outline btn-sm"
          @click="$emit('edit', quizBank.id)"
        >编辑</button>
        <button 
          class="btn btn-primary btn-sm"
          @click="$emit('enter', quizBank.id)"
        >题目列表</button>
        <button 
          class="btn btn-accent btn-sm"
          @click="$emit('enterManagement', quizBank.id)"
        >管理题目</button>
      </div>
    </div>
  </div>
</template> 