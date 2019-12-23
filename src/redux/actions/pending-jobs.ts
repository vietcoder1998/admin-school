import {IPendingJobs} from '../models/pending-jobs';
import {REDUX} from '../../const/actions';

export const getPendingJobs = (data: IPendingJobs) => ({
    type: REDUX.PENDING_JOBS.GET_PENDING_JOBS,
    data
});