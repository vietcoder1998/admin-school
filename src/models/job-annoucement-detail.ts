export interface IShiftDetail {
    id?: string|number,
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
    genderRequireds?: Array<{
        id?: string
        gender?: 'MALE' | 'FEMALE' | 'BOTH',
        quantity?: number,
        applied?: number,
    }>
}

export interface IJobAnnouncementDetail {
    data?: any;
    id?: string,
    employerCoverUrl?: string,
    jobName?: {
        id?: number,
        name?: string,
        jobGroup?: {
            id?: number,
            name?: string,
            priority?: number
        }
    },
    description?: string,
    jobTitle?: string,
    address?: string,
    requiredSkills?: Array<{ id?: number, name?: string }>;
    region?: {
        id?: number,
        name?: string
    },
    shifts?: Array<IShiftDetail>,
    atHeadquarters?: boolean,
    lat?: number,
    lon?: number,
    employerBranchID?: string,
    employerBranchName?: string,
    employerID?: string,
    employerName?: string,
    employerLogoUrl?: string,
    createdDate?: number,
    expired?: boolean,
    expirationDate?: number,
    timeLeft?: string,
    jobType?: "FULLTIME" | "PARTTIME" | "INTERNSHIP",
    pendingApplied?: number,
    acceptedApplied?: number,
    rejectedApplied?: number,
    appliedCount?: number,
    suitableCount?: number,
    disable?: boolean,
    hidden?: boolean,
    enableNotification?: boolean,
    priority?: {
        homePriority?: string,
        homeExpired?: boolean,
        homeExpiration?: number,
        homeTimeLeft?: string,

        searchPriority?: string,
        searchExpired?: boolean,
        searchExpiration?: number,
        searchTimeLeft?: string
    }
}