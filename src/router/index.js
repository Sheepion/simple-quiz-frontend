import { createRouter, createWebHistory } from 'vue-router'
import QuizBankList from '../components/quiz-bank/QuizBankList.vue'
import QuizBank from '../views/QuizBank.vue'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: QuizBankList
  },
  {
    path: '/quizbank',
    name: 'QuizBank',
    component: QuizBank
  },
  {
    path: '/about',
    name: 'About',
    // 懒加载About页面
    component: () => import('../views/About.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 