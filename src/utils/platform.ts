// eslint-disable-next-line import/prefer-default-export
export const getPlatform = () => {
  const { userAgent } = navigator;
  console.log('current userAgent', userAgent);
  // alert(userAgent);
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)"
  // Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
  // const app = navigator.appVersion;
  const isAndroid =
    userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1; // android终端或者uc浏览器
  // const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  const isiOS = !!userAgent.match(/(iPhone|iPod|iPad|Macintosh).*AppleWebKit/i);
  if (userAgent.toLowerCase().indexOf('micromessenger') > -1) {
    return 3; // 微信小程序
  }
  if (isiOS) {
    return 1;
  }
  if (isAndroid) {
    return 2;
  }
  return 0;
};
