import { Outlet } from 'react-router-dom';
import { FloatButton } from 'antd';
import CustomIcon from '@/components/CustomIcon';
import Sider from './Sider';
import './style/index.less';

const BasicLayout = ({ menus }) => (
  <div className="w-flex basic-layout">
    <Sider menus={menus} />
    <div className="w-scroll-y w-flex-item basic-layout_content">
      <Outlet />
      <FloatButton
        tooltip={<div>客户/帮助中心</div>}
        href="https://work.weixin.qq.com/kfid/kfca1ef4be625466f20"
        target="_blank"
        icon={
          <CustomIcon
            name="icon-kefu"
            color="#fff"
          />
        }
      />
    </div>
  </div>
);

export default BasicLayout;
