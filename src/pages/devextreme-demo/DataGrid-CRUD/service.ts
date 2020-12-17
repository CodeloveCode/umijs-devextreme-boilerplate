import { DTOResponse } from '@/configs/structure/ServerResp';
import {
    ajaxGet,
    ajaxPost,
    ajaxDelete,
    ajaxPut,
} from '@/utils/axiosEnhancer';
import { getUrlByName } from '@/utils/configsReader';

const hostname = getUrlByName('portal_system_url');

const urlWorkMaster = hostname + '/action/xxx';

export async function getList(
): Promise<any[]> {
    let url = ''
    const resp: DTOResponse = await ajaxGet(url);
    if (resp.success) {
        // return resp.data;
        // 假数据
        return []
    } else {
        throw new Error(resp.message);
    }
}

export async function add(param: any): Promise<string> {
    const resp: DTOResponse = await ajaxPost(urlWorkMaster, param);
    if (resp.success) {
        return resp.data;
    } else {
        throw new Error(resp.message);
    }
}

export async function remove(id: string): Promise<boolean> {
    let url = '';
    const resp: DTOResponse = await ajaxDelete(url);
    if (resp.success) {
        return resp.data;
    } else {
        throw new Error(resp.message);
    }
}

export async function edit(id: string, param: any): Promise<boolean> {
    let url = '';
    const resp: DTOResponse = await ajaxPut(url, param);
    if (resp.success) {
        return true;
    } else {
        throw new Error(resp.message);
    }
}
