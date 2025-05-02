<script setup>
</script>

<template>
  <div class="navbar bg-base-200">
    <div class="navbar-start">
      <a class="text-xl font-bold">简易题库</a>
    </div>
    <div class="navbar-center">
      <div class="menu menu-horizontal">
        <router-link to="/" class="btn btn-ghost">首页</router-link>
        <router-link to="/quizbank" class="btn btn-ghost">题库</router-link>
        <router-link to="/about" class="btn btn-ghost">关于我们</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <button class="btn btn-primary">登录</button>
    </div>
  </div>
  
  <main>
    <router-view />
  </main>
</template>

<style>
body {
  min-height: 100vh;
}
</style>
