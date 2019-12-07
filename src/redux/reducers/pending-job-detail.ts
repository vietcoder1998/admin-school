import { REDUX } from '../../common/const/actions';
import { IPendingJobDetail } from '../models/pending-job';

let initState: IPendingJobDetail = {
    description: null,
    employerBranchID: null,
    expirationDate: null,
    jobNameID: null,
    jobTitle: null,
    jobType: null,
    requiredSkillIDs: [],
    shifts: [],
    employer: {
        employerName: null,
        id: null,
        logoUrl: null,
    },
    id: null,
    jobID: null,
    message: null,
    repliedDate: null,
    state: null,
};

export const PendingJobDetail = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL:
            return {
                ...state,
                data: action.data
            };

        default:
            return state;
    }
};