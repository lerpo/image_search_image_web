export const TITLE = 'KOS智能助手';

export const TOKEN_KEY = 'TOKEN_KEY';

export const USER_INFO_KEY = 'info';

export const STORAGE_TYPE = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
}

export const PLATFORM = {
  XHS: 'xhs',
  DY: 'douyin',
}

export const STATUS = {
  "START": '1',
  "BAN": '0',
  "ALL": '',
}

export const PLATFORM_TEXT = {
  [PLATFORM.XHS]: '小红书',
  [PLATFORM.DY]: '抖音',
}

export const STATUS_TEXT = {
  [STATUS.START]: '启用',
  [STATUS.BAN]: '禁用',
  [STATUS.ALL]: '全部',
}

export const EDITOR_ACTION = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
}

export const MONITOR_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  DISABLED: 3,
}

export const MONITOR_STATUS_TEXT = {
  [MONITOR_STATUS.PENDING]: '未开始',
  [MONITOR_STATUS.IN_PROGRESS]: '监控中',
  [MONITOR_STATUS.COMPLETED]: '已结束',
  [MONITOR_STATUS.DISABLED]: '已禁用',
}

