import React from 'react';
import { Access } from '@/components/Access';
import { canAccess } from '@/components/Access/AccessControl';
import { PERMISSIONS } from '@/configs/configs';

// 测试: 根据后台的按钮权限 控制按钮的显示和隐藏.

export default () => {
    const onDel = () => {
        if (canAccess(PERMISSIONS.CAN_DELETE)) {
            alert('允许删除,删除中...')
        } else {
            alert('你没有删除的权限...')
        }
    }

    return (
        <>
            <Access permission={PERMISSIONS.CAN_ADD}>
                <button onClick={() => alert('do something...')}>添加</button>
            </Access>
            <Access permission={'perm-edit-res'} fallback={<button>没有权限</button>}>
                <button>编辑</button>
            </Access>
            <Access permission={'perm-edit-query'}>
                <button>查询</button>
            </Access>
            <button onClick={onDel}>删除</button>
        </>
    )
}