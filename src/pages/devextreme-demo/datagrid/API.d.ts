// declare namespace API {
export interface SysPermissionSaveVO {
    // 权限的唯一代码
    code: string
    // 描述
    description: string
    name: string
    // 父级权限的ID, 如果是顶级节点,约定为0
    parentId: string
    // 权限类型.菜单、url等
    type: string
    url: string
}

export interface SysPermissionVO {
    permId: string
    code: string
    name: string
    description: string
    parentId: string
    type: string
    url: string
    sort: number
    available: boolean
    createTime: string
}
// }