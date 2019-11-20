export interface IRole {
    id?: number;
    name?: string;
    type?: string;
}

export interface IAdminAccounts {
    items: Array<IAdminAccounts>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    role_detail?: IRole
}