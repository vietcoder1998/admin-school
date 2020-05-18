export interface IEventSchoolFilter {
    schoolID: string,
    createdDate: number,
    startedDate: number,
    finishedDate: number,
    started: false,
    finished: false
}

export interface IEventSchool {
    id: string,
    school: {
        id: string,
        name: string,
        shortName: string,
        educatedScale: number,
        region: {
            id: number,
            name: string
        },
        schoolType: {
            id: number,
            name: string,
            priority: number
        },
        email: string,
        phone: string,
        logoUrl: string,
        address: string,
        lat: number,
        lon: number,
        createdDate: number
    },
    name: string,
    bannerUrl: string,
    startedDate: number,
    finishedDate: number,
    createdDate: number
}

export interface IEventSchools {
    items?: Array<IEventSchool>,
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}