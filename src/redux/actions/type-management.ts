import { IPendingJobs } from '../../common/models/pending-job';
import { REDUX } from '../../common/const/actions';

export const getTypeManagement = (data: any) => ({
    type: REDUX.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT, 
    data
});