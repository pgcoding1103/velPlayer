<script setup>
  import { guestlogin } from '@/api/user.js'
  import { useUser } from './store'
  const { login } = useUser()
  login().catch(() => {
    guestlogin()
  })
</script>
<template>
  <el-container>
    <el-aside
      width="250px"
      style="overflow: visible"
    >
      <Aside />
    </el-aside>
    <el-container>
      <el-header
        height="100px"
        style="
          position: sticky;
          top: 0;
          background-color: rgba(255, 255, 255);
          border-bottom: 1px solid var(--el-border-color);
          z-index: 999;
        "
      >
        <Header />
      </el-header>
      <el-main style="padding: 0">
        <router-view v-slot="{ Component }">
          <keep-alive include="Home">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped></style>
