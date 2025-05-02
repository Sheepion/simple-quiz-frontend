/**
 * 通用响应结果
 * @template T
 * @typedef {Object} Result
 * @property {number} code - 响应代码
 * @property {string} message - 响应消息
 * @property {T} data - 响应数据
 */

/**
 * 分页响应结果
 * @template T
 * @typedef {Object} PageResult
 * @property {number} code - 响应代码
 * @property {string} message - 响应消息
 * @property {Object} data - 分页数据
 * @property {Array<T>} data.records - 数据记录
 * @property {number} data.total - 总记录数
 * @property {number} data.size - 每页大小
 * @property {number} data.current - 当前页码
 */

export default {
  // 可以在这里添加一些通用的响应代码常量
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}; 