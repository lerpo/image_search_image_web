import { Typography } from "antd";

const { Text } = Typography;

export const ResponseViewer = ({ data }: { data: any }) => {
  if (!data) {
    return <Text type="secondary">暂无响应数据</Text>;
  }

  return (
    <pre className="response-viewer">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

