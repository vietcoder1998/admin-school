export interface IAnnouTypes {
    id: number;
    name: string;
    priority: number;
    targets: Array<string>;
}

export interface IAnnouTypess {
    items: Array<IAnnouTypes>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    single_data: IAnnouTypes
}