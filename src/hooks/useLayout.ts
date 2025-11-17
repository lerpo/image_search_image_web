import { useEffect, useMemo } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { TITLE } from '@/constants';

export default function useLayout(routes) {
  console.log('routes', routes);
  const { pathname } = useLocation();

  const matches = useMatches();

  const route = useMemo(() => {
    const matchPaths = matches.filter((matchRoute) => matchRoute.pathname === pathname).map(({ pathname, params }) => {
      let originPath = pathname;

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          // 多id情况下需要使用修改后的originPath作为源数据
          originPath = originPath.replace(new RegExp(`${params[key]}$|(?<=\/)${params[key]}`, 'g'), `:${key}`);
        }
      }
      return originPath;
    });

    const activeMenu = routes.find(({ path }) => matchPaths.includes(path));

    return activeMenu;
  }, [pathname, routes]);

  useEffect(() => {
    document.title = route?.title ? `${TITLE}-${route.title}` : TITLE;
  }, [route]);

  return route;
}
