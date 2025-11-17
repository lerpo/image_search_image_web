const DEFAULT_BASE_URL =  "/api";

export interface ReverseImageResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, string | number | boolean | undefined>;
  payload?: Record<string, any>;
}

const getWindowOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "";

const normalizeBaseUrl = (baseUrl: string) => {
  const trimmed = baseUrl?.trim() ?? "";
  if (!trimmed) {
    return getWindowOrigin();
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  if (trimmed.startsWith("/")) {
    const origin = getWindowOrigin();
    return origin ? `${origin}${trimmed}`.replace(/\/$/, "") : trimmed;
  }

  const origin = getWindowOrigin();
  return origin
    ? `${origin}/${trimmed.replace(/^\/+/, "")}`.replace(/\/$/, "")
    : trimmed.replace(/\/$/, "");
};

export const callReverseImageApi = async <T>(
  baseUrl: string,
  path: string,
  { query, payload, headers, method = "POST" }: RequestOptions = {}
): Promise<T> => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const fullPath = path.startsWith("http")
    ? path
    : `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
  const requestUrl = new URL(fullPath);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        requestUrl.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(requestUrl.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const rawText = await response.text();
  let json: ReverseImageResponse<T>;

  try {
    json = rawText ? (JSON.parse(rawText) as ReverseImageResponse<T>) : null;
  } catch {
    throw new Error(
      `接口返回非 JSON 数据：${rawText?.slice(0, 200) || "空响应"}`
    );
  }

  if (!json) {
    throw new Error("接口未返回内容，请检查服务端日志");
  }

  if (json.code !== 10000) {
    throw new Error(json.message || "接口请求失败");
  }

  return json.data;
};

export { DEFAULT_BASE_URL };

