export interface IUserController {
    id?: string,
    username?: string,
    email?: string,
    createdDate?: number,
    lastActive?: number,
    activated?: boolean,
    banned?: boolean
}

export interface IUserControllers {
    items?: Array<IUserController>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}