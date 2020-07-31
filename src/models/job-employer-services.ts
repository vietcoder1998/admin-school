export interface IJobEmployerServices {
    allEmployers: boolean,
    employerIDs: String[],
    message: string,
    jobLimitExists: boolean,
    topLimit: number,
    inDayLimit: number,
    highlightLimit: number,
    titleHighlightLimit: number,
    jobLimit: number,
    unlockLimit: number
}