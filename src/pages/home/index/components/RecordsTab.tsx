import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  Modal,
  Upload,
  message,
  Image,
  Popconfirm,
  Tooltip,
} from "antd";
import type { UploadProps } from "antd";
import type { FormInstance } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InboxOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { callReverseImageApi } from "@/api/reverseImage";

const { Dragger } = Upload;

const FIXED_TABLE_NAME = "test_table";

// 图片列表项类型
export interface ImageListItem {
  id: number;
  milvus_id: number;
  tags: string;
  brief: string;
  url: string;
  create_date: string;
  modify_date: string;
}

// 图片列表响应类型
interface ImageListResponse {
  images: ImageListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface RecordsTabProps {
  baseUrl: string;
  loadingMap: Record<string, boolean>;
  responses: Record<string, any>;
  previewMap: Record<"add" | "update", string | undefined>;
  onRequest: <T,>(
    key: string,
    request: () => Promise<T>,
    onSuccess?: (data: T) => void
  ) => void;
  getUploadProps: (
    formKey: "add" | "update",
    formInstance: FormInstance
  ) => UploadProps;
  cleanPayload: (payload: Record<string, any>) => Record<string, any>;
}

export const RecordsTab = ({
  baseUrl,
  loadingMap,
  responses,
  previewMap,
  onRequest,
  getUploadProps,
  cleanPayload,
}: RecordsTabProps) => {
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [imageList, setImageList] = useState<ImageListItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ImageListItem | null>(null);

  // 加载图片列表
  const loadImageList = async (page: number = 1, pageSize: number = 20) => {
    try {
      onRequest(
        "list",
        () =>
          callReverseImageApi<ImageListResponse>(baseUrl, "/milvus/img/list", {
            method: "GET",
            query: {
              table: FIXED_TABLE_NAME,
              page,
              page_size: pageSize,
            },
          }),
        (data) => {
          setImageList(data.images || []);
          setPagination({
            current: data.page || page,
            pageSize: data.page_size || pageSize,
            total: data.total || 0,
          });
        }
      );
    } catch (error) {
      console.error("加载图片列表失败:", error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadImageList(1, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  // 处理添加图片
  const handleAdd = () => {
    addForm
      .validateFields()
      .then((values) => {
        onRequest("add", () =>
          callReverseImageApi(baseUrl, "/milvus/img/add", {
            payload: cleanPayload({
              ...values,
              table: FIXED_TABLE_NAME,
            }),
          }),
          () => {
            setAddModalVisible(false);
            addForm.resetFields();
            loadImageList(pagination.current, pagination.pageSize);
            message.success("添加成功");
          }
        );
      })
      .catch((error) => {
        console.error("表单验证失败:", error);
      });
  };

  // 处理更新图片
  const handleUpdate = () => {
    updateForm
      .validateFields()
      .then((values) => {
        onRequest("update", () =>
          callReverseImageApi(baseUrl, "/milvus/img/update", {
            payload: cleanPayload({
              ...values,
              table: FIXED_TABLE_NAME,
            }),
          }),
          () => {
            setUpdateModalVisible(false);
            updateForm.resetFields();
            setEditingRecord(null);
            loadImageList(pagination.current, pagination.pageSize);
            message.success("更新成功");
          }
        );
      })
      .catch((error) => {
        console.error("表单验证失败:", error);
      });
  };

  // 处理删除图片
  const handleDelete = (record: ImageListItem) => {
    onRequest("delete", () =>
      callReverseImageApi(baseUrl, "/milvus/img/delete", {
        method: "POST",
        query: {
          id: record.id,
          table: FIXED_TABLE_NAME,
        },
      }),
      () => {
        loadImageList(pagination.current, pagination.pageSize);
        message.success("删除成功");
      }
    );
  };

  // 打开更新弹窗
  const openUpdateModal = (record: ImageListItem) => {
    setEditingRecord(record);
    updateForm.setFieldsValue({
      id: record.id,
      url: record.url,
      tags: record.tags,
      brief: record.brief,
    });
    setUpdateModalVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<ImageListItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Milvus ID",
      dataIndex: "milvus_id",
      key: "milvus_id",
      width: 100,
    },
    {
      title: "图片",
      key: "image",
      width: 120,
      render: (_, record) => (
        <Image
          width={80}
          height={80}
          src={record.url}
          alt={record.brief}
          style={{ objectFit: "cover" }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      ellipsis: true,
      width: 200,
    },
    {
      title: "描述",
      dataIndex: "brief",
      key: "brief",
      ellipsis: true,
      width: 200,
    },
    {
      title: "图片 URL",
      dataIndex: "url",
      key: "url",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (url: string) => (
        <Tooltip placement="topLeft" title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </Tooltip>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "create_date",
      key: "create_date",
      width: 180,
    },
    {
      title: "更新时间",
      dataIndex: "modify_date",
      key: "modify_date",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(record)}
          >
            更新
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setAddModalVisible(true);
            addForm.resetFields();
            addForm.setFieldsValue({ table: FIXED_TABLE_NAME });
          }}
        >
          添加图片
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={imageList}
        rowKey="id"
        loading={loadingMap.list}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            loadImageList(page, pageSize);
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* 添加图片弹窗 */}
      <Modal
        title="添加图片"
        open={addModalVisible}
        onOk={handleAdd}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        width={600}
        okText="确定"
        cancelText="取消"
        confirmLoading={loadingMap.add}
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{ table: FIXED_TABLE_NAME }}
        >
          <Form.Item
            label="表名"
            name="table"
            rules={[{ required: true, message: "请输入表名" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="图片上传">
            <Dragger {...getUploadProps("add", addForm)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                点击或拖拽图片到这里（自动转为 base64）
              </p>
            </Dragger>
            {previewMap.add && (
              <div className="upload-preview" style={{ marginTop: 16 }}>
                <img
                  src={previewMap.add}
                  alt="已选择图片预览"
                  className="upload-preview-image"
                  style={{ maxWidth: "100%", maxHeight: 200 }}
                />
              </div>
            )}
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
        </Form>
      </Modal>

      {/* 更新图片弹窗 */}
      <Modal
        title="更新图片"
        open={updateModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setUpdateModalVisible(false);
          updateForm.resetFields();
          setEditingRecord(null);
        }}
        width={600}
        okText="确定"
        cancelText="取消"
        confirmLoading={loadingMap.update}
      >
        <Form
          form={updateForm}
          layout="vertical"
          initialValues={{ table: FIXED_TABLE_NAME }}
        >
          <Form.Item
            label="记录 ID"
            name="id"
            rules={[{ required: true, message: "请输入 ID" }]}
          >
            <InputNumber className="full-width" min={1} disabled />
          </Form.Item>
          <Form.Item
            label="表名"
            name="table"
            rules={[{ required: true, message: "请输入表名" }]}
          >
            <Input disabled />
          </Form.Item>
          {editingRecord?.url && (
            <Form.Item label="当前图片">
              <Image
                width={200}
                src={editingRecord.url}
                alt={editingRecord.brief}
                style={{ objectFit: "cover" }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </Form.Item>
          )}
          <Form.Item label="图片上传">
            <Dragger {...getUploadProps("update", updateForm)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                点击或拖拽图片到这里（自动转为 base64）
              </p>
            </Dragger>
            {previewMap.update && (
              <div className="upload-preview" style={{ marginTop: 16 }}>
                <img
                  src={previewMap.update}
                  alt="已选择图片预览"
                  className="upload-preview-image"
                  style={{ maxWidth: "100%", maxHeight: 200 }}
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
          <Form.Item label="标签" name="tags">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="brief">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
