import { IShiftDetail } from './job-annoucement-detail';
export default interface IJobDetail {
    jobTitle?: string;
    jobName?: string;
    employerName?: string;
    jobType?: string;
    createdDate?: number;
    expriratedDate?: number;
    description?: string;
    shifts?: Array<IShiftDetail>;
    requiredSkills?: Array<any>;
    employerUrl?: string;
}