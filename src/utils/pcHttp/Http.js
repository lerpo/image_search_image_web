/*
 * @Author: kusty
 * @Date: 2018-09-02 14:18:50
 * @Last Modified by: kusty
 * @Last Modified time: 2018-12-20 20:05:43
 */
import axios from "axios";
import React from "react";
import { Notify, Sweetalert } from "ezrd";
import { JSEncrypt } from "jsencrypt";
import { toJS, isObservable } from 'mobx';
import CryptoJS from 'crypto-js';

export default class http {
  static async request(method, url, data, loading = true) {
    const { hash } = window.location;
    const routeUrl = hash.indexOf("#") === 0 ? hash.substring(1) : hash;
    const queryIndex = url.indexOf("?");
    const apiIndex = url.indexOf("api") < -1 ? 0 : url.indexOf("api") + 4;
    const apiUrl = queryIndex > 0
      ? url.substring(apiIndex, queryIndex)
      : url.substring(apiIndex);
    const userInfo = localStorage.getItem("EZPConsts");
    const userId = userInfo ? JSON.parse(userInfo).userId : 0;
    const timeStamp = new Date().getTime();
    const headerMsg = `${routeUrl}&${apiUrl}&${userId}&${timeStamp}`;
    const whiteList = ["localhost", "127.0.0.1"];

    let publicKey = "-----BEGIN PUBLIC KEY-----";
    publicKey
      += "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkwG+nEY9xWb/1LjOnJ7e";
    publicKey
      += "foun8/cu9cKyvqCUFNQKa1Dut01JfuTOkwH0X+tbSw3JC6gb2tApSXMRRLof3V6M";
    publicKey
      += "EHXXivDaNLjRXD8uTkpzoqCmd+2aePuSLUhR20EGITNQcP7nLi+pXa2uAtllwc1I";
    publicKey
      += "PX3209F2JqwffJuUzftQTnf4czoBCXuP4rXn5Nw6mhycSEg75Tm90v496xrAo0tB";
    publicKey
      += "HlWO7WkW/GCRIIDIvknq7SDu2ZUGfSEP0Y6Gi6RudLl4ZTbJZzHIc/kr/+SfPy6P";
    publicKey
      += "koWhUV2uorg1gnXAwEZKTOgqA1QmYP1TIbR1JlbmBdnagbydiLy1VUGFbcprOWDJ";
    publicKey += "LwIDAQAB";
    publicKey += "-----END PUBLIC KEY-----";

    const enc = new JSEncrypt();
    enc.setPublicKey(publicKey);

    const param = {
      method,
      url,
      data
    };
    if (whiteList.includes(location.hostname)) {
      param.headers = { v: enc.encrypt(headerMsg) };
    }

    // CRM应用
    // 所有请求添加签名
    // 请求加密
    const isBigData = [
      '/api/crm/Visit/RtnVisit/GetVisitConvertByOrg',
      '/api/crm/Visit/RtnVisit/GetVisitConvertBySaler',
      '/api/crm/Visit/RtnVisit/GetVisitOverallStatistics',
      '/api/crm/Visit/RtnVisit/GetVisitProgress',
      '/api/crm/Visit/RtnVisit/GetVisitSuccessConvert',
      '/api/crm/Visit/RtnVisit/VisitDownTask',
      '/api/crm/Visit/RtnVisit/GetVisitStatistics',
      '/api/crm/Visit/RtnVisit/GetVisitDtlInfo',
      '/api/crm/Visit/RtnVisit/GetVisitConvertByDetail',
      '/api/crm/Visit/RtnVisit/VisitBatchDownTask',
    ].some((bigDataUrl) => url.indexOf(bigDataUrl) > -1);

    const isFlea = window.__FLEA__;

    if (/\/api\/crm\//.test(url) && !isBigData && !isFlea) {
      const queryString = queryIndex > -1 ? decodeURIComponent(url.slice(queryIndex + 1)) : '';
      const isPOST = method === 'POST';
      const isStringData = typeof data === 'string';
      const isFormData = Object.prototype.toString.call(data) === '[object FormData]';

      let bodyString = '';

      if (isPOST && data && !isFormData) {
        if (isStringData) {
          bodyString = data;
        } else {
          bodyString = JSON.stringify(isObservable(data) ? toJS(data) : data);
        }
      }

      const secretKey = "ezrpro209F86D081884C7D659A2FEAA0C55AD015";

      const s = CryptoJS.SHA1(queryString + bodyString + secretKey.slice(0, 18));

      param.headers = {
        ...(param.headers || {}),
        s: s.toString()
      };

      // POST请求也存在url传参的情况，牛
      if (queryIndex > -1 && queryString.length < 50) {
        const encryptQuery = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(queryString), CryptoJS.enc.Utf8.parse(secretKey.slice(0, 16)), {
          iv: CryptoJS.enc.Utf8.parse(secretKey.slice(16, 32))
        });

        param.url = `${param.url.slice(0, queryIndex)}?_jmqs=${encodeURIComponent(encryptQuery.toString())}`;
      }

      // FormData 类型的数据不加密
      // x-www-form-urlencoded 类型不加密，真牛
      if (bodyString && !isStringData) {
        const encryptData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(bodyString), CryptoJS.enc.Utf8.parse(secretKey.slice(0, 16)), {
          iv: CryptoJS.enc.Utf8.parse(secretKey.slice(16, 32))
        });

        param.headers = {
          ...param.headers,
          'content-Type': 'application/json'
        };

        param.data = `_jmbody${encryptData.toString()}`;
      }
    }

    const res = await axios.request(param);
    if (this.isSuccess(res)) {
      return this.handleData(res.data);
    }
    throw this.requestException(res);
  }

  static async uploadFile(url, file, callback) {
    const { hash } = window.location;
    const routeUrl = hash.indexOf("#") === 0 ? hash.substring(1) : hash;
    const queryIndex = url.indexOf("?");
    const apiIndex = url.indexOf("api") < -1 ? 0 : url.indexOf("api") + 4;
    const apiUrl = queryIndex > 0
      ? url.substring(apiIndex, queryIndex)
      : url.substring(apiIndex);
    const userInfo = localStorage.getItem("EZPConsts");
    const userId = userInfo ? JSON.parse(userInfo).userId : 0;
    const timeStamp = new Date().getTime();
    const headerMsg = `${routeUrl}&${apiUrl}&${userId}&${timeStamp}`;
    const whiteList = ["localhost", "127.0.0.1", "192.168.20.102"];

    let publicKey = "-----BEGIN PUBLIC KEY-----";
    publicKey
      += "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkwG+nEY9xWb/1LjOnJ7e";
    publicKey
      += "foun8/cu9cKyvqCUFNQKa1Dut01JfuTOkwH0X+tbSw3JC6gb2tApSXMRRLof3V6M";
    publicKey
      += "EHXXivDaNLjRXD8uTkpzoqCmd+2aePuSLUhR20EGITNQcP7nLi+pXa2uAtllwc1I";
    publicKey
      += "PX3209F2JqwffJuUzftQTnf4czoBCXuP4rXn5Nw6mhycSEg75Tm90v496xrAo0tB";
    publicKey
      += "HlWO7WkW/GCRIIDIvknq7SDu2ZUGfSEP0Y6Gi6RudLl4ZTbJZzHIc/kr/+SfPy6P";
    publicKey
      += "koWhUV2uorg1gnXAwEZKTOgqA1QmYP1TIbR1JlbmBdnagbydiLy1VUGFbcprOWDJ";
    publicKey += "LwIDAQAB";
    publicKey += "-----END PUBLIC KEY-----";

    const enc = new JSEncrypt();
    enc.setPublicKey(publicKey);

    const fd = new FormData();
    fd.append("file", file);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      // 获取文件上传进度
      onUploadProgress: (progressEvent) => {
        callback(progressEvent);
      }
    };
    if (whiteList.includes(document.location.hostname)) {
      config.headers = { v: enc.encrypt(headerMsg) };
    }
    const res = await axios.post(url, fd, config);
    if (this.isSuccess(res)) {
      const result = await this.handleData(res.data);
      return result;
    }
    throw this.requestException(res);
  }

  static isSuccess(res) {
    const code = res.status;
    if (code !== 200) {
      return false;
    }
    return true;
  }

  static handleData(data) {
    if (data.IsError) {
      let errorMsg = data.ErrorMsg;
      if (data.ErrorMsg === "900") {
        Notify.error("未登录");
        // location.href = `https://account.ezrpro.com/?rturl=${location.href}`;
      }
      if (data.SessionId) {
        errorMsg += `\n编号: ${data.SessionId}`;
      }
      if (data.OccurTime) {
        errorMsg += `\n时间: ${data.OccurTime}`;
      }
      if (data.ErrorContent) {
        errorMsg += `\n详情: ${data.ErrorContent}`;
      }
      // 兼容处理没有ErrorType字段时，使用旧报错
      if (data.ErrorType !== undefined) {
        Sweetalert.alert({
          type: "apiError",
          apiErrorCode: data.ErrorType,
          closeBtn: true,
          maskClosable: false,
          content: data.ErrorType == 2 ? data.ErrorContent : errorMsg
        });
      } else {
        Notify.error(
          errorMsg,
          3000
        );
      }
      throw errorMsg;
    } else {
      return data;
    }
  }

  /**
   * 异常
   */
  static requestException(res) {
    error.status = res.status;
    return error;
  }

  static get(url, data = {}, loading = true) {
    return this.request("GET", url, data, loading);
  }

  static put(url, data, loading = true) {
    return this.request("PUT", url, data, loading);
  }

  static post(url, data, loading = true) {
    return this.request("POST", url, data, loading);
  }

  static delete(url, data, loading = true) {
    return this.request("DELETE", url, data, loading);
  }
}
