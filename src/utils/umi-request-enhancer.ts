import { getDvaApp, history, request, useStore } from 'umi';
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
export const authorizationRequestInterceptor: RequestInterceptor = (
  url,
  options,
) => {
  // TODO:临时为监控页放行,后期提取成独立模块
  if (url.includes('/monitor')) {
    return { url, options };
  }
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
export const notLoginResponseInterceptor = async (response: Response) => {
  console.log('response: ', response);

  if (!response.status) {
    toLogin();
    return;
  } else {
    if (response.status === 401) {
      toLogin();
      return;
    }
    if (response.status === 403) {
      notifyError('权限不足');
    }
    if (response.status === 200) {
      // 有些时候浏览器的响应是200,但后台接口做了处理,在data.code中返回401未认证,需要做特殊处理.这个clone操作是否太重了???
      const clonedResponse = response.clone(); // 克隆响应对象做解析处理.
      const respData = await clonedResponse.json();
      if (respData.code === 401) {
        toLogin();
        return;
      }
    }
  }

  return response;
};

function toLogin() {
  // 同时清空浏览器和Redux中缓存,防止脏数据,以及可能的死循环.如果以后使用Context保存token,这里也要处理.
  notifyError('尚未登录或者会话超时,即将重新登录...');
  Store.clear();
  getDvaApp()._store.dispatch({ type: 'session/removeSession' });
  setTimeout(() => (window.location.href = '/login'), 500);
}

/**
 * 由于项目的实际后台与umi-request的默认响应的数据结构不一致,因此处理错误时,要告诉它如何包装.
 */
export const errorConfig = {
  adaptor: (resData: any) => {
    return {
      ...resData,
      success: resData?.code === 200,
      errorMessage: resData?.message ?? '未知错误',
    };
  },
};
