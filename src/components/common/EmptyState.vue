<script setup>
defineProps({
  message: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<template>
  <div class="text-center my-8">
    <div class="text-lg text-gray-500">{{ message }}</div>
  </div>
</template> 