import { IPendingJobDetail } from './../models/pending-job';
import { REDUX } from '../../common/const/actions';

export const getPendingJobDetail = (data: IPendingJobDetail) => ({
    type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, 
    data
});