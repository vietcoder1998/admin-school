import { ISkill } from './skills';

export interface ILanguageSkillStudent {
    id?: string,
    language?: {
        id?: number,
        name?: string
    },
    level?: string,
    certificate?: string,
    score?: number
};

export interface IExperienceStudent {
    id?: string,
    jobName?: string,
    companyName?: string,
    startedDate?: number,
    finishedDate?: number,
    description?: string
};

export default interface IStudentDetail {
    id?: string,
    firstName?: string,
    lastName?: string,
    birthday?: number,
    avatarUrl?: string,
    email?: string,
    phone?: string,
    gender?: 'MALE' | 'FEMALE',
    region?: {
        id?: number,
        name?: string
    },
    address?: string,
    coverUrl?: string,
    description?: string,
    lat?: number,
    identityCard?: string,
    lon?: number,
    profileVerified?: false,
    lookingForJob?: false,
    completePercent?: number,
    unlocked?: false,
    identityCardFrontImageUrl?: string,
    rating?: {
        attitudeRating?: number,
        skillRating?: number,
        jobAccomplishmentRating?: number,
        ratingCount?: number
    },
    identityCardBackImageUrl?: string,
    school?: {
        id?: string,
        name?: string,
        shortName?: string,
        logoUrl?: string,
        schoolType?: {
            id?: number,
            name?: string,
            priority?: number
        }
    },
    major?: {
        id?: number,
        name?: string,
        branch?: {
            id?: number,
            name?: string
        }
    },
    schoolYearStart?: number,
    schoolYearEnd?: number,
    skills?: Array<ISkill>,
    studentCode?: string,
    createdDate?: number,
    languageSkills?: Array<ILanguageSkillStudent> ,
    experiences?: Array<IExperienceStudent>
};