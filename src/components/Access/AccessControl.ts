import { getDvaApp, SessionModelState } from 'umi';
import { PERMISSIONS } from "../../configs/configs";

/**
 * 检查当前用户是否有授权访问目标资源
 * @param resourcePermission 权限code
 * @example
 * import React from 'react';
 * import { canAccess } from '../../components/Access/AccessControl'
  *  const PageA = props => {
  *  if (canAccess('canDelete')) {
  *      // 如果可以删除，则...
  *  }
  *
  *  return <>TODO</>;
  *  };
  *  export default PageA;
 */
export function canAccess(resourcePermission: string) {
    // 从Redux中取出SessionReducer的state.
    const sessionState = getDvaApp()._store.getState().session as SessionModelState;

    let apis = sessionState.userInfo?.profile?.permissions.apis

    // 为了方便,开发环境直接读取configs.ts中的配置.
    if (process.env.NODE_ENV === 'development') {
        apis = Object.values(PERMISSIONS);
    }

    if (apis && apis.length > 0 && apis.includes(resourcePermission)) {
        return true
    }
    return false
}