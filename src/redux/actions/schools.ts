import { REDUX } from '../../common/const/actions';
import { ISchools } from '../models/schools';

export const getListSchools = (data?: ISchools) => ({
    type: REDUX.SCHOOLS.GET_SCHOOLS, 
    data
});