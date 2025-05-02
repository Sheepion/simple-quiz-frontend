import request from './request';

/**
 * 获取题库列表
 * @returns {Promise<import('../models/result').Result<Array<import('../models/quiz-bank').QuizBank>>>} 题库列表结果
 */
export function getQuizBankList() {
  return request({
    url: '/api/quiz-banks',
    method: 'get'
  });
}

/**
 * 根据ID获取题库详情
 * @param {number} id - 题库ID
 * @returns {Promise<import('../models/result').Result<import('../models/quiz-bank').QuizBank>>} 题库详情结果
 */
export function getQuizBankById(id) {
  return request({
    url: `/api/quiz-banks/${id}`,
    method: 'get'
  });
}

/**
 * 创建题库
 * @param {import('../models/quiz-bank').QuizBankCreateDTO} data - 题库数据
 * @returns {Promise<import('../models/result').Result<import('../models/quiz-bank').QuizBank>>} 创建结果
 */
export function createQuizBank(data) {
  return request({
    url: '/api/quiz-banks',
    method: 'post',
    data
  });
}

/**
 * 更新题库
 * @param {number} id - 题库ID
 * @param {import('../models/quiz-bank').QuizBankUpdateDTO} data - 题库数据
 * @returns {Promise<import('../models/result').Result<import('../models/quiz-bank').QuizBank>>} 更新结果
 */
export function updateQuizBank(id, data) {
  return request({
    url: `/api/quiz-banks/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除题库
 * @param {number} id - 题库ID
 * @returns {Promise<import('../models/result').Result<boolean>>} 删除结果
 */
export function deleteQuizBank(id) {
  return request({
    url: `/api/quiz-banks/${id}`,
    method: 'delete'
  });
}

/**
 * 搜索题库
 * @param {import('../models/quiz-bank').QuizBankSearchParams} params - 搜索参数
 * @returns {Promise<import('../models/result').Result<Array<import('../models/quiz-bank').QuizBank>>>} 搜索结果
 */
export function searchQuizBanks(params) {
  return request({
    url: '/api/quiz-banks/search',
    method: 'get',
    params
  });
} 