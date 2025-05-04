<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="alert alert-error my-4">
    <span>{{ message }}</span>
  </div>
</template> 