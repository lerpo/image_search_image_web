# AI Chat 组件重构总结

## 重构目标
将 `CHAT_TYPES.AI_REFINE` 和 `SMS_REWRITE` 两种类型的重复逻辑合并，提高代码可维护性和可扩展性。

## 重构内容

### 1. 统一配置系统
- **新增**: `CHAT_TYPE_CONFIG` 统一配置对象
- **移除**: `DEFAULT_INPUT_TEMPLATES` 和 `TAB_CONFIG` 重复配置
- **优势**: 所有聊天类型的配置集中管理，便于维护

### 2. 状态管理优化
- **合并**: `refineInput` 和 `rewriteInput` → `inputValue`
- **合并**: `refineTextareaRef` 和 `rewriteTextareaRef` → `textareaRef`
- **优势**: 减少状态数量，简化状态管理

### 3. 函数逻辑统一
- **合并**: `submitRefineMessage` 和 `submitRewriteMessage` → `submitMessage`
- **重构**: `generateAIRefinement` → `generateAIResponse`
- **简化**: `handleKeyDown` 函数参数
- **优势**: 消除重复代码，提高代码复用性

### 4. UI组件优化
- **统一**: 输入区域组件，根据当前类型动态渲染
- **动态**: 标签页渲染，支持任意数量的聊天类型
- **优势**: 减少UI重复，提高组件灵活性

## 扩展新类型的方法

要添加新的聊天类型（如邮件改写），只需：

### 1. 在 `CHAT_TYPES` 中添加新类型
```typescript
export const CHAT_TYPES = {
  AI_REFINE: 'ai-refine',
  SMS_REWRITE: 'sms-rewrite',
  EMAIL_REWRITE: 'email-rewrite', // 新增
} as const;
```

### 2. 在 `CHAT_TYPE_CONFIG` 中添加配置
```typescript
[CHAT_TYPES.EMAIL_REWRITE]: {
  label: '邮件改写',
  title: '改写邮件内容，提高送达率',
  placeholder: '请输入需要改写的邮件...',
  apiEndpoint: '/api/ai-agent/agent/generate/email-rewrite',
  defaultTemplate: '改写以下邮件，提高送达率，邮件字数限定：200，需改写邮件：{填写邮件内容}',
  apiType: 'email-rewrite' as const,
},
```

### 3. 完成！
- 无需修改组件逻辑
- 无需添加新的状态管理
- 无需创建新的UI组件
- 标签页和输入区域会自动适配

## 重构效果

### 代码减少
- **状态变量**: 从 4 个减少到 2 个
- **函数**: 从 6 个减少到 4 个
- **UI组件**: 从 2 个重复组件合并为 1 个

### 可维护性提升
- 配置集中管理
- 逻辑统一处理
- 类型安全保证

### 可扩展性增强
- 添加新类型只需配置，无需修改组件代码
- 支持任意数量的聊天类型
- 易于测试和维护

## 文件变更
- `src/constants/ai.ts`: 新增统一配置系统
- `src/components/AiChat/index.tsx`: 重构组件逻辑和UI
