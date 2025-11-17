import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { useSelector } from '@/hooks/useRedux';
import type { IRoute } from '@/types/route';
import CustomIcon from '@/components/CustomIcon';

const BasicMenu = ({
  menus,
  isCollapse
}: {
  menus: IRoute[];
  isCollapse: boolean;
}) => {
  const { route } = useSelector('route');
  console.log('route', route)
  const navigate = useNavigate();
  const [downUp, setDownUp] = useState('expanded');

  function handleJump(route) {
    navigate(route);
  }
  return (
    <ul className="w-scroll-y basic-layout_menu">
      {
        menus.map(({ key, title, icon, showChildren, children }) => isCollapse ? (
          <Tooltip
            key={key}
            title={title}
            align={{
              offset: [10, 0]
            }}
            arrow={false}
            placement="right"
          >
            {
              showChildren && children.length > 0 ? (
                <li
                  className={classNames('w-flex w-flex-align--center basic-layout_menu_row', {
                    'basic-layout_menu_row--active': route?.nodeIds?.includes(key),
                  })}
                  key={key}
                >
                  <CustomIcon
                    className="basic-layout_menu_icon"
                    name={icon as string}
                    color='#fff'
                  />
                </li>
              ) : (
                <li
                  className={classNames('w-flex w-flex-align--center basic-layout_menu_row', {
                    'basic-layout_menu_row--active': route?.nodeIds?.includes(key),
                  })}
                  key={key}
                  onClick={() => handleJump(key)}
                >
                  <CustomIcon
                    className="basic-layout_menu_icon"
                    name={icon as string}
                    color='#fff'
                  />
                </li>
              )
            }
            
          </Tooltip>
        ) : (
          showChildren && children.length > 0 ? (
            <>
              <li
                key={key}
                className='w-flex w-flex-align--center basic-layout_menu_row releative'
                onClick={() => setDownUp(downUp === 'expanded' ? 'collapsed' : 'expanded')}
              >
                <CustomIcon
                  className="basic-layout_menu_icon"
                  name={icon as string}
                  color='#fff'
                />
                <span className="basic-layout_menu_title">{title}</span>
                <div className='basic-layout_menu_expansion'>
                  <i className={
                    classNames(
                      "basic-layout_menu_expansion_icon",
                      {
                        'basic-layout_menu_expansion_icon_expanded': downUp === 'expanded',
                        'basic-layout_menu_expansion_icon_collapsed': downUp === 'collapsed',
                      }
                    )
                  }></i>
                </div>
              </li>
              <ul
                className={classNames('basic-layout_menu_has_submenu', {
                  'basic-layout_menu_has_submenu--collapsed': downUp === 'collapsed', // 折叠状态
                  'basic-layout_menu_has_submenu--expanded': downUp === 'expanded', // 展开状态
                })} 
              >
                {
                  children.map(e => (
                    <li
                      key={e.key}
                      className={classNames('w-flex w-flex-align--center basic-layout_menu_row basic-layout_menu_sub_row', {
                        'basic-layout_menu_row--active': route?.nodeIds?.includes(e.key),
                      })}
                      onClick={() => handleJump(e.key)}
                    >
                      <CustomIcon
                        className="basic-layout_menu_icon"
                        name="icon-erji"
                        color='#fff'
                        fontSize={11}
                      />
                      <span className="basic-layout_menu_sub_title">{e.title}</span>
                    </li>
                  ))
                }
              </ul>
            </>
          ) : (
            <li
              key={key}
              className={classNames('w-flex w-flex-align--center basic-layout_menu_row', {
                'basic-layout_menu_row--active': route?.nodeIds?.includes(key),
              })}
              onClick={() => handleJump(key)}
            >
              <CustomIcon
                className="basic-layout_menu_icon"
                name={icon as string}
                color='#fff'
              />
              <span className="basic-layout_menu_title">{title}</span>
            </li>
          )
        ))
      }
    </ul>
  );
}

export default BasicMenu;
