import IEventDetail from '../../models/event-detail';
import { REDUX } from '../../const/actions';

export const getEventDetailList = (data?: IEventDetail) => ({
    type: REDUX.EVENT_SCHOOLS.GET_EVENT_DETAIL, 
    data
});