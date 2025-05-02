# Simple Quiz（简易题库系统）
**此前端主要由 LLM 完成开发，无法保证代码质量**  

后端仓库地址：https://github.com/Sheepion/simple-quiz-backend
## 项目介绍

Simple Quiz 是一个基于 Vue 3 和 Vite 构建的简易题库管理系统前端，组件库使用 DaisyUI 5。  
系统旨在提供直观、易用的在线题库管理和练习功能。系统支持多种题型，包括单选题、多选题、判断题、填空题和简答题。  

**项目仍处于早期开发阶段，各项功能并不完善**

## 功能介绍
- **题库管理**：创建、查看、编辑和删除题库
- **题目管理**：支持多种题型（单选、多选、判断、填空、简答）的添加和管理
- **在线练习**：用户可以在线进行题目练习
- **搜索功能**：支持按题库名称和题目关键字搜索

## 技术栈
- **前端框架**：Vue 3
- **构建工具**：Vite
- **路由管理**：Vue Router
- **HTTP 请求**：Axios
- **UI 框架**：TailwindCSS + DaisyUI
- **开发语言**：JavaScript

## 代码结构
```
simple-quiz-frontend/
├── public/             # 静态资源目录
├── src/                # 源代码目录
│   ├── api/            # API 接口请求
│   ├── assets/         # 项目资源文件
│   ├── components/     # 公共组件
│   ├── models/         # 数据模型定义
│   ├── router/         # 路由配置
│   ├── views/          # 页面视图组件
│   ├── App.vue         # 应用入口组件
│   ├── main.js         # 应用入口文件
│   └── style.css       # 全局样式
└── vite.config.js      # Vite 配置文件
```

## 快速开始
1. 安装依赖
```
npm install
```

2. 启动开发服务器
```
npm run dev
```

3. 构建生产版本
```
npm run build
```
