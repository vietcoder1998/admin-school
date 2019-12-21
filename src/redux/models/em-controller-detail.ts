export interface IEmControllerDetail {
    id?: string,
    employerName?: string,
    email?: string,
    phone?: string,
    address?: string,
    region?: {
        id?: number,
        name?: string
    },
    lat?: number,
    lon?: number,
    logoUrl?: string,
    coverUrl?: string,
    taxCode?: string,
    description?: string,
    identityCardFrontImageUrl?: string,
    identityCardBackImageUrl?: string,
    rating?: {
        workingEnvironmentRating?: number,
        salaryRating?: number,
        ratingCount?: number
    },
    profileVerified?: boolean;
}