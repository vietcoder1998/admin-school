import { IEventJobs } from '../../models/event-jobs';
import { REDUX } from '../../const/actions';

export const getEventJobsList = (data?: IEventJobs) => ({
    type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_JOBS, 
    data
});