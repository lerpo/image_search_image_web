import { Spin } from 'antd';
import './styles/index.less';

export default function LoadingComponent() {
  return (
    <div className="loading-component">
      <Spin />
    </div>
  );
}

