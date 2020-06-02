export interface IEventEm {
    id?: number,
    employer?: {
        id?: string,
        employerName?: string,
        logoUrl?: string,
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
    bannerUrl?: string,
    bannerPriority?: string,
    priority?: string,
    createdDate?: number
}

export interface IEventEms {
    items?: Array<IEventEm>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}

export interface IEventEmsFilter {
    bannerPriority?: string,
    priority?: string,
    createdDate?: 0,
    shuffle?: boolean
}

export interface IEventEmFilter {
    eid?: string;
    sid?: string;
    bannerPriority?: string,
    priority?: string,
    createdDate?: number,
    shuffle?: boolean
}