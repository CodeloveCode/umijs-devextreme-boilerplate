import { ajaxDelete, ajaxGet, ajaxPost, ajaxPut } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';
import { SysPermissionSaveVO, SysPermissionVO } from './API';

const base_url_system_mgmt = getUrlByName('system_mgmt');

const urlPermission = base_url_system_mgmt + '/permission';
const urlPermissions = base_url_system_mgmt + '/permissions';

export async function add(param: SysPermissionSaveVO): Promise<boolean> {
  const resp = await ajaxPost(urlPermission, param);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

export async function edit(id: string, param: SysPermissionSaveVO,
): Promise<boolean> {
  const url = `${urlPermission}/${id}`
  const resp = await ajaxPut(url, param);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

export async function delById(id: number): Promise<boolean> {
  const url = `${urlPermission}/${id}`;
  const resp = await ajaxDelete(url);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

/**
 * 查询列表
 */
export async function getList(): Promise<SysPermissionVO[]> {
  const resp = await ajaxGet(urlPermissions);
  if (resp.code == 200) {
    return resp.data;
  } else {
    throw new Error(resp.msg);
  }
}