export interface IJobSuitableCandidate {
    id: string,
    firstName: string,
    lastName: string,
    birthday: number,
    avatarUrl: string,
    coverUrl: string,
    email: string,
    phone: string,
    gender: 'MALE'|'FEMALE',
    region: {
        id: number,
        name: string
    },
    address: string,
    lat: number,
    lon: number,
    profileVerified: false,
    lookingForJob: false,
    completePercent: number,
    unlocked: false,
    saved: false,
    rating: {
        attitudeRating: number,
        skillRating: number,
        jobAccomplishmentRating: number,
        ratingCount: number
    },
    createdDate: number
}

export interface IJobSuitableCandidates {
    items?: Array<IJobSuitableCandidate>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}
