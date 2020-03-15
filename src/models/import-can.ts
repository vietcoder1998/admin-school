export default interface IImportCan {
    sheet?: Array<number>,
    startRow?:number,
    endRow?: number,
    starColumn?:number,
    endColumn?: number,
    commentErrorToFile?: boolean,
    removeImportedRowFromFile?: boolean,
}