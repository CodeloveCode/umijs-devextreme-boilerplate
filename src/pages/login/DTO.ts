/**
 * 用户配置.
 */
export interface UserProfile {
    userId: string;
    mobile: string;
    mailbox: string;
    workNumber: string;
    userName: string;
    company: string;
    companyId: string;
    departmentName: string;
    departmentId: string;
    staffPhoto: string;
    level: string;
    /**
         * 当前用户拥有的权限.注意各app的权限是隔离的
         */
    permissions: {
        apps: any[];
        menus: string[];
        points: string[];
        apis: string[];
    }
}

/**
 * 用户会话信息.
 */
export interface UserSession {
    token?: string;
    profile: UserProfile;
}