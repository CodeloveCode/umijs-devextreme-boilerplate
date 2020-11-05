import { ajaxDelete, ajaxGet, ajaxPost, ajaxPut } from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';

const base_url_java_two_table = getUrlByName('base_url_java_two_table');

const urlIndicatorValue = base_url_java_two_table + '/api/v1/chartData';

/**
 * 添加
 */
export async function save(param: ChartData): Promise<boolean> {
  const resp = await ajaxPost(urlIndicatorValue, param);
  if (resp.code === 200) {
    return true;
  } else {
    throw new Error(resp.msg);
  }
}

/**
 * 修改
 */
export async function edit(id: string, param: ChartData,
): Promise<boolean> {
  const url = `${urlIndicatorValue}/${id}`
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
  const url = `${urlIndicatorValue}/${id}`;
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
export async function getList(): Promise<ChartData[]> {
  const resp = await ajaxGet(urlIndicatorValue);
  if (resp.code == 200) {
    return resp.data;
  } else {
    throw new Error(resp.msg);
  }
}


export interface ChartData {
  /**
   * 修改时需要,添加时不传.
   */
  id?: string;
  name: string;
  type: string;
  value: number;
}