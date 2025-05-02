/**
 * 题目类型枚举
 * @enum {string}
 */
export const QuestionType = {
  /** 单选题 */
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  /** 多选题 */
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  /** 判断题 */
  JUDGMENT: 'JUDGMENT',
  /** 填空题 */
  FILL_BLANK: 'FILL_BLANK',
  /** 简答题 */
  SHORT_ANSWER: 'SHORT_ANSWER'
};

/**
 * 题目数据模型
 * @typedef {Object} Question
 * @property {number} id - 题目ID
 * @property {number} quizBankId - 所属题库ID
 * @property {string} title - 题目标题
 * @property {string} content - 题目内容
 * @property {QuestionType} type - 题目类型
 * @property {Object} [options] - 选项内容，JSON格式，例如: {A: "选项A", B: "选项B"}
 * @property {string} answer - 正确答案
 * @property {string} [analysis] - 题目解析
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 创建题目请求参数
 * @typedef {Object} QuestionCreateDTO
 * @property {number} quizBankId - 所属题库ID
 * @property {string} title - 题目标题
 * @property {string} content - 题目内容
 * @property {QuestionType} type - 题目类型
 * @property {Object} [options] - 选项内容，JSON格式
 * @property {string} answer - 正确答案
 * @property {string} [analysis] - 题目解析
 */

/**
 * 更新题目请求参数
 * @typedef {Object} QuestionUpdateDTO
 * @property {string} title - 题目标题
 * @property {string} content - 题目内容
 * @property {QuestionType} type - 题目类型
 * @property {Object} [options] - 选项内容，JSON格式
 * @property {string} answer - 正确答案
 * @property {string} [analysis] - 题目解析
 */

/**
 * 题目搜索参数
 * @typedef {Object} QuestionSearchParams
 * @property {number} [quizBankId] - 题库ID
 * @property {string} [title] - 题目标题关键字
 * @property {QuestionType} [type] - 题目类型
 */ 