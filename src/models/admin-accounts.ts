export interface IAdminAccount {
    id?: string,
    username?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    createdDate?: number,
    lastActive?: number,
    banned?: false,
    role?: {
        id?: number,
        name?: string,
        type?: string,
    }
}

export interface IAdminAccounts {
    items?: Array<IAdminAccount>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
    role_detail?: any;
}