/**
 * 题库数据模型
 * @typedef {Object} QuizBank
 * @property {number} id - 题库ID
 * @property {string} name - 题库名称
 * @property {string} [description] - 题库描述
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 创建题库请求参数
 * @typedef {Object} QuizBankCreateDTO
 * @property {string} name - 题库名称
 * @property {string} [description] - 题库描述
 */

/**
 * 更新题库请求参数
 * @typedef {Object} QuizBankUpdateDTO
 * @property {string} name - 题库名称
 * @property {string} [description] - 题库描述
 */

/**
 * 题库搜索参数
 * @typedef {Object} QuizBankSearchParams
 * @property {string} [name] - 题库名称关键字
 */

// 导出类型定义（为了TypeScript或JSDoc类型提示）
export const QuizBankTypes = {
  // 题库相关常量
}; 