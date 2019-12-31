import { REDUX } from '../../const/actions';
import { IJobAnnouncementDetail } from '../../models/job-annoucement-detail';

let initState: IJobAnnouncementDetail = {
    id: null,
    employerCoverUrl: null,
    jobName: {
        id: null,
        name: null,
        jobGroup: {
            id: null,
            name: null,
            priority: null
        }
    },
    description: null,
    jobTitle: null,
    address: null,
    requiredSkills: [],
    region: {
        id: null,
        name: null
    },
    shifts: [],
    atHeadquarters: null,
    lat: null,
    lon: null,
    employerBranchID: null,
    employerBranchName: null,
    employerID: null,
    employerName: null,
    employerLogoUrl: null,
    createdDate: null,
    expired: null,
    expirationDate: null,
    timeLeft: null,
    jobType: null,
    pendingApplied: null,
    acceptedApplied: null,
    rejectedApplied: null,
    appliedCount: null,
    suitableCount: null,
    disable: null,
    hidden: null,
    enableNotification: null,
    priority: {
        homePriority: null,
        homeExpired: null,
        homeExpiration: null,
        homeTimeLeft: null,

        searchPriority: null,
        searchExpired: null,
        searchExpiration: null,
        searchTimeLeft: null
    }
};

export const JobAnnouncementDetail = (state: IJobAnnouncementDetail = initState, action: any): IJobAnnouncementDetail => {
    switch (action.type) {
        case REDUX.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};