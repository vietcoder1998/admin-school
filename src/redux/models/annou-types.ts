export interface IAnnouType{
    id: number;
    name: string;
    priority: number;
    targets: Array<string>;
}

export interface IAnnouTypes {
    items: Array<IAnnouType>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    single_data: IAnnouType
}