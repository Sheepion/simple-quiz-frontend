/**
 * 题目难度级别枚举
 * @enum {string}
 */
export const DifficultyLevel = {
  /** 简单 */
  EASY: 'easy',
  /** 中等 */
  MEDIUM: 'medium',
  /** 困难 */
  HARD: 'hard'
};

/**
 * 获取难度级别显示文本
 * @param {string} level 难度级别
 * @returns {string} 难度级别显示文本
 */
export const getDifficultyText = (level) => {
  const textMap = {
    [DifficultyLevel.EASY]: '简单',
    [DifficultyLevel.MEDIUM]: '中等',
    [DifficultyLevel.HARD]: '困难'
  };
  return textMap[level] || '未知';
};

/**
 * 获取难度级别对应的样式类
 * @param {string} level 难度级别
 * @returns {string} 样式类名
 */
export const getDifficultyClass = (level) => {
  const classMap = {
    [DifficultyLevel.EASY]: 'text-success',
    [DifficultyLevel.MEDIUM]: 'text-warning',
    [DifficultyLevel.HARD]: 'text-error'
  };
  return classMap[level] || '';
}; 