export interface IPendingJob {
    id?: string
    employer?: {
        jobID?: string;
        employerName?: string;
        logoUrl?: string;
    }
    jobID?: string;
    jobName?: {
        id?: number;
        name?: string;
    }
    employerBranchName?: string;
    address?: string
    jobTitle?: string;
    jobType?: string;
    state?: string;
    repliedDate?: number;
    message?: string;
    description?: string;
    createdDate?: number;
};

export interface IGenderData {
    id?: string,
    gender?: 'BOTH' | 'MALE' | 'FEMALE',
    quantity?: number,
}

export interface IShifts {
    endTime?: string;
    startTime?: string;
    genderRequireds?: Array<IGenderData>
    id?: string;
    maxSalary?: number;
    minSalary?: number;
    mon?: boolean;
    sat?: boolean;
    sun?: boolean;
    thu?: boolean;
    tue?: boolean;
    fri?: boolean;
    wed?: boolean;
    unit?: string;
}

export interface IPendingJobDetail {
    createdDate?: number;
    description?: string;
    employerBranchID?: string;
    expirationDate?: number,
    jobNameID?: number
    jobTitle?: string
    jobType?: 'FULLTIME' | 'PARTIME' | 'INTERNSHIP'
    requiredSkillIDs?: Array<number>
    shifts?: Array<any>
    employer?: {
        employerName?: string;
        id?: string;
        logoUrl?: string;
    },
    id?: string;
    jobID?: string
    message?: string
    repliedDate?: number;
    state?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

export interface IPendingJobs {
    list_jobs?: Array<IPendingJob>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}