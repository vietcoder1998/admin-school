export interface ITypeManagement {
    id: number;
    name: string;
    priority: number;
    targets: Array<string>;
}

export interface ITypeManagements {
    items: Array<ITypeManagement>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
    single_data: ITypeManagement
}