export interface IJobName {
    id?: number;
    name?: string;
    priority?: string;
};

export interface IJobNames {
    items: Array<IJobName>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}
