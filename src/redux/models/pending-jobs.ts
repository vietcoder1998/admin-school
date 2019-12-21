export interface IPendingJob {
    id?: string
    employer?: {
        id: string,
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
    applied?: number
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


export interface IPendingJobs {
    items?: Array<IPendingJob>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}

export interface IShifts {
    id?: string,
    startTime?: string,
    endTime?: string,
    minSalary?: number,
    maxSalary?: number,
    unit?: string | 'ca' | 'giờ' | 'ngày' | 'tháng' | 'sản phẩm',
    mon?: boolean,
    tue?: boolean,
    wed?: boolean,
    thu?: boolean,
    fri?: boolean,
    sat?: boolean,
    sun?: boolean,
    genderRequireds?: Array<IGenderData>
}

export interface IAnnoucementBody {
    id?: string,
    jobTitle?: string,
    jobNameID?: number,
    employerBranchID?: string,
    description?: string,
    requiredSkillIDs?: Array<any>,
    jobType?: string,
    expirationDate?: number,
    shifts?: Array<IShifts>
}