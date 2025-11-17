import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useLayout from '@/hooks/useLayout';
import { useDispatch } from '@/hooks/useRedux';
import { switchRoute } from '@/store/reducers/route';
import { TOKEN_KEY } from '@/constants';
import whiteRoute from '@/constants/white_route';

const layoutFile = import.meta.glob(['../**/index.tsx', '!../**/components/**/*.tsx'], {
  import: 'default',
  eager: true,
});

const layoutComponentMap = Object.entries(layoutFile)
  .reduce((target, [layoutPath, layoutComponent]) => {
    const layoutContext = layoutPath.split('/');

    target[layoutContext.at(-2)] = layoutComponent;

    return target;
  }, {});

const GuardLayout = ({
  routes,
  menus,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const route = useLayout(routes);

  function validateIsWhite(pathname: string): boolean {
    return whiteRoute.some(route => pathname.includes(route));
  }

  useEffect(() => {
    if (!route) {
      return;
    }

    const token = Cookies.get(TOKEN_KEY);

    if (!validateIsWhite(route?.path) && !token) {
      navigate('/account/login');
      return;
    }

    dispatch(switchRoute(route));
  }, [route]);

  return (layoutComponentMap[route?.layout || 'BasicLayout'])({ menus });
}

export default GuardLayout;
