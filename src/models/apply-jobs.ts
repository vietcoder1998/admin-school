export interface IApplyJobs {
    items?: Array<any>,
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
}

export interface IApplyJob {
    id?: string,
    state?: string,
    message?: string,
    createdDate?: number,
    repliedDate?: number,
    job?: {
        id?: string,
        jobName?: {
            id?: number,
            name?: string,
            jobGroup?: {
                id?: number,
                name?: string,
                priority?: number
            }
        },
        jobTitle?: string,
        address?: string,
        region?: {
            id?: number,
            name?: string
        },
        lat?: number,
        lon?: number,
        distance?: number,
        employerBranchID?: string,
        employerBranchName?: string,
        employerID?: string,
        employerName?: string,
        employerLogoUrl?: string,
        employerVerified?: number,
        createdDate?: number,
        expirationDate?: number,
        timeLeft?: string,
        priority?: [
            string
        ],
        jobType?: string,
        applyState?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
        offerState?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
        saved?: number,
        schoolIgnored?: number,
        schoolConnected?: number
    }
}