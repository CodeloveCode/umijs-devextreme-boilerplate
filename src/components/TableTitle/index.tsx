
import React from "react";
import styles from "./index.less";

interface IProps {
    title: string;
}

export default ({ title }: IProps) => (
    <h3 className={styles['dev-table-title']}>{title}</h3>
)