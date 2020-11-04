import Store from '../../utils/store';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import { ajaxDelete, ajaxGet, ajaxPost } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';
import { UserSession } from './DTO';

const base_url_login = getUrlByName('base_url_login');

const url_login = base_url_login + '/api/Login/Login';

/**
 * 
 * @param token 
 * @returns {{
  "code": 200,
  "message": "操作成功！",
  "data": {
    "userId": "1300640677205389312",
    "mobile": "15850669514",
    "mailbox": "610009787@qq.com",
    "workNumber": "tucci",
    "userName": "tucci",
    "company": "南京维思凯",
    "companyId": "1300243876568641536",
    "departmentName": "1300249736699256832",
    "departmentId": "1300249736699256832",
    "staffPhoto": "https://timgsa.baidu.com/timg?F01300000194285122188000535877.jpg",
    "level": "coAdmin",
    "permissions": {
      "apis": [
        "POINT-DELETE"
      ],
      "menus": [],
      "apps": [
        "1316643721167777792"
      ],
      "points": []
    },
    "authCacheKey": null
  }
}} userInfo
 */
export async function fetchUserInfo(token: string): Promise<UserSession> {
  const resp = await ajaxGet(url_login);
  console.log('resp:', resp);
  if (resp.code === 200) {
    const userInfo: UserSession = {
      token: token,
      profile: resp.data,
    };
    Store.set(LOGINED_USER_SESSION, userInfo);
    return userInfo;
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
