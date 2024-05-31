<script setup></script>
<template>
  <el-container>
    <el-aside width="250px">Aside</el-aside>
    <el-container>
      <el-header height="100px">
        <SearchBar />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped></style>
