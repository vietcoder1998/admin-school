export interface IMajorJobName {
    id: number;
    name: string;
    branch: {
        id?: number;
        name?: string;
    }
}

export interface IMajorJobNames {
    items: Array<IMajorJobNames>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}