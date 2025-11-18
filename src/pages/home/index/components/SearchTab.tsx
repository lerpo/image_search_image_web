import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Upload,
  Tag,
  Typography,
  Image,
} from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { callReverseImageApi } from "@/api/reverseImage";

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;

const FIXED_TABLE_NAME = "test_table";

export interface SearchResultItem {
  id?: number;
  tags?: string;
  brief?: string;
  url?: string;
  distance?: number;
}

interface SearchTabProps {
  baseUrl: string;
  loadingMap: Record<string, boolean>;
  previewMap: Record<"search", string | undefined>;
  searchResults: SearchResultItem[];
  onRequest: <T,>(
    key: string,
    request: () => Promise<T>,
    onSuccess?: (data: T) => void
  ) => void;
  onSearchResultsChange: (results: SearchResultItem[]) => void;
  getUploadProps: (formKey: "search", formInstance: FormInstance) => UploadProps;
  cleanPayload: (payload: Record<string, any>) => Record<string, any>;
}

export const SearchTab = ({
  baseUrl,
  loadingMap,
  previewMap,
  searchResults,
  onRequest,
  onSearchResultsChange,
  getUploadProps,
  cleanPayload,
}: SearchTabProps) => {
  const [searchForm] = Form.useForm();

  return (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Card title="搜索相似图片" bordered={false}>
          <Form
            form={searchForm}
            layout="vertical"
            initialValues={{ topk: 10, table: FIXED_TABLE_NAME }}
            onFinish={(values) =>
              onRequest(
                "search",
                () =>
                  callReverseImageApi<SearchResultItem[]>(
                    baseUrl,
                    "/milvus/img/search",
                    {
                      payload: cleanPayload({
                        ...values,
                        table: FIXED_TABLE_NAME,
                      }),
                    }
                  ),
                (data) => onSearchResultsChange(data ?? [])
              )
            }
          >
            <Form.Item
              label="表名"
              name="table"
              rules={[{ required: true, message: "请输入表名" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="图片上传">
              <Dragger {...getUploadProps("search", searchForm)}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  上传或拖拽图片（转换为查询用 base64）
                </p>
              </Dragger>
              {previewMap.search && (
                <div className="upload-preview">
                  <img
                    src={previewMap.search}
                    alt="已选择图片预览"
                    className="upload-preview-image"
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item label="图片 base64" name="image">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="或图片 URL" name="url">
              <Input />
            </Form.Item>
            <Form.Item
              label="返回数量 TopK"
              name="topk"
              rules={[{ required: true, message: "请输入 TopK" }]}
            >
              <InputNumber className="full-width" min={1} max={200} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingMap.search}
              >
                开始检索
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="检索结果" bordered={false}>
          {searchResults.length === 0 ? (
            <Text type="secondary">等待检索结果</Text>
          ) : (
            <div className="result-grid">
              {searchResults.map((item) => (
                <Card
                  key={`${item.id}-${item.url}`}
                  className="result-card"
                  size="small"
                >
                  {item.url ? (
                    <div className="result-image-wrapper">
                      <Image
                        src={item.url}
                        alt={item.tags || "搜索结果"}
                        className="result-image"
                        preview={{ mask: "预览" }}
                      />
                    </div>
                  ) : (
                    <div className="result-placeholder">缺少图片 URL</div>
                  )}
                  {item.url && (
                    <Paragraph
                      className="result-url"
                      style={{ wordBreak: "break-all" }}
                      copyable={{ text: item.url }}
                    >
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.url}
                      </a>
                    </Paragraph>
                  )}
                  <div className="result-meta">
                    <Text strong>ID: {item.id ?? "-"}</Text>
                    <Tag>{item.distance?.toFixed(4)}</Tag>
                  </div>
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {item.brief || "暂无描述"}
                  </Paragraph>
                  {item.tags && (
                    <div className="tag-row">
                      {item.tags.split(",").map((tag: string) => (
                        <Tag key={tag.trim()}>{tag.trim()}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

