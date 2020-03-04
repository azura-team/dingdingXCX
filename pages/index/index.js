/// <reference path="../../dingtalk.d.ts" />
import { $request,GetDetail } from '../../utils';

/** @type {Promise<any>} */
function cb(context, callbackId, data) {
  if (data && typeof data === 'object' && typeof data['then'] === 'function') {
    data.then(
      function(e) {
        context.postMessage({
          callbackId: callbackId,
          issuccess: true,
          data: e
        });
      },
      function(e) {
        context.postMessage({
          callbackId: callbackId,
          issuccess: false,
          data: e
        });
      }
    );
  } else {
    context.postMessage({ callbackId: callbackId, issuccess: true, data });
  }
}
Page({
  onLoad(e) {
    this.webViewContext = dd.createWebViewContext('web-view-1');
  },
  onmessage({ detail }) {
    /** @type {{ type:"log"|"request"|"userinfo", params:any,callbackId:string }} */
    const { type, params, callbackId } = detail;
    console.log(type, params, callbackId);
    if (type === 'log') {
      console.log(params);
    } else if (type === 'userinfo') {
      cb(this.webViewContext, callbackId, GetDetail());
    } else if (type === 'request') {
      GetDetail().then(info => {
        params.data = { ...info, ...params.data };
        cb(this.webViewContext, callbackId, $request(params));
      });
    } else if (type === 'storage') {
      cb(this.webViewContext, callbackId, $storage(params));
    } else if (type === 'chooseImage') {
      cb(this.webViewContext, callbackId, $chooseImage(params));
    } else if (type === 'showCallMenu') {
      cb(this.webViewContext, callbackId, $showCallMenu(params));
    } else if (type === 'uploadFile') {
      cb(this.webViewContext, callbackId, $uploadFile(params));
    }
  }
});

function $storage(params) {
  return new Promise(function(resolve, reject) {
    /** @type {"removeStorage"|"getStorage"|"setStorage"} */
    let key = 'getStorage';
    dd.removeStorage;
    if (params.data === undefined) key = 'getStorage';
    else if (params.data === null) key = 'removeStorage';
    else key = 'setStorage';
    dd[key]({ ...params, success: resolve, fail: reject });
  });
}

function $chooseImage(params) {
  return new Promise(function(resolve, reject) {
    dd.chooseImage({ ...params, success: resolve, fail: reject });
  });
}

function $showCallMenu(params) {
  return new Promise(function(resolve, reject) {
    dd.showCallMenu({ ...params, success: resolve, fail: reject });
  });
}

function $uploadFile(params) {
  return new Promise(function(resolve, reject) {
    dd.uploadFile({ ...params, success: resolve, fail: reject });
  });
}