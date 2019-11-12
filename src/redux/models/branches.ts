export interface IBranch {
    id: number;
    name: string;
}

export interface IBranches {
    items: Array<IBranch>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
}