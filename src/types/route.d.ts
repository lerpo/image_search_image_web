export interface IRoute {
  // 路由地址
  key: string;
  // 路由名称
  title: string;
  // 菜单图标
  icon?: React.ReactNode;
  // 当前路由是否渲染菜单
  menu?: boolean;
  // 采用layout模板，默认采用blankLayout
  layout?: string;
  // 子路由
  children?: IRoute[];
  // 非配置项字段
  Component?: any;
  // 菜单树id集合
  nodeIds?: string[];

  showChildren?: boolean;
}

export interface IMatchRoute extends Pick<IRoute, "title" | "icon" | "menu" | "Component" | "nodeIds"> {
  path: string;
}
