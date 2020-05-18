import { REDUX } from '../../const/actions';
import { IEventJobDetail } from '../../models/event-job-detail';

let initState: IEventJobDetail = {
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

export const EventJobDetail = (state: IEventJobDetail = initState, action: any): IEventJobDetail => {
    switch (action.type) {
        case REDUX.EVENT_SCHOOLS.GET_EVENT_JOB_DETAIL:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};