import { useMemo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import routes from '@/router';
import 'ezrd/css/index.css';
import {
  filterAuthorizedRoutes,
  flattenRoutes,
  generateMenus,
} from '@/utils/router';

// 优化：在模块顶层计算路由配置，避免每次组件渲染时重新计算
const authorizedRoutes = filterAuthorizedRoutes(routes);
const flattenedRoutes = flattenRoutes(authorizedRoutes);
const menus = generateMenus(authorizedRoutes);

function App() {
  // 使用 useMemo 缓存 router 实例，避免每次渲染都重新创建
  const router = useMemo(() => createBrowserRouter([
    {
      path: '/',
      element: <Navigate to={flattenedRoutes[0]?.path ?? '/'} replace />,
    },
    ...flattenedRoutes,
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]), []); // 空依赖数组，因为路由配置在模块加载时已确定

  return (
    <RouterProvider router={router} />
  );
}

export default App;
