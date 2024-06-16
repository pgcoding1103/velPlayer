<script setup>
  import { Icon } from '@iconify/vue'
  import router from '../router'
</script>
<template>
  <div class="navigationbar-haeder">
    <el-button
      type="primary"
      plain
      round
      @click="router.go(-1)"
    >
      <Icon
        icon="typcn:arrow-back"
        style="font-size: 25px"
      ></Icon>
    </el-button>
    <el-button
      type="primary"
      plain
      round
      @click="router.push('/')"
    >
      <Icon
        icon="typcn:home"
        style="font-size: 22px"
      ></Icon>
    </el-button>
    <el-button
      type="primary"
      plain
      round
      @click="router.go(1)"
    >
      <Icon
        icon="typcn:arrow-forward"
        style="font-size: 25px"
      ></Icon>
    </el-button>
  </div>
</template>
<style scoped>
  .navigationbar-haeder {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    padding: 0 15px;
  }
</style>
