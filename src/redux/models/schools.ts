export interface ISchoolsFilter {
    name?: string,
    shortName?: string,
    educatedScale?: number,
    regionID?: number,
    schoolTypeID?: number,
    email?: string,
    employerID?: string,
    connected?: boolean,
    createdDate?: number
}

export interface ISchool {
    id?: string,
    name?: string,
    shortName?: string,
    educatedScale?: number,
    region?: {
        id?: number,
        name?: string
    },
    schoolType?: {
        id?: number,
        name?: string,
        priority?: number
    },
    email?: string,
    phone?: string,
    logoUrl?: string,
    address?: string,
    lat?: number,
    lon?: number,
    createdDate?: number
}

export interface ISchools {
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
    items?: Array<ISchool>
}