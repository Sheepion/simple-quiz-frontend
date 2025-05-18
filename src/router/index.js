import { createRouter, createWebHistory } from 'vue-router'
import QuizBankList from '../components/quiz-bank/QuizBankList.vue'
import QuestionManagement from '../views/QuestionManagement.vue'
import QuizBank from '../views/QuizBank.vue'
import QuizExam from '../views/QuizExam.vue'
import QuizQuestions from '../views/QuizQuestions.vue'

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
    path: '/quizbank/:id/questions',
    name: 'QuizQuestions',
    component: QuizQuestions,
    props: true
  },
  {
    path: '/quizbank/:id/management',
    name: 'QuestionManagement',
    component: QuestionManagement,
    props: true
  },
  {
    path: '/quizbank/:id/exam',
    name: 'QuizExam',
    component: QuizExam,
    props: true
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