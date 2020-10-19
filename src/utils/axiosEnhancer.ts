import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Store from './store';
import notify from 'devextreme/ui/notify';
import { LOGINED_USER_SESSION } from '@/common/constants';
import {
  alertSuccess,
  alertWarning,
  confirmNotify,
  notifyError,
} from './devExtremeUtils';
import { getDvaApp } from 'umi';
import ServerResp from '@/common/structure/ServerResp';
// import { history } from 'umi';

const HttpStatusEnum = [
  { status: 200, desc: '服务器成功返回请求的数据。', name: '' },
  { status: 201, desc: '新建或修改数据成功。', name: '' },
  { status: 202, desc: '一个请求已经进入后台排队（异步任务）。', name: '' },
  { status: 204, desc: '删除数据成功。', name: '' },
  {
    status: 400,
    desc: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    name: '',
  },
  { status: 401, desc: '用户没有权限（令牌、用户名、密码错误）。', name: '' },
  {
    status: 403,
    desc: '用户得到授权，但是访问是被禁止的。(权限不足)',
    name: '',
  },
  {
    status: 404,
    desc: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    name: '',
  },
  { status: 406, desc: '请求的格式不可得。', name: '' },
  { status: 410, desc: '请求的资源被永久删除，且不会再得到的。', name: '' },
  { status: 422, desc: '当创建一个对象时，发生一个验证错误。', name: '' },
  { status: 500, desc: '服务器发生错误，请检查服务器。', name: '' },
  { status: 502, desc: '网关错误。', name: '' },
  { status: 503, desc: '服务不可用，服务器暂时过载或维护。', name: '' },
  { status: 504, desc: '网关超时。', name: '' },
];

const axiosInstance = _axios.create({
  //自动给请求的url加上webpack.xx.config.js中配置的url前缀.
  // baseURL: `${process.env.BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  responseType: 'json',
  timeout: 3000000, // 超时时间.毫秒
  withCredentials: false, // 跨域请求,是否携带cookie
});

/**
 * 请求拦截器.
 * 1.在request-header中存入已登录用户的Authorization.后续接口都需要.
 */
axiosInstance.interceptors.request.use(
  function (config) {
    // if (Store.get(LOGINED_USER_SESSION)?.token) {
    //   config.headers['Authorization'] = Store.get(LOGINED_USER_SESSION).token;
    // }

    return config;
  },
  function (error) {
    // 对请求错误做些什么(服务器没收到请求)
    console.log('axios request error: ', error);
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器.对401,403进行处理.
 * //2xx响应.  response.status === 2xx
    // 这里约定服务器返回的响应体必须是{code,message,data}的格式.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // 后台接口做了处理,401时返回的也是200,需要在这里处理.
    if (response.data.code === 401) {
      toLogin();
      return Promise.reject(new Error(response.data.message));
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error === undefined || error.code === 'ECONNABORTED') {
      notifyError('服务请求超时');
      return Promise.reject(error);
    }

    const response: AxiosResponse = error.response;
    if (response) {
      const { status, statusText } = response;
      const errorText =
        HttpStatusEnum.find(item => item.status === status)?.desc ?? statusText;

      if (status === 401) {
        toLogin();
        return Promise.reject(error);
      }

      if (status === 403) {
        alertWarning(errorText ?? '权限不足...');
        return Promise.reject(error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      toLogin();
      return Promise.reject(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);

    return Promise.reject(error);
  },
);

function toLogin() {
  // todo:等做登陆时再放开.
  // alertWarning('尚未登录或者会话超时,即将重新登录...');
  // Store.clear();
  // getDvaApp()._store.dispatch({ type: 'session/removeSession' });
  // window.location.href = '/login';
}

/**
 * 发送Post请求.
 * @param url 
 * @param data js字面量对象.(json)
 * @param config 其他Http Request配置.
 * @example ```
 * return ajaxPost('http://www.students.com/student', {name:'lily',gender:'female'}).then(isSuccess=>{
 *  console.log(`result: ${isSuccess}`)
 *  return isSuccess
 * })
 * ```
 */
const ajaxPost = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<any> {
  const response = await axiosInstance.post(url, data, config);
  return response.data;
};

/**
 * 发送Get请求.
 * @param url
 * @param config 其他Http Request配置.
 * @example ```
 * const id = '1234'
 * const url = `http://www.students.com/student/${id}`
 * return ajaxGet(url).then(student=>{
 *     return student
 * })
 * ```
 */
const ajaxGet = async function (
  url: string,
  config?: AxiosRequestConfig,
): Promise<any> {
  const response = await axiosInstance.get(url, config);
  return response.data;
};

/**
 * 发送Put请求.
 * @param url
 * @param data js字面量对象.(json)
 * @param config 其他Http Request配置.
 * @example ```
 * const id = '1234'
 * const url = `http://www.students.com/student/${id}`
 * return ajaxPut(url,{name:'lily',gender:'female'}).then(updatedStudent=>{
 *     return updatedStudent
 * })lose resource...
 * })
 * ```
 */
const ajaxPut = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<any> {
  const response = await axiosInstance.put(url, data, config);
  return response.data;
};

/**
 * 发送Delete请求.
 * @param url
 * @param config 其他Http Request配置.
 * @example ```
 * const id = '1234'
 * const url = `http://www.students.com/student/${id}`
 * return ajaxDelete(url).then(isSuccess=>{
 *     return isSuccess
 * })
 * ```
 */
const ajaxDelete = async function (
  url: string,
  config?: AxiosRequestConfig,
): Promise<any> {
  const response = await axiosInstance.delete(url, config);
  return response.data;
};

export { ajaxGet, ajaxPost, ajaxPut, ajaxDelete };
