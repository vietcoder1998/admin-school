export interface IPendingJob {
    id: string
    employer: {
        jobID?: string;
        employerName?: string;
        logoUrl?: string;
    }
    jobID: string;
    jobName: {
        id?: number;
        name?: string;
    }
    employerBranchName?: string;
    address?: string
    jobTitle?: string;
    jobType?: string;
    createdDate: number;
    state?: string;
    repliedDate?: number;
    message?: string;
}

export interface IPendingJobs {
    list_jobs?: Array<IPendingJob>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}