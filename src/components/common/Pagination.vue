<script setup>
defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

defineEmits(['page-change'])
</script>

<template>
  <div class="flex justify-center mt-8">
    <div class="join">
      <button 
        class="join-item btn" 
        :disabled="currentPage <= 1"
        @click="$emit('page-change', currentPage - 1)"
      >«</button>
      
      <template v-for="page in totalPages" :key="page">
        <button 
          class="join-item btn" 
          :class="{ 'btn-active': page === currentPage }"
          @click="$emit('page-change', page)"
        >{{ page }}</button>
      </template>
      
      <button 
        class="join-item btn" 
        :disabled="currentPage >= totalPages"
        @click="$emit('page-change', currentPage + 1)"
      >»</button>
    </div>
  </div>
</template> 