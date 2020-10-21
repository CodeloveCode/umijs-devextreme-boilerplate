import { ajaxDelete, ajaxPost } from '@/utils/axiosEnhancer'



const base_url = 'http://118.31.184.21:9006/'

// 查询vsky目录的数据.
const urlGetDocuments = base_url + '/oss/document/vsky'
const urlDeleteDocument = base_url + '/oss/document/delete'


export async function deleteDocument(id: string): Promise<boolean> {
    const url = `${urlDeleteDocument}?id=${id}&type=vsky`
    const resp = await ajaxDelete(urlDeleteDocument)
    if (resp.code === 200) {
        return true
    } else {
        throw new Error(resp.message)
    }
}

export async function getDocuments(): Promise<Array<Document>> {
    const resp = await ajaxPost(urlGetDocuments)
    if (resp.code === 200) {
        return resp.data
    } else {
        throw new Error(resp.message)
    }
}

interface Document {
    id: string
    name: string
    size: number
    isDirectory: boolean
    items: Document[]
}