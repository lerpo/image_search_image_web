const tpHost = 'kos.ezrpro.com';
const q1H5Link = 'https://kos-h5-q1.ezrpro.com/#/binding/ezr?code=';
const tpH5Link = 'https://kos-h5.ezrpro.com/#/binding/ezr?code=';
const q1H5OuterLink = 'https://kos-h5-q1.ezrpro.com/#/binding/outer?code=';
const tpH5OuterLink = 'https://kos-h5.ezrpro.com/#/binding/outer?code=';
const ezrQ1SettingLink = 'https://crm-q1.ezrpro.com/#/kos/helper';
const ezrTpSettingLink = 'https://crm-tp.ezrpro.com/#/kos/helper';
const isProd = window.location.host === tpHost;


export const h5Link = isProd ? tpH5Link : q1H5Link;
export const h5OuterLink = isProd ? tpH5OuterLink : q1H5OuterLink;
export const ezrSettingLink = isProd ? ezrTpSettingLink : ezrQ1SettingLink;


export const applicationData = {
    '0': '待审核',
    '1': '已通过',
    '2': '已拒绝'
}
// valid_status 0 未开始 1 成功 2失败
export const noteStatus = {
    '0': '未开始',
    '1': '成功',
    '2': '失败'
}