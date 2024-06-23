<script setup></script>
<template>
  <el-container>
    <el-aside
      width="250px"
      style="
        overflow: visible;
        height: 100vh;
        border-right: 1px solid var(--el-border-color);
      "
    >
      <Aside />
    </el-aside>
    <el-container style="height: 100vh">
      <el-header
        height="100px"
        style="border-bottom: 1px solid var(--el-border-color)"
      >
        <Header />
      </el-header>
      <el-main style="flex: 1; overflow-y: scroll">
        <router-view
          v-slot="{ Component }"
          :key="$route.fullPath"
        >
          <keep-alive include="Home">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped></style>
