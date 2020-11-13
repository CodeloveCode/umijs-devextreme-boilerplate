import React from 'react';
import Access from '@/components/Access';
import { canAccess } from '@/components/Access/AccessControl';
// 测试: 根据后台的按钮权限 控制按钮的显示和隐藏.

export default () => {
    const onDel = () => {
        if (canAccess('perm-del-res')) {
            alert('允许删除,删除中...')
        }
    }

    return (
        <>
            <Access permission={'perm-add-res'}>
                <button>添加</button>
            </Access>
            <Access permission={'perm-edit-res'} fallback={'你没有修改的权限'}>
                <button>编辑</button>
            </Access>
            <button onClick={onDel}>删除</button>
        </>
    )
}