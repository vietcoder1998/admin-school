import { IEventSchool } from '../../models/event-schools';
import { REDUX } from '../../const/actions';

export const getEventSchoolList = (data?: IEventSchool) => ({
    type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_SCHOOLS, 
    data
});