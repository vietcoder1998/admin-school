import { REDUX } from '../../const/actions';
import { IPendingJobDetail } from '../../models/pending-job-detail';

let initState: IPendingJobDetail = {
    createdDate: null,
    employer: {
        employerName: null,
        id: null,
        logoUrl: null,
        profileVerified: false
    },
    data: {
        description: null,
        employerBranchID: null,
        expirationDate: null,
        jobNameID: null,
        jobTitle: null,
        jobType: null,
        requiredSkillIDs: [],
        shifts: [],
    },
    id: null,
    jobID: null,
    message: null,
    repliedDate: null,
    state: null,
};

export const PendingJobDetail = (state: IPendingJobDetail = initState, action: any) => {
    switch (action.type) {
        case REDUX.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL:
            return {
                ...action.data,
            };

        default:
            return state;
    }
};