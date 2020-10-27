import Store from '../../utils/store';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import { ajaxDelete, ajaxGet, ajaxPost } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';

const uri = getUrlByName('uri')
const url_login = uri + '/portal/user/login';
// const url_profile = uri + '/sys/profile';
// const url_logout = uri + '/sys/logout';
// const url_userList = uri + '/sys/user';

/**
 * 
 * @param account 
 * @param password 
 * @returns {{
  "code": 200,
  "message": "操作成功！",
  "data": "a1620edc-2a96-4ec0-9925-75432a494ffe"
}}
 */
export async function signIn(account: string, password: string) {
  // 登陆
  // 获取token
  // 使用token获取用户信息
  // 额外将用户信息保存到sessionStorage中.
  let url = `${url_login}?username=${account}&password=${password}`
  const respData = await ajaxGet(url);

  // const respData = await request(url_login, {
  //   method: 'POST',
  //   data: { account, password, rememberme },
  // });

  let token = null;

  if (respData.code === 200) {
    token = 'Bearer ' + respData.data;
  } else {
    throw new Error(respData.message);
  }

  // const profile = await getProfile(token);

  let userInfo = {
    token: token,
    // ...profile,
  };

  Store.set(LOGINED_USER_SESSION, userInfo);

  return userInfo;
}

/**
 * 根据登陆得到的授权码,获取用户信息.
 * @param token
 */
// async function getProfile(token: string) {
//   const resp = await ajaxPost(url_login, null, { headers: { Authorization: token } });
//   // const resp = await request(url_profile, {
//   //   method: 'POST',
//   //   headers: { Authorization: token },
//   // });

//   if (resp.code === 200) {
//     return resp.data;
//   } else {
//     throw new Error(resp.message);
//   }
// }

export async function deleteSession() {
  const resp = await ajaxDelete(url_login);
  // const resp = await request(url_logout, { method: 'DELETE' });

  Store.remove(LOGINED_USER_SESSION);
  if (resp.code === 200) {
    return true;
  }
}

/**
 * 获取用户列表
 * @param token
 */
// export async function getUserList(token: string) {
//   const resp = await ajaxGet(url_userList);
//   // const resp = await request(url_userList, {
//   //   method: 'GET',
//   //   headers: { Authorization: token },
//   // });

//   if (resp.code === 200) {
//     return resp.data;
//   } else {
//     throw new Error(resp.message);
//   }
// }
