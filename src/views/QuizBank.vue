<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createQuizBank, getQuizBankById, updateQuizBank } from '../api/quiz-bank';
import Pagination from '../components/common/Pagination.vue';
import SearchInput from '../components/common/SearchInput.vue';
import QuizBankDialog from '../components/quiz-bank/QuizBankDialog.vue';
import QuizBankList from '../components/quiz-bank/QuizBankList.vue';

const router = useRouter();
const currentPage = ref(1);
const totalPages = ref(1); // 实际应用中可能需要从后端获取
const searchKeyword = ref('');
const dialogVisible = ref(false);
const currentQuizBank = ref(null);
const loading = ref(false);
const errorMessage = ref('');

// 处理搜索事件
const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
  currentPage.value = 1; // 重置页码
};

// 打开创建题库对话框
const handleCreateQuizBank = () => {
  currentQuizBank.value = null; // 清空当前题库，表示新建
  dialogVisible.value = true;
};

// 打开编辑题库对话框
const handleEditQuizBank = async (id) => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    // 获取题库详情
    const res = await getQuizBankById(id);
    
    if (res.data.code === 200) {
      currentQuizBank.value = res.data.data;
      dialogVisible.value = true;
    } else {
      errorMessage.value = res.data.message || '获取题库详情失败';
    }
  } catch (err) {
    errorMessage.value = err.message || '网络错误';
  } finally {
    loading.value = false;
  }
};

// 处理进入题目列表
const handleEnterQuizBank = (id) => {
  console.log('进入题库被触发，ID:', id);
  try {
    router.push(`/quizbank/${id}/questions`);
    console.log('路由跳转已执行');
  } catch (err) {
    console.error('路由跳转错误:', err);
  }
};

// 处理进入题目管理
const handleEnterQuestionManagement = (id) => {
  console.log('进入题目管理，ID:', id);
  try {
    router.push(`/quizbank/${id}/management`);
    console.log('路由跳转已执行');
  } catch (err) {
    console.error('路由跳转错误:', err);
  }
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  // 实际应用中可能需要重新获取数据
  // fetchQuizBanks(page)
};

// 处理对话框提交
const handleDialogSubmit = async (formData) => {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    let res;
    
    if (currentQuizBank.value?.id) {
      // 编辑模式
      res = await updateQuizBank(currentQuizBank.value.id, formData);
    } else {
      // 新建模式
      res = await createQuizBank(formData);
    }
    
    if (res.data.code === 200) {
      dialogVisible.value = false;
      // 刷新列表数据
      // 这里可以通过重置搜索关键词来触发列表重新加载
      const temp = searchKeyword.value;
      searchKeyword.value = '';
      setTimeout(() => {
        searchKeyword.value = temp;
      }, 0);
    } else {
      errorMessage.value = res.data.message || '操作失败';
    }
  } catch (err) {
    errorMessage.value = err.message || '网络错误';
  } finally {
    loading.value = false;
  }
};

// 关闭对话框
const handleDialogClose = () => {
  dialogVisible.value = false;
  errorMessage.value = '';
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 标题和新建按钮 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">题库列表</h1>
      <button 
        class="btn btn-primary"
        @click="handleCreateQuizBank"
      >新建题库</button>
    </div>
    
    <!-- 搜索框 -->
    <div class="mb-6">
      <SearchInput 
        placeholder="搜索题库名称..." 
        :value="searchKeyword"
        @search="handleSearch"
      />
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="alert alert-error mb-4">
      <span>{{ errorMessage }}</span>
    </div>
    
    <!-- 题库列表组件 -->
    <QuizBankList 
      :current-page="currentPage"
      :keyword="searchKeyword"
      @edit-quiz-bank="handleEditQuizBank"
      @enter-quiz-bank="handleEnterQuizBank"
      @enter-question-management="handleEnterQuestionManagement"
    />
    
    <!-- 分页组件 -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
      class="mt-6"
    />
    
    <!-- 题库对话框 -->
    <QuizBankDialog
      :show="dialogVisible"
      :quiz-bank="currentQuizBank"
      @submit="handleDialogSubmit"
      @close="handleDialogClose"
    />
  </div>
</template> 