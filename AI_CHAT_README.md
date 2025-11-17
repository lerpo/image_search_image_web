# AI智能助手页面

## 功能概述

基于你提供的Vue AI聊天页面，我已经成功创建了一个纯AI智能助手页面。该功能提供了两种AI服务：

1. **AI润色** - 用于文案润色，风格亲切热情
2. **短信改写** - 用于改写短信，防止被运营商拦截

## 主要特性

### 🎯 核心功能
- ✅ 双模式AI助手（润色/改写）
- ✅ 实时聊天界面
- ✅ 消息历史记录
- ✅ 打字动画效果
- ✅ 消息操作（复制、重新生成、编辑）

### 🎨 界面特性
- ✅ 侧滑式聊天窗口
- ✅ 响应式设计
- ✅ 现代化UI风格
- ✅ 流畅的动画效果

### 🔧 技术特性
- ✅ TypeScript支持
- ✅ 常量配置管理
- ✅ 错误处理机制
- ✅ 加载状态管理

## 文件结构

```
src/
├── components/
│   └── AiChat/
│       ├── index.tsx          # AI聊天主组件
│       └── index.less         # 样式文件
├── constants/
│   └── ai.ts                  # AI相关常量配置
└── pages/
    └── chat/
        └── index/
            ├── index.tsx      # AI聊天页面
            └── index.less     # 页面样式
```

## 使用方法

### 1. 访问AI助手页面
直接访问AI聊天页面，AI助手会自动打开。

### 2. 切换功能模式
- **AI润色**：用于文案润色，适合回访、群发等场景
- **短信改写**：用于改写短信，减少被运营商拦截

### 3. 发送消息
- 在输入框中输入内容
- 按 `Enter` 键发送（`Shift+Enter` 换行）
- 或点击发送按钮

### 4. 消息操作
- **复制**：复制AI回复内容
- **重新生成**：重新生成AI回复
- **重新编辑**：编辑用户消息

## API配置

### 基础配置
```typescript
// src/constants/ai.ts
export const AI_BASE_URL = 'http://127.0.0.1:2021/apis';
```

### API端点
- 获取历史消息：`/api/ai-agent/agent/get_history_messages`
- AI润色：`/api/ai-agent/agent/generate/refine`
- 短信改写：`/api/ai-agent/agent/generate/rewrite`

## 自定义配置

### 修改API地址
在 `src/constants/ai.ts` 中修改 `AI_BASE_URL` 常量：

```typescript
export const AI_BASE_URL = '你的API服务器地址';
```

### 修改默认模板
在 `src/constants/ai.ts` 中修改 `DEFAULT_INPUT_TEMPLATES`：

```typescript
export const DEFAULT_INPUT_TEMPLATES = {
  [CHAT_TYPES.AI_REFINE]: '你的润色模板',
  [CHAT_TYPES.SMS_REWRITE]: '你的改写模板',
} as const;
```

### 修改样式
在 `src/components/AiChat/index.less` 中自定义样式。

## 组件接口

### AiChat Props
```typescript
interface AiChatProps {
  visible: boolean;        // 是否显示聊天窗口
  onClose: () => void;    // 关闭回调
}
```

### 使用示例
```tsx
import AiChat from '@/components/AiChat';

function AiChatPage() {
  const [showAiChat, setShowAiChat] = useState(true);
  
  return (
    <div className="ai-chat-page">
      <AiChat 
        visible={showAiChat} 
        onClose={() => setShowAiChat(false)} 
      />
    </div>
  );
}
```

## 注意事项

1. **API服务**：确保AI服务正常运行在配置的地址
2. **跨域配置**：如果API在不同域名，需要配置CORS
3. **错误处理**：组件已包含完整的错误处理机制
4. **性能优化**：使用了防抖和节流优化用户体验

## 扩展功能

可以基于现有代码轻松扩展以下功能：
- 添加更多AI服务类型
- 实现消息搜索
- 添加文件上传功能
- 实现多语言支持
- 添加用户偏好设置

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **Less** - CSS预处理器
- **Fetch API** - HTTP请求

---

🎉 现在你有了一个纯AI智能助手页面，可以直接使用所有AI功能！
