import { IPendingJobDetail } from './../models/pending-job-detail';
import { REDUX } from '../../const/actions';

export const getPendingJobDetail = (data: IPendingJobDetail) => ({
    type: REDUX.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL, 
    data
});