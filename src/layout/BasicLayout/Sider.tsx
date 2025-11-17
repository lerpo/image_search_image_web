import { useState, useMemo } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/constants';
import Logo from '@/assets/image/logo.png';
import LogoJD from '@/assets/image/logo_jd.png';
import { getItem } from '@/utils/storage';
import CustomIcon from '@/components/CustomIcon';
import Avatar from '@/assets/image/avator.png';
import Menu from './Menu';

const BasicSider = ({
  menus
}: {
  menus: any[];
}) => {
  const navigate = useNavigate();

  const [isCollapse, setIsCollapse] = useState(false);

  function handleToggleSider() {
    setIsCollapse(!isCollapse);
  }

  const userInfo = useMemo(() => getItem('info') || {}, []);

  function goHome() {
    navigate('/');
  }

  function handleLogout() {
    Cookies.remove(TOKEN_KEY);
    navigate('/account/login', { replace: true });
  }

  return (
    <div className={classNames(
      'w-flex w-flex-column basic-layout_sider',
      {
        'basic-layout_sider--collapse': isCollapse,
      }
    )}>
      <div className="basic-layout_header">
        <div className={classNames(
          'w-flex w-flex-align--center',
          {
            'w-flex-column': isCollapse,
            'w-flex-justify--center': isCollapse
          }
        )}>
          <CustomIcon
            className="basic-layout_header_collapse"
            name="icon-zhankai"
            color='#fff'
            onClick={handleToggleSider}
          />
          {
            isCollapse ? (
              <CustomIcon
                className="basic-layout_header_logo--collapse"
                name="icon-logo2"
                color='#fff'
                onClick={goHome}
              />
            ) : (
              <img
                className="basic-layout_header_logo"
                height={20}
                src={window.location.origin.includes('https://kos-jd') ? LogoJD : Logo}
                alt="KOS"
                onClick={goHome}
              />
            )
          }
        </div>
        <div className={
          classNames(
            "w-flex w-flex-justify--start w-flex-align--center basic-layout_header_avatar",
            {
              "basic-layout_header_avatar--collapse": isCollapse
            }
          )
        }>
          <img
            className="basic-layout_header_avatar_img"
            src={Avatar}
            width={40}
            height={40}
            alt="avatar"
          />
          {
            !isCollapse && (
              <h2 className="text-ellipsis basic-layout_header_avatar_text">{userInfo?.name ?? '-'}</h2>
            )
          }
        </div>
      </div>
      <div className="w-flex-item">
        <Menu
          isCollapse={isCollapse}
          menus={menus}
        />
      </div>
      <footer className="basic-layout_footer">
        <div
          className="basic-layout_footer_logout"
          onClick={handleLogout}
        >
          退出
        </div>
      </footer>
    </div>
  );
}

export default BasicSider;
