import { ajaxDelete, ajaxGet, ajaxPost, ajaxPut } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';

const base_url_java_two_table = getUrlByName('base_url_java_two_table');

const api = {
  indicatorValue: base_url_java_two_table + '/api/v1/indicatorValue',
};

/**
 * 添加
 */
export async function save(
  param: IndicatorValue,
): Promise<boolean> {
  const resp = await ajaxPost(api.indicatorValue, param);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

/**
 * 修改
 */
export async function edit(id: string, param: IndicatorValue,
): Promise<boolean> {
  const url = `${api.indicatorValue}/${id}`
  const resp = await ajaxPut(url, param);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

/**
 * 删除
 */
export async function delById(id: number): Promise<boolean> {
  const url = `${api.indicatorValue}/${id}`;
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
export async function getList(): Promise<IndicatorValue[]> {
  const resp = await ajaxGet(api.indicatorValue);
  if (resp.code == 200) {
    return resp.data;
  } else {
    throw new Error(resp.msg);
  }
}


export interface IndicatorValue {
  /**
   * 修改时需要,添加时不传.
   */
  id?: string;
  name: string;
  value: number;
}