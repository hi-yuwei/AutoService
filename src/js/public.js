"use strict";

import axios from "axios";
/** 用于中断的信号 */
class BreakSignal {}
axios.interceptors.request.use(
  config => {
    // loading
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

export default {
  pageInitFunc: null,
  setPageInit: function(func) {
    this.pageInitFunc = func;
  },
  pageInit: function(options) {

    if (window.setTokenFlag) {
      
      this.pageInitFunc(options)
    } else {
      window.setTimeout(()=>{
        this.pageInit(options) 
      }, 200);
    }
  },
  TOKEN: "Token 8982367b06af01fc634eaacaaf2dd1cda349d06e",
  partnerId: "bxjradfjkjeiadf124jadf",
  sessionId: "",
  getApi(params, type) {
    params.partnerId = this.partnerId;
    params.sessionId = this.sessionId;
    params.wdToken = this.getAuthor();
    params.clientType=this.isApp();
    // params.clientType = '1';
    return axios({
      method: "post",
      // url: "http://10.0.1.53:8000/api/v2/question",
      url: "/api/v2/question",
      data: JSON.stringify(params),
      type: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.TOKEN
      }
    }).then(res => {
      return this.checkCode(res);
    });
  },
  checkCode(res) {
    if (res.data.sessionId) {
      this.sessionId = res.data.sessionId;
    }

    if (res.data) {
      res.data.type = JSON.parse(res.config.data).eventType;
      res.data.lastProblem = JSON.parse(res.config.data).content;
    }
    return res;
  },
  getAuthor() {

    let persion;
    // try {
    //   persion = localStorage.getItem("persion");
    // } catch (r) {
      persion = sessionStorage.getItem("persion");
    // }
    return JSON.parse(persion).accessToken;
    // return '86d0d3f0-6c55-4a43-913a-9d1b0ea2bd24'
  },
  isApp: function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("baoxiang") > -1) {
      if (/baoxiangiOS/.test("baoxiangiOS")) {
        //iOS
        return "1";
      } else if (/baoxiangAndroid/.test("baoxiangAndroid")) {
        //Android
        return "2";
      }
    } else {
      //h5,pc
      return "3";
    }
  }
};
