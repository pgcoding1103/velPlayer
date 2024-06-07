<script setup>
  const props = defineProps({
    id: {
      type: String,
      default: ''
    }
  })
</script>
<template>
  <SongList :originId="props.id" />
</template>
<style scoped></style>
