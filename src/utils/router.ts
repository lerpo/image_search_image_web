import { USER_INFO_KEY } from '@/constants';
import type { IRoute, IMatchRoute } from '@/types/route';
import { getItem } from './storage';
import lazyload from './lazyload';

const routeComponents = import.meta.glob('../pages/**/*.tsx');

function pureRoute(route: string) {
  return route.replace(/(\/:\w+?(?=\/))|(\/:\w+$)/g, '');
}

export function filterAuthorizedRoutes(routes: IRoute[]): IRoute[] {
  // const userInfo = getItem(USER_INFO_KEY);
  // console.log('userInfouserInfo', userInfo);
  // const mobiles = ['13816659396', '18521030566', '18221000854', '18682200973', '17602134158','13917315557']
  // // 商家审核指定
  // const __routes1 = mobiles.includes(userInfo?.mobile) 
  //   ? routes 
  //   : routes.filter(route => !(['/review', '/aigc/audit'].includes(route.key)));
    

  // const __routes = __routes1.filter(route => !(['/application/index', '/personal/list', '/materiel', '/monitor/list'].includes(route.key) && userInfo?.mobile === '18521030566'));

  // return __routes;
  return routes;
}

// 解析组件路径
function resolveComponent(route: string) {
  // 兼容路由参数
  const purePath = pureRoute(route);

  if (routeComponents[`${purePath}/index.tsx`]) {
    return routeComponents[`${purePath}/index.tsx`];
  }

  if (routeComponents[`${purePath}.tsx`]) {
    return routeComponents[`${purePath}.tsx`];
  }

  return null;
}

export function flattenRoutes(routes: IRoute[]): IMatchRoute[] {
  if (!routes?.length) {
    return [];
  }

  const flattenedRoutes = [];

  function travel(_routes: IRoute[], _container: any[], _parents: string[] = []) {
    if (!_routes?.length) {
      return _container;
    }

    _routes.forEach(({ key, menu, children, ...options }) => {
      const lazyComponent = resolveComponent(`../pages${key}`);

      const nodeIds = menu ? [..._parents, pureRoute(key)] : [..._parents];
      if (lazyComponent) {
        _container.push({
          ...options,
          path: key,
          Component: lazyload(lazyComponent),
          menu,
          nodeIds,
        });
      } else if (!children?.length) {
        console.warn(`路由 ${key} 没有配置对应的组件`);
      }

      if (children?.length > 0) {
        travel(children, _container, nodeIds);
      }
    });
  }

  travel(routes, flattenedRoutes);

  return flattenedRoutes;
}

export function generateMenus(routes: IRoute[]): IRoute[] {
  if (!routes?.length) {
    return [];
  }

  return routes
    .filter(({ menu }) => menu)
    .map(({ key, title, icon, children, showChildren = false }) => {
      return {
        key: pureRoute(key),
        title,
        icon,
        showChildren,
        children: generateMenus(children),
      }
    });
}
