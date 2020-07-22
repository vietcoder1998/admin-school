export default interface IWorkingTools {
    pageIndex: number;
    pageSize: number;
    items?: Array<IWorkingTool>
    totalItems?: number;
}

export interface IWorkingTool {
    id?: number;
    name?: string;
}