export interface IStudentsFilter {
    email: string,
    phone: string,
    gender: string,
    birthYearStart: number,
    birthYearEnd: number,
    regionID: number,
    lookingForJob: boolean,
    profileVerified: boolean,
    majorIDs: Array<number>,
    schoolYearStart: number,
    schoolYearEnd: number,
    skillIDs: Array<number>,
    languageIDs: Array<number>,
    schoolID: string,
    employerID: string,
    unlocked: boolean,
    ids: Array<string>,
    createdDate: number
}

export interface IStudent {
    id: string,
    firstName: string,
    lastName: string,
    birthday: number,
    avatarUrl: string,
    email: string,
    phone: string,
    gender: 'MALE' | 'FEMALE',
    region: {
        id: number,
        name: string
    },
    address: string,
    lat: number,
    lon: number,
    profileVerified: boolean,
    lookingForJob: boolean,
    completePercent: number,
    unlocked: boolean,
    rating: {
        attitudeRating: number,
        skillRating: number,
        jobAccomplishmentRating: number,
        ratingCount: number
    },
    school: {
        id: string,
        name: string,
        shortName: string,
        logoUrl: string,
        schoolType: {
            id: number,
            name: string,
            priority: number
        }
    },
    major: {
        id: number,
        name: string,
        branch: {
            id: number,
            name: string
        }
    },
    schoolYearStart: number,
    schoolYearEnd: number,
    studentCode: string,
    createdDate: number
}

export interface IStudents {
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
    items?: Array<IStudent>
}