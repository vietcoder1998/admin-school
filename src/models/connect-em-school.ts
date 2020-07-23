export interface IConnectEmSchoolFilter {
    name?: string,
    regionID?: number,
    headquarters?: boolean,
    hasRequest?: boolean,
    state?: string,
    id?: string,
}

export interface IConnectEmSchool {
    employer?: {
        id?: string,
        employerName?: string,
        logoUrl?: string,
        coverUrl?: string,
        region?: {
            id?: number,
            name?: string
        },
        address?: string,
        lat?: number,
        lon?: number,
        phone?: string,
        email?: string,
        taxCode?: string,
        profileVerified?: boolean,
        createdDate?: number
    },
    state?: string,
    createdDate?: number,
    replyDate?: number
}

export default interface IConnectEmSchools {
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
    items?: Array<IConnectEmSchool>
}