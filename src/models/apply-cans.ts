export interface IApplyCan {
    candidate?: {
        id?: string,
        firstName?: string,
        lastName?: string,
        birthday?: 0,
        avatarUrl?: string,
        coverUrl?: string,
        email?: string,
        phone?: string,
        gender?: 'MALE' | 'FEMALE',
        region?: {
            id?: 0,
            name?: string
        },
        address?: string,
        lat?: 0,
        lon?: 0,
        profileVerified?: boolean,
        lookingForJob?: boolean,
        completePercent?: 0,
        unlocked?: boolean,
        saved?: boolean,
        rating?: {
            attitudeRating?: 0,
            skillRating?: 0,
            jobAccomplishmentRating?: 0,
            ratingCount?: 0
        },
        createdDate?: 0
    },
    appliedDate?: 0,
    repliedDate?: 0,
    state?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
    message?: string,
    appliedShifts?: Array<IShift>
}

export interface IShift {
    id?: string,
    startTime?: string,
    endTime?: string,
    minSalary?: number,
    maxSalary?: number,
    unit?: string,
    mon?: boolean,
    tue?: boolean,
    wed?: boolean,
    thu?: boolean,
    fri?: boolean,
    sat?: boolean,
    sun?: boolean
}

export interface IApplyCans {
    items?: Array<IApplyCan>,
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
}