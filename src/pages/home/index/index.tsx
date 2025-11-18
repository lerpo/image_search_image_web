import { useState } from "react";
import { observer } from "mobx-react";
import { Form, Input, Space, Tabs, Tag, Typography, Upload, message } from "antd";
import type { FormInstance } from "antd";
import type { UploadProps } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { DEFAULT_BASE_URL } from "@/api/reverseImage";
import { DatasetTab } from "./components/DatasetTab";
import { RecordsTab } from "./components/RecordsTab";
import { SearchTab, SearchResultItem } from "./components/SearchTab";
import "./index.less";

const { Title, Paragraph, Text } = Typography;

type UploadFormKey = "add" | "update" | "search";

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const stripImageDataUrl = (value: string) =>
  value.replace(/^data:image\/[\w.+-]+;base64,/, "");

const AiChatPage = () => {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [previewMap, setPreviewMap] = useState<
    Record<UploadFormKey, string | undefined>
  >({
    add: undefined,
    update: undefined,
    search: undefined,
  });

  const setLoading = (key: string, value: boolean) =>
    setLoadingMap((prev) => ({ ...prev, [key]: value }));

  const trackResponse = (key: string, data: any) =>
    setResponses((prev) => ({ ...prev, [key]: data }));

  const cleanPayload = (payload: Record<string, any>) =>
    Object.entries(payload).reduce<Record<string, any>>((acc, [k, v]) => {
      if (
        v !== undefined &&
        v !== null &&
        !(typeof v === "string" && v.trim() === "")
      ) {
        if (k === "image" && typeof v === "string") {
          const trimmed = v.trim();
          acc[k] = stripImageDataUrl(trimmed);
        } else {
          acc[k] = typeof v === "string" ? v.trim() : v;
        }
      }
      return acc;
    }, {});

  const getUploadProps = (
    formKey: UploadFormKey,
    formInstance?: FormInstance
  ): UploadProps => ({
    accept: "image/*",
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const base64 = await fileToBase64(file);
        formInstance?.setFieldsValue?.({ image: base64 });
        setPreviewMap((prev) => ({ ...prev, [formKey]: base64 }));
        message.success("图片已转换为 base64");
      } catch (error) {
        message.error("图片转换失败，请重试");
      }
      return false;
    },
  });

  const handleRequest = async <T,>(
    key: string,
    request: () => Promise<T>,
    onSuccess?: (data: T) => void
  ) => {
    try {
      setLoading(key, true);
      const data = await request();
      message.success("操作成功");
      trackResponse(key, data);
      onSuccess?.(data);
    } catch (error: any) {
      message.error(error?.message || "请求失败");
    } finally {
      setLoading(key, false);
    }
  };

  return (
    <div className="reverse-image-page">
      <section className="hero-section">
        <div>
          <Tag color="processing">Reverse Image Search</Tag>
          <Title level={2}>以图搜图 · 一站式调试台</Title>
          <Paragraph>
            快速调试 Milvus + MySQL 反向图片检索接口，集成建表、数据管理、检索与统计能力。
          </Paragraph>
          <Space wrap>
            <Text strong>服务地址：</Text>
            <Input
              className="hero-input"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="例如：http://localhost:5000"
              suffix={
                <ReloadOutlined
                  className="reload-icon"
                  onClick={() => setBaseUrl(DEFAULT_BASE_URL)}
                />
              }
            />
          </Space>
        </div>
      </section>

      <Tabs
        className="reverse-tabs"
        items={[
          {
            key: "dataset",
            label: "表与集合",
            children: (
              <DatasetTab
                baseUrl={baseUrl}
                loadingMap={loadingMap}
                responses={responses}
                onRequest={handleRequest}
              />
            ),
          },
          {
            key: "records",
            label: "图片管理",
            children: (
              <RecordsTab
                baseUrl={baseUrl}
                loadingMap={loadingMap}
                responses={responses}
                previewMap={previewMap}
                onRequest={handleRequest}
                getUploadProps={getUploadProps}
                cleanPayload={cleanPayload}
              />
            ),
          },
          {
            key: "search",
            label: "以图搜图",
            children: (
              <SearchTab
                baseUrl={baseUrl}
                loadingMap={loadingMap}
                previewMap={previewMap}
                searchResults={searchResults}
                onRequest={handleRequest}
                onSearchResultsChange={setSearchResults}
                getUploadProps={getUploadProps}
                cleanPayload={cleanPayload}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default observer(AiChatPage);
