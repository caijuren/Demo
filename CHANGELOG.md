# 更新记录

## [Unreleased]

### 新增
- 事件中心表格行按风险等级添加彩色左边条（红色/橙色/蓝色）
- 筛选栏全部筛选项改为标签+输入框横向左右排列布局
- 下拉菜单自定义 CaretDown 箭头图标，美化交互样式

### 优化
- 将所有 lucide-react 图标替换为 @phosphor-icons/react Duotone（双色）风格
- 重新设计筛选栏 UI：白底、统一高度 34px、hover 蓝色边框反馈
- 筛选栏间距调整，搜索框与下拉菜单平铺排列
- 优化 AiAnalysisModal 分析内容动态生成逻辑

### 依赖
- 新增 @phosphor-icons/react 图标库

### 修复
- 修复 incidentToAlertItem 函数缺少 detail 字段的类型错误
- 修复 Home.tsx 文件被意外截断的问题