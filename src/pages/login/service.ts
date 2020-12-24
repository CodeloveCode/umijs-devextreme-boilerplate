import Store from '../../utils/store';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import { ajaxDelete, ajaxGet, ajaxPost } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';
import { UserSession } from './DTO';

const base_url_login = getUrlByName('base_url_login');

const url_login = base_url_login + '/api/Login/Login';

/**
 * 获取用户基本信息、app列表、app菜单权限等。
 * @param token 已登录用户获发的令牌.
 */
export async function fetchUserInfo(token: string): Promise<UserSession> {
  const resp = await ajaxGet(url_login);
  console.log('resp:', resp);
  if (resp.code === 200) {
    const userSession: UserSession = {
      token: token,
      profile: resp.data,
    };
    Store.set(LOGINED_USER_SESSION, userSession);
    return userSession;
  } else {
    throw new Error('not found');
  }
}

/**
 * @deprecated 此后台接口尚未提供.
 */
export async function deleteSession() {
  const resp = await ajaxDelete(url_login);
  // const resp = await request(url_logout, { method: 'DELETE' });

  Store.remove(LOGINED_USER_SESSION);
  if (resp.code === 200) {
    return true;
  }
}
