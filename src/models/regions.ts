export interface IRegion {
    id: number;
    name: string;
}

export interface IRegions {
    items: Array<IRegion>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}