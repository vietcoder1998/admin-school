import { IRegion } from '../../redux/models/regions';

export interface ISkill {
    id?: number;
    name?: string
}

export interface ILanguageSkill {
    id?: string;
    language?: {
        id?: number;
        name?: string
    };
    level?: string;
    certificate?: string;
    score?: number
}

export interface IExperience {
    id?: string;
    jobName?: string;
    companyName?: string;
    startedDate?: number;
    finishedDate?: number;
    description?: string
}

export interface IEducation {
    id?: string;
    school?: string;
    branchOfLearning?: string;
    startedDate?: number;
    finishedDate?: number;
    description?: string
}

export interface IJobNames {
    id?: number;
    name?: string;
    jobGroup: {
        id?: number;
        name?: string;
        priority?: number
    }
}

export interface ICandidateDetail {
    id?: string;
    firstName?: string;
    lastName?: string;
    birthday?: number;
    avatarUrl?: string;
    email?: string;
    phone?: string;
    gender?: "MALE" | "FEMALE";
    region?: IRegion;
    address?: string;
    coverUrl?: string;
    description?: string;
    lat?: number;
    identityCard?: string;
    lon?: number;
    profileVerified?: boolean;
    lookingForJob?: boolean;
    completePercent?: number;
    unlocked?: boolean;
    identityCardFrontImageUrl?: string;
    saved?: boolean;
    identityCardBackImageUrl?: string;
    rating: {
        attitudeRating?: number;
        skillRating?: number;
        jobAccomplishmentRating?: number;
        ratingCount?: number
    } | null | undefined;
    applyState?: "PENDING" | "ACCEPTED" | "REJECTED";
    offerState?: "PENDING" | "ACCEPTED" | "REJECTED";
    skills?: Array<ISkill>;
    languageSkills?: Array<ILanguageSkill>;
    experiences?: Array<IExperience>;
    educations?: Array<IEducation>;
    desiredJobDto?: {
        jobNames?: Array<IJobNames>;
        region?: IRegion;
        address?: string;
        distance?: number;
        lat?: number;
        lon?: number;
        enableNotification?: boolean;
        mode?: string;
        selectedJobGroupID?: number;
        jobType?: "FULLTIME" | "PARTTIME" | "INTERNSHIP";
        mon?: boolean;
        tue?: boolean;
        wed?: boolean;
        thu?: boolean;
        fri?: boolean;
        sat?: boolean;
        sun?: boolean;
        morning?: boolean;
        afternoon?: boolean;
        evening?: boolean
    }
}