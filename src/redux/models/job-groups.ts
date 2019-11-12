export interface IJobGroup {
    id: number;
    name: string;
}

export interface IJobGroups {
    items: Array<IJobGroup>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
}