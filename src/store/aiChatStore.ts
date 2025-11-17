import { makeAutoObservable, runInAction } from 'mobx';
import { getMobileChatTypeConfig, MobileChatTypeConfigItem, ApiResponse } from '@/api/aiChat';

// 用户信息接口
export interface Signature {
  user_key: string;
  user_id: string;
  organization_id: string;
  timestamp: number;
  nonce: string;
  signature: string;
}

// URL 参数中的 data 类型（根据实际情况可能需要调整）
export type UrlData = any;

class AiChatStore {
  // 用户信息

  // 签名
  signature: Signature | null = null;
  
  // URL 参数中的 data
  data: UrlData | null = null;

  // Token
  token: string | null = null;

  tokenInfo: any = null;

  // 代理列表
  agenList: any | null = null;

  // 移动端聊天类型配置
  mobileChatTypeConfig: MobileChatTypeConfigItem | null = null;

  constructor() {
    // 使用 makeAutoObservable 自动推断
    makeAutoObservable(this);
    
  }

  // 设置用户信息
  setSignature = (signature: Signature) => {
    this.signature = signature;
  }

  // 设置 data
  setData = (data: UrlData) => {
    this.data = data;
  }

  
  setAgenList = (agenList: any) => {
    this.agenList = agenList;
  }

  // 设置 token
  setToken = (tokenInfo: any) => {
    this.token = tokenInfo.access_token;
    // 同时存储到 sessionStorage，供 HTTP 请求使用
    // 如果 expiryTime 不存在，则计算并设置
    if (!tokenInfo.expiryTime && tokenInfo.expires_in) {
      const expiryTime = Date.now() + tokenInfo.expires_in * 1000;
      tokenInfo.expiryTime = expiryTime;
    }
    this.tokenInfo = tokenInfo;
    try {
      if (tokenInfo) {
        sessionStorage.setItem('AI_CHAT_TOKEN', JSON.stringify(tokenInfo));
      }
    } catch (error) {
      console.warn('存储 token 到 sessionStorage 失败:', error);
    }
  }

  getTokenInfo = () => {
    // 如果内存中有 tokenInfo，直接返回
    if (this.tokenInfo) {
      return this.tokenInfo;
    }
    
    // 如果内存中没有，尝试从 sessionStorage 缓存中读取
    try {
      const cachedTokenInfo = sessionStorage.getItem('AI_CHAT_TOKEN');
      if (cachedTokenInfo) {
        const tokenInfo = JSON.parse(cachedTokenInfo);
        // 检查 token 是否过期
        if (tokenInfo.expiryTime && tokenInfo.expiryTime > Date.now()) {
          // 如果未过期，恢复到内存中并返回
          this.tokenInfo = tokenInfo;
          this.token = tokenInfo.access_token;
          return tokenInfo;
        } else {
          // 如果已过期，清除缓存
          sessionStorage.removeItem('AI_CHAT_TOKEN');
        }
      }
    } catch (error) {
      console.warn('从 sessionStorage 读取 token 失败:', error);
    }
    
    return null;
  }

  // 设置移动端聊天类型配置
  setMobileChatTypeConfig = (config: MobileChatTypeConfigItem | null) => {
    this.mobileChatTypeConfig = config;
  }

  // 获取移动端聊天类型配置（如果已存在则直接返回，否则从接口获取）
  fetchMobileChatTypeConfig = async (agentId: string): Promise<MobileChatTypeConfigItem | null> => {
    // 否则从接口获取
    try {
      const response: ApiResponse<MobileChatTypeConfigItem> = await getMobileChatTypeConfig(agentId);
      if (response.code === 200 && response.data) {
        // 使用 runInAction 来批量更新 observable
        runInAction(() => {
          this.mobileChatTypeConfig = response.data;
        });
        return response.data;
      }
    } catch (error) {
      console.error('获取移动端聊天类型配置失败:', error);
    }
    return null;
  }

  // 清除所有数据
  clear = () => {
    this.signature = null;
    this.data = null;
    this.token = null;
    this.tokenInfo = null;
    this.agenList = null;
    this.mobileChatTypeConfig = null;
    // 清除 sessionStorage 中的 token
    try {
      sessionStorage.removeItem('AI_CHAT_TOKEN');
    } catch (error) {
      console.warn('清除 sessionStorage 中的 token 失败:', error);
    }
  }

  // 析构函数，清理资源
  destroy() {
    this.clear();
  }
}

// 导出单例
export default new AiChatStore();