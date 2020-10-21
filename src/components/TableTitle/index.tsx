
import React from "react";
import styles from "./index.less";

interface IProps {
    children: React.ReactNode;
    // title: string | React.ReactNode;
}

/**
 * 适合作为标题使用.
 * @example
 * <TableTitle>维修工单详情</TableTitle>
 * <DataGrid>...</DataGrid>
 * 
 * <TableTitle><i class="dx-icon-user"/></TableTitle>
 */
export default (props: IProps) => (
    <h3 className={styles['dev-table-title']}>{props.children}</h3>
);
