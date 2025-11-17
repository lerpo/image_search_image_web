import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from '@/store';
import { createRoot } from 'react-dom/client';
import theme from '@/constants/theme';
import App from './App';
import zhCN from 'antd/locale/zh_CN';
import '@/assets/style/index.less';
import "dayjs/locale/zh-cn";

createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <Provider store={store}>
      <ConfigProvider
        locale={zhCN}
        theme={theme}
      >
        <App />
      </ConfigProvider>
    </Provider>
  );
