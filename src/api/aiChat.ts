import { get, post } from "@/utils/http";
import pcHttp from "@/utils/pcHttp/Http";
import { AI_BASE_URL, AI_API_ENDPOINTS, AGENT_BASE_URL } from "@/constants/ai";
import aiChatStore from "@/store/aiChatStore";

// ==================== 类型定义 ====================

// 聊天消息接口
export interface ChatMessage {
  id: string;
  sender_type: "user" | "ai";
  content: string;
  timestamp: string | Date;
  chatType: string;
  title?: string;
  sessionTitle?: string;
  isLoading?: boolean;
}

export interface MobileChatMessage {
  id: number;
  sender_type: "user" | "ai";
  icon: string;
  content: string;
  timestamp: string | Date;
  chatType: string;
  title?: string;
  sessionTitle?: string;
  isLoading?: boolean;
}

// 移动端聊天类型配置项
export interface MobileChatTypeConfigItem {
  AgentId: string;
  Name: string;
  Icon: string;
  placeholder: string;
  apiEndpoint: string;
  defaultTemplate: string;
  emptyTitle: string;
  loadingText: string;
}

// PC端聊天类型配置项
export interface ChatTypeConfigItem {
  AgentId: string;
  Name: string;
  Icon: string;
  placeholder: string;
  apiEndpoint: string;
  defaultTemplate: string;
  emptyTitle: string;
  loadingText: string;
  tCorlor: string; // PC端特有字段
  textIndent: number; // PC端特有字段
  canChatEdit: boolean; // PC端特有字段
}

// PC端聊天类型配置（数组格式）
export type ChatTypeConfig = ChatTypeConfigItem[];

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// 功能开关配置
// export interface AiFeatureConfig {
//   showBusinessAnalysis: boolean; // 是否显示"分析整体经营"入口
// }

// 获取Token参数
export interface GetTokenParams {
  UserKey?: string;
  UserId?: string | number;
  OrganizationId?: string | number;
  TimeStamp?: number;
  Nonce?: string;
  Signature?: string;
}

// 获取Token响应
export interface GetTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

// ==================== 认证相关 ====================

// 获取Token
export const getToken = async (
  params: GetTokenParams
): Promise<ApiResponse<GetTokenResponse>> => {
  try {
    // 检查是否存在有效的 token（会先从内存检查，如果没有则从 sessionStorage 读取）
    const tokenInfo = aiChatStore.getTokenInfo();
    if (tokenInfo) {
      const { expiryTime, access_token} = tokenInfo;
      
      // 如果 token 未过期，直接返回缓存的 token
      if (expiryTime && expiryTime > Date.now() && access_token) {
        return {
          code: 200,
          data: {
            ...tokenInfo,
          },
          message: "success",
        };
      }
    }

    // 如果 token 不存在或已过期，调用接口获取新的 token
    const response = await post<ApiResponse<GetTokenResponse>>(
      `${AGENT_BASE_URL}${AI_API_ENDPOINTS.GET_TOKEN}`,
      {
        user_key: params.UserKey,
        user_id: params.UserId,
        organization_id: params.OrganizationId,
        timestamp: params.TimeStamp,
        nonce: params.Nonce,
        signature: params.Signature,
      }
    );
    
    // 如果获取成功，保存 token 到 store
    if (response.data?.access_token) {
      aiChatStore.setToken(response.data);
    }
    
    return response;
  } catch (error) {
    console.error("获取Token失败:", error);
    throw error;
  }
};

export const updateToken = async (
  params: any
): Promise<ApiResponse<GetTokenResponse>> => {
  try {
    const response = await post<ApiResponse<GetTokenResponse>>(
      `${AGENT_BASE_URL}${AI_API_ENDPOINTS.UPDATE_TOKEN}`,
      params
    );
    return response;
  } catch (error) {
    console.error("获取Token失败:", error);
    throw error;
  }
};

export const getSignature = (params: any) => {
  pcHttp.post(`${AI_BASE_URL}${AI_API_ENDPOINTS.GET_Sigin}`);
  return {
    SignatureInfo: "12345qweqwqqwq121212",
    AgentList: [
      {
        AgentId: "ai-refine",
        Name: "AI润色",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_sms_airewrite.png",
      },
      {
        AgentId: "sms-rewrite",
        Name: "短信改写",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_sms_rewrite.png",
      },
      {
        AgentId: "business-analysis",
        Name: "分析整体经营",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icom_analiyse_%20all_operate.png",
      },
    ],
  };

  // 返回混合类型的 markdown 假数据
};

// ==================== 配置相关 ====================

// localStorage 存储 key
const MOBILE_CHAT_TYPE_CONFIG_KEY = "MOBILE_CHAT_TYPE_CONFIG";

// 获取移动端聊天类型配置
export const getMobileChatTypeConfig = (agentCode) => {
  return new Promise<ApiResponse<MobileChatTypeConfigItem>>((resolve) => {
    // 先从 localStorage 读取配置
    try {
      const cachedConfig = localStorage.getItem(MOBILE_CHAT_TYPE_CONFIG_KEY);
      if (cachedConfig) {
        const parsedConfig = JSON.parse(cachedConfig);
        // 验证配置格式是否正确（数组格式）
        if (Array.isArray(parsedConfig) && parsedConfig.length > 0) {
          resolve({
            code: 200,
            data: parsedConfig.filter((item) => item.AgentId === agentCode)[0],
            message: "success",
          });
          return;
        }
      }
    } catch (error) {
      console.error("读取 localStorage 配置失败:", error);
    }

    // 如果 localStorage 没有配置，则调用接口获取
    // 实际调用示例：
    // return pcHttp.post<ApiResponse<MobileChatTypeConfig>>(`${AI_BASE_URL}/api/ai-agent/agent/mobile-chat-type-config`, {});
    // 返回 mock 数据
    const mockConfig: any = [
      {
        AgentId: "cae1966486bc44d18dfdc15cf646ed61",
        Name: "员工绩效分析及能力提升",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icom_analiyse_%20all_operate.png",
        placeholder: "请输入需要分析的经营数据...",
        apiEndpoint: AI_API_ENDPOINTS.ANALYSIS,
        defaultTemplate: "请帮我生成最近30天销售和会员经营情况，提供运营策略 （暂不支持编辑）",
        emptyTitle: "点击下方发送按钮，获取整体经营分析",
        loadingText: "AI深度思考中，请耐心等待…",
      },
      {
        AgentId: "7823ff2c6b6a44c2aea7cde937dedee3",
        Name: "昨日工作总结及今日建议",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_sms_airewrite.png",
        placeholder: "请输入需要分析的经营数据...",
        apiEndpoint: AI_API_ENDPOINTS.ANALYSIS,
        defaultTemplate: "请帮我生成最近30天销售和会员经营情况，提供运营策略 （暂不支持编辑）",
        emptyTitle: "点击下方发送按钮，获取整体经营分析",
        loadingText: "AI深度思考中，请耐心等待…",
      },
      {
        AgentId: "c50790a4a0ec4a5dacca6e667c48e38e",
        Name: "本周工作总结",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_week_summary.png",
        placeholder: "请输入需要分析的经营数据...",
        apiEndpoint: AI_API_ENDPOINTS.ANALYSIS,
        defaultTemplate: "请帮我生成最近30天销售和会员经营情况，提供运营策略 （暂不支持编辑）",
        emptyTitle: "点击下方发送按钮，获取整体经营分析",
        loadingText: "AI深度思考中，请耐心等待…",
      }
    ];

    // 模拟API延迟
    setTimeout(() => {
      // 将配置保存到 localStorage
      try {
        localStorage.setItem(
          MOBILE_CHAT_TYPE_CONFIG_KEY,
          JSON.stringify(mockConfig)
        );
      } catch (error) {
        console.error("保存配置到 localStorage 失败:", error);
      }

      resolve({ code: 200, data: mockConfig, message: "success" });
    }, 500);
  });
};

// 获取PC端聊天类型配置
export const getChatTypeConfig = async (
  agentId: string
): Promise<ApiResponse<ChatTypeConfigItem>> => {
  try {
    const response = await post<ApiResponse<ChatTypeConfigItem>>(
      `${AI_BASE_URL}${AI_API_ENDPOINTS.GET_CHAT_TYPE_CONFIG}`,
      {}
    );
    return response;
  } catch (error) {
    console.error("获取PC端聊天类型配置失败:", error);
    // 返回示例数据作为 fallback
    const exampleData: ChatTypeConfig = [
      {
        AgentId: "ai-refine",
        Name: "AI润色",
        placeholder: "请输入需要润色的文案...",
        apiEndpoint: AI_API_ENDPOINTS.REFINE,
        defaultTemplate:
          "润色以下文案，文案风格：亲切热情，字数限定：100，需润色文案：{请填写需润色文案}",
        emptyTitle: "发送回访、群发等文案，我来帮你润色",
        loadingText: "AI文案润色中，请耐心等待…",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_sms_airewrite.png",
        tCorlor: "#8BC34A",
        textIndent: 50,
        canChatEdit: true,
      },
      {
        AgentId:  "sms-rewrite",
        Name: "短信改写",
        placeholder: "请输入需要改写的短信...",
        apiEndpoint: AI_API_ENDPOINTS.REWRITE,
        defaultTemplate:
          "改写以下短信，防止进入垃圾箱和被运营商拦截，短信字数限定：50，需改写短信：{填写短信内容}",
        emptyTitle: "我来帮你改写短信，减少被运营商拦截概率",
        loadingText: "短信改写中，请耐心等待…",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icon_sms_rewrite.png",
        tCorlor: "#FF9601",
        textIndent: 60,
        canChatEdit: true,
      },
      {
        AgentId: "business-analysis",
        Name: "分析整体经营",
        placeholder: "请输入需要分析的经营数据...",
        apiEndpoint: AI_API_ENDPOINTS.ANALYSIS,
        defaultTemplate:
          "请帮我生成最近30天销售和会员经营情况，提供运营策略 （暂不支持编辑）",
        emptyTitle: "点击下方发送按钮，获取整体经营分析",
        loadingText: "AI深度思考中，请耐心等待…",
        Icon: "https://assets-img.ezrpro.com/pc/img/basic/icom_analiyse_%20all_operate.png",
        tCorlor: "#1282FF",
        textIndent: 90,
        canChatEdit: false,
      },
    ];
    return {
      code: 200,
      data: exampleData.filter((item) => item.AgentId === agentId)[0],
      message: "使用示例数据",
    };
  }
};

// ==================== 历史记录相关（PC端） ====================

// 获取聊天历史记录
export const getChatHistory = (
  page: number = 1,
  pageSize: number = 10,
  chatTypeConfig?: ChatTypeConfig
) => {
  // return get<ApiResponse<ChatMessage[]>>(`${AI_API_ENDPOINTS.GET_HISTORY}?type=${type}`);
  // 生成mock数据
  const generateMockData = (pageNum: number, size: number) => {
    const mockData: ChatMessage[] = [];
    const startIndex = (pageNum - 1) * size;

    // 从配置中获取所有类型，如果没有配置则使用默认类型
    const allTypes = chatTypeConfig
      ? chatTypeConfig.map((item) => item.AgentId)
      : ["ai-refine", "sms-rewrite", "business-analysis"];

    for (let i = 0; i < size; i++) {
      const index = startIndex + i;
      const chatType = allTypes[index % allTypes.length];
      const config = chatTypeConfig?.find((item) => item.AgentId === chatType);
      const typeLabel = config?.Name || "未知类型";

      const now = new Date();
      const timestamp = new Date(
        now.getTime() - index * 2 * 60 * 60 * 1000
      ).toISOString();

      const contents = [
        `这是${typeLabel}的第${
          index + 1
        }条历史记录，包含了详细的对话内容和分析结果。`,
        `用户咨询了关于${typeLabel}的相关问题，AI助手提供了专业的建议和解决方案。`,
        `在${typeLabel}对话中，用户表达了具体的需求，AI助手根据上下文给出了合适的回复。`,
        `这是一段关于${typeLabel}的深度对话，涉及了多个方面的讨论和分析。`,
        `用户通过${typeLabel}功能获得了有价值的信息和建议，对话过程非常顺利。`,
      ];

      mockData.push({
        id: `${chatType}-${index + 1}`,
        sender_type: "user",
        content: contents[index % contents.length],
        timestamp: timestamp,
        chatType,
        title: typeLabel,
        sessionTitle: `${typeLabel}对话`,
      });
    }

    return mockData;
  };

  // 模拟API延迟
  return new Promise<ApiResponse<ChatMessage[]>>((resolve) => {
    setTimeout(() => {
      const mockData = generateMockData(page, pageSize);
      resolve({
        code: 200,
        data: mockData,
        message: "success",
      });
    }, 500);
  });
};

// 根据ID获取聊天历史记录
export const getChatHistoryById = (
  type: string,
  chatTypeConfig?: ChatTypeConfig,
  chatId?: number
) => {
  // return get<ApiResponse<ChatMessage[]>>(`${AI_API_ENDPOINTS.GET_HISTORY}?type=${type}`);
  //  return pcHttp.post(`${AI_BASE_URL}${AI_API_ENDPOINTS.GET_HISTORY}`,{ParentCategoryId: 0})
  // 返回混合类型的 markdown 假数据
  const now = Date.now();
  const mk = (s: number) => new Date(now - s * 1000).toISOString();

  // 从配置中获取标签，如果没有配置则使用默认值
  const findConfigByType = (chatType: string) =>
    chatTypeConfig?.find((item) => item.AgentId === chatType);
  const getLabel = (chatType: string, defaultLabel: string) =>
    findConfigByType(chatType)?.Name || defaultLabel;

  const items: ChatMessage[] = [
    {
      id: "mk-1",
      sender_type: "user",
      chatType: "ai-refine",
      title: getLabel("ai-refine", "AI润色"),
      sessionTitle: `${getLabel("ai-refine", "AI润色")}对话`,
      timestamp: mk(10),
      // 用户消息：纯文本
      content:
        "请输出一份营销方案概览，目标是提升10%转化率，说明目标受众、主要渠道和预算，并给出关键指标。",
    },
    {
      id: "mk-2",
      sender_type: "ai",
      chatType: "sms-rewrite",
      title: getLabel("sms-rewrite", "短信改写"),
      sessionTitle: `${getLabel("sms-rewrite", "短信改写")}对话`,
      timestamp: mk(8),
      // AI 消息：Markdown
      content:
        "请将以下短信改写为更易通过审核的版本：\n\n```text\n亲爱的用户，您已获得限时优惠，点击链接立即领取：https://example.com\n```\n\n> 要求：避免敏感词，控制在50字以内。",
    },
    {
      id: "mk-3",
      sender_type: "user",
      chatType: "business-analysis",
      title: getLabel("business-analysis", "分析整体经营"),
      sessionTitle: `${getLabel("business-analysis", "分析整体经营")}对话`,
      timestamp: mk(6),
      // 用户消息：纯文本
      content:
        "请对不同渠道的曝光、点击率和成本进行对比，并给出结论与优先投放建议。",
    },
    {
      id: "mk-4",
      sender_type: "ai",
      chatType: "ai-refine",
      title: getLabel("ai-refine", "AI润色"),
      sessionTitle: `${getLabel("ai-refine", "AI润色")}对话`,
      timestamp: mk(4),
      // AI 消息：Markdown
      content:
        "### 文案润色建议\n\n- 保持语气亲切\n- 明确行动指令\n- 减少形容词，强调利益点\n\n示例：\n\n> 现在下单立减20元，库存有限，抓紧哦！",
    },
    {
      id: "mk-5",
      sender_type: "user",
      chatType: "sms-rewrite",
      title: getLabel("sms-rewrite", "短信改写"),
      sessionTitle: `${getLabel("sms-rewrite", "短信改写")}对话`,
      timestamp: mk(2),
      // 用户消息：纯文本
      content: "根据我发的图片生成一段不超过50字的推文文案。",
    },
  ];

  return new Promise<ApiResponse<ChatMessage[]>>((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data: items, message: "success" });
    }, 300);
  });
};

// ==================== 历史记录相关（移动端） ====================

export const getMobileChatHistory = (
  page: number = 1,
  pageSize: number = 10
) => {
  // return get<ApiResponse<ChatMessage[]>>(`${AI_API_ENDPOINTS.GET_HISTORY}?type=${type}`);
  // 生成mock数据
  const generateMockData = (pageNum: number, size: number) => {
    const mockData: MobileChatMessage[] = [];
    const startIndex = (pageNum - 1) * size;

    // 从配置中获取所有类型

    for (let i = 0; i < size; i++) {
      const index = startIndex + i;
      const chatType = aiChatStore.mobileChatTypeConfig?.AgentId;
      const config = aiChatStore.mobileChatTypeConfig;
      const typeLabel = config?.Name || "未知类型";

      const now = new Date();
      const timestamp = new Date(
        now.getTime() - index * 2 * 60 * 60 * 1000
      ).toISOString();

      const contents = [
        `这是${typeLabel}的第${
          index + 1
        }条历史记录，包含了详细的对话内容和分析结果。`,
        `用户咨询了关于${typeLabel}的相关问题，AI助手提供了专业的建议和解决方案。`,
        `在${typeLabel}对话中，用户表达了具体的需求，AI助手根据上下文给出了合适的回复。`,
        `这是一段关于${typeLabel}的深度对话，涉及了多个方面的讨论和分析。`,
        `用户通过${typeLabel}功能获得了有价值的信息和建议，对话过程非常顺利。`,
      ];

      mockData.push({
        id: Math.floor(Math.random() * 100000),
        sender_type: "user",
        content: contents[index % contents.length],
        timestamp: timestamp,
        chatType,
        title: typeLabel,
        icon: config.Icon,
        label: config.Name,
        sessionTitle: `${typeLabel}对话`,
      });
    }

    return mockData;
  };

  // 模拟API延迟
  return new Promise<ApiResponse<MobileChatMessage[]>>((resolve) => {
    setTimeout(() => {
      const mockData = generateMockData(page, pageSize);
      resolve({
        code: 200,
        data: mockData,
        message: "success",
      });
    }, 500);
  });
};

// 根据ID获取移动端聊天历史记录
export const getMobileChatById = (
  type: string,
  chatTypeConfig?: ChatTypeConfig
) => {
  // return get<ApiResponse<ChatMessage[]>>(`${AI_API_ENDPOINTS.GET_HISTORY}?type=${type}`);
  // 返回混合类型的结构化数据示例
  const now = Date.now();
  const mk = (s: number) => new Date(now - s * 1000).toISOString();

  // 从配置中获取标签，如果没有配置则使用默认值
  const findConfigByType = (chatType: string) =>
    chatTypeConfig?.find((item) => item.AgentId === chatType);
  const getLabel = (chatType: string, defaultLabel: string) =>
    findConfigByType(chatType)?.Name || defaultLabel;

  // 结构化数据示例：包含 text、table、card 三种类型
  const structuredDataExample = JSON.stringify([
    {
      type: "text",
      value:
        "你是一位零售人力资源专家，擅长分析门店人员配置和绩效数据。请基于以下数据，提供优化建议。",
    },
    {
      type: "table",
      value: {
        title: "核心业绩概览",
        subTitle: "",
        icon: "https://assets-img.ezrpro.com/app/icon/icon/hexin_yewu_gailan_icon.png",
        tableInfo: [
          { 指标: "新增客户", "1月": "120", "2月": "150", "3月": "180" },
          { 指标: "销售额","1月": "¥12,500","2月": "¥15,800","3月": "¥18,200"},
          { 指标: "转化率", "1月": "12.5%", "2月": "15.2%", "3月": "18.0%" },
          { 指标: "平均客单价", "1月": "¥104", "2月": "¥105", "3月": "¥101" },
        ],
      },
    },
    {
      type: "card",
      value: {
        title: "门店活动",
        subTitle: "分享活动获得更多新客和销售业绩",
        icon: "https://assets-img.ezrpro.com/app/icon/icon/mendian_activity_icon.png",
        list: [
          {
            title: "互动大转盘游戏",
            content:
              "通过互动游戏吸引新客户参与，提升用户粘性和复购率。适合周末和节假日推广。",
            taskName: "分享朋友圈",
            taskIcon:
              "https://assets-img.ezrpro.com/app/icon/icon/share_friends_icon.png",
            type: "share",
          },
          {
            title: "新客专享优惠券",
            content:
              "为新注册用户提供专属优惠券，刺激首次购买转化。建议设置合理的使用门槛。",
            taskName: "分享朋友圈",
            taskIcon:
              "https://assets-img.ezrpro.com/app/icon/icon/share_friends_icon.png",
            type: "share",
          },
          {
            title: "会员积分翻倍",
            content:
              "会员日活动期间，积分获取翻倍，鼓励会员消费并分享给好友，扩大传播范围。",
            taskName: "做任务",
            type: "task",
          },
        ],
      },
    },
  ]);

  const items: ChatMessage[] = [
    {
      id: "mk-1",
      sender_type: "user",
      chatType: "ai-refine",
      title: getLabel("ai-refine", "AI润色"),
      sessionTitle: `${getLabel("ai-refine", "AI润色")}对话`,
      timestamp: mk(10),
      // 用户消息：纯文本
      content:
        "请输出一份营销方案概览，目标是提升10%转化率，说明目标受众、主要渠道和预算，并给出关键指标。",
    },
    {
      id: "mk-2",
      sender_type: "ai",
      chatType: "sms-rewrite",
      title: getLabel("sms-rewrite", "短信改写"),
      sessionTitle: `${getLabel("sms-rewrite", "短信改写")}对话`,
      timestamp: mk(8),
      // AI 消息：结构化数据（包含 text、table、card）
      content: structuredDataExample,
    },
    {
      id: "mk-3",
      sender_type: "user",
      chatType: "business-analysis",
      title: getLabel("business-analysis", "分析整体经营"),
      sessionTitle: `${getLabel("business-analysis", "分析整体经营")}对话`,
      timestamp: mk(6),
      // 用户消息：纯文本
      content:
        "请对不同渠道的曝光、点击率和成本进行对比，并给出结论与优先投放建议。",
    },
    {
      id: "mk-4",
      sender_type: "ai",
      chatType: "ai-refine",
      title: getLabel("ai-refine", "AI润色"),
      sessionTitle: `${getLabel("ai-refine", "AI润色")}对话`,
      timestamp: mk(4),
      // AI 消息：Markdown（普通文本消息，非结构化数据）
      content:
        "### 文案润色建议\n\n- 保持语气亲切\n- 明确行动指令\n- 减少形容词，强调利益点\n\n示例：\n\n> 现在下单立减20元，库存有限，抓紧哦！",
    },
    {
      id: "mk-5",
      sender_type: "user",
      chatType: "sms-rewrite",
      title: getLabel("sms-rewrite", "短信改写"),
      sessionTitle: `${getLabel("sms-rewrite", "短信改写")}对话`,
      timestamp: mk(2),
      // 用户消息：纯文本
      content: "根据我发的图片生成一段不超过50字的推文文案。",
    },
  ];

  return new Promise<ApiResponse<ChatMessage[]>>((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data: items, message: "success" });
    }, 300);
  });
};

// ==================== AI生成相关 ====================

// 生成 AI 回复
export const generateAIResponse = (
  text: string,
  chatType: string,
  chatTypeConfig?: ChatTypeConfig
) => {
  const config = chatTypeConfig?.find((item) => item.AgentId === chatType);
  if (!config) {
    // 如果没有找到配置，使用默认端点（向后兼容）
    return post<ApiResponse<{ text: string }>>(
      `${AI_BASE_URL}/api/ai-agent/agent/generate/refine`,
      { text }
    );
  }
  return post<ApiResponse<{ text: string }>>(config.apiEndpoint, { text });
};

// 获取今日经营分析分享次数（已用次数）
export const getAnalysisShareCount = () => {
  // 实际调用示例：
  // return pcHttp.post(`${AI_BASE_URL}${AI_API_ENDPOINTS.GET_ANALYSIS_SHARE_COUNT}`, {});
  // 这里返回 mock 数据，字段 sharedToday 表示今日已分享/使用次数
  return new Promise<ApiResponse<{ sharedToday: number }>>((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data: { sharedToday: 1 }, message: "success" });
    }, 300);
  });
};
