# AGENTS.md

## 项目概览
浅途 Nav — 一个轻量美观的网站导航站，采用 React 19 + Vite + TypeScript 构建。

## 技术栈
- **框架**: React 19 + TypeScript
- **构建**: Vite 8
- **动画**: Framer Motion
- **图标**: Lucide React
- **字体**: Noto Sans SC (Google Fonts CN 域)
- **样式**: 原生 CSS (CSS Variables)

## 目录结构
```
src/
├── main.tsx              # 入口文件
├── App.tsx               # 主应用组件
├── components/
│   ├── Header.tsx        # 顶部导航栏（毛玻璃效果）
│   ├── SearchBar.tsx     # 搜索栏（防抖搜索）
│   ├── CategoryNav.tsx   # 分类标签导航（横向滚动）
│   ├── SiteCard.tsx      # 站点卡片（含收藏功能）
│   └── Footer.tsx        # 页脚
├── data/
│   └── sites.ts          # 站点数据（分类 + 站点列表）
├── hooks/
│   └── useFavorites.ts   # 收藏功能 Hook（localStorage 持久化）
├── types/
│   └── index.ts          # TypeScript 类型定义
└── styles/
    └── index.css         # 全局样式（CSS Variables + 响应式）
```

## 构建与运行
- 安装依赖: `pnpm install`
- 开发模式: `pnpm dev`
- 构建: `pnpm build`
- 预览: `pnpm preview`
- 代码检查: `pnpm lint`

## 核心功能
1. **分类浏览**: 7 大分类（AI工具、综合工具、生活实用、影音娱乐、开发技术、设计素材、学习资料）
2. **搜索**: 支持站点名称和描述的模糊搜索，200ms 防抖
3. **收藏**: 基于 localStorage 的收藏功能，支持筛选已收藏站点
4. **响应式**: PC 4列 → 平板 3列 → 手机 2列/1列

## 设计规范
详见 `DESIGN.md`，核心要点：
- 主色: #6366f1 (Indigo 500)
- 字体: Noto Sans SC
- 卡片圆角: 16px，毛玻璃导航栏
- 动效: framer-motion 入场动画 + hover 上移

## 添加站点
编辑 `src/data/sites.ts`，在 `sites` 数组中添加新条目：
```ts
{
  id: 'unique-id',
  name: '站点名称',
  description: '简短描述',
  url: 'https://example.com',
  logo: 'https://example.com/favicon.ico',
  category: 'ai', // 分类 ID
}
```
