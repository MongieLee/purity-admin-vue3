import {message} from 'ant-design-vue';
import axios from 'axios';
import {
  __auth_refresh_token_key__, __auth_token_key__, clearAuthToken, getToken, inspectTokenValidity, setAuthToken
} from '@/utils/token';
import router from '@/router';
// import {tokenGrantType} from '@/services/auth/department.js';
import * as Qs from 'qs';

const instance = axios.create({
  baseURL: "http://192.168.8.58:8080",
  // timeout: 4000
});

// 处理https问题
let currentRequestDomain = window.location.host;
currentRequestDomain = (currentRequestDomain.indexOf('www.') != -1) ? `https://www.fuyou.cn/WebApi` : `https://fuyou.cn/WebApi`;

// instance.defaults.baseURL = apiUrl;
// instance.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.8.207:7681/' : currentRequestDomain;
// instance.defaults.timeout = 3000;

const METHOD = {
  GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
};

const GRANT_TYPE = {
  grantType: 'refresh_token', REFRESH_TOKEN: 'REFRESH_TOKEN'
};

/**
 * 重定向到登陆页面
 */
const redirectLogin = () => {
  message.error('登录已失效，请重新登录');
  clearAuthToken();
  return router.push({
    path: '/login', query: {
      // 将原本的路由信息传递给登陆页面，当登陆成功后，跳转回原来的页面
      redirect: encodeURIComponent(router.currentRoute.fullPath)
    }
  });
};

/**
 * 请求拦截器，每次请求前都会调用，主要校验token是否存在，如果存在，则每次请求都带上token
 */
instance.interceptors.request.use((config) => {
  if (inspectTokenValidity()) {
    config.headers['Authorization'] = `Bearer ${getToken(__auth_token_key__)}`;
  }
  config.headers['Content-type'] = 'application/json';
  return config;
});


let cacheRequest = [];
let refreshing = false;

const refreshToken = () => {
  // 新建一个实例，没有拦截器
  return axios.create()({
    url: '/api/v1/auth/refreshToken', method: METHOD.POST, data: {
      // grantType: GRANT_TYPE.REFRESH_TOKEN,
      tokenGrantType: tokenGrantType.refresh_token,
      refreshToken: getToken(__auth_refresh_token_key__)
    }
  });
};

/**
 * 响应拦截器，主要用于处理token过期
 */
// instance.interceptors.response.use((response) => {
//   // 200状态码会进入成功回调
//   // 业务逻辑错误，success为false
//   return response.data;
// }, (error) => {
//   // 如果非200状态，则会进入reject函数
//   // 判断是否有响应体
//   if (error.response) {
//     const {status} = error.response;
//     if (status === 401) {
//       // 如果返回401，并且不存在refreshToken，则跳转到登陆页面
//       if (!getToken(__auth_refresh_token_key__)) {
//         redirectLogin();
//         throw (new Error('登录失效，请重新登录'));
//       }
//       if (!refreshing) {
//         refreshing = true; // 标记正在刷新
//         return refreshToken().then(res => {
//           if (!res.data.success) {
//             throw new Error('刷新token失败');
//           }
//           const {token, expires, refresh_token} = res.data.data;
//           setAuthToken(token, expires, refresh_token);
//           cacheRequest.forEach(fn => fn());
//           cacheRequest = [];
//           return request(error.config).then(res => {
//             return res;
//           });
//         }).catch(error => {
//           store.commit('auth/updateUser', null);
//           redirectLogin();
//           return Promise.reject(error);
//         }).finally(() => {
//           refreshing = false; // 刷新完成
//         });
//       }
//       // 如果正在刷新refresh_token，将请求缓存起来，等待刷新完成后再发起请求
//       return new Promise(resolve => {
//         // error.config就是拦截请求的配置
//         cacheRequest.push(() => {
//           resolve(request(error.config));
//         });
//       });
//     }
//   }
//   return Promise.reject(error);
// });
instance.interceptors.response.use((response) => {
  // 200状态码会进入成功回调
  // 业务逻辑错误，success为false
  console.log('response');
  console.log(response)
  return response.data;
}, (error) => {
  console.log('拦截器的error')
  console.log(error)
  const status = error?.response?.status;
  if (error?.response?.status === 401) {
    // 如果返回401，并且不存在refreshToken，则跳转到登陆页面
    redirectLogin();
  } else {
    return error?.response?.data?.error;
  }
});

const request = (config = {}) => {
  return new Promise((resolve, reject) => {
    config = {
      ...config,
      headers: {
        "Content-Type": "application/json"
      }
    };
    instance.request(config).then(data => {
      if (data?.success) {
        resolve(data?.result);
      } else {
        throw new Error(data?.msg);
      }
    }).catch(error => {
      message.error(error.message || '请求失败');
      reject(error);
    });
  });
};


const postRequest = (url, data, params) => {
  return request({
    url, method: METHOD.POST, data, params
  });
};

const getRequest = (url, params) => {
  return request({
    url, method: METHOD.GET, params
  });
};

const putRequest = (url, data) => {
  return request({
    url, method: METHOD.PUT, data
  });
};

const deleteRequest = (url, params) => {
  return request({
    url, method: METHOD.DELETE, params
  });
};

export {postRequest, getRequest, putRequest, deleteRequest};

export default request;
