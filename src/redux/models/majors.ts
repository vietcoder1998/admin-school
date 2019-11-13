export interface IMajor {
    id: number;
    name: string;
    branch: {
        id?: number;
        name?: string;
    }
}

export interface IMajors {
    items: Array<IMajors>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}