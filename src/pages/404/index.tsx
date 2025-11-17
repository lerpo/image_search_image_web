import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './index.less';

// 检测是否是企业微信小程序环境
const isWeChatMiniProgram = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // 检测是否存在 wx 对象且包含 miniProgram（微信小程序环境）
  const wx = (window as any).wx;
  if (wx && typeof wx.miniProgram !== 'undefined') {
    return true;
  }
  
  // 检测 User Agent（企业微信环境）
  const ua = window.navigator.userAgent.toLowerCase();
  const isWorkWeChat = /wxwork/i.test(ua);
  const isWeChat = /micromessenger/i.test(ua);
  
  return (isWeChat || isWorkWeChat) && wx;
};

// 根据环境获取首页路径
const getHomePath = (): string => {
  if (isWeChatMiniProgram()) {
    return '/mchat/index';
  }
  return '/chat/index';
};

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const homePath = getHomePath();
    navigate(homePath);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-description">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <div className="not-found-actions">
          <Button type="primary" size="large" onClick={handleGoHome}>
            返回首页
          </Button>
          <Button size="large" onClick={handleGoBack} style={{ marginLeft: 16 }}>
            返回上一页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

