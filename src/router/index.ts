import { isArray } from '@/utils/type';
import type { IRoute } from '@/types/route';
// import { ROUTE_ORDER } from './constant';

const routes: IRoute[] = [];

const routeFiles = import.meta.glob('./routes/**/*.ts', {
  import: 'default',
  eager: true, // 保持 eager，因为路由配置需要在应用启动时可用
});
// function getRouteOrder(route: string) {
//   const routeKey = route.split('/')
//     .at(-1)
//     .replace(/\.tsx?$/, '')
//     .toLowerCase();

//   return (ROUTE_ORDER.findIndex(route => route === routeKey) + 1) || Infinity;
// }

Object.keys(routeFiles)
  // .sort((prev, next) => getRouteOrder(prev) > getRouteOrder(next) ? 1 : -1)
  .map(routePath => routeFiles[routePath])
  .filter(route => typeof route === 'object')
  .forEach((route: IRoute[] | IRoute) => {
    if (isArray(route)) {
      routes.push(...route);
    } else {
      routes.push(route);
    }
  });
export default routes;
