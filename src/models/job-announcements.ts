export interface IJobAnnouncement {
    id?: string;
    jobName?: {
        id: number;
        name?: string;
        jobGroup?: {
            id?: string;
            name: string;
            priority?: string;
        }
    };
    jobTitle?: string;
    address?: string;
    region?: {
        id?: number;
        name?: string;
    };
    lat?: number;
    lon?: number;
    employerBranchID?: string;
    employerBranchName?: string;
    employerID?: string;
    employerName?: string;
    employerLogoUrl?: string;
    createdDate?: number;
    expired?: boolean;
    expirationDate?: number;
    timeLeft?: string;
    jobType?: string;
    pendingApplied?: number;
    acceptedApplied?: number;
    rejectedApplied?: number;
    appliedCount?: number;
    suitableCount?: number;
    disable: boolean;
    hidden: boolean;
    enableNotification: boolean;
    priority?: {
        homePriority?: string;
        homeExpired?: boolean;
        homeExpiration?: number;
        homeTimeLeft?: string;
        searchPriority?: string;
        searchExpired?: boolean;
        searchExpiration?: number;
        searchTimeLeft?: string
    }
}

export interface IJobAnnouncements {
    items?: Array<IJobAnnouncement>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}

export interface IJobAnnouncementsFilter {
    expired?: boolean;
    hidden?: boolean;
    jobType: null | undefined | string;
    homePriority?: string;
    homeExpired?: boolean;
    searchPriority?: string;
    searchExpired?: boolean;
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
    jobLocationFilter: {
        regionID: string | null,
        lat: 0,
        lon: 0,
        distance: 0
    } | null | undefined;
}