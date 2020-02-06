import {IJobServices} from '../../models/job-services';
import {REDUX} from '../../const/actions';

export const getListJobServices = (data: IJobServices) => ({
    type: REDUX.JOB_SERVICE.GET_JOB_SERVICE,
    data
});