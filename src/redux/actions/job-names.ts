import {IPendingJobs} from './../../models/pending-jobs';
import {REDUX} from '../../const/actions';

export const getJobName = (data: IPendingJobs) => ({
    type: REDUX.JOB_NAMES.GET_JOB_NAMES,
    data
});

export const getSingleJobName = (data: any) => ({
    type: REDUX.JOB_NAMES.GET_SINGLE_JOB_NAME,
});