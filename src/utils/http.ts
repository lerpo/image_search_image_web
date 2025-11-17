import { AxiosRequestConfig } from "axios";
import axiosInstance from "./request";
import aiChatStore from "@/store/aiChatStore";
import { getToken, updateToken } from "@/api/aiChat";

// 确保有 token，如果没有则获取
const ensureToken = async (): Promise<string | null> => {
  // 先检查 store 中是否有 tokenInfo，如果有则尝试获取 token
  if (aiChatStore.tokenInfo !== null) {
    if (aiChatStore.tokenInfo.expiryTime < Date.now()) {
      const { data } = await updateToken({ refresh_token: aiChatStore.tokenInfo.refresh_token });
      if (data?.access_token) {
        aiChatStore.setToken(data);
        return data.access_token;
      }
    } else {
      return aiChatStore.tokenInfo.access_token;
    }
  } else {
    try {
      const signature = (aiChatStore as any).signature;
      if (!signature) {
        throw new Error("获取 token 失败：signature 不存在");
      }

      const { data } = await getToken(signature);
      if (data?.access_token) {
        aiChatStore.setToken(data);
        return data.access_token;
      } else {
        throw new Error("获取 token 失败：返回数据中没有 access_token");
      }
    } catch (error) {}
  }
};

// 构建请求头，包含 token 和用户信息
const buildHeaders = async (
  existingHeaders?: Record<string, any>,
  url?: string
): Promise<Record<string, any>> => {
  const noTokenWhitelist = ["/api/v1/auth/temp-token"];
  const headers: Record<string, any> = {
    ...(existingHeaders || {}),
  };
  // headers["Content-Type"] = "application/json";
  // 添加 token（特定接口无需 token）
  const skipToken =
    url && noTokenWhitelist.some((path) => url.includes(path));
  if (!skipToken) {
    const token = await ensureToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

async function get<T>(url: string, params?: object): Promise<T> {
  // 构建请求头（包含 token 和用户信息）
  const headers = await buildHeaders(undefined, url);

  return axiosInstance.get(url, { params, headers });
}

const post = async <T>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  // 构建请求头（包含 token 和用户信息）
  const headers = await buildHeaders(
    config?.headers as Record<string, any>,
    url
  );

  return axiosInstance.post(url, data, { ...config, headers });
};

export { get, post };
