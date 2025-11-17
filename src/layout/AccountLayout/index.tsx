import { Outlet } from 'react-router-dom';
import Logo from '@/assets/image/logo.png';
import logoNc from '@/assets/image/logo_nc.png';
import LogoJD from '@/assets/image/logo_jd.png';
import LoginRobot from '@/assets/image/login_robot.png';
import './style/index.less';

const AccountLayout = () => (
  <div className="w-flex w-flex-justify--center w-flex-align--center account-layout">
    <div className="account-layout_logo">
      <img
        id="logo"
        src={window.location.origin.includes('https://kos-jd') ? LogoJD : Logo}
        height={40}
      />
    </div>
    <div className="w-flex w-flex-justify--around w-flex-align--center account-layout_wrapper">
      <img
        className="account-layout_robot"
        src={LoginRobot}
        width={400}
        height={400}
        alt="robot"
      />
      <Outlet />
    </div>
  </div>
);

export default AccountLayout;
