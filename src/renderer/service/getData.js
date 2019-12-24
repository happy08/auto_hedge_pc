import { get, post, postJSON, http } from './http';
export const login = p => post('/api/login/login',p);  // 登录
export const vertify = p => get('api/login/vertify',p);  // 获取图片验证码
//获取交易所信息
// export const exchangeList = p => get('api/exchange/exchangeList',p);  // 获取交易所列表