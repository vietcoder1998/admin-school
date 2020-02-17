import { IShiftDetail } from './job-annoucement-detail';
export interface IPendingJobDetail {
    employer?: {
        employerName?: string,
        id?: string,
        logoUrl?: string,
        profileVerified?: boolean
    },
    data?: {
        employerBranchID?: string,
        description?: string,
        expirationDate?: number,
        jobNameID?: string,
        jobTitle?: string,
        jobType?: string,
        requiredSkillIDs?: [],
        shifts?: Array<IShiftDetail>,
    },
    id?: string,
    jobID?: string,
    message?: string,
    repliedDate?: number,
    state?: string,
    createdDate?: number
}