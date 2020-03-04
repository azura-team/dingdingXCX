//@ts-check
// @ts-ignore
import { token, expires_in } from "./app.json";
/**
 * @typedef {Object} RequestConfig
 * @property {string} url
 * @property {"GET"|"POST"} [method]
 * @property {any} [data]
 */
/**
 * @template T
 * @typedef {Object} DingTalkResponse
 * @property {number} status
 * @property {Record<string,string>} headers
 * @property {T} data
 */
/**
 * @template T
 * @param {RequestConfig} config
 * @returns {Promise<DingTalkResponse<T>>}
 */
export function $request(config) {
  return new Promise(function(resolve, reject) {
    dd.httpRequest({
      ...config,
      dataType: "json",
      success: resolve,
      fail: reject
    });
  });
}
/**
 * 获取access_token
 * @param {{appkey:string,appsecret:string}} data
 * @returns {Promise<DingTalkResponse<{access_token:string, errcode:number, errmsg: string, expires_in: number}>>}
 */
function getToken(data) {
  return $request({ url: "https://oapi.dingtalk.com/gettoken", data: data });
}
/**
 * @returns {Promise<{authCode: string}>}
 */
function getAuthCode() {
  return new Promise(function(resolve, reject) {
    dd.getAuthCode({
      success: resolve,
      fail: reject
    });
  });
}

/**
 *
 * @param {{access_token:string,code:string}} data
 * @returns {Promise<DingTalkResponse<{deviceId:string,errcode:number,errmsg:string,is_sys:boolean,name:string,sys_level:number,userid:strin}>>}
 */
function getuserinfo(data) {
  return $request({
    url: "https://oapi.dingtalk.com/user/getuserinfo",
    data: data
  });
}
//
//https://oapi.dingtalk.com/gettoken?appkey=key&appsecret=secret
export async function GetDetail() {
  const access_token = (await getToken(token)).data.access_token;
  const { authCode } = await getAuthCode();
  const userinfo = await getuserinfo({ access_token, code: authCode });
  return { userid: userinfo.data.userid, access_token };
};

//
// setInterval(function updateAccessToken() {
//   getToken(token);
// }, 1000 * expires_in);
