
export const webObjToUrlParams = (obj?: any | null) => {
  let args = '';
  if (obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in obj) {
      if (obj[prop] !== null && obj[prop] !== undefined) {
        const value = encodeURIComponent(obj[prop]);
        args = `${args}&${prop}=${value}`;
      }
    }
    console.log(args);
    if (args.length > 0) {
      return `?${  args.substr(1)}`;
    }
  }
  return '';
};

/** 跳转封装 */
export const jumpTo = (options: {
  url: string;
  params?: any;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: any) => void;
  /** 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 */
  events?: any;
  /** 接口调用失败的回调函数 */
  fail?: (res: any) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: any) => void;
}) => {
  const args = webObjToUrlParams(options.params);
  const modifyOption = options;
  modifyOption.url += args;
  const {wx} = window as any;
  wx.miniProgram.navigateTo(modifyOption);
};

export const redirectTo = (options: {
  url: string;
  params?: any;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: any) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: any) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: any) => void;
}) => {
  const args = webObjToUrlParams(options.params);
  const modifyOption = options;
  modifyOption.url += args;
  console.log('args', options.url);
  const {wx} = window as any;
  wx.miniProgram.redirectTo(modifyOption);
};

export const reLaunchTo = (options: {
  url: string;
  params?: any;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: any) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: any) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: any) => void;
}) => {
  const args = webObjToUrlParams(options.params);
  const modifyOption = options;
  modifyOption.url += args;
  console.log('args', options.url);
  const {wx} = window as any;
  wx.miniProgram.reLaunch(modifyOption);
};

export const switchTab = (url: string) => {
  const {wx} = window as any;
  wx.miniProgram.switchTab({ url });
};

export const navigateBack = (options: {
  // 返回层级数
  delta: number;
}) => {
  const {wx} = window as any;
  wx.miniProgram.navigateBack(options);
};

// 会员详情
export const jumpToVipInfo = (vipId: number) => {
  jumpTo({
    url: '/subPages/crm/view/vipInfo/index',
    params: { vipId }
  });
};

export const jumpToVipSummaryVipList = (searchVipType: number) => {
  jumpTo({
    url: '/subPages/crm/view/vipSummary/vipList/index',
    params: { searchVipType }
  });
};

export const jumpToVisitMonthlyReport = () => {
  jumpTo({ url: '/subPages/crm/view/VisitMonthlyReport/index' });
};

export const jumpToVisitTask = (params: any) => {
  jumpTo({ url: '/subPages/vipVisit/view/VisitTaskNew/index', params });
};

export const jumpToVipVisitRemark = (params: any) => {
  jumpTo({
    url: '/subPages/crm/view/vipReturn/vipReturnRemark/index',
    params
  });
};

export const jumpToVipVisitCheckRemark = (params: any) => {
  jumpTo({
    url: '/subPages/crm/view/vipReturn/vipReturnCheckRemark/index',
    params
  });
};

export const jumpToperformance = () => {
  jumpTo({ url: '/subPages/crm/view/target/performance/index' });
};
export const jumpTorecruitVip = () => {
  jumpTo({ url: '/subPages/crm/view/target/recruitVip/index' });
};
// 跳转小程序面对面送券
export const jumpTofaceSendCoupon = (params: any) => {
  jumpTo({ url: '/subPages/crm/view/faceSendCoupon/index', params });
};
// 跳转小程序远程送券
export const jumpToremoteSendCoupon = (params: any) => {
  jumpTo({ url: '/subPages/crm/view/remoteSendCoupon/index', params });
};
// 跳转小程序分享海报送券
export const jumpShareSendCoupon = (params: any) => {
  jumpTo({
    url: '/subPages/crm/view/sharePosterSendCoupon/index',
    params
  });
};
// 跳转小程序我的粉丝今日新增/会员总量
export const jumpToMyFansList = (params: any) => {
  jumpTo({ url: '/subPages/crm/view/vipAssets/myFansList/index', params });
};
// 跳转小程序目标达成率
export const jumpToRecruitVip = () => {
  jumpTo({ url: '/subPages/crm/view/target/recruitVip/index' });
};
// 句子页面引导跳转
export const jumpToRedirect = (type: string) => {
  console.log('句子跳转type ==> ', type);
  const { host } = window.location
  let domain = ''
  if (host && host.indexOf('http') > -1) {
    domain = host
  } else {
    domain = `https://${host}`
  }
  switch(type) {
  // 会员详情页
  case 'vipInfo':
    window.location.href = `${domain}/#/vipInfo/0/0`
    break
  // 邀请入会
  case 'invite':
    window.location.href = `${domain}/taro/index.html#/subPages/crm/view/join/index.h5`
    break
  // 打标签
  case 'tag':
    window.location.href = `${domain}/taro/index.html#/subPages/crm/view/tag/index`
    break
  // 分销-专题
  case 'activity':
    window.location.href = `${domain}/taro/index.html#/subPages/distribution/view/activity/index.h5`
    break
  // 分销-分享商品
  case 'shareGoods':
    window.location.href = `${domain}/taro/index.html#/subPages/distribution/view/shareGoods/index.h5`
    break
  case 'mallOrderList':
    window.location.href = `${domain}/#/mallOrderList`
    break
  default:
  }
}