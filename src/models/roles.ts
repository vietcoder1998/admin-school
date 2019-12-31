export interface IRole {
    id?: number;
    name?: string;
    type?: string;
}

export interface IRoles {
    items: Array<IRoles>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    role_detail?: IRole
}