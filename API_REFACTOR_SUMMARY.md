# AI Chat 网络请求重构总结

## 重构目标
将 `AiChat/index.tsx` 组件中的网络请求操作提取到 `src/api/aiChat.ts` 文件中，统一请求方式，提高代码的可维护性和复用性。

## 重构内容

### 1. API 函数提取
**从组件中提取的网络请求函数：**
- `loadChatHistory` → `getChatHistory`
- `generateAIResponse` → `generateAIResponse` (API层)

### 2. 统一请求方式
- **之前**: 使用原生 `fetch` API
- **现在**: 使用项目统一的 `get` 和 `post` 方法（来自 `@/utils/http`）

### 3. 类型定义优化
**新增类型接口：**
```typescript
// API 响应接口
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// 聊天消息接口
export interface ChatMessage {
  id: string;
  sender_type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}
```

### 4. API 函数设计
```typescript
// 获取聊天历史记录
export const getChatHistory = (type: string) => {
  return get<ApiResponse<ChatMessage[]>>(`${AI_API_ENDPOINTS.GET_HISTORY}?type=${type}`);
};

// 生成 AI 回复
export const generateAIResponse = (text: string, chatType: typeof CHAT_TYPES[keyof typeof CHAT_TYPES]) => {
  const config = CHAT_TYPE_CONFIG[chatType];
  return post<ApiResponse<{ text: string }>>(config.apiEndpoint, { text });
};
```

## 重构效果

### 代码结构优化
- **分离关注点**: 网络请求逻辑与UI逻辑分离
- **统一请求方式**: 所有API调用使用相同的HTTP工具
- **类型安全**: 完整的TypeScript类型定义

### 可维护性提升
- **集中管理**: 所有AI聊天相关的API集中在 `aiChat.ts`
- **易于测试**: API函数可以独立测试
- **易于复用**: 其他组件可以直接使用这些API函数

### 错误处理统一
- 使用项目统一的HTTP工具，自动处理常见的网络错误
- 统一的响应格式处理

## 文件变更

### `src/api/aiChat.ts`
- 新增 AI 聊天相关的 API 函数
- 新增类型定义
- 统一使用项目的 HTTP 工具

### `src/components/AiChat/index.tsx`
- 移除原生 `fetch` 调用
- 导入并使用新的 API 函数
- 简化网络请求逻辑
- 保持原有的业务逻辑不变

## 使用示例

### 在其他组件中使用
```typescript
import { getChatHistory, generateAIResponse } from '@/api/aiChat';

// 获取聊天历史
const history = await getChatHistory('ai-refine');

// 生成AI回复
const response = await generateAIResponse('你好', CHAT_TYPES.AI_REFINE);
```

## 优势总结

1. **代码复用**: API函数可以在多个组件中复用
2. **统一管理**: 所有网络请求集中管理，便于维护
3. **类型安全**: 完整的TypeScript支持
4. **错误处理**: 统一的错误处理机制
5. **易于测试**: API层可以独立进行单元测试
6. **扩展性**: 新增API功能更加简单

重构完成后，代码结构更加清晰，维护成本降低，同时保持了所有原有功能的完整性。
