import request from './request';

/**
 * 获取题目详情
 * @param {number} id - 题目ID
 * @returns {Promise<import('../models/result').Result<import('../models/question').Question>>} 题目详情结果
 */
export function getQuestionById(id) {
  return request({
    url: `/api/quiz-questions/${id}`,
    method: 'get'
  });
}

/**
 * 创建题目
 * @param {import('../models/question').QuestionCreateDTO} data - 题目数据
 * @returns {Promise<import('../models/result').Result<import('../models/question').Question>>} 创建结果
 */
export function createQuestion(data) {
  return request({
    url: '/api/quiz-questions',
    method: 'post',
    data
  });
}

/**
 * 更新题目
 * @param {number} id - 题目ID
 * @param {import('../models/question').QuestionUpdateDTO} data - 题目数据
 * @returns {Promise<import('../models/result').Result<import('../models/question').Question>>} 更新结果
 */
export function updateQuestion(id, data) {
  return request({
    url: `/api/quiz-questions/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除题目
 * @param {number} id - 题目ID
 * @returns {Promise<import('../models/result').Result<boolean>>} 删除结果
 */
export function deleteQuestion(id) {
  return request({
    url: `/api/quiz-questions/${id}`,
    method: 'delete'
  });
}

/**
 * 获取题库下的题目列表
 * @param {number} quizBankId - 题库ID
 * @returns {Promise<import('../models/result').Result<Array<import('../models/question').Question>>>} 题目列表结果
 */
export function getQuestionsByBankId(quizBankId) {
  return request({
    url: `/api/quiz-questions/bank/${quizBankId}`,
    method: 'get'
  });
}

/**
 * 搜索题目
 * @param {import('../models/question').QuestionSearchParams} params - 搜索参数
 * @returns {Promise<import('../models/result').Result<Array<import('../models/question').Question>>>} 搜索结果
 */
export function searchQuestions(params) {
  return request({
    url: '/api/quiz-questions/search',
    method: 'get',
    params
  });
} 