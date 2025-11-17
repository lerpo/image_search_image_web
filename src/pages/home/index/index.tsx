import { useState } from "react";
import { observer } from "mobx-react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  DEFAULT_BASE_URL,
  callReverseImageApi,
} from "@/api/reverseImage";
import "./index.less";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

type UploadFormKey = "add" | "update" | "search";

interface SearchResultItem {
  id?: number;
  tags?: string;
  brief?: string;
  url?: string;
  distance?: number;
}

const FIXED_TABLE_NAME = "test_table";

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const stripImageDataUrl = (value: string) =>
  value.replace(/^data:image\/[\w.+-]+;base64,/, "");

const ResponseViewer = ({ data }: { data: any }) => {
  if (!data) {
    return <Text type="secondary">暂无响应数据</Text>;
  }

  return (
    <pre className="response-viewer">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

const AiChatPage = () => {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  const [createForm] = Form.useForm();
  const [loadForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [countForm] = Form.useForm();
  const [dropForm] = Form.useForm();

  const uploadForms: Record<UploadFormKey, ReturnType<typeof Form.useForm>[0]> = {
    add: addForm,
    update: updateForm,
    search: searchForm,
  };

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

  const getUploadProps = (formKey: UploadFormKey): UploadProps => ({
    accept: "image/*",
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const base64 = await fileToBase64(file);
        uploadForms[formKey]?.setFieldsValue({ image: base64 });
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
        <div className="hero-hints">
          <div>
            <Text type="secondary">默认前缀</Text>
            <Title level={4}>/milvus/img</Title>
          </div>
          <div>
            <Text type="secondary">成功码</Text>
            <Title level={4}>10000</Title>
          </div>
          <div>
            <Text type="secondary">Content-Type</Text>
            <Title level={4}>application/json</Title>
          </div>
        </div>
      </section>

      <Tabs
        className="reverse-tabs"
        items={[
          {
            key: "dataset",
            label: "表与集合",
            children: (
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="创建表 / 集合" bordered={false}>
                    <Form
                      form={createForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("create", () =>
                          callReverseImageApi(
                            baseUrl,
                            "/milvus/img/table",
                            {
                              method: "POST",
                              query: { table: FIXED_TABLE_NAME },
                            }
                          )
                        )
                      }
                    >
                      <Form.Item
                        label="表名 / 集合名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input placeholder="如：food_images" disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.create}
                        >
                          创建
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.create} />
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="批量加载数据" bordered={false}>
                    <Form
                      form={loadForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("load", () =>
                          callReverseImageApi(baseUrl, "/milvus/img/load", {
                            payload: { table: FIXED_TABLE_NAME },
                          })
                        )
                      }
                    >
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input placeholder="food_images" disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.load}
                        >
                          开始加载
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.load} />
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="统计图片数量" bordered={false}>
                    <Form
                      form={countForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("count", () =>
                          callReverseImageApi(
                            baseUrl,
                            "/milvus/img/count",
                            {
                              method: "GET",
                              query: { table: FIXED_TABLE_NAME },
                            }
                          )
                        )
                      }
                    >
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.count}
                        >
                          获取数量
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.count} />
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="删除整张表 / 集合" bordered={false}>
                    <Form
                      form={dropForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("drop", () =>
                          callReverseImageApi(baseUrl, "/milvus/img/drop", {
                            method: "POST",
                            query: { table: FIXED_TABLE_NAME },
                          })
                        )
                      }
                    >
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          danger
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.drop}
                        >
                          删除
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.drop} />
                    </Form>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: "records",
            label: "图片管理",
            children: (
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="新增图片" bordered={false}>
                    <Form
                      form={addForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("add", () =>
                          callReverseImageApi(baseUrl, "/milvus/img/add", {
                            payload: cleanPayload({
                              ...values,
                              table: FIXED_TABLE_NAME,
                            }),
                          })
                        )
                      }
                    >
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item label="图片上传">
                        <Dragger {...getUploadProps("add")}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            点击或拖拽图片到这里（自动转为 base64）
                          </p>
                        </Dragger>
                      </Form.Item>
                      <Form.Item label="图片 base64" name="image">
                        <Input.TextArea
                          rows={3}
                          placeholder="data:image/jpeg;base64,***"
                        />
                      </Form.Item>
                      <Form.Item label="或图片 URL" name="url">
                        <Input placeholder="https://example.com/img.jpg" />
                      </Form.Item>
                      <Form.Item label="标签（逗号分隔）" name="tags">
                        <Input placeholder="noodle,asian_food" />
                      </Form.Item>
                      <Form.Item label="描述" name="brief">
                        <Input.TextArea rows={2} placeholder="一碗牛肉面" />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.add}
                        >
                          插入图片
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.add} />
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="更新图片" bordered={false}>
                    <Form
                      form={updateForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("update", () =>
                          callReverseImageApi(baseUrl, "/milvus/img/update", {
                            payload: cleanPayload({
                              ...values,
                              table: FIXED_TABLE_NAME,
                            }),
                          })
                        )
                      }
                    >
                      <Form.Item
                        label="记录 ID"
                        name="id"
                        rules={[{ required: true, message: "请输入 ID" }]}
                      >
                        <InputNumber className="full-width" min={1} />
                      </Form.Item>
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item label="图片上传">
                        <Dragger {...getUploadProps("update")}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            点击或拖拽图片到这里（自动转为 base64）
                          </p>
                        </Dragger>
                      </Form.Item>
                      <Form.Item label="图片 base64" name="image">
                        <Input.TextArea rows={3} />
                      </Form.Item>
                      <Form.Item label="或图片 URL" name="url">
                        <Input />
                      </Form.Item>
                      <Form.Item label="标签" name="tags">
                        <Input />
                      </Form.Item>
                      <Form.Item label="描述" name="brief">
                        <Input.TextArea rows={2} />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.update}
                        >
                          更新信息
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.update} />
                    </Form>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="删除图片" bordered={false}>
                    <Form
                      form={deleteForm}
                      layout="vertical"
                      initialValues={{ table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest("delete", () =>
                          callReverseImageApi(
                            baseUrl,
                            "/milvus/img/delete",
                            {
                              method: "POST",
                              query: {
                                id: values.id,
                                table: FIXED_TABLE_NAME,
                              },
                            }
                          )
                        )
                      }
                    >
                      <Form.Item
                        label="记录 ID"
                        name="id"
                        rules={[{ required: true, message: "请输入 ID" }]}
                      >
                        <InputNumber className="full-width" min={1} />
                      </Form.Item>
                      <Form.Item
                        label="表名"
                        name="table"
                        rules={[{ required: true, message: "请输入表名" }]}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          danger
                          type="primary"
                          htmlType="submit"
                          loading={loadingMap.delete}
                        >
                          删除记录
                        </Button>
                      </Form.Item>
                      <ResponseViewer data={responses.delete} />
                    </Form>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: "search",
            label: "以图搜图",
            children: (
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Card title="搜索相似图片" bordered={false}>
                    <Form
                      form={searchForm}
                      layout="vertical"
                      initialValues={{ topk: 10, table: FIXED_TABLE_NAME }}
                      onFinish={(values) =>
                        handleRequest(
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
                          (data) => setSearchResults(data ?? [])
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
                        <Dragger {...getUploadProps("search")}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            上传或拖拽图片（转换为查询用 base64）
                          </p>
                        </Dragger>
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
                        rules={[
                          { required: true, message: "请输入 TopK" },
                        ]}
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
                              <img
                                src={item.url}
                                alt={item.tags || "搜索结果"}
                                className="result-image"
                              />
                            ) : (
                              <div className="result-placeholder">
                                缺少图片 URL
                              </div>
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
            ),
          },
        ]}
      />
    </div>
  );
};

export default observer(AiChatPage);
