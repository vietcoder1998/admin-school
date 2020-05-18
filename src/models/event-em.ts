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
    schoolEventID?: string;
    expired?: boolean;
    hidden?: boolean;
    jobType?: null | undefined | string;
    homePriority?: string;
    homeExpired?: boolean;
    searchPriority?: string;
    searchExpired?: boolean;
    highlightExpired?: boolean;
    highlight?: string;
    excludedJobIDs?: string;
    jobNameIDs?: string;
    jobGroupIDs?: string;
    hasPendingApplied?: boolean;
    hasAcceptedApplied?: boolean;
    hasRejectedApplied?: boolean;

    jobShiftFilter?: {
        gender?: string;
        weekDays?: any;
        dayTime?: string;
    };
    jobLocationFilter?: {
        regionID?: string | null,
        lat?: number,
        lon?: number,
        distance?: number
    } | null | undefined;
}

export interface IEventEmFilter {
    bannerPriority?: string,
    priority?: string,
    createdDate?: number,
    shuffle?: boolean
  }