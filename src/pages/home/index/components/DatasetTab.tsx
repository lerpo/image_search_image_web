import { Form, Input, Button, Card, Row, Col, Typography } from "antd";
import { callReverseImageApi } from "@/api/reverseImage";
import { ResponseViewer } from "../ResponseViewer";

const { Text } = Typography;

const FIXED_TABLE_NAME = "test_table";

interface DatasetTabProps {
  baseUrl: string;
  loadingMap: Record<string, boolean>;
  responses: Record<string, any>;
  onRequest: <T,>(
    key: string,
    request: () => Promise<T>,
    onSuccess?: (data: T) => void
  ) => void;
}

export const DatasetTab = ({
  baseUrl,
  loadingMap,
  responses,
  onRequest,
}: DatasetTabProps) => {
  const [createForm] = Form.useForm();
  const [loadForm] = Form.useForm();
  const [countForm] = Form.useForm();
  const [dropForm] = Form.useForm();

  return (
    <Row gutter={[24, 24]}>
      <Col span={12}>
        <Card title="创建表 / 集合" bordered={false}>
          <Form
            form={createForm}
            layout="vertical"
            initialValues={{ table: FIXED_TABLE_NAME }}
            onFinish={(values) =>
              onRequest("create", () =>
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
              onRequest("load", () =>
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
              onRequest("count", () =>
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
              onRequest("drop", () =>
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
  );
};

