import { Outlet } from 'react-router-dom';
import './style/index.less';

const BlankLayout = () => (
  <div className='fl-scroll-x blank-layout'>
    <Outlet />
  </div>
);

export default BlankLayout;
