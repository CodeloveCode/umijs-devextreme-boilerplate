import { getDvaApp, history, useStore } from 'umi';
import { RequestInterceptor } from 'umi-request';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import Store from './store';
import { notifyError } from './devExtremeUtils';

// https://umijs.org/zh-CN/plugins/plugin-request#运行时配置

/**
 * 授权凭证拦截器.
 * umi-request拦截器.
 * 每次发起请求时,检查sessionStorage中已登录用户的token.写入http-header中({"Authorization":token}).后台的shiro会校验此授权码.
 */
export const authorizationRequestInterceptor: RequestInterceptor = (url, options) => {

  if (Store.get(LOGINED_USER_SESSION)?.token) {
    options.headers = {
      ...options.headers,
      Authorization: Store.get(LOGINED_USER_SESSION).token,
    };
  }

  return {
    url,
    options: { ...options, interceptors: true },
  };
};

/**
 * 处理401(未授权)响应,跳转登陆页.
 * 处理403 权限不足.弹出一个提示tip.
 * @param url
 * @param options
 */
export const notLoginResponseInterceptor = async (response: any) => {
  // 克隆响应对象做解析处理.  // 后台接口做了处理,401时返回的也是200,需要在这里处理.
  const respData = await response.clone().json();

  if (!response.status || response.status === 401 || respData.code === 401) {
    // 同时清空浏览器和Redux中缓存,防止脏数据,以及可能的死循环.如果以后使用Context保存token,这里也要处理.
    notifyError('尚未登录或者会话超时,即将重新登录...')
    Store.clear();
    getDvaApp()._store.dispatch({ type: 'session/removeSession' });
    // history.push('/login');
    setTimeout(() => window.location.href = '/login', 500);
  }
  if (response.status === 403) {
    notifyError('权限不足');
  }
  return response;
};

/**
 * 由于项目的实际后台与umi-request的默认响应的数据结构不一致,因此处理错误时,要告诉它如何包装.
 */
export const errorConfig = {
  adaptor: (resData: any) => {
    return {
      ...resData,
      success: resData.code === 200,
      errorMessage: resData.message,
    };
  },
};
