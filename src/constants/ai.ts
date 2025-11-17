// AI助手相关常量配置

// AI服务基础URL
export const AI_BASE_URL = 'http://127.0.0.1:2021/apis';
// export const AGENT_BASE_URL = 'https://imp.ezrpro.com/apis'
export const AGENT_BASE_URL = 'http://127.0.0.1:3001'

// AI API端点
export const AI_API_ENDPOINTS = {
  GET_Sigin: '/api/crm/shopmanage/EAI/Agent/GetSignature',
  // 获取历史消息
  GET_HISTORY: '/api/omcr/productbasic/MiniShop/GetChildCategories',
  // 获取今日分析分享次数
  GET_ANALYSIS_SHARE_COUNT: '/api/ai-agent/agent/analysis/share-count',
  // 获取PC端聊天类型配置
  GET_CHAT_TYPE_CONFIG: '/api/ai-agent/agent/chat-type-config',
  // 获取Token
  GET_TOKEN: '/api/v1/auth/temp-token',
  // 更新Token
  UPDATE_TOKEN: 'api/v1/auth/refresh',
  // AI润色
  REFINE: '/api/ai-agent/agent/generate/refine',
  // 短信改写
  REWRITE: '/api/ai-agent/agent/generate/rewrite',
  // 经营分析
  ANALYSIS: '/api/ai-agent/agent/generate/analysis',
} as const;


// 消息发送者类型
export const SENDER_TYPES = {
  USER: 'user',
  AI: 'ai',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络异常，请检查网络连接',
  AI_SERVICE_UNAVAILABLE: 'AI服务暂时不可用，请稍后重试',
  LOAD_HISTORY_FAILED: '加载历史记录失败',
  GENERATE_FAILED: '生成失败，请重试',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  COPY_SUCCESS: '复制成功！',
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  TYPING_DOT_DELAY: {
    FIRST: -0.32,
    SECOND: -0.16,
    THIRD: 0,
  },
  MIN_LOADING_TIME: 1000, // 最小加载时间(ms)
  SCROLL_DELAY: 100, // 滚动延迟(ms)
} as const;
