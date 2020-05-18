import { IEventEms } from '../../models/event-em';
import { REDUX } from '../../const/actions';

export const getEventEmsList = (data?: IEventEms) => ({
    type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_EM, 
    data
});